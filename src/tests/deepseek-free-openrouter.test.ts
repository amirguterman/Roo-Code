// Test cases for DeepSeek R1 (free) computer use integration through OpenRouter
// This file contains test cases to verify the functionality of the DeepSeek R1 (free) integration

import { OpenRouterHandler } from '../api/providers/openrouter';
import { OpenRouterComputerUseHandler } from '../api/providers/openrouter-computer-use';
import { getComputerPrompt, isDeepSeekR1 } from '../core/prompts/computer';
import { COMPUTER_USE_SECURITY_RULES } from '../core/prompts/computer';

// Test case 1: Verify DeepSeek R1 (free) model identification
const testDeepSeekR1FreeIdentification = () => {
  const modelId = 'deepseek/deepseek-r1:free';
  const isDeepSeekModel = isDeepSeekR1(modelId);
  
  console.log('Test 1: DeepSeek R1 (free) Identification');
  console.log('Model ID:', modelId);
  console.log('Is DeepSeek R1:', isDeepSeekModel);
  console.log('---');
  
  return isDeepSeekModel;
};

// Test case 2: Verify prompt preparation for DeepSeek R1 (free)
const testPromptPreparation = async () => {
  const handler = new OpenRouterComputerUseHandler({
    openRouterApiKey: 'test-key',
    openRouterModelId: 'deepseek/deepseek-r1:free',
    openRouterModelInfo: {
      maxTokens: 32768,
      contextWindow: 128000,
      supportsImages: false,
      supportsComputerUse: true
    }
  });
  
  const prompt = "Open GitHub repo";
  const result = await handler.preparePrompt(prompt);
  
  console.log('Test 2: Prompt Preparation');
  console.log('Result includes computer prompt:', result.includes(getComputerPrompt('deepseek/deepseek-r1:free')));
  console.log('---');
  
  return result.includes(getComputerPrompt('deepseek/deepseek-r1:free'));
};

// Test case 3: Verify JSON response processing
const testResponseProcessing = async () => {
  const handler = new OpenRouterComputerUseHandler({
    openRouterApiKey: 'test-key',
    openRouterModelId: 'deepseek/deepseek-r1:free',
    openRouterModelInfo: {
      maxTokens: 32768,
      contextWindow: 128000,
      supportsImages: false,
      supportsComputerUse: true
    }
  });
  
  const response = `{
    "actions": [
      {"type": "browser", "operation": "navigate", "target": "https://github.com"}
    ]
  }`;
  
  const result = await handler.processResponse(response);
  
  console.log('Test 3: Response Processing');
  console.log('Success:', result.success);
  console.log('Actions:', JSON.stringify(result.actions, null, 2));
  console.log('---');
  
  return result.success && result.actions && result.actions.length > 0;
};

// Test case 4: Verify security blocks for navigation to non-allowlisted domains
const testSecurityBlock = () => {
  const domain = 'malicious-domain.com';
  const isAllowed = COMPUTER_USE_SECURITY_RULES.allowlistedDomains.includes(domain);
  
  console.log('Test 4: Security Block');
  console.log('Domain:', domain);
  console.log('Is allowed:', isAllowed);
  console.log('---');
  
  return !isAllowed;
};

// Run all tests
const runAllTests = async () => {
  console.log('Running all tests for DeepSeek R1 (free) OpenRouter integration...');
  
  const test1Result = testDeepSeekR1FreeIdentification();
  const test2Result = await testPromptPreparation();
  const test3Result = await testResponseProcessing();
  const test4Result = testSecurityBlock();
  
  console.log('Test Results Summary:');
  console.log('Test 1 (DeepSeek R1 Free Identification):', test1Result ? 'PASS' : 'FAIL');
  console.log('Test 2 (Prompt Preparation):', test2Result ? 'PASS' : 'FAIL');
  console.log('Test 3 (Response Processing):', test3Result ? 'PASS' : 'FAIL');
  console.log('Test 4 (Security Block):', test4Result ? 'PASS' : 'FAIL');
  
  const allPassed = test1Result && test2Result && test3Result && test4Result;
  console.log('All tests passed:', allPassed ? 'YES' : 'NO');
  
  return allPassed;
};

// Export test functions
export {
  testDeepSeekR1FreeIdentification,
  testPromptPreparation,
  testResponseProcessing,
  testSecurityBlock,
  runAllTests
};
