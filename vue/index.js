// Vue 3 Hook System
export { default as VueHookSystem, vueHookSystem } from './VueHookSystem.js'
export { 
    useHooks, 
    useLifecycleHooks, 
    useAsyncHooks, 
    useHookWatchers 
} from './useHooks.js'
export { default as VueHookPlugin } from './VueHookPlugin.js'

// Export convenience functions
export { 
    addHook, 
    removeHook, 
    executeHook, 
    toggleHook, 
    getHooks, 
    clearHooks 
} from './VueHookSystem.js'

/**
 * Quick setup function for Vue 3 applications
 * @param {Object} app - Vue application instance
 * @param {Object} options - Plugin options
 */
export function setupVueHooks(app, options = {}) {
    const VueHookPlugin = require('./VueHookPlugin.js').default
    app.use(VueHookPlugin, options)
    return app
}
