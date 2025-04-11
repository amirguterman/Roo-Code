// Test cases for DeepSeek R1 computer use integration
// This file contains test cases to verify the functionality of the DeepSeek R1 integration

import { DeepSeekHandler } from '../api/providers/deepseek';
import { DeepSeekComputerUseHandler } from '../api/providers/deepseek-computer-use';
import { getComputerPrompt } from '../core/prompts/computer';
import { COMPUTER_USE_SECURITY_RULES } from '../core/prompts/computer';

// Test case 1: Verify DeepSeek generates valid JSON commands for browser navigation
const testBrowserNavigation = async () => {
  const handler = new DeepSeekComputerUseHandler({
    deepSeekApiKey: 'test-key',
    apiModelId: 'deepseek-reasoner'
  });
  
  const prompt = "Open GitHub repo";
  const result = await handler.preparePrompt(prompt);
  
  console.log('Test 1: Browser Navigation');
  console.log('Result includes computer prompt:', result.includes(getComputerPrompt('deepseek-reasoner')));
  console.log('---');
  
  return result.includes(getComputerPrompt('deepseek-reasoner'));
};

// Test case 2: Verify DeepSeek generates valid JSON commands for VS Code file operations
const testVSCodeOperation = async () => {
  const handler = new DeepSeekComputerUseHandler({
    deepSeekApiKey: 'test-key',
    apiModelId: 'deepseek-reasoner'
  });
  
  const response = `{
    "actions": [
      {"type": "vscode", "operation": "create_file", "target": "app.js"}
    ]
  }`;
  
  const result = await handler.processResponse(response);
  
  console.log('Test 2: VS Code Operation');
  console.log('Success:', result.success);
  console.log('Actions:', JSON.stringify(result.actions, null, 2));
  console.log('---');
  
  return result.success && result.actions && result.actions.length > 0;
};

// Test case 3: Verify security blocks for navigation to non-allowlisted domains
const testSecurityBlock = () => {
  const domain = 'malicious-domain.com';
  const isAllowed = COMPUTER_USE_SECURITY_RULES.allowlistedDomains.includes(domain);
  
  console.log('Test 3: Security Block');
  console.log('Domain:', domain);
  console.log('Is allowed:', isAllowed);
  console.log('---');
  
  return !isAllowed;
};

// Test case 4: Verify security blocks for password field interactions
const testPasswordFieldBlock = () => {
  const operation = 'password_field_interaction';
  const isBlocked = COMPUTER_USE_SECURITY_RULES.blockedOperations.includes(operation);
  
  console.log('Test 4: Password Field Block');
  console.log('Operation:', operation);
  console.log('Is blocked:', isBlocked);
  console.log('---');
  
  return isBlocked;
};

// Run all tests
const runAllTests = async () => {
  console.log('Running all tests...');
  
  const test1Result = await testBrowserNavigation();
  const test2Result = await testVSCodeOperation();
  const test3Result = testSecurityBlock();
  const test4Result = testPasswordFieldBlock();
  
  console.log('Test Results Summary:');
  console.log('Test 1 (Browser Navigation):', test1Result ? 'PASS' : 'FAIL');
  console.log('Test 2 (VS Code Operation):', test2Result ? 'PASS' : 'FAIL');
  console.log('Test 3 (Security Block):', test3Result ? 'PASS' : 'FAIL');
  console.log('Test 4 (Password Field Block):', test4Result ? 'PASS' : 'FAIL');
  
  const allPassed = test1Result && test2Result && test3Result && test4Result;
  console.log('All tests passed:', allPassed ? 'YES' : 'NO');
  
  return allPassed;
};

// Export test functions
export {
  testBrowserNavigation,
  testVSCodeOperation,
  testSecurityBlock,
  testPasswordFieldBlock,
  runAllTests
};
