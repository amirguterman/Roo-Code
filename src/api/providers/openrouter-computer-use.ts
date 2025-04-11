import { OpenRouterHandler } from "./openrouter"
import { getComputerPrompt, isOpenRouterComputerUseModel } from "../../core/prompts/computer"
import { Anthropic } from "@anthropic-ai/sdk"
import OpenAI from "openai"
import { convertToOpenAiMessages } from "../transform/openai-format"

export class OpenRouterComputerUseHandler extends OpenRouterHandler {
	// Add computer use prompt when needed
	protected async preparePrompt(prompt: string): Promise<string> {
		const model = this.getModel()

		// Check if the model supports computer use
		if (model.info.supportsComputerUse) {
			// Add the computer use prompt
			return `${getComputerPrompt(model.id)}\n\n${prompt}`
		}

		// Return the original prompt if computer use is not supported
		return prompt
	}

	// Override to handle image support in messages
	override async *createMessage(
		systemPrompt: string,
		messages: Anthropic.Messages.MessageParam[],
	): AsyncGenerator<any> {
		const model = this.getModel()

		// If the model supports images and prompt caching, ensure proper handling
		if (model.info.supportsImages && model.info.supportsPromptCache) {
			let systemMessage: OpenAI.Chat.ChatCompletionSystemMessageParam = {
				role: "system",
				content: systemPrompt,
			}

			// Convert messages to OpenAI format with proper image handling
			const convertedMessages = [systemMessage, ...convertToOpenAiMessages(messages)]

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

			// Use the parent class implementation with our modified messages
			yield* super.createMessage(systemPrompt, messages)
		} else {
			// If images or prompt caching not supported, use the parent class implementation
			yield* super.createMessage(systemPrompt, messages)
		}
	}

	// Parse JSON responses for computer use actions
	protected async processResponse(response: string): Promise<any> {
		const model = this.getModel()

		// Check if the model supports computer use and is one of our supported models
		if (model.info.supportsComputerUse && isOpenRouterComputerUseModel(model.id)) {
			try {
				// Try to parse JSON from the response
				const jsonResponse = JSON.parse(response)

				// Validate actions
				if (jsonResponse.actions && Array.isArray(jsonResponse.actions)) {
					return {
						success: true,
						actions: jsonResponse.actions,
					}
				}
			} catch (error) {
				// If parsing fails, return the original response
				return {
					success: false,
					error: `Failed to parse computer use actions: ${error.message}`,
					text: response,
				}
			}
		}

		// Return the original response if computer use is not supported
		return {
			success: true,
			text: response,
		}
	}
}
