<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue 3 Hook System Demo</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        
        .container {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
        }
        
        .header {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 30px;
        }
        
        .demo-section {
            margin-bottom: 30px;
            padding: 20px;
            border: 2px solid #e74c3c;
            border-radius: 8px;
            background: #fff5f5;
        }
        
        .demo-section h3 {
            color: #e74c3c;
            margin-top: 0;
        }
        
        .button {
            background: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            margin: 5px;
            font-size: 14px;
            transition: background-color 0.3s;
        }
        
        .button:hover {
            background: #2980b9;
        }
        
        .button.success {
            background: #27ae60;
        }
        
        .button.success:hover {
            background: #229954;
        }
        
        .button.danger {
            background: #e74c3c;
        }
        
        .button.danger:hover {
            background: #c0392b;
        }
        
        .log {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 15px;
            border-radius: 6px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 12px;
            max-height: 300px;
            overflow-y: auto;
            margin-top: 15px;
        }
        
        .log-entry {
            margin-bottom: 5px;
            padding: 3px 0;
            border-bottom: 1px solid #34495e;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .stat-card {
            background: #ecf0f1;
            padding: 15px;
            border-radius: 6px;
            text-align: center;
            transition: all 0.3s ease;
        }
        
        .stat-card.executing {
            background: #fff5f5;
            border: 2px solid #e74c3c;
            animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .input-group {
            margin: 15px 0;
        }
        
        .input-group input {
            padding: 8px 12px;
            border: 2px solid #bdc3c7;
            border-radius: 4px;
            margin-right: 10px;
            font-size: 14px;
        }
        
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .hook-list {
            display: grid;
            gap: 10px;
            margin: 15px 0;
        }
        
        .hook-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 4px;
            border-left: 4px solid #3498db;
        }
    </style>
