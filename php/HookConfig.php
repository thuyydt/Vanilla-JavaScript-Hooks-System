<?php
/**
 * Hook Configuration
 * Register all hooks and their functions here
 */

require_once __DIR__ . '/HookSystem.php';
require_once __DIR__ . '/HookFunctions.php';

/**
 * Initialize the hook system and register all hooks
 * 
 * @param bool $debug Whether to enable debug output
 * @return PHPHookSystem The initialized hook system
 */
function initializeHookSystem($debug = true) {
    $hookSystem = new PHPHookSystem($debug);
    
    // Register User Authentication Hooks
    $hookSystem->addHook('user_login', [UserAuthHooks::class, 'validateUser'], 5);
    $hookSystem->addHook('user_login', [UserAuthHooks::class, 'logLoginAttempt'], 10);
    $hookSystem->addHook('user_login', [UserAuthHooks::class, 'checkUserPermissions'], 15);
    
    // Register Data Processing Hooks
    $hookSystem->addHook('process_data', [DataProcessingHooks::class, 'validateData'], 5);
    $hookSystem->addHook('process_data', [DataProcessingHooks::class, 'sanitizeData'], 10);
    $hookSystem->addHook('process_data', [DataProcessingHooks::class, 'cacheData'], 15);
    
    // Register Email Notification Hooks
    $hookSystem->addHook('user_registered', [EmailNotificationHooks::class, 'sendWelcomeEmail'], 10);
    $hookSystem->addHook('user_registered', [EmailNotificationHooks::class, 'sendAdminNotification'], 20);
    $hookSystem->addHook('user_registered', [EmailNotificationHooks::class, 'updateUserStats'], 30);
    
    // Alternative: Register with legacy function names for backward compatibility
    // $hookSystem->addHook('user_login', 'validateUser', 5);
    // $hookSystem->addHook('user_login', 'logLoginAttempt', 10);
    // $hookSystem->addHook('user_login', 'checkUserPermissions', 15);
    
    return $hookSystem;
}

/**
 * Register additional custom hooks
 * 
 * @param PHPHookSystem $hookSystem The hook system instance
 * @return void
 */
function registerCustomHooks($hookSystem) {
    // Example: Register custom hooks for specific features
    
    // File upload hooks
    $hookSystem->addHook('file_upload', function($filename, $filesize) {
        echo "    📁 Processing file upload: {$filename} ({$filesize} bytes)\n";
        return ['processed' => true, 'filename' => $filename];
    }, 10);
    
    // Database operation hooks
    $hookSystem->addHook('before_save', function($data) {
        echo "    💽 Running pre-save validation\n";
        return ['validated' => true, 'data' => $data];
    }, 5);
    
    $hookSystem->addHook('after_save', function($data, $id) {
        echo "    ✅ Post-save cleanup for ID: {$id}\n";
        return ['cleanup_completed' => true, 'record_id' => $id];
    }, 10);
    
    // API request hooks
    $hookSystem->addHook('api_request', function($endpoint, $method) {
        echo "    🌐 API request to {$method} {$endpoint}\n";
        return ['request_logged' => true, 'timestamp' => time()];
    }, 5);
}

/**
 * Load hooks from configuration array
 * 
 * @param PHPHookSystem $hookSystem The hook system instance
 * @param array $config Hook configuration array
 * @return void
 */
function loadHooksFromConfig($hookSystem, $config) {
    foreach ($config as $hookName => $functions) {
        foreach ($functions as $function) {
            $callback = $function['callback'];
            $priority = $function['priority'] ?? 10;
            
            $hookSystem->addHook($hookName, $callback, $priority);
        }
    }
}

/**
 * Example configuration array
 * You could load this from a JSON file or database
 */
function getHookConfiguration() {
    return [
        'user_profile_update' => [
            [
                'callback' => function($userId, $newData) {
                    echo "    👤 Validating profile update for user {$userId}\n";
                    return ['validated' => true];
                },
                'priority' => 5
            ],
            [
                'callback' => function($userId, $newData) {
                    echo "    🔄 Syncing profile data for user {$userId}\n";
                    return ['synced' => true];
                },
                'priority' => 10
            ]
        ],
        'system_maintenance' => [
            [
                'callback' => function($maintenanceType) {
                    echo "    🔧 Running {$maintenanceType} maintenance\n";
                    return ['maintenance_completed' => true];
                },
                'priority' => 10
            ]
        ]
    ];
}
