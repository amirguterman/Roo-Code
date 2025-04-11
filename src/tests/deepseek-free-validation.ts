// Validation script for DeepSeek R1 (free) OpenRouter integration
// This script validates that all required components are properly implemented

import { isDeepSeekR1 } from "../core/prompts/computer"
import {
	isDeepSeekR1FreeOpenRouter,
	DeepSeekFreeComputerControlBadge,
	DeepSeekFreeComputerUseActions,
} from "../components/deepseek-free-openrouter-ui"
import { runAllTests } from "./deepseek-free-openrouter.test"

// Validation checklist
const validationChecklist = [
	{
		name: "Model Configuration",
		validate: () => {
			// Check if OpenRouter handler has DeepSeek R1 (free) detection
			const modelId = "deepseek/deepseek-r1:free"
			const isDeepSeekFree = isDeepSeekR1(modelId)
			const isDeepSeekFreeSpecific = isDeepSeekR1FreeOpenRouter(modelId)

			return {
				success: isDeepSeekFree && isDeepSeekFreeSpecific,
				details: {
					isDeepSeekFree,
					isDeepSeekFreeSpecific,
				},
			}
		},
	},
	{
		name: "Security Rules",
		validate: () => {
			// Import security rules
			const { COMPUTER_USE_SECURITY_RULES } = require("../core/prompts/computer")

			// Check if security rules include OpenRouter and DeepSeek domains
			const hasOpenRouterDomain = COMPUTER_USE_SECURITY_RULES.allowlistedDomains.includes("openrouter.ai")
			const hasDeepSeekDomain = COMPUTER_USE_SECURITY_RULES.allowlistedDomains.includes("deepseek.com")

			// Check if security rules block sensitive operations
			const blocksPasswordFields =
				COMPUTER_USE_SECURITY_RULES.blockedOperations.includes("password_field_interaction")
			const blocksPaymentFields =
				COMPUTER_USE_SECURITY_RULES.blockedOperations.includes("payment_field_interaction")

			return {
				success: hasOpenRouterDomain && hasDeepSeekDomain && blocksPasswordFields && blocksPaymentFields,
				details: {
					hasOpenRouterDomain,
					hasDeepSeekDomain,
					blocksPasswordFields,
					blocksPaymentFields,
				},
			}
		},
	},
	{
		name: "UI Components",
		validate: () => {
			// Check if UI components exist for DeepSeek R1 (free)
			const hasDeepSeekFreeBadge = typeof DeepSeekFreeComputerControlBadge === "function"
			const hasDeepSeekFreeActions = typeof DeepSeekFreeComputerUseActions === "function"

			return {
				success: hasDeepSeekFreeBadge && hasDeepSeekFreeActions,
				details: {
					hasDeepSeekFreeBadge,
					hasDeepSeekFreeActions,
				},
			}
		},
	},
	{
		name: "Test Cases",
		validate: async () => {
			try {
				// Run all tests
				const allTestsPassed = await runAllTests()

				return {
					success: allTestsPassed,
					details: {
						allTestsPassed,
					},
				}
			} catch (error) {
				return {
					success: false,
					details: {
						error: error.message,
					},
				}
			}
		},
	},
]

// Run validation
const runValidation = async () => {
	console.log("Validating DeepSeek R1 (free) OpenRouter integration...")

	const results = []

	for (const check of validationChecklist) {
		console.log(`Validating: ${check.name}`)

		try {
			const result = await check.validate()
			results.push({
				name: check.name,
				success: result.success,
				details: result.details,
			})

			console.log(`  Success: ${result.success ? "YES" : "NO"}`)
			console.log(`  Details: ${JSON.stringify(result.details, null, 2)}`)
		} catch (error) {
			results.push({
				name: check.name,
				success: false,
				details: {
					error: error.message,
				},
			})

			console.log(`  Success: NO`)
			console.log(`  Error: ${error.message}`)
		}

		console.log("---")
	}

	// Calculate overall success
	const allSuccessful = results.every((result) => result.success)

	console.log("Validation Summary:")
	results.forEach((result) => {
		console.log(`${result.name}: ${result.success ? "PASS" : "FAIL"}`)
	})
	console.log(`Overall: ${allSuccessful ? "PASS" : "FAIL"}`)

	return {
		success: allSuccessful,
		results,
	}
}

// Export validation function
export { runValidation }
