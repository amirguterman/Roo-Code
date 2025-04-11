// This file adds UI components for DeepSeek R1 computer use
// Non-JSX version to avoid requiring the --jsx flag

import { isDeepSeekR1 } from "../core/prompts/computer"

// Helper to check if model is DeepSeek R1 with computer use capability
export const isDeepSeekR1WithComputerUse = (model: any): boolean => {
	return isDeepSeekR1(model.id) && model.info.supportsComputerUse
}

// Mock component for DeepSeek R1 Computer Control badge
export const DeepSeekComputerControlBadge = (props: { model: any }): any => {
	// This is just a mock component for testing purposes
	return null
}

// Mock component for DeepSeek R1 Computer Use actions
export const DeepSeekComputerUseActions = (props: {
	actions: any[]
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

.computer-use-actions {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin: 1rem 0;
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
