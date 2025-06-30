<?php
/**
 * PHP Hook System
 * A flexible hook system for PHP applications
 * 
 * @author Your Name
 * @version 1.0.0
 */

class PHPHookSystem {
    /**
     * @var array Storage for all registered hooks
     */
    private $hooks = [];

    /**
     * @var bool Whether to output debug information
     */
    private $debug = true;

    /**
     * Constructor
     * 
     * @param bool $debug Whether to enable debug output
     */
    public function __construct($debug = true) {
        $this->debug = $debug;
    }

    /**
     * Add a function to a hook with optional priority
     * 
     * @param string $hookName The name of the hook
     * @param callable $callback The function to call
     * @param int $priority Priority (lower numbers = higher priority)
     * @return void
     */
    public function addHook($hookName, $callback, $priority = 10) {
        if (!isset($this->hooks[$hookName])) {
            $this->hooks[$hookName] = [];
        }

        $this->hooks[$hookName][] = [
            'callback' => $callback,
            'priority' => $priority
        ];

        // Sort by priority (lower numbers = higher priority)
        usort($this->hooks[$hookName], function($a, $b) {
            return $a['priority'] - $b['priority'];
        });

        if ($this->debug) {
            echo "✅ Function registered to hook: {$hookName} (priority: {$priority})\n";
        }
    }

    /**
     * Remove a function from a hook
     * 
     * @param string $hookName The name of the hook
     * @param callable $callback The function to remove
     * @return bool True if removed, false if not found
     */
    public function removeHook($hookName, $callback) {
        if (!isset($this->hooks[$hookName])) {
            return false;
        }

        $hookArray = &$this->hooks[$hookName];
        for ($i = 0; $i < count($hookArray); $i++) {
            if ($hookArray[$i]['callback'] === $callback) {
                array_splice($hookArray, $i, 1);
                if ($this->debug) {
                    echo "❌ Function removed from hook: {$hookName}\n";
                }
                return true;
            }
        }

        return false;
    }

    /**
     * Execute all functions registered to a hook
     * 
     * @param string $hookName The name of the hook to execute
     * @param mixed ...$args Arguments to pass to the hook functions
     * @return array Results from all executed functions
     */
    public function executeHook($hookName, ...$args) {
        if ($this->debug) {
            echo "🔥 Executing hook: {$hookName}\n";
        }

        if (!isset($this->hooks[$hookName])) {
            if ($this->debug) {
                echo "⚠️ No functions registered for hook: {$hookName}\n";
            }
            return [];
        }

        $results = [];
        foreach ($this->hooks[$hookName] as $hook) {
            try {
                if ($this->debug) {
                    echo "  → Running function with priority {$hook['priority']}\n";
                }
                $result = call_user_func_array($hook['callback'], $args);
                $results[] = $result;
            } catch (Exception $e) {
                if ($this->debug) {
                    echo "❌ Error in hook {$hookName}: " . $e->getMessage() . "\n";
                }
                $results[] = ['error' => $e->getMessage()];
            }
        }

        return $results;
    }

    /**
     * Get information about all registered hooks
     * 
     * @return array Hook names and function counts
     */
    public function getHooks() {
        $hookInfo = [];
        foreach ($this->hooks as $name => $functions) {
            $hookInfo[$name] = count($functions);
        }
        return $hookInfo;
    }

    /**
     * Get detailed information about a specific hook
     * 
     * @param string $hookName The name of the hook
     * @return array|null Hook details or null if not found
     */
    public function getHookDetails($hookName) {
        if (!isset($this->hooks[$hookName])) {
            return null;
        }

        return [
            'name' => $hookName,
            'function_count' => count($this->hooks[$hookName]),
            'functions' => array_map(function($hook) {
                return [
                    'priority' => $hook['priority'],
                    'callback' => is_string($hook['callback']) ? $hook['callback'] : 'Closure'
                ];
            }, $this->hooks[$hookName])
        ];
    }

    /**
     * Check if a hook exists
     * 
     * @param string $hookName The name of the hook
     * @return bool True if hook exists, false otherwise
     */
    public function hasHook($hookName) {
        return isset($this->hooks[$hookName]) && !empty($this->hooks[$hookName]);
    }

    /**
     * Clear all functions from a specific hook
     * 
     * @param string $hookName The name of the hook to clear
     * @return bool True if cleared, false if hook didn't exist
     */
    public function clearHook($hookName) {
        if (isset($this->hooks[$hookName])) {
            $count = count($this->hooks[$hookName]);
            unset($this->hooks[$hookName]);
            if ($this->debug) {
                echo "🧹 Cleared {$count} function(s) from hook: {$hookName}\n";
            }
            return true;
        }
        return false;
    }

    /**
     * Clear all hooks
     * 
     * @return void
     */
    public function clearAllHooks() {
        $totalCount = array_sum(array_map('count', $this->hooks));
        $this->hooks = [];
        if ($this->debug) {
            echo "🧹 Cleared all hooks ({$totalCount} total functions)\n";
        }
    }

    /**
     * Set debug mode
     * 
     * @param bool $debug Whether to enable debug output
     * @return void
     */
    public function setDebug($debug) {
        $this->debug = $debug;
    }

    /**
     * Execute a hook and filter the result through all functions
     * This is different from executeHook - it passes the result from one function
     * to the next, allowing for data transformation
     * 
     * @param string $hookName The name of the hook to execute
     * @param mixed $value The initial value to filter
     * @param mixed ...$args Additional arguments to pass to hook functions
     * @return mixed The filtered result
     */
    public function filterHook($hookName, $value, ...$args) {
        if ($this->debug) {
            echo "🔍 Filtering through hook: {$hookName}\n";
        }

        if (!isset($this->hooks[$hookName])) {
            if ($this->debug) {
                echo "⚠️ No functions registered for filter hook: {$hookName}\n";
            }
            return $value;
        }

        $filteredValue = $value;
        foreach ($this->hooks[$hookName] as $hook) {
            try {
                if ($this->debug) {
                    echo "  → Filtering through function with priority {$hook['priority']}\n";
                }
                $filteredValue = call_user_func_array($hook['callback'], array_merge([$filteredValue], $args));
            } catch (Exception $e) {
                if ($this->debug) {
                    echo "❌ Error in filter hook {$hookName}: " . $e->getMessage() . "\n";
                }
                // Continue with the previous value if there's an error
            }
        }

        return $filteredValue;
    }
}
