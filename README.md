# Vanilla JavaScript Hooks System

This project demonstrates how to create a hook system in vanilla JavaScript that can run functions from different files. The system is modular, extensible, and follows modern JavaScript patterns.

## Features

- **Modular Hook System**: Central system for managing and executing hooks
- **Cross-File Function Execution**: Functions from different files can register to and be triggered by hooks
- **Priority-Based Execution**: Functions execute in order of priority
- **Async Support**: Hooks can handle both synchronous and asynchronous functions
- **ES6 Modules**: Uses modern JavaScript module system for clean imports/exports
- **Error Handling**: Graceful error handling for hook execution
- **Real-time Logging**: Visual feedback of hook execution

## Project Structure

```
vanilla-js-hooks/
├── index.html              # Main HTML file with UI
├── js/
│   ├── hookSystem.js       # Core hook system implementation
│   ├── main.js            # Main application orchestration
│   ├── userActions.js     # User-related functions
│   ├── dataProcessing.js  # Data manipulation functions
│   ├── uiUpdates.js       # UI update functions
│   └── utils.js           # Utility functions
└── README.md              # This file
```

## How It Works

### 1. Hook System Core (`hookSystem.js`)
The central `HookSystem` class manages all hooks:
- `addHook(hookName, callback, priority)` - Register a function to a hook
- `executeHook(hookName, ...args)` - Execute all functions registered to a hook
- `removeHook(hookName, callback)` - Remove a function from a hook

### 2. Function Registration
Functions from different files can register themselves to hooks:
```javascript
import { addHook } from './hookSystem.js';

function myFunction(data) {
    // Process data
    return result;
}

// Register to a hook with priority 1 (higher priority)
addHook('my_hook', myFunction, 1);
```

### 3. Hook Execution
Any part of the application can trigger hooks:
```javascript
import { executeHook } from './hookSystem.js';

// Execute all functions registered to 'my_hook'
const results = await executeHook('my_hook', someData);
```

## Key Concepts Demonstrated

### Module System
- Uses ES6 `import`/`export` for clean module separation
- Each file focuses on specific functionality
- Functions can be imported and used across files

### Hook Patterns
- **Observer Pattern**: Functions subscribe to hooks and get notified
- **Plugin Architecture**: Easy to add new functionality by registering to hooks
- **Event-Driven Programming**: Actions trigger cascades of functions

### Priority System
- Functions execute in order of priority (lower number = higher priority)
- Allows fine control over execution order
- Critical functions can run before others

### Async Handling
- Supports both sync and async functions
- Uses `async/await` for clean asynchronous code
- Handles errors gracefully

## Usage Examples

### Basic Hook Registration
```javascript
// In any module file
import { addHook } from './hookSystem.js';

export function handleLogin(userData) {
    console.log('User logged in:', userData);
    return { success: true, user: userData };
}

// Register the function to a hook
addHook('user_login', handleLogin, 1);
```

### Triggering Hooks
```javascript
// In main application
import { executeHook } from './hookSystem.js';

async function loginUser(userData) {
    // This will run ALL functions registered to 'user_login' hook
    const results = await executeHook('user_login', userData);
    console.log('Login results:', results);
}
```

### Cross-Module Communication
Functions in different files can communicate through hooks without direct imports:
- `userActions.js` handles user events
- `dataProcessing.js` processes the data
- `uiUpdates.js` updates the interface
- All coordinated through the hook system

## Running the Project

1. Open `index.html` in a modern web browser
2. Open browser developer tools to see console output
3. Click the buttons to trigger different hook demonstrations
4. Watch the real-time output showing hook execution

## Browser Compatibility

- Requires modern browser with ES6 module support
- Uses `import`/`export` statements
- Supports async/await
- Works in Chrome 61+, Firefox 60+, Safari 10.1+

## Extending the System

To add new functionality:

1. Create a new module file
2. Define your functions
3. Import the hook system
4. Register your functions to appropriate hooks
5. Import your module in `main.js`

Example:
```javascript
// newModule.js
import { addHook } from './hookSystem.js';

export function myNewFunction(data) {
    // Your logic here
    return result;
}

addHook('existing_hook', myNewFunction, 3);
```

This demonstrates how vanilla JavaScript can create sophisticated hook systems that rival those found in frameworks like WordPress or React, while maintaining simplicity and performance.
