import { OpenAiHandler, OpenAiHandlerOptions } from "./openai"
import { deepSeekModels, deepSeekDefaultModelId, ModelInfo } from "../../shared/api"
import { ApiStreamUsageChunk } from "../transform/stream" // Import for type
import { getModelParams } from "../index"
import { convertToOpenAiMessages } from "../transform/openai-format"
import { Anthropic } from "@anthropic-ai/sdk"
import OpenAI from "openai"

export class DeepSeekHandler extends OpenAiHandler {
	constructor(options: OpenAiHandlerOptions) {
		super({
			...options,
			openAiApiKey: options.deepSeekApiKey ?? "not-provided",
			openAiModelId: options.apiModelId ?? deepSeekDefaultModelId,
			openAiBaseUrl: options.deepSeekBaseUrl ?? "https://api.deepseek.com",
			openAiStreamingEnabled: true,
			includeMaxTokens: true,
		})
	}

	override getModel(): { id: string; info: ModelInfo } {
		const modelId = this.options.apiModelId ?? deepSeekDefaultModelId
		const info = deepSeekModels[modelId as keyof typeof deepSeekModels] || deepSeekModels[deepSeekDefaultModelId]

		return {
			id: modelId,
			info,
			...getModelParams({ options: this.options, model: info }),
		}
	}

	// Override to handle image support in messages
	override async *createMessage(
		systemPrompt: string,
		messages: Anthropic.Messages.MessageParam[],
	): AsyncGenerator<any> {
		const modelInfo = this.getModel().info

		// If the model supports images, ensure proper handling of image content
		if (modelInfo.supportsImages) {
			let systemMessage: OpenAI.Chat.ChatCompletionSystemMessageParam = {
				role: "system",
				content: systemPrompt,
			}

			// Convert messages to OpenAI format with proper image handling
			const convertedMessages = [systemMessage, ...convertToOpenAiMessages(messages)]

			// Add prompt caching if supported
			if (modelInfo.supportsPromptCache) {
				// Add cache_control to system message
				systemMessage = {
					role: "system",
					content: [
						{
							type: "text",
							text: systemPrompt,
							// @ts-ignore-next-line
							cache_control: { type: "ephemeral" },
						},
					],
				}

				// Add cache_control to the last two user messages
				const lastTwoUserMessages = convertedMessages.filter((msg) => msg.role === "user").slice(-2)
				lastTwoUserMessages.forEach((msg) => {
					if (typeof msg.content === "string") {
						msg.content = [{ type: "text", text: msg.content }]
					}
					if (Array.isArray(msg.content)) {
						let lastTextPart = msg.content.filter((part) => part.type === "text").pop()

						if (!lastTextPart) {
							lastTextPart = { type: "text", text: "..." }
							msg.content.push(lastTextPart)
						}
						// @ts-ignore-next-line
						lastTextPart["cache_control"] = { type: "ephemeral" }
					}
				})
			}

			// Use the parent class implementation with our modified messages
			yield* super.createMessage(systemPrompt, messages)
		} else {
			// If images not supported, use the parent class implementation
			yield* super.createMessage(systemPrompt, messages)
		}
	}

	// Override to handle DeepSeek's usage metrics, including caching.
	protected override processUsageMetrics(usage: any): ApiStreamUsageChunk {
		return {
			type: "usage",
			inputTokens: usage?.prompt_tokens || 0,
			outputTokens: usage?.completion_tokens || 0,
			cacheWriteTokens: usage?.prompt_tokens_details?.cache_miss_tokens,
			cacheReadTokens: usage?.prompt_tokens_details?.cached_tokens,
		}
	}
}
