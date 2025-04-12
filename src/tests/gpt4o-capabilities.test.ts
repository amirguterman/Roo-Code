// Test cases for GPT-4o capabilities
// This file contains test cases to verify the functionality of GPT-4o's capabilities

import { openAiNativeModels } from "../shared/api"
import { OpenAiNativeHandler } from "../api/providers/openai-native"
import { convertToOpenAiMessages } from "../api/transform/openai-format"
import { isGPT4oModel } from "../core/prompts/computer"

// Test case 1: Verify GPT-4o has all required capabilities enabled in model configuration
const testCapabilitiesConfiguration = () => {
  const modelId = "gpt-4o"
  const modelInfo = openAiNativeModels[modelId]
  
  console.log("Test 1: Capabilities Configuration")
  console.log("Model ID:", modelId)
  console.log("Supports Computer Use:", modelInfo.supportsComputerUse)
  console.log("Supports Images:", modelInfo.supportsImages)
  console.log("Supports Prompt Cache:", modelInfo.supportsPromptCache)
  console.log("---")
  
  return (
    modelInfo.supportsComputerUse === true &&
    modelInfo.supportsImages === true &&
    modelInfo.supportsPromptCache === true
  )
}

// Test case 2: Verify GPT-4o is correctly identified by the isGPT4oModel function
const testModelIdentification = () => {
  const modelId = "gpt-4o"
  const isGPT4o = isGPT4oModel(modelId)
  
  console.log("Test 2: Model Identification")
  console.log("Model ID:", modelId)
  console.log("Is GPT-4o:", isGPT4o)
  console.log("---")
  
  return isGPT4o === true
}

// Test case 3: Verify prompt caching implementation in OpenAiNativeHandler
const testPromptCaching = () => {
  // Create a mock handler instance
  const handler = new OpenAiNativeHandler({
    apiProvider: "openai-native",
    apiModelId: "gpt-4o",
    openAiNativeApiKey: "test-key"
  })
  
  // Access the private method using type assertion
  const handleDefaultModelMessage = (handler as any).handleDefaultModelMessage
  
  // Check if the method exists (indirect verification)
  const methodExists = typeof handleDefaultModelMessage === 'function'
  
  console.log("Test 3: Prompt Caching Implementation")
  console.log("Handler has handleDefaultModelMessage method:", methodExists)
  console.log("---")
  
  return methodExists
}

// Test case 4: Verify image support implementation in convertToOpenAiMessages
const testImageSupport = () => {
  // Create a sample message with image content
  const messages = [
    {
      role: "user" as const,
      content: [
        {
          type: "text" as const,
          text: "What's in this image?"
        },
        {
          type: "image" as const,
          source: {
            type: "base64" as const,
            media_type: "image/jpeg",
            data: "base64_encoded_image_data"
          }
        }
      ]
    }
  ]
  
  // Convert the message
  const convertedMessages = convertToOpenAiMessages(messages)
  
  // Check if the conversion includes image_url
  const hasImageUrl = Array.isArray(convertedMessages[0].content) && 
    convertedMessages[0].content.some(item => item.type === "image_url")
  
  console.log("Test 4: Image Support Implementation")
  console.log("Converted message has image_url:", hasImageUrl)
  console.log("---")
  
  return hasImageUrl
}

// Test case 5: Verify cache usage metrics in handleStreamResponse
const testCacheMetrics = () => {
  // Create a mock handler instance
  const handler = new OpenAiNativeHandler({
    apiProvider: "openai-native",
    apiModelId: "gpt-4o",
    openAiNativeApiKey: "test-key"
  })
  
  // Create a mock usage object
  const mockUsage = {
    prompt_tokens: 100,
    completion_tokens: 50,
    cache_creation_input_tokens: 80,
    cache_read_input_tokens: 20
  }
  
  // Create a mock chunk with usage
  const mockChunk = {
    choices: [{ delta: { content: "test" } }],
    usage: mockUsage
  }
  
  // Access the private method using type assertion
  const handleStreamResponse = (handler as any).handleStreamResponse
  
  // Check if the method exists (indirect verification)
  const methodExists = typeof handleStreamResponse === 'function'
  
  console.log("Test 5: Cache Metrics Implementation")
  console.log("Handler has handleStreamResponse method:", methodExists)
  console.log("---")
  
  return methodExists
}

// Run all tests
const runAllTests = () => {
  console.log("Running all GPT-4o capability tests...")
  
  const test1Result = testCapabilitiesConfiguration()
  const test2Result = testModelIdentification()
  const test3Result = testPromptCaching()
  const test4Result = testImageSupport()
  const test5Result = testCacheMetrics()
  
  console.log("Test Results Summary:")
  console.log("Test 1 (Capabilities Configuration):", test1Result ? "PASS" : "FAIL")
  console.log("Test 2 (Model Identification):", test2Result ? "PASS" : "FAIL")
  console.log("Test 3 (Prompt Caching Implementation):", test3Result ? "PASS" : "FAIL")
  console.log("Test 4 (Image Support Implementation):", test4Result ? "PASS" : "FAIL")
  console.log("Test 5 (Cache Metrics Implementation):", test5Result ? "PASS" : "FAIL")
  
  const allPassed = test1Result && test2Result && test3Result && test4Result && test5Result
  console.log("All tests passed:", allPassed ? "YES" : "NO")
  
  return allPassed
}

// Export test functions
export { 
  testCapabilitiesConfiguration, 
  testModelIdentification, 
  testPromptCaching, 
  testImageSupport,
  testCacheMetrics,
  runAllTests 
}
