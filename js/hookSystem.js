// Hook System - Central manager for all hooks
class HookSystem {
    constructor() {
        this.hooks = new Map();
    }

    // Register a function to a specific hook
    addHook(hookName, callback, priority = 10) {
        if (!this.hooks.has(hookName)) {
            this.hooks.set(hookName, []);
        }
        
        this.hooks.get(hookName).push({
            callback,
            priority
        });
        
        // Sort by priority (lower numbers = higher priority)
        this.hooks.get(hookName).sort((a, b) => a.priority - b.priority);
        
        console.log(`✅ Function registered to hook: ${hookName} (priority: ${priority})`);
    }

    // Remove a function from a hook
    removeHook(hookName, callback) {
        if (this.hooks.has(hookName)) {
            const hookArray = this.hooks.get(hookName);
            const index = hookArray.findIndex(hook => hook.callback === callback);
            if (index > -1) {
                hookArray.splice(index, 1);
                console.log(`❌ Function removed from hook: ${hookName}`);
            }
        }
    }

    // Execute all functions registered to a hook
    async executeHook(hookName, ...args) {
        console.log(`🔥 Executing hook: ${hookName}`);
        
        if (!this.hooks.has(hookName)) {
            console.log(`⚠️ No functions registered for hook: ${hookName}`);
            return [];
        }

        const results = [];
        const hookFunctions = this.hooks.get(hookName);

        for (const hook of hookFunctions) {
            try {
                console.log(`  → Running function with priority ${hook.priority}`);
                const result = await hook.callback(...args);
                results.push(result);
            } catch (error) {
                console.error(`❌ Error in hook ${hookName}:`, error);
                results.push({ error: error.message });
            }
        }

        return results;
    }

    // Get all registered hooks
    getHooks() {
        const hookInfo = {};
        for (const [name, functions] of this.hooks) {
            hookInfo[name] = functions.length;
        }
        return hookInfo;
    }

    // Execute a hook and return a promise
    executeHookAsync(hookName, ...args) {
        return this.executeHook(hookName, ...args);
    }
}

// Create global hook system instance
export const hookSystem = new HookSystem();

// Convenience functions for easier use
export const addHook = (hookName, callback, priority) => 
    hookSystem.addHook(hookName, callback, priority);

export const removeHook = (hookName, callback) => 
    hookSystem.removeHook(hookName, callback);

export const executeHook = (hookName, ...args) => 
    hookSystem.executeHook(hookName, ...args);

export const getHooks = () => hookSystem.getHooks();
