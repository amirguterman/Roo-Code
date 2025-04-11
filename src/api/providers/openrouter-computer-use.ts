// This file extends the OpenRouter handler to support computer use for multiple models

import { OpenRouterHandler } from "./openrouter"
import { getComputerPrompt, isOpenRouterComputerUseModel } from "../../core/prompts/computer"

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
