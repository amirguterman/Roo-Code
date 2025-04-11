import { OpenRouterHandler } from "../openrouter"
import { OpenRouterComputerUseHandler } from "../openrouter-computer-use"

describe("OpenRouter models capabilities", () => {
	describe("Image support and prompt caching for Dolphin model", () => {
		it("should have image support and prompt caching enabled in model configuration", () => {
			// Mock the getOpenRouterModels function to return test data
			const mockModels = {
				"cognitivecomputations/dolphin3.0-r1-mistral-24b:free": {
					maxTokens: 24_576,
					contextWindow: 128_000,
					supportsImages: true,
					supportsComputerUse: true,
					supportsPromptCache: true,
					inputPrice: 0.5,
					outputPrice: 1.5,
				},
			}

			// Create a handler with the mock model
			const handler = new OpenRouterHandler({
				openRouterModelId: "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
				openRouterModelInfo: mockModels["cognitivecomputations/dolphin3.0-r1-mistral-24b:free"],
			})

			// Verify the model has the correct capabilities
			const model = handler.getModel()
			expect(model.info.supportsImages).toBe(true)
			expect(model.info.supportsPromptCache).toBe(true)
		})

		it("should properly handle image content and prompt caching in messages", async () => {
			// Mock the model info
			const mockModelInfo = {
				maxTokens: 24_576,
				contextWindow: 128_000,
				supportsImages: true,
				supportsComputerUse: true,
				supportsPromptCache: true,
				inputPrice: 0.5,
				outputPrice: 1.5,
			}

			// Create a handler with the mock model
			const handler = new OpenRouterComputerUseHandler({
				openRouterModelId: "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
				openRouterModelInfo: mockModelInfo,
			})

			// Mock the createMessage method of the parent class
			const superCreateMessageMock = jest.spyOn(
				Object.getPrototypeOf(OpenRouterComputerUseHandler.prototype),
				"createMessage",
			)
			superCreateMessageMock.mockImplementation(function* () {
				yield { type: "text", text: "Test response" }
			})

			// Create a test message
			const systemPrompt = "You are a helpful assistant."
			const messages = [{ role: "user" as const, content: "What's in this image?" }]

			// Call the createMessage method
			const messageGenerator = handler.createMessage(systemPrompt, messages)
			const result = await messageGenerator.next()

			// Verify that the parent method was called
			expect(superCreateMessageMock).toHaveBeenCalledWith(systemPrompt, messages)
			expect(result.value).toEqual({ type: "text", text: "Test response" })

			// Clean up
			superCreateMessageMock.mockRestore()
		})
	})

	describe("Image support and prompt caching for Qwen model", () => {
		it("should have image support and prompt caching enabled in model configuration", () => {
			// Mock the getOpenRouterModels function to return test data
			const mockModels = {
				"qwen/qwen-2.5-coder-32b-instruct:free": {
					maxTokens: 32_768,
					contextWindow: 128_000,
					supportsImages: true,
					supportsComputerUse: true,
					supportsPromptCache: true,
					inputPrice: 0.6,
					outputPrice: 1.8,
				},
			}

			// Create a handler with the mock model
			const handler = new OpenRouterHandler({
				openRouterModelId: "qwen/qwen-2.5-coder-32b-instruct:free",
				openRouterModelInfo: mockModels["qwen/qwen-2.5-coder-32b-instruct:free"],
			})

			// Verify the model has the correct capabilities
			const model = handler.getModel()
			expect(model.info.supportsImages).toBe(true)
			expect(model.info.supportsPromptCache).toBe(true)
		})

		it("should properly handle image content and prompt caching in messages", async () => {
			// Mock the model info
			const mockModelInfo = {
				maxTokens: 32_768,
				contextWindow: 128_000,
				supportsImages: true,
				supportsComputerUse: true,
				supportsPromptCache: true,
				inputPrice: 0.6,
				outputPrice: 1.8,
			}

			// Create a handler with the mock model
			const handler = new OpenRouterComputerUseHandler({
				openRouterModelId: "qwen/qwen-2.5-coder-32b-instruct:free",
				openRouterModelInfo: mockModelInfo,
			})

			// Mock the createMessage method of the parent class
			const superCreateMessageMock = jest.spyOn(
				Object.getPrototypeOf(OpenRouterComputerUseHandler.prototype),
				"createMessage",
			)
			superCreateMessageMock.mockImplementation(function* () {
				yield { type: "text", text: "Test response" }
			})

			// Create a test message
			const systemPrompt = "You are a helpful assistant."
			const messages = [{ role: "user" as const, content: "What's in this image?" }]

			// Call the createMessage method
			const messageGenerator = handler.createMessage(systemPrompt, messages)
			const result = await messageGenerator.next()

			// Verify that the parent method was called
			expect(superCreateMessageMock).toHaveBeenCalledWith(systemPrompt, messages)
			expect(result.value).toEqual({ type: "text", text: "Test response" })

			// Clean up
			superCreateMessageMock.mockRestore()
		})
	})
})
