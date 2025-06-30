// Vue 3 Composables - Compatible with CDN and module environments
const getVue = () => {
    if (typeof window !== 'undefined' && window.Vue) {
        return window.Vue
    }
    throw new Error('Vue 3 is required. Please load Vue 3 before using the hook system.')
}

const { ref, computed, onMounted, onUnmounted, watch } = getVue()

import { vueHookSystem } from './VueHookSystem.js'

/**
 * Composable function for using hooks in Vue 3 components
 * @returns {Object} Hook utilities and reactive state
 */
export function useHooks() {
    const hookSystem = vueHookSystem
    const registeredHooks = ref([])
    
    // Reactive computed properties
    const isExecuting = computed(() => hookSystem.isExecuting.value)
    const executionLog = computed(() => hookSystem.executionLog.value)
    const allHooks = computed(() => hookSystem.getHooks())
    
    /**
     * Register a hook and keep track of it for cleanup
     * @param {string} hookName - The name of the hook
     * @param {Function} callback - The callback function
     * @param {number} priority - Priority (lower = higher priority)
     * @returns {Function} Unregister function
     */
    const registerHook = (hookName, callback, priority = 10) => {
        const unregister = hookSystem.addHook(hookName, callback, priority)
        
        // Track for cleanup
        registeredHooks.value.push({
            hookName,
            callback,
            unregister
        })
        
        return unregister
    }
    
    /**
     * Execute a hook
     * @param {string} hookName - The name of the hook to execute
     * @param {...any} args - Arguments to pass to hook functions
     * @returns {Promise<Array>} Results from hook functions
     */
    const executeHook = async (hookName, ...args) => {
        return await hookSystem.executeHook(hookName, ...args)
    }
    
    /**
     * Remove a specific hook
     * @param {string} hookName - The name of the hook
     * @param {Function} callback - The callback function to remove
     */
    const removeHook = (hookName, callback) => {
        hookSystem.removeHook(hookName, callback)
        
        // Remove from tracking
        const index = registeredHooks.value.findIndex(
            h => h.hookName === hookName && h.callback === callback
        )
        if (index > -1) {
            registeredHooks.value.splice(index, 1)
        }
    }
    
    /**
     * Toggle a hook on/off
     * @param {string} hookName - The name of the hook
     * @param {Function} callback - The callback function
     * @param {boolean} enabled - Whether to enable or disable
     */
    const toggleHook = (hookName, callback, enabled) => {
        hookSystem.toggleHook(hookName, callback, enabled)
    }
    
    /**
     * Clear execution log
     */
    const clearLog = () => {
        hookSystem.clearLog()
    }
    
    /**
     * Cleanup function to remove all registered hooks
     */
    const cleanup = () => {
        registeredHooks.value.forEach(({ unregister }) => {
            unregister()
        })
        registeredHooks.value = []
    }
    
    // Auto cleanup on component unmount
    onUnmounted(() => {
        cleanup()
    })
    
    return {
        // Hook management
        registerHook,
        executeHook,
        removeHook,
        toggleHook,
        cleanup,
        
        // State
        isExecuting,
        executionLog,
        allHooks,
        registeredHooks: computed(() => registeredHooks.value),
        
        // Utilities
        clearLog,
        hookSystem
    }
}

/**
 * Composable for creating lifecycle hooks
 * @returns {Object} Lifecycle hook utilities
 */
export function useLifecycleHooks() {
    const { registerHook, executeHook } = useHooks()
    
    // Common lifecycle hooks
    const onComponentMounted = (callback, priority = 10) => {
        return registerHook('component:mounted', callback, priority)
    }
    
    const onComponentUpdated = (callback, priority = 10) => {
        return registerHook('component:updated', callback, priority)
    }
    
    const onComponentUnmounted = (callback, priority = 10) => {
        return registerHook('component:unmounted', callback, priority)
    }
    
    const onDataChanged = (callback, priority = 10) => {
        return registerHook('data:changed', callback, priority)
    }
    
    const onUserAction = (callback, priority = 10) => {
        return registerHook('user:action', callback, priority)
    }
    
    // Execute lifecycle hooks
    const triggerMounted = (...args) => executeHook('component:mounted', ...args)
    const triggerUpdated = (...args) => executeHook('component:updated', ...args)
    const triggerUnmounted = (...args) => executeHook('component:unmounted', ...args)
    const triggerDataChanged = (...args) => executeHook('data:changed', ...args)
    const triggerUserAction = (...args) => executeHook('user:action', ...args)
    
    return {
        // Register lifecycle hooks
        onComponentMounted,
        onComponentUpdated,
        onComponentUnmounted,
        onDataChanged,
        onUserAction,
        
        // Trigger lifecycle hooks
        triggerMounted,
        triggerUpdated,
        triggerUnmounted,
        triggerDataChanged,
        triggerUserAction
    }
}

/**
 * Composable for async hook operations
 * @returns {Object} Async hook utilities
 */
export function useAsyncHooks() {
    const { registerHook, executeHook } = useHooks()
    const loading = ref(false)
    const error = ref(null)
    const results = ref([])
    
    /**
     * Execute async hook with loading state
     * @param {string} hookName - The name of the hook
     * @param {...any} args - Arguments to pass to hook functions
     * @returns {Promise<Array>} Results from hook functions
     */
    const executeAsyncHook = async (hookName, ...args) => {
        loading.value = true
        error.value = null
        
        try {
            const hookResults = await executeHook(hookName, ...args)
            results.value = hookResults
            return hookResults
        } catch (err) {
            error.value = err
            throw err
        } finally {
            loading.value = false
        }
    }
    
    /**
     * Register an async hook with error handling
     * @param {string} hookName - The name of the hook
     * @param {Function} asyncCallback - The async callback function
     * @param {number} priority - Priority (lower = higher priority)
     * @returns {Function} Unregister function
     */
    const registerAsyncHook = (hookName, asyncCallback, priority = 10) => {
        const wrappedCallback = async (...args) => {
            try {
                return await asyncCallback(...args)
            } catch (err) {
                console.error(`Async hook error in ${hookName}:`, err)
                throw err
            }
        }
        
        return registerHook(hookName, wrappedCallback, priority)
    }
    
    return {
        executeAsyncHook,
        registerAsyncHook,
        loading: computed(() => loading.value),
        error: computed(() => error.value),
        results: computed(() => results.value)
    }
}

/**
 * Composable for watching reactive data and triggering hooks
 * @returns {Object} Watcher utilities
 */
export function useHookWatchers() {
    const { executeHook } = useHooks()
    const watchers = ref([])
    
    /**
     * Watch a reactive value and trigger a hook when it changes
     * @param {Ref} source - The reactive source to watch
     * @param {string} hookName - The hook to trigger
     * @param {Object} options - Watch options
     * @returns {Function} Stop watching function
     */
    const watchAndTrigger = (source, hookName, options = {}) => {
        const stopWatcher = watch(
            source,
            (newValue, oldValue) => {
                executeHook(hookName, { newValue, oldValue, source })
            },
            options
        )
        
        watchers.value.push(stopWatcher)
        return stopWatcher
    }
    
    /**
     * Stop all watchers
     */
    const stopAllWatchers = () => {
        watchers.value.forEach(stop => stop())
        watchers.value = []
    }
    
    // Auto cleanup on unmount
    onUnmounted(() => {
        stopAllWatchers()
    })
    
    return {
        watchAndTrigger,
        stopAllWatchers,
        activeWatchers: computed(() => watchers.value.length)
    }
}

export default {
    useHooks,
    useLifecycleHooks,
    useAsyncHooks,
    useHookWatchers
}
