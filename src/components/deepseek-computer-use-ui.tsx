// This file adds UI components for DeepSeek R1 computer use

import React from 'react';

// Component to display Computer Control badge for DeepSeek R1
export const DeepSeekComputerControlBadge = ({ model }) => {
  // Check if the model is DeepSeek R1 and supports computer use
  const isDeepSeekR1WithComputerUse = 
    (model.id.includes('deepseek') && model.info.supportsComputerUse);
  
  if (!isDeepSeekR1WithComputerUse) {
    return null;
  }
  
  return (
    <span className="computer-control-badge">
      Computer Control
    </span>
  );
};

// Component to display computer use actions for DeepSeek R1
export const DeepSeekComputerUseActions = ({ actions, onConfirm, onCancel }) => {
  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div className="computer-use-actions">
      <h3>Computer Control Actions</h3>
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
`;
