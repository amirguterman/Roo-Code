// This file extends the OpenRouter handler to support computer use for DeepSeek R1 (free)

import { OpenRouterHandler } from "./openrouter";
import { getComputerPrompt, isDeepSeekR1 } from "../../core/prompts/computer";

export class OpenRouterComputerUseHandler extends OpenRouterHandler {
  // Override to add computer use prompt when needed
  protected override async preparePrompt(prompt: string): Promise<string> {
    const model = this.getModel();
    
    // Check if the model supports computer use
    if (model.info.supportsComputerUse) {
      // Add the computer use prompt
      return `${getComputerPrompt(model.id)}\n\n${prompt}`;
    }
    
    // Return the original prompt if computer use is not supported
    return prompt;
  }
  
  // Override to parse JSON responses for computer use actions
  protected override async processResponse(response: string): Promise<any> {
    const model = this.getModel();
    
    // Check if the model supports computer use and is DeepSeek R1
    if (model.info.supportsComputerUse && isDeepSeekR1(model.id)) {
      try {
        // Try to parse JSON from the response
        const jsonResponse = JSON.parse(response);
        
        // Validate actions
        if (jsonResponse.actions && Array.isArray(jsonResponse.actions)) {
          return {
            success: true,
            actions: jsonResponse.actions
          };
        }
      } catch (error) {
        // If parsing fails, return the original response
        return {
          success: false,
          error: `Failed to parse computer use actions: ${error.message}`,
          text: response
        };
      }
    }
    
    // Return the original response if computer use is not supported
    return {
      success: true,
      text: response
    };
  }
}
