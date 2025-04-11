// UI components for Dolphin and Qwen models computer use through OpenRouter
// Non-JSX version to avoid requiring the --jsx flag

import { isDolphinModel, isQwenModel } from "../core/prompts/computer"

// Helper to check if model is Dolphin through OpenRouter
export const isDolphinModelOpenRouter = (modelId: string): boolean => {
	return modelId.includes("cognitivecomputations/dolphin")
}

// Helper to check if model is Qwen through OpenRouter
export const isQwenModelOpenRouter = (modelId: string): boolean => {
	return modelId.includes("qwen/qwen-2.5-coder")
}

// Mock component for Dolphin Computer Control badge
export const DolphinComputerControlBadge = (props: { model: any }): any => {
	// This is just a mock component for testing purposes
	return null
}

// Mock component for Qwen Computer Control badge
export const QwenComputerControlBadge = (props: { model: any }): any => {
	// This is just a mock component for testing purposes
	return null
}

// Mock component for OpenRouter models Computer Use actions
export const OpenRouterModelsComputerUseActions = (props: {
	actions: any[]
	modelId: string
	onConfirm: () => void
	onCancel: () => void
}): any => {
	// This is just a mock component for testing purposes
	return null
}

// CSS styles for the components (for reference)
export const styles = `
.computer-control-badge {
  display: inline-block;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin-left: 0.5rem;
  background-color: #2196f3;
  color: white;
}

.dolphin-badge {
  background-color: #9c27b0;
}

.qwen-badge {
  background-color: #ff9800;
}

.computer-use-actions {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin: 1rem 0;
}

.dolphin-actions {
  border-left: 4px solid #9c27b0;
}

.qwen-actions {
  border-left: 4px solid #ff9800;
}

.computer-use-actions pre {
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 0.5rem;
  overflow-x: auto;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.confirm-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
`
