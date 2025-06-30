// Utils Module - Utility functions that can be used across the application
import { addHook } from './hookSystem.js';

// Function to log all hook executions
export function logHookExecution(hookName, ...args) {
    const logMessage = `🔍 Hook "${hookName}" executed with args: ${JSON.stringify(args)}`;
    console.log(logMessage);
    return { logged: true, hook: hookName, args };
}

// Function to measure performance
export function measurePerformance(hookName) {
    const startTime = performance.now();
    return {
        hook: hookName,
        startTime,
        measure: () => {
            const endTime = performance.now();
            const duration = endTime - startTime;
            console.log(`⏱️ Hook "${hookName}" took ${duration.toFixed(2)}ms to execute`);
            return duration;
        }
    };
}

// Function to format output for display
export function formatOutput(data) {
    const formatted = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
    console.log('📝 Output Formatted');
    return formatted;
}

// Register utility functions to all hooks with low priority
addHook('user_action', logHookExecution, 0);
addHook('data_processing', logHookExecution, 0);
addHook('ui_update', logHookExecution, 0);

console.log('📁 Utils module loaded and hooks registered');
