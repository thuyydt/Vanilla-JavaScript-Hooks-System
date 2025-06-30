// jQuery Hook System - Central manager for all hooks
(function($) {
    'use strict';

    // Hook System Class
    function HookSystem() {
        this.hooks = {};
    }

    HookSystem.prototype = {
        // Register a function to a specific hook
        addHook: function(hookName, callback, priority) {
            priority = priority || 10;
            
            if (!this.hooks[hookName]) {
                this.hooks[hookName] = [];
            }
            
            this.hooks[hookName].push({
                callback: callback,
                priority: priority
            });
            
            // Sort by priority (lower numbers = higher priority)
            this.hooks[hookName].sort(function(a, b) {
                return a.priority - b.priority;
            });
            
            console.log('✅ Function registered to hook: ' + hookName + ' (priority: ' + priority + ')');
        },

        // Remove a function from a hook
        removeHook: function(hookName, callback) {
            if (this.hooks[hookName]) {
                var hookArray = this.hooks[hookName];
                for (var i = 0; i < hookArray.length; i++) {
                    if (hookArray[i].callback === callback) {
                        hookArray.splice(i, 1);
                        console.log('❌ Function removed from hook: ' + hookName);
                        break;
                    }
                }
            }
        },

        // Execute all functions registered to a hook
        executeHook: function(hookName) {
            var self = this;
            var args = Array.prototype.slice.call(arguments, 1);
            
            console.log('🔥 Executing hook: ' + hookName);
            
            if (!this.hooks[hookName]) {
                console.log('⚠️ No functions registered for hook: ' + hookName);
                return $.Deferred().resolve([]).promise();
            }

            var promises = [];
            var hookFunctions = this.hooks[hookName];

            for (var i = 0; i < hookFunctions.length; i++) {
                var hook = hookFunctions[i];
                try {
                    console.log('  → Running function with priority ' + hook.priority);
                    var result = hook.callback.apply(null, args);
                    
                    // Handle both promises and regular values
                    if (result && typeof result.then === 'function') {
                        promises.push(result);
                    } else {
                        promises.push($.Deferred().resolve(result).promise());
                    }
                } catch (error) {
                    console.error('❌ Error in hook ' + hookName + ':', error);
                    promises.push($.Deferred().resolve({ error: error.message }).promise());
                }
            }

            return $.when.apply($, promises).then(function() {
                return Array.prototype.slice.call(arguments);
            });
        },

        // Get all registered hooks
        getHooks: function() {
            var hookInfo = {};
            for (var name in this.hooks) {
                if (this.hooks.hasOwnProperty(name)) {
                    hookInfo[name] = this.hooks[name].length;
                }
            }
            return hookInfo;
        }
    };

    // Create global hook system instance
    var hookSystem = new HookSystem();

    // Add to jQuery namespace
    $.hookSystem = hookSystem;

    // Convenience functions
    $.addHook = function(hookName, callback, priority) {
        return hookSystem.addHook(hookName, callback, priority);
    };

    $.removeHook = function(hookName, callback) {
        return hookSystem.removeHook(hookName, callback);
    };

    $.executeHook = function(hookName) {
        var args = Array.prototype.slice.call(arguments);
        return hookSystem.executeHook.apply(hookSystem, args);
    };

    $.getHooks = function() {
        return hookSystem.getHooks();
    };

})(jQuery);
