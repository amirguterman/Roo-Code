// Computer use prompts for different models

// Claude prompt for computer use
export const CLAUDE_COMPUTER_PROMPT = `You are an automation expert. Respond with JSON commands using:
{
  "actions": [
    {"type": "browser", "operation": "navigate", "target": "https://example.com"},
    {"type": "vscode", "operation": "open_file", "target": "src/app.ts"}
  ]
}`;

// DeepSeek prompt for computer use - adapted from Claude's prompt with the same structure
export const DEEPSEEK_COMPUTER_PROMPT = `You are an automation expert. Respond with JSON commands using:
{
  "actions": [
    {"type": "browser", "operation": "navigate", "target": "https://example.com"},
    {"type": "vscode", "operation": "open_file", "target": "src/app.ts"}
  ]
}`;

// Helper to get the appropriate prompt based on model
export const getComputerPrompt = (modelId: string): string => {
  if (modelId.includes('deepseek')) {
    return DEEPSEEK_COMPUTER_PROMPT;
  }
  
  // Default to Claude prompt for other models
  return CLAUDE_COMPUTER_PROMPT;
};

// Common security rules that apply to all models
export const COMPUTER_USE_SECURITY_RULES = {
  allowlistedDomains: [
    'github.com',
    'example.com',
    'localhost',
    // other allowed domains...
  ],
  
  requireConfirmation: {
    operations: [
      'file_write',
      'file_delete',
      'form_submit',
      'clipboard_access'
    ]
  },
  
  blockedOperations: [
    'password_field_interaction',
    // other blocked operations...
  ]
};
