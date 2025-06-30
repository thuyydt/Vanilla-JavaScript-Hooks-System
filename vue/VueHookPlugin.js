import { vueHookSystem } from './VueHookSystem.js'

/**
 * Vue 3 Hook Plugin
 * Provides global access to the hook system in Vue applications
 */
export default {
    install(app, options = {}) {
        // Plugin configuration
        const config = {
            globalPropertyName: '$hooks',
            provideKey: 'vueHooks',
            autoRegisterLifecycleHooks: true,
            ...options
        }
        
        // Make hook system available globally
        app.config.globalProperties[config.globalPropertyName] = vueHookSystem
        
        // Provide hook system for injection
        app.provide(config.provideKey, vueHookSystem)
        
        // Auto-register common lifecycle hooks if enabled
        if (config.autoRegisterLifecycleHooks) {
            registerCommonHooks()
        }
        
        // Global error handler for hooks
        app.config.errorHandler = (err, instance, info) => {
            console.error('Vue Hook Error:', err)
            vueHookSystem.log(`❌ Vue Error: ${err.message} in ${info}`)
            
            // Execute error hooks
            vueHookSystem.executeHook('app:error', { error: err, instance, info })
        }
        
        // Register global mixin for automatic lifecycle hooks
        app.mixin({
            mounted() {
                vueHookSystem.executeHook('component:mounted', {
                    component: this,
                    componentName: this.$options.name || 'Anonymous'
                })
            },
            
            updated() {
                vueHookSystem.executeHook('component:updated', {
                    component: this,
                    componentName: this.$options.name || 'Anonymous'
                })
            },
            
            unmounted() {
                vueHookSystem.executeHook('component:unmounted', {
                    component: this,
                    componentName: this.$options.name || 'Anonymous'
                })
            }
        })
        
        console.log('🔌 Vue Hook System Plugin installed successfully')
    }
}

/**
 * Register common application-wide hooks
 */
function registerCommonHooks() {
    // App initialization
    vueHookSystem.addHook('app:init', () => {
        console.log('🚀 Vue application initialized')
    }, 1)
    
    // Router hooks (if Vue Router is available)
    if (typeof window !== 'undefined' && window.history) {
        vueHookSystem.addHook('router:beforeEach', (to, from) => {
            console.log(`🔄 Navigating from ${from?.path || 'unknown'} to ${to?.path || 'unknown'}`)
        }, 5)
    }
    
    // Error logging
    vueHookSystem.addHook('app:error', ({ error, instance, info }) => {
        console.error('App Error Hook:', { error, instance, info })
    }, 1)
    
    // Performance monitoring
    vueHookSystem.addHook('component:mounted', ({ componentName }) => {
        console.log(`📊 Component mounted: ${componentName}`)
    }, 100)
    
    console.log('✅ Common hooks registered')
}