</head>
<body>
    <div id="app">
        <div class="header">
            <h1>🪝 Vue 3 Hook System Demo</h1>
            <p>Interactive demonstration of the Vue 3 Hook System with Composition API</p>
        </div>

        <!-- Hook Statistics -->
        <div class="container">
            <h2>📊 Hook Statistics</h2>
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number">{{ Object.keys(allHooks).length }}</div>
                    <div>Total Hooks</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{{ registeredHooks.length }}</div>
                    <div>Component Hooks</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{{ executionLog.length }}</div>
                    <div>Log Entries</div>
                </div>
                <div class="stat-card" :class="{ 'executing': isExecuting }">
                    <div class="stat-number" :style="{ color: isExecuting ? '#e74c3c' : '#2c3e50' }">
                        <span v-if="isExecuting" class="loading" style="width: 16px; height: 16px; margin-right: 8px;"></span>
                        {{ isExecuting ? 'Yes' : 'No' }}
                    </div>
                    <div>Currently Executing</div>
                </div>
            </div>
        </div>

        <!-- Basic Hook Operations -->
        <div class="container">
            <div class="demo-section">
                <h3>🔧 Basic Hook Operations</h3>
                <div class="input-group">
                    <input v-model="newHookName" placeholder="Hook name (e.g., user:login)" />
                    <input v-model="newHookMessage" placeholder="Test message" />
                    <button @click="addTestHook" class="button">Add Test Hook</button>
                </div>
                <div>
                    <button @click="executeTestHook" class="button success">Execute Hook</button>
                    <button @click="removeTestHook" class="button danger">Remove Hook</button>
                    <button @click="clearAllHooks" class="button">Clear All Hooks</button>
                </div>
            </div>
        </div>

        <!-- Lifecycle Hooks -->
        <div class="container">
            <div class="demo-section">
                <h3>🔄 Lifecycle Hooks</h3>
                <div>
                    <button @click="triggerMounted" class="button">Trigger Mounted</button>
                    <button @click="triggerUpdated" class="button">Trigger Updated</button>
                    <button @click="triggerDataChanged" class="button">Trigger Data Changed</button>
                    <button @click="triggerUserAction" class="button">Trigger User Action</button>
                </div>
                <div class="input-group">
                    <button @click="toggleLifecycleHooks" class="button">
                        {{ lifecycleHooksEnabled ? 'Disable' : 'Enable' }} Lifecycle Hooks
                    </button>
                </div>
            </div>
        </div>

        <!-- Async Hooks -->
        <div class="container">
            <div class="demo-section">
                <h3>⚡ Async Hook Operations</h3>
                <div>
                    <button @click="executeAsyncHook" class="button" :disabled="loading">
                        <span v-if="loading" class="loading"></span>
                        {{ loading ? 'Executing...' : 'Execute Async Hook' }}
                    </button>
                    <button @click="addAsyncHook" class="button success">Add Async Hook</button>
                </div>
                <div v-if="error" style="color: #e74c3c; margin-top: 10px;">
                    Error: {{ error.message }}
                </div>
                <div v-if="results.length > 0" style="margin-top: 10px;">
                    <strong>Results:</strong> {{ results.length }} hook(s) executed
                </div>
            </div>
        </div>

        <!-- Active Hooks List -->
        <div class="container">
            <h2>📋 Active Hooks</h2>
            <div class="hook-list">
                <div v-for="(hookInfo, hookName) in allHooks" :key="hookName" class="hook-item">
                    <div>
                        <strong>{{ hookName }}</strong>
                        <small> ({{ hookInfo.enabled }} enabled, {{ hookInfo.disabled }} disabled)</small>
                    </div>
                    <div>
                        <button @click="executeSpecificHook(hookName)" class="button">Execute</button>
                    </div>
                </div>
            </div>
            <div v-if="Object.keys(allHooks).length === 0" style="text-align: center; color: #7f8c8d;">
                No hooks registered yet. Add some hooks using the controls above!
            </div>
        </div>

        <!-- Execution Log -->
        <div class="container">
            <h2>📝 Execution Log</h2>
            <div>
                <button @click="clearLog" class="button">Clear Log</button>
                <button @click="downloadLog" class="button">Download Log</button>
            </div>
            <div class="log">
                <div v-for="entry in executionLog.slice(-50)" :key="entry.id" class="log-entry">
                    <span style="color: #95a5a6;">[{{ entry.timestamp }}]</span> {{ entry.message }}
                </div>
                <div v-if="executionLog.length === 0" style="color: #7f8c8d;">
                    No log entries yet. Perform some hook operations to see logs here.
                </div>
            </div>
        </div>
    </div>

    <script type="module">
        // Import Vue composables from our local files
        import { useHooks, useLifecycleHooks, useAsyncHooks } from './vue/useHooks.js'
        
        // Use Vue from the global CDN
        const { createApp, ref, computed } = Vue

        createApp({
            setup() {
                // Use the Vue 3 hook composables
                const {
                    registerHook,
                    executeHook,
                    removeHook,
                    toggleHook,
                    isExecuting,
                    executionLog,
                    allHooks,
                    registeredHooks,
                    clearLog,
                    cleanup
                } = useHooks()

                const {
                    onComponentMounted,
                    onComponentUpdated,
                    onDataChanged,
                    onUserAction,
                    triggerMounted,
                    triggerUpdated,
                    triggerDataChanged,
                    triggerUserAction
                } = useLifecycleHooks()

                const {
                    executeAsyncHook,
                    registerAsyncHook,
                    loading,
                    error,
                    results
                } = useAsyncHooks()

                // Component reactive state
                const newHookName = ref('demo:test')
                const newHookMessage = ref('Hello from hook!')
                const lifecycleHooksEnabled = ref(true)
                let currentTestHook = null

                // Register some initial lifecycle hooks
                onComponentMounted(() => {
                    console.log('Demo component mounted!')
                    return { status: 'mounted', timestamp: Date.now() }
                })

                onComponentUpdated(() => {
                    console.log('Demo component updated!')
                    return { status: 'updated', timestamp: Date.now() }
                })

                onDataChanged((data) => {
                    console.log('Data changed:', data)
                    return { status: 'data-changed', data }
                })

                onUserAction((action) => {
                    console.log('User action:', action)
                    return { status: 'user-action', action }
                })

                // Register some async hooks
                registerAsyncHook('async:demo', async (message) => {
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    return { message: `Async result: ${message}`, timestamp: Date.now() }
                })

                registerAsyncHook('async:demo', async (message) => {
                    await new Promise(resolve => setTimeout(resolve, 500))
                    return { message: `Another async result: ${message}`, timestamp: Date.now() }
                })

                // Methods
                const addTestHook = () => {
                    if (currentTestHook) {
                        removeHook(newHookName.value, currentTestHook)
                    }
                    
                    currentTestHook = (message) => {
                        console.log(`Test hook executed with message: ${message}`)
                        return { 
                            message: `Hook response: ${message}`, 
                            hookName: newHookName.value,
                            timestamp: Date.now()
                        }
                    }
                    
                    registerHook(newHookName.value, currentTestHook, 10)
                }

                const executeTestHook = () => {
                    executeHook(newHookName.value, newHookMessage.value)
                }

                const removeTestHook = () => {
                    if (currentTestHook) {
                        removeHook(newHookName.value, currentTestHook)
                        currentTestHook = null
                    }
                }

                const clearAllHooks = () => {
                    cleanup()
                    currentTestHook = null
                }

                const toggleLifecycleHooks = () => {
                    lifecycleHooksEnabled.value = !lifecycleHooksEnabled.value
                    // Here you would toggle the actual hooks if needed
                }

                const executeSpecificHook = (hookName) => {
                    executeHook(hookName, `Manual execution of ${hookName}`)
                }

                const addAsyncHook = () => {
                    const randomId = Math.floor(Math.random() * 1000)
                    registerAsyncHook(`async:custom-${randomId}`, async (data) => {
                        const delay = Math.random() * 2000 + 500
                        await new Promise(resolve => setTimeout(resolve, delay))
                        return { 
                            id: randomId, 
                            data, 
                            delay,
                            result: `Custom async hook ${randomId} completed!`
                        }
                    })
                }

                const executeAsyncDemo = () => {
                    executeAsyncHook('async:demo', 'Demo message for async hooks')
                }

                const downloadLog = () => {
                    const logData = executionLog.value.map(entry => 
                        `[${entry.timestamp}] ${entry.message}`
                    ).join('\n')
                    
                    const blob = new Blob([logData], { type: 'text/plain' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `vue-hooks-log-${Date.now()}.txt`
                    a.click()
                    URL.revokeObjectURL(url)
                }

                return {
                    // State
                    newHookName,
                    newHookMessage,
                    lifecycleHooksEnabled,
                    isExecuting,
                    executionLog,
                    allHooks,
                    registeredHooks,
                    loading,
                    error,
                    results,
                    
                    // Methods
                    addTestHook,
                    executeTestHook: executeAsyncDemo,
                    removeTestHook,
                    clearAllHooks,
                    triggerMounted,
                    triggerUpdated,
                    triggerDataChanged,
                    triggerUserAction,
                    toggleLifecycleHooks,
                    executeSpecificHook,
                    executeAsyncHook: executeAsyncDemo,
                    addAsyncHook,
                    clearLog,
                    downloadLog
                }
            }
        }).mount('#app')
    </script>
</body>
</html>
