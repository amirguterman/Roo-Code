// Validation script for Dolphin and Qwen models OpenRouter integration
// This script validates that all required components are properly implemented

import { isDolphinModel, isQwenModel, isOpenRouterComputerUseModel } from '../core/prompts/computer';
import { runAllTests } from './openrouter-models.test';

// Validation checklist
const validationChecklist = [
  {
    name: 'Model Configuration',
    validate: () => {
      // Check if OpenRouter handler has Dolphin and Qwen detection
      const dolphinModelId = 'cognitivecomputations/dolphin3.0-r1-mistral-24b:free';
      const qwenModelId = 'qwen/qwen-2.5-coder-32b-instruct:free';
      
      const isDolphin = isDolphinModel(dolphinModelId);
      const isQwen = isQwenModel(qwenModelId);
      const isDolphinSupported = isOpenRouterComputerUseModel(dolphinModelId);
      const isQwenSupported = isOpenRouterComputerUseModel(qwenModelId);
      
      return {
        success: isDolphin && isQwen && isDolphinSupported && isQwenSupported,
        details: {
          isDolphin,
          isQwen,
          isDolphinSupported,
          isQwenSupported
        }
      };
    }
  },
  {
    name: 'Security Rules',
    validate: () => {
      // Import security rules
      const { COMPUTER_USE_SECURITY_RULES } = require('../core/prompts/computer');
      
      // Check if security rules include relevant domains
      const hasCognitiveComputationsDomain = COMPUTER_USE_SECURITY_RULES.allowlistedDomains.includes('cognitivecomputations.com');
      const hasQwenDomain = COMPUTER_USE_SECURITY_RULES.allowlistedDomains.includes('qwen.ai');
      
      return {
        success: hasCognitiveComputationsDomain && hasQwenDomain,
        details: {
          hasCognitiveComputationsDomain,
          hasQwenDomain
        }
      };
    }
  },
  {
    name: 'UI Components',
    validate: () => {
      // Check if UI components exist for Dolphin and Qwen
      const { DolphinComputerControlBadge, QwenComputerControlBadge, OpenRouterModelsComputerUseActions } = 
        require('../components/openrouter-models-ui');
      
      const hasDolphinBadge = typeof DolphinComputerControlBadge === 'function';
      const hasQwenBadge = typeof QwenComputerControlBadge === 'function';
      const hasActionsComponent = typeof OpenRouterModelsComputerUseActions === 'function';
      
      return {
        success: hasDolphinBadge && hasQwenBadge && hasActionsComponent,
        details: {
          hasDolphinBadge,
          hasQwenBadge,
          hasActionsComponent
        }
      };
    }
  },
  {
    name: 'Test Cases',
    validate: async () => {
      try {
        // Run all tests
        const allTestsPassed = await runAllTests();
        
        return {
          success: allTestsPassed,
          details: {
            allTestsPassed
          }
        };
      } catch (error) {
        return {
          success: false,
          details: {
            error: error.message
          }
        };
      }
    }
  }
];

// Run validation
const runValidation = async () => {
  console.log('Validating Dolphin and Qwen OpenRouter integration...');
  
  const results = [];
  
  for (const check of validationChecklist) {
    console.log(`Validating: ${check.name}`);
    
    try {
      const result = await check.validate();
      results.push({
        name: check.name,
        success: result.success,
        details: result.details
      });
      
      console.log(`  Success: ${result.success ? 'YES' : 'NO'}`);
      console.log(`  Details: ${JSON.stringify(result.details, null, 2)}`);
    } catch (error) {
      results.push({
        name: check.name,
        success: false,
        details: {
          error: error.message
        }
      });
      
      console.log(`  Success: NO`);
      console.log(`  Error: ${error.message}`);
    }
    
    console.log('---');
  }
  
  // Calculate overall success
  const allSuccessful = results.every(result => result.success);
  
  console.log('Validation Summary:');
  results.forEach(result => {
    console.log(`${result.name}: ${result.success ? 'PASS' : 'FAIL'}`);
  });
  console.log(`Overall: ${allSuccessful ? 'PASS' : 'FAIL'}`);
  
  return {
    success: allSuccessful,
    results
  };
};

// Export validation function
export { runValidation };
