# Vue 3 Hook System

A powerful and reactive hook system built specifically for Vue 3 using the Composition API. This system provides a flexible way to extend functionality through hooks while maintaining Vue's reactivity.

## Features

- 🔥 **Vue 3 Composition API**: Built with Vue 3's reactive system
- ⚡ **Reactive State**: All hook operations are reactive and observable
- 🪝 **Lifecycle Hooks**: Automatic integration with Vue component lifecycle
- 🔄 **Async Support**: Full support for async hook operations
- 📊 **Real-time Monitoring**: Watch hook execution in real-time
- 🎯 **Priority System**: Control hook execution order with priorities
- 🛡️ **Error Handling**: Robust error handling and logging
- 🔌 **Plugin System**: Easy integration with Vue applications

## Installation

### Using ES Modules

```javascript
import { useHooks, VueHookPlugin } from './vue/index.js'

// Use in a Vue 3 application
app.use(VueHookPlugin)
```

### Using as Plugin

```javascript
import { createApp } from 'vue'
import VueHookPlugin from './vue/VueHookPlugin.js'
import App from './App.vue'

const app = createApp(App)
app.use(VueHookPlugin, {
    globalPropertyName: '$hooks',
    autoRegisterLifecycleHooks: true
})
```

## Usage

### Basic Hook Operations

```javascript
import { useHooks } from './vue/useHooks.js'

export default {
    setup() {
        const { registerHook, executeHook, removeHook } = useHooks()
        
        // Register a hook
        const unregister = registerHook('user:login', (userData) => {
            console.log('User logged in:', userData)
            return { status: 'logged-in', timestamp: Date.now() }
        }, 10) // Priority 10
        
        // Execute the hook
        const results = await executeHook('user:login', { id: 1, name: 'John' })
        
        // Remove the hook
        unregister()
        
        return {}
    }
}
```

### Lifecycle Hooks

```javascript
import { useLifecycleHooks } from './vue/useHooks.js'

export default {
    setup() {
        const { 
            onComponentMounted, 
            onComponentUpdated, 
            triggerDataChanged 
        } = useLifecycleHooks()
        
        // Register lifecycle hooks
        onComponentMounted(() => {
            console.log('Component has mounted!')
        })
        
        onComponentUpdated(() => {
            console.log('Component has updated!')
        })
        
        // Trigger custom lifecycle events
        const handleDataChange = () => {
            triggerDataChanged({ newData: 'some value' })
        }
        
        return { handleDataChange }
    }
}
```

### Async Hooks

```javascript
import { useAsyncHooks } from './vue/useHooks.js'

export default {
    setup() {
        const { 
            registerAsyncHook, 
            executeAsyncHook, 
            loading, 
            error, 
            results 
        } = useAsyncHooks()
        
        // Register async hook
        registerAsyncHook('api:fetch', async (url) => {
            const response = await fetch(url)
            return await response.json()
        })
        
        // Execute async hook with loading state
        const fetchData = async () => {
            try {
                const results = await executeAsyncHook('api:fetch', '/api/data')
                console.log('Fetch results:', results)
            } catch (err) {
                console.error('Fetch error:', err)
            }
        }
        
        return { 
            fetchData, 
            loading, 
            error, 
            results 
        }
    }
}
```

### Reactive Watchers

```javascript
import { useHookWatchers } from './vue/useHooks.js'
import { ref } from 'vue'

export default {
    setup() {
        const { watchAndTrigger } = useHookWatchers()
        const userData = ref({ name: '', email: '' })
        
        // Watch reactive data and trigger hooks on changes
        watchAndTrigger(
            userData, 
            'user:dataChanged', 
            { deep: true }
        )
        
        return { userData }
    }
}
```

## API Reference

### Core Classes

#### VueHookSystem

The main hook system class that manages all hook operations.

**Methods:**
- `addHook(hookName, callback, priority)` - Register a hook function
- `removeHook(hookName, callback)` - Remove a hook function
- `executeHook(hookName, ...args)` - Execute all functions for a hook
- `toggleHook(hookName, callback, enabled)` - Enable/disable a hook
- `getHooks()` - Get information about all hooks
- `clearHooks(hookName)` - Clear hooks

### Composables

#### useHooks()

Main composable for hook operations.

**Returns:**
- `registerHook(hookName, callback, priority)` - Register a hook
- `executeHook(hookName, ...args)` - Execute a hook
- `removeHook(hookName, callback)` - Remove a hook
- `isExecuting` - Reactive boolean indicating if hooks are executing
- `executionLog` - Reactive array of execution logs
- `allHooks` - Reactive object with hook information

#### useLifecycleHooks()

Composable for component lifecycle hooks.

**Returns:**
- `onComponentMounted(callback, priority)` - Register mounted hook
- `onComponentUpdated(callback, priority)` - Register updated hook
- `onComponentUnmounted(callback, priority)` - Register unmounted hook
- `triggerMounted(...args)` - Trigger mounted hooks
- `triggerUpdated(...args)` - Trigger updated hooks

#### useAsyncHooks()

Composable for async hook operations.

**Returns:**
- `executeAsyncHook(hookName, ...args)` - Execute async hooks with loading state
- `registerAsyncHook(hookName, callback, priority)` - Register async hook
- `loading` - Reactive loading state
- `error` - Reactive error state
- `results` - Reactive results array

#### useHookWatchers()

Composable for watching reactive data and triggering hooks.

**Returns:**
- `watchAndTrigger(source, hookName, options)` - Watch reactive data
- `stopAllWatchers()` - Stop all active watchers
- `activeWatchers` - Number of active watchers

## Plugin Configuration

```javascript
app.use(VueHookPlugin, {
    globalPropertyName: '$hooks',           // Global property name
    provideKey: 'vueHooks',                // Provide/inject key
    autoRegisterLifecycleHooks: true       // Auto-register lifecycle hooks
})
```

## Common Hook Names

The system supports any hook names, but here are some common conventions:

### Component Lifecycle
- `component:mounted`
- `component:updated` 
- `component:unmounted`

### User Actions
- `user:login`
- `user:logout`
- `user:action`

### Data Operations
- `data:changed`
- `data:loaded`
- `data:saved`

### Application Events
- `app:init`
- `app:error`
- `app:ready`

### Router Events (if using Vue Router)
- `router:beforeEach`
- `router:afterEach`

## Error Handling

The hook system includes comprehensive error handling:

```javascript
// Errors are caught and logged
registerHook('error:prone', () => {
    throw new Error('Something went wrong')
})

// Execute the hook - error will be caught and logged
const results = await executeHook('error:prone')
// Results will include error information
```

## Performance Considerations

- Hooks are executed in priority order (lower numbers first)
- Async hooks run concurrently but return results in priority order
- The system automatically cleans up hooks when components are unmounted
- Execution logs are limited to 100 entries to prevent memory issues

## Examples

See `indexvue.php` for a complete interactive demo showing all features of the Vue 3 Hook System.

## License

This Vue 3 Hook System is part of the vanilla-js-hooks project.
