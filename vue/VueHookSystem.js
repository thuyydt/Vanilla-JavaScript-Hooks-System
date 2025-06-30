// Vue 3 Hook System - Compatible with CDN and module environments
const getVue = () => {
    if (typeof window !== 'undefined' && window.Vue) {
        return window.Vue
    }
    throw new Error('Vue 3 is required. Please load Vue 3 before using the hook system.')
}

const { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } = getVue()

/**
 * Vue 3 Hook System
 * A reactive hook system built for Vue 3 using the Composition API
 */
class VueHookSystem {
    constructor() {
        this.hooks = reactive(new Map())
        this.isExecuting = ref(false)
        this.executionLog = ref([])
    }

    /**
     * Register a function to a specific hook
     * @param {string} hookName - The name of the hook
     * @param {Function} callback - The callback function
     * @param {number} priority - Priority (lower = higher priority)
     * @returns {Function} Unregister function
     */
    addHook(hookName, callback, priority = 10) {
        if (!this.hooks.has(hookName)) {
            this.hooks.set(hookName, reactive([]))
        }
        
        const hookEntry = {
            id: Date.now() + Math.random(),
            callback,
            priority,
            enabled: ref(true)
        }
        
        this.hooks.get(hookName).push(hookEntry)
        
        // Sort by priority (lower numbers = higher priority)
        this.hooks.get(hookName).sort((a, b) => a.priority - b.priority)
        
        this.log(`✅ Function registered to hook: ${hookName} (priority: ${priority})`)
        
        // Return unregister function
        return () => this.removeHook(hookName, callback)
    }

    /**
     * Remove a function from a hook
     * @param {string} hookName - The name of the hook
     * @param {Function} callback - The callback function to remove
     */
    removeHook(hookName, callback) {
        if (this.hooks.has(hookName)) {
            const hookArray = this.hooks.get(hookName)
            const index = hookArray.findIndex(hook => hook.callback === callback)
            if (index > -1) {
                hookArray.splice(index, 1)
                this.log(`❌ Function removed from hook: ${hookName}`)
            }
        }
    }

    /**
     * Execute all functions registered to a hook
     * @param {string} hookName - The name of the hook to execute
     * @param {...any} args - Arguments to pass to hook functions
     * @returns {Promise<Array>} Results from all hook functions
     */
    async executeHook(hookName, ...args) {
        this.isExecuting.value = true
        this.log(`🔥 Executing hook: ${hookName}`)
        
        // Give Vue a chance to update the UI
        await nextTick()
        
        if (!this.hooks.has(hookName)) {
            this.log(`⚠️ No functions registered for hook: ${hookName}`)
            // Add a small delay so user can see the executing state
            await new Promise(resolve => setTimeout(resolve, 100))
            this.isExecuting.value = false
            return []
        }

        const results = []
        const hookFunctions = this.hooks.get(hookName).filter(hook => hook.enabled.value)

        for (const hook of hookFunctions) {
            try {
                this.log(`  → Running function with priority ${hook.priority}`)
                const result = await hook.callback(...args)
                results.push({
                    success: true,
                    result,
                    hookId: hook.id
                })
                // Small delay between hooks to show progress
                if (hookFunctions.length > 1) {
                    await new Promise(resolve => setTimeout(resolve, 50))
                }
            } catch (error) {
                console.error(`❌ Error in hook ${hookName}:`, error)
                this.log(`❌ Error in hook ${hookName}: ${error.message}`)
                results.push({
                    success: false,
                    error: error.message,
                    hookId: hook.id
                })
            }
        }

        // Add a final delay to ensure user sees the execution
        await new Promise(resolve => setTimeout(resolve, 200))
        this.isExecuting.value = false
        await nextTick() // Ensure reactivity updates
        return results
    }

    /**
     * Enable or disable a specific hook function
     * @param {string} hookName - The name of the hook
     * @param {Function} callback - The callback function
     * @param {boolean} enabled - Whether to enable or disable
     */
    toggleHook(hookName, callback, enabled = true) {
        if (this.hooks.has(hookName)) {
            const hook = this.hooks.get(hookName).find(h => h.callback === callback)
            if (hook) {
                hook.enabled.value = enabled
                this.log(`${enabled ? '✅' : '❌'} Hook ${hookName} ${enabled ? 'enabled' : 'disabled'}`)
            }
        }
    }

    /**
     * Get information about all registered hooks
     * @returns {Object} Hook information
     */
    getHooks() {
        const hookInfo = {}
        for (const [name, functions] of this.hooks) {
            hookInfo[name] = {
                total: functions.length,
                enabled: functions.filter(f => f.enabled.value).length,
                disabled: functions.filter(f => !f.enabled.value).length
            }
        }
        return hookInfo
    }

    /**
     * Clear all hooks or a specific hook
     * @param {string} hookName - Optional hook name to clear
     */
    clearHooks(hookName = null) {
        if (hookName) {
            this.hooks.delete(hookName)
            this.log(`🧹 Cleared hook: ${hookName}`)
        } else {
            this.hooks.clear()
            this.log('🧹 Cleared all hooks')
        }
    }

    /**
     * Log messages to the execution log
     * @param {string} message - The message to log
     */
    log(message) {
        const timestamp = new Date().toLocaleTimeString()
        this.executionLog.value.push({
            timestamp,
            message,
            id: Date.now() + Math.random()
        })
        
        // Keep only last 100 log entries
        if (this.executionLog.value.length > 100) {
            this.executionLog.value.shift()
        }
        
        console.log(`[VueHooks ${timestamp}] ${message}`)
    }

    /**
     * Clear the execution log
     */
    clearLog() {
        this.executionLog.value = []
    }
}

// Create and export the global Vue hook system instance
export const vueHookSystem = new VueHookSystem()

// Export convenience functions
export const addHook = (hookName, callback, priority) => 
    vueHookSystem.addHook(hookName, callback, priority)

export const removeHook = (hookName, callback) => 
    vueHookSystem.removeHook(hookName, callback)

export const executeHook = (hookName, ...args) => 
    vueHookSystem.executeHook(hookName, ...args)

export const toggleHook = (hookName, callback, enabled) => 
    vueHookSystem.toggleHook(hookName, callback, enabled)

export const getHooks = () => vueHookSystem.getHooks()

export const clearHooks = (hookName) => vueHookSystem.clearHooks(hookName)

export default vueHookSystem
