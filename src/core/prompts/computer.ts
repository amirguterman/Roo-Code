// Computer use prompts for different models

// Claude prompt for computer use
export const CLAUDE_COMPUTER_PROMPT = `You are an automation expert. Respond with JSON commands using:
{
  "actions": [
    {"type": "browser", "operation": "navigate", "target": "https://example.com"},
    {"type": "vscode", "operation": "open_file", "target": "src/app.ts"}
  ]
}`

// DeepSeek prompt for computer use - adapted from Claude's prompt with the same structure
export const DEEPSEEK_COMPUTER_PROMPT = `You are an automation expert. Respond with JSON commands using:
{
  "actions": [
    {"type": "browser", "operation": "navigate", "target": "https://example.com"},
    {"type": "vscode", "operation": "open_file", "target": "src/app.ts"}
  ]
}`

// Helper to get the appropriate prompt based on model
export const getComputerPrompt = (modelId: string): string => {
	if (modelId.includes("deepseek") || modelId.includes("dolphin") || modelId.includes("qwen") || modelId.includes("gpt-4o")) {
		return DEEPSEEK_COMPUTER_PROMPT
	}

	// Default to Claude prompt for other models
	return CLAUDE_COMPUTER_PROMPT
}

// Check if model is DeepSeek R1 (including free version through OpenRouter)
export const isDeepSeekR1 = (modelId: string): boolean => {
	return (
		modelId.includes("deepseek-r1") || modelId.includes("deepseek/deepseek-r1") || modelId === "deepseek-reasoner"
	)
}

// Check if model is Dolphin (through OpenRouter)
export const isDolphinModel = (modelId: string): boolean => {
	return modelId.includes("cognitivecomputations/dolphin")
}

// Check if model is Qwen (through OpenRouter)
export const isQwenModel = (modelId: string): boolean => {
	return modelId.includes("qwen/qwen-2.5-coder")
}

// Check if model is GPT-4o
export const isGPT4oModel = (modelId: string): boolean => {
	return modelId.includes("gpt-4o")
}

// Check if model supports computer use through OpenRouter
export const isOpenRouterComputerUseModel = (modelId: string): boolean => {
	return isDeepSeekR1(modelId) || isDolphinModel(modelId) || isQwenModel(modelId) || isGPT4oModel(modelId)
}

// Common security rules that apply to all models
export const COMPUTER_USE_SECURITY_RULES = {
	allowlistedDomains: [
		"github.com",
		"example.com",
		"localhost",
		"openrouter.ai",
		"deepseek.com",
		"cognitivecomputations.com",
		"qwen.ai",
		// other allowed domains...
	],

	requireConfirmation: {
		operations: ["file_write", "file_delete", "form_submit", "clipboard_access"],
	},

	blockedOperations: [
		"password_field_interaction",
		"payment_field_interaction",
		"credential_storage",
		// other blocked operations...
	],
}
