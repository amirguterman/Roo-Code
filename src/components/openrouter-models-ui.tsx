// UI components for Dolphin and Qwen models computer use through OpenRouter

import React from 'react';
import { isDolphinModel, isQwenModel } from '../../core/prompts/computer';

// Component to display Computer Control badge for Dolphin model
export const DolphinComputerControlBadge = ({ model }) => {
  // Check if the model is Dolphin and supports computer use
  const isDolphin = 
    (isDolphinModel(model.id) && model.info.supportsComputerUse);
  
  if (!isDolphin) {
    return null;
  }
  
  return (
    <span className="computer-control-badge dolphin-badge">
      Computer Control
    </span>
  );
};

// Component to display Computer Control badge for Qwen model
export const QwenComputerControlBadge = ({ model }) => {
  // Check if the model is Qwen and supports computer use
  const isQwen = 
    (isQwenModel(model.id) && model.info.supportsComputerUse);
  
  if (!isQwen) {
    return null;
  }
  
  return (
    <span className="computer-control-badge qwen-badge">
      Computer Control
    </span>
  );
};

// Component to display computer use actions for Dolphin and Qwen models
export const OpenRouterModelsComputerUseActions = ({ actions, modelId, onConfirm, onCancel }) => {
  if (!actions || actions.length === 0) {
    return null;
  }

  let modelName = "Model";
  let badgeClass = "";
  
  if (isDolphinModel(modelId)) {
    modelName = "Dolphin";
    badgeClass = "dolphin-actions";
  } else if (isQwenModel(modelId)) {
    modelName = "Qwen";
    badgeClass = "qwen-actions";
  }

  return (
    <div className={`computer-use-actions ${badgeClass}`}>
      <h3>{modelName} Computer Control Actions</h3>
      <pre>{JSON.stringify(actions, null, 2)}</pre>
      
      <div className="action-buttons">
        <button onClick={onConfirm} className="confirm-button">
          Execute Actions
        </button>
        <button onClick={onCancel} className="cancel-button">
          Cancel
        </button>
      </div>
    </div>
  );
};

// CSS styles for the components
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
`;
