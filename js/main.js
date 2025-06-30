// Main Application File - Orchestrates everything
import { executeHook, getHooks } from './hookSystem.js';
import './userActions.js';
import './dataProcessing.js';
import './uiUpdates.js';
import './utils.js';

// Output element for displaying results
let outputElement;

// Initialize the application
function init() {
    outputElement = document.getElementById('output');
    logToOutput('🚀 Vanilla JS Hooks System Initialized');
    logToOutput('📋 Registered Hooks: ' + JSON.stringify(getHooks(), null, 2));
}

// Function to log messages to both console and output element
function logToOutput(message) {
    console.log(message);
    if (outputElement) {
        outputElement.textContent += message + '\n';
        outputElement.scrollTop = outputElement.scrollHeight;
    }
}

// Trigger user actions hook
window.triggerUserActions = async function() {
    logToOutput('\n=== TRIGGERING USER ACTIONS HOOK ===');
    
    const userData = { username: 'john_doe', email: 'john@example.com' };
    const results = await executeHook('user_action', userData);
    
    logToOutput('Results:');
    results.forEach((result, index) => {
        logToOutput(`  ${index + 1}. ${JSON.stringify(result)}`);
    });
};

// Trigger data processing hook
window.triggerDataProcessing = async function() {
    logToOutput('\n=== TRIGGERING DATA PROCESSING HOOK ===');
    
    const sampleData = {
        name: 'Sample Data',
        value: 42,
        items: ['apple', 'banana', 'cherry']
    };
    
    const results = await executeHook('data_processing', sampleData);
    
    logToOutput('Results:');
    results.forEach((result, index) => {
        logToOutput(`  ${index + 1}. ${JSON.stringify(result)}`);
    });
};

// Trigger UI updates hook
window.triggerUIUpdates = async function() {
    logToOutput('\n=== TRIGGERING UI UPDATES HOOK ===');
    
    const uiData = {
        header: 'New Header Content',
        theme: Math.random() > 0.5 ? 'dark' : 'light',
        notification: 'Hello from the hook system!',
        animation: 'fadeIn'
    };
    
    const results = await executeHook('ui_update', uiData);
    
    logToOutput('Results:');
    results.forEach((result, index) => {
        logToOutput(`  ${index + 1}. ${JSON.stringify(result)}`);
    });
};

// Clear output
window.clearOutput = function() {
    if (outputElement) {
        outputElement.textContent = 'Output cleared...\n';
    }
    console.clear();
};

// Advanced example: Chaining hooks
window.advancedExample = async function() {
    logToOutput('\n=== ADVANCED EXAMPLE: CHAINING HOOKS ===');
    
    // Process data first
    const data = { user: 'jane', action: 'purchase', amount: 99.99 };
    const processedResults = await executeHook('data_processing', data);
    
    // Use processed data for user action
    const userResults = await executeHook('user_action', processedResults[1]); // Use transformed data
    
    // Update UI based on user action
    const uiResults = await executeHook('ui_update', { notification: 'Purchase completed!' });
    
    logToOutput('Chained execution completed!');
};

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Example of creating a custom hook dynamically
import { addHook } from './hookSystem.js';

// Custom function that can be added to any hook
function customFunction(data) {
    logToOutput('🎯 Custom function executed with: ' + JSON.stringify(data));
    return { custom: true, data };
}

// Add the custom function to a hook
addHook('user_action', customFunction, 5);

console.log('📁 Main application loaded successfully');
