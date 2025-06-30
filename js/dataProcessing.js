// Data Processing Module - Functions for data manipulation
import { addHook } from './hookSystem.js';

// Function to validate data
export function validateData(data) {
    const isValid = data && typeof data === 'object' && Object.keys(data).length > 0;
    const message = `✅ Data Validation: ${isValid ? 'PASSED' : 'FAILED'}`;
    console.log(message);
    return { validation: isValid, data };
}

// Function to transform data
export function transformData(data) {
    const transformed = {
        ...data,
        processed: true,
        processedAt: new Date().toISOString(),
        id: Math.random().toString(36).substr(2, 9)
    };
    console.log('🔄 Data Transformed:', transformed);
    return transformed;
}

// Function to cache data
export function cacheData(data) {
    // Simulate caching
    const cacheKey = `cache_${Date.now()}`;
    localStorage.setItem(cacheKey, JSON.stringify(data));
    console.log(`💾 Data Cached with key: ${cacheKey}`);
    return { cached: true, key: cacheKey };
}

// Function to log data processing
export function logDataProcessing(data) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        dataSize: JSON.stringify(data).length,
        type: 'data_processing'
    };
    console.log('📝 Data Processing Logged:', logEntry);
    return logEntry;
}

// Register functions to data processing hook
addHook('data_processing', validateData, 1);
addHook('data_processing', transformData, 2);
addHook('data_processing', cacheData, 3);
addHook('data_processing', logDataProcessing, 4);

console.log('📁 Data Processing module loaded and hooks registered');
