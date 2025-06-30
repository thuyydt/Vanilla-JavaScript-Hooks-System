// User Actions Module - Functions related to user interactions
import { addHook } from './hookSystem.js';

// Function to handle user login
export function handleUserLogin(userData) {
    const message = `🔐 User Login: ${userData.username} logged in at ${new Date().toLocaleTimeString()}`;
    console.log(message);
    return { action: 'login', user: userData.username, timestamp: Date.now() };
}

// Function to handle user logout  
export function handleUserLogout(userData) {
    const message = `🚪 User Logout: ${userData.username} logged out at ${new Date().toLocaleTimeString()}`;
    console.log(message);
    return { action: 'logout', user: userData.username, timestamp: Date.now() };
}

// Function to track user activity
export function trackUserActivity(action) {
    const message = `📊 Activity Tracked: ${action} at ${new Date().toLocaleTimeString()}`;
    console.log(message);
    return { tracked: action, timestamp: Date.now() };
}

// Function to send analytics
export function sendAnalytics(eventData) {
    const message = `📈 Analytics Sent: ${JSON.stringify(eventData)}`;
    console.log(message);
    return { analytics: 'sent', data: eventData };
}

// Auto-register functions to hooks when module loads
addHook('user_action', handleUserLogin, 1);
addHook('user_action', handleUserLogout, 2);
addHook('user_action', trackUserActivity, 3);
addHook('user_action', sendAnalytics, 4);

console.log('📁 User Actions module loaded and hooks registered');
