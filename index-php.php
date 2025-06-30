<?php
/**
 * PHP Hook System Example
 * Demonstrates how to implement and use a hook system in PHP
 */

// Include the hook system and configuration
require_once __DIR__ . '/php/HookConfig.php';

// Initialize the hook system with all registered hooks
$hookSystem = initializeHookSystem(true);

// Register additional custom hooks for demonstration
registerCustomHooks($hookSystem);

// Load hooks from configuration (optional)
$additionalConfig = getHookConfiguration();
loadHooksFromConfig($hookSystem, $additionalConfig);

// HTML Output starts here
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Hook System Example</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        h1 {
            color: #333;
            border-bottom: 2px solid #007acc;
            padding-bottom: 10px;
        }
        h2 {
            color: #555;
            margin-top: 30px;
        }
        .output {
            background: #1e1e1e;
            color: #f0f0f0;
            padding: 15px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            overflow-x: auto;
            white-space: pre-wrap;
            margin: 10px 0;
        }
        .hook-info {
            background: #e8f4fd;
            border-left: 4px solid #007acc;
            padding: 15px;
            margin: 10px 0;
        }
        .example {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            padding: 15px;
            border-radius: 4px;
            margin: 10px 0;
        }
        .code {
            background: #f8f8f8;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔗 PHP Hook System Example</h1>
        
        <div class="hook-info">
            <h3>What is a Hook System?</h3>
            <p>A hook system allows you to execute multiple functions at specific points in your application's lifecycle. This enables modular, extensible code where different components can "hook into" events without directly depending on each other.</p>
        </div>

        <h2>📊 Currently Registered Hooks</h2>
        <div class="example">
            <?php
            $hooks = $hookSystem->getHooks();
            foreach ($hooks as $hookName => $count) {
                echo "<strong>{$hookName}:</strong> {$count} function(s) registered<br>";
            }
            ?>
        </div>

        <h2>🚀 Hook Execution Examples</h2>

        <h3>1. User Login Hook</h3>
        <div class="example">
            <p>This hook validates user credentials, logs the attempt, and checks permissions:</p>
            <div class="output">
                <?php
                echo "=== User Login Hook Example ===\n\n";
                $loginResults = $hookSystem->executeHook('user_login', 'admin', 'password123');
                echo "\nResults:\n";
                foreach ($loginResults as $index => $result) {
                    echo "Result " . ($index + 1) . ": " . json_encode($result, JSON_PRETTY_PRINT) . "\n";
                }
                ?>
            </div>
        </div>

        <h3>2. Data Processing Hook</h3>
        <div class="example">
            <p>This hook validates, sanitizes, and caches incoming data:</p>
            <div class="output">
                <?php
                echo "\n=== Data Processing Hook Example ===\n\n";
                $sampleData = ['name' => 'John Doe', 'email' => 'john@example.com', 'age' => 30];
                $processingResults = $hookSystem->executeHook('process_data', $sampleData);
                echo "\nResults:\n";
                foreach ($processingResults as $index => $result) {
                    echo "Result " . ($index + 1) . ": " . json_encode($result, JSON_PRETTY_PRINT) . "\n";
                }
                ?>
            </div>
        </div>

        <h3>3. User Registration Hook</h3>
        <div class="example">
            <p>This hook sends welcome email, notifies admin, and updates statistics:</p>
            <div class="output">
                <?php
                echo "\n=== User Registration Hook Example ===\n\n";
                $registrationResults = $hookSystem->executeHook('user_registered', 'jane@example.com', 'Jane Smith');
                echo "\nResults:\n";
                foreach ($registrationResults as $index => $result) {
                    echo "Result " . ($index + 1) . ": " . json_encode($result, JSON_PRETTY_PRINT) . "\n";
                }
                ?>
            </div>
        </div>

        <h3>4. Custom Hooks Examples</h3>
        <div class="example">
            <p>Additional hooks loaded from configuration:</p>
            <div class="output">
                <?php
                echo "\n=== User Profile Update Hook ===\n\n";
                $profileResults = $hookSystem->executeHook('user_profile_update', 123, ['name' => 'John Updated']);
                echo "\nResults:\n";
                foreach ($profileResults as $index => $result) {
                    echo "Result " . ($index + 1) . ": " . json_encode($result, JSON_PRETTY_PRINT) . "\n";
                }

                echo "\n=== File Upload Hook ===\n\n";
                $uploadResults = $hookSystem->executeHook('file_upload', 'document.pdf', 2048576);
                echo "\nResults:\n";
                foreach ($uploadResults as $index => $result) {
                    echo "Result " . ($index + 1) . ": " . json_encode($result, JSON_PRETTY_PRINT) . "\n";
                }
                ?>
            </div>
        </div>

        <h2>💻 Code Implementation</h2>
        <div class="example">
            <h4>Project Structure:</h4>
            <div class="code">
php/
├── HookSystem.php      # Core hook system class
├── HookFunctions.php   # Hook function implementations
└── HookConfig.php      # Hook registration and configuration

indexphp.php           # Main demo file
            </div>

            <h4>Basic Hook System Usage:</h4>
            <div class="code">
// Include the hook system
require_once __DIR__ . '/php/HookConfig.php';

// Initialize with all hooks registered
$hookSystem = initializeHookSystem(true);

// Execute a hook
$results = $hookSystem->executeHook('user_login', $username, $password);
            </div>

            <h4>Adding Custom Hooks:</h4>
            <div class="code">
// Register a simple function
$hookSystem->addHook('my_hook', 'myFunction', 10);

// Register a class method
$hookSystem->addHook('my_hook', [MyClass::class, 'myMethod'], 5);

// Register an anonymous function
$hookSystem->addHook('my_hook', function($data) {
    return ['processed' => true, 'data' => $data];
}, 15);
            </div>

            <h4>Hook System Features:</h4>
            <div class="code">
// Check if hook exists
if ($hookSystem->hasHook('user_login')) {
    // Execute the hook
}

// Get hook details
$details = $hookSystem->getHookDetails('user_login');

// Filter data through hooks (transforms data)
$filteredData = $hookSystem->filterHook('sanitize_input', $rawData);

// Clear specific hook
$hookSystem->clearHook('old_hook');
            </div>
        </div>

        <h2>🎯 Use Cases</h2>
        <div class="example">
            <ul>
                <li><strong>User Authentication:</strong> Validate credentials, log attempts, check permissions</li>
                <li><strong>Data Processing:</strong> Validate, sanitize, transform, and cache data</li>
                <li><strong>Email Notifications:</strong> Send different types of emails based on events</li>
                <li><strong>Logging:</strong> Log different events across your application</li>
                <li><strong>Plugin System:</strong> Allow third-party code to hook into your application</li>
                <li><strong>Event Handling:</strong> Handle application events in a decoupled way</li>
            </ul>
        </div>

        <h2>✨ Benefits of This Architecture</h2>
        <div class="example">
            <ul>
                <li><strong>Separation of Concerns:</strong> Hook system, functions, and configuration are in separate files</li>
                <li><strong>Modularity:</strong> Each component can be developed and tested independently</li>
                <li><strong>Extensibility:</strong> Easy to add new functionality without modifying existing code</li>
                <li><strong>Reusability:</strong> Hook system can be used in multiple projects</li>
                <li><strong>Flexibility:</strong> Control execution order with priorities</li>
                <li><strong>Maintainability:</strong> Clear structure makes code easier to maintain</li>
                <li><strong>Testability:</strong> Each hook function can be tested independently</li>
                <li><strong>Configuration:</strong> Hooks can be loaded from config files or databases</li>
                <li><strong>Class-based Organization:</strong> Related functions grouped in classes</li>
                <li><strong>Backward Compatibility:</strong> Legacy function names still supported</li>
            </ul>
        </div>
    </div>

    <div class="container">
        <h2>🔧 Advanced Features</h2>
        <div class="example">
            <p>You can extend this hook system with:</p>
            <ul>
                <li>Conditional hook execution based on context</li>
                <li>Hook filtering (modify data as it passes through hooks)</li>
                <li>Asynchronous hook execution</li>
                <li>Hook debugging and profiling</li>
                <li>Dynamic hook registration from configuration files</li>
                <li>Hook dependency management</li>
            </ul>
        </div>
    </div>
</body>
</html>