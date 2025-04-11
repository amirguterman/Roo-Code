import { DeepSeekHandler } from "../deepseek"
import { deepSeekModels } from "../../../shared/api"

describe("DeepSeek capabilities", () => {
	describe("Image support", () => {
		it("should have image support enabled in model configuration", () => {
			// Check that the model configuration has image support enabled
			// Use type assertion to access the property
			const modelInfo = deepSeekModels["deepseek.r1-v1:0" as keyof typeof deepSeekModels]
			expect(modelInfo.supportsImages).toBe(true)
		})

		it("should properly handle image content in messages", async () => {
			const handler = new DeepSeekHandler({
				apiModelId: "deepseek.r1-v1:0",
				deepSeekApiKey: "test-key",
			})

			// Mock the createMessage method of the parent class
			const superCreateMessageMock = jest.spyOn(Object.getPrototypeOf(DeepSeekHandler.prototype), "createMessage")
			superCreateMessageMock.mockImplementation(function* () {
				yield { type: "text", text: "Test response" }
			})

			// Create a test message with image content
			const systemPrompt = "You are a helpful assistant."
			// Use proper Anthropic message format with type assertion
			const messages = [
				{
					role: "user" as const,
					content: "What's in this image?",
				},
			]

			// Call the createMessage method
			const messageGenerator = handler.createMessage(systemPrompt, messages)
			const result = await messageGenerator.next()

			// Verify that the parent method was called with the correct parameters
			expect(superCreateMessageMock).toHaveBeenCalledWith(systemPrompt, messages)
			expect(result.value).toEqual({ type: "text", text: "Test response" })

			// Clean up
			superCreateMessageMock.mockRestore()
		})
	})

	describe("Prompt caching", () => {
		it("should have prompt caching enabled in model configuration", () => {
			// Check that the model configuration has prompt caching enabled
			// Use type assertion to access the property
			const modelInfo = deepSeekModels["deepseek.r1-v1:0" as keyof typeof deepSeekModels]
			expect(modelInfo.supportsPromptCache).toBe(true)
		})

		it("should properly handle prompt caching in messages", async () => {
			const handler = new DeepSeekHandler({
				apiModelId: "deepseek.r1-v1:0",
				deepSeekApiKey: "test-key",
			})

			// Mock the createMessage method of the parent class
			const superCreateMessageMock = jest.spyOn(Object.getPrototypeOf(DeepSeekHandler.prototype), "createMessage")
			superCreateMessageMock.mockImplementation(function* () {
				yield { type: "text", text: "Test response" }
				yield {
					type: "usage",
					inputTokens: 100,
					outputTokens: 50,
					cacheWriteTokens: 80,
					cacheReadTokens: 20,
				}
			})

			// Create test messages with proper types
			const systemPrompt = "You are a helpful assistant."
			const messages = [
				{ role: "user" as const, content: "Hello" },
				{ role: "assistant" as const, content: "Hi there!" },
				{ role: "user" as const, content: "How are you?" },
			]

			// Call the createMessage method
			const messageGenerator = handler.createMessage(systemPrompt, messages)
			const textResult = await messageGenerator.next()
			const usageResult = await messageGenerator.next()

			// Verify that the parent method was called with the correct parameters
			expect(superCreateMessageMock).toHaveBeenCalledWith(systemPrompt, messages)
			expect(textResult.value).toEqual({ type: "text", text: "Test response" })
			expect(usageResult.value).toEqual({
				type: "usage",
				inputTokens: 100,
				outputTokens: 50,
				cacheWriteTokens: 80,
				cacheReadTokens: 20,
			})

			// Clean up
			superCreateMessageMock.mockRestore()
		})
	})

	describe("Usage metrics", () => {
		it("should properly process usage metrics including cache information", () => {
			const handler = new DeepSeekHandler({
				apiModelId: "deepseek.r1-v1:0",
				deepSeekApiKey: "test-key",
			})

			// Create mock usage data
			const mockUsage = {
				prompt_tokens: 100,
				completion_tokens: 50,
				prompt_tokens_details: {
					cache_miss_tokens: 80,
					cached_tokens: 20,
				},
			}

			// Access the protected method using type assertion
			const processUsageMetrics = (handler as any).processUsageMetrics.bind(handler)
			const result = processUsageMetrics(mockUsage)

			// Verify the result
			expect(result).toEqual({
				type: "usage",
				inputTokens: 100,
				outputTokens: 50,
				cacheWriteTokens: 80,
				cacheReadTokens: 20,
			})
		})
	})
})
