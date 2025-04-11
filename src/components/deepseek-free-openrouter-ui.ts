// Helper functions for DeepSeek R1 (free) OpenRouter integration
// This file contains utility functions for identifying DeepSeek R1 (free) models

import { isDeepSeekR1 } from "../core/prompts/computer"

// Check if model is DeepSeek R1 (free) through OpenRouter
export const isDeepSeekR1FreeOpenRouter = (modelId: string): boolean => {
	return modelId.includes("deepseek/deepseek-r1:free")
}

// Mock component for DeepSeek R1 (free) Computer Control badge
export const DeepSeekFreeComputerControlBadge = ({ model }: { model: any }) => {
	// This is just a mock component for testing purposes
	return null
}

// Mock component for DeepSeek R1 (free) Computer Use actions
export const DeepSeekFreeComputerUseActions = ({
	actions,
	modelId,
	onConfirm,
	onCancel,
}: {
	actions: any[]
	modelId: string
	onConfirm: () => void
	onCancel: () => void
}) => {
	// This is just a mock component for testing purposes
	return null
}
