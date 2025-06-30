// jQuery Main Application - Orchestrates everything
(function($) {
    'use strict';

    var $output;

    // Function to log messages to both console and output element
    function logToOutput(message) {
        console.log(message);
        if ($output && $output.length) {
            $output.append(message + '\n');
            $output.scrollTop($output[0].scrollHeight);
        }
    }

    // Initialize the application
    function init() {
        $output = $('#output');
        logToOutput('🚀 jQuery Hooks System Initialized');
        logToOutput('📋 Registered Hooks: ' + JSON.stringify($.getHooks(), null, 2));
        
        // Initialize notifications container
        if ($('#notifications').length === 0) {
            $('<div id="notifications" class="notifications-container"></div>')
                .appendTo('body');
        }
    }

    // Trigger user actions hook
    window.triggerUserActions = function() {
        logToOutput('\n=== TRIGGERING USER ACTIONS HOOK ===');
        
        var userData = { 
            username: 'john_doe', 
            email: 'john@example.com',
            action: 'login'
        };
        
        $.executeHook('user_action', userData).then(function() {
            var results = Array.prototype.slice.call(arguments);
            logToOutput('Results:');
            results.forEach(function(result, index) {
                logToOutput('  ' + (index + 1) + '. ' + JSON.stringify(result));
            });
            
            // Also trigger UI update
            $.executeHook('ui_update', userData);
        });
    };

    // Trigger data processing hook
    window.triggerDataProcessing = function() {
        logToOutput('\n=== TRIGGERING DATA PROCESSING HOOK ===');
        
        var sampleData = {
            name: 'Sample Data',
            value: 42,
            score: 87.5,
            items: ['apple', 'banana', 'cherry'],
            active: true,
            _private: 'this should be removed',
            timestamp: new Date().toISOString()
        };
        
        $.executeHook('data_processing', sampleData).then(function() {
            var results = Array.prototype.slice.call(arguments);
            logToOutput('Results:');
            results.forEach(function(result, index) {
                logToOutput('  ' + (index + 1) + '. ' + JSON.stringify(result, null, 2));
            });
            
            // Also trigger UI update
            $.executeHook('ui_update', sampleData);
        });
    };

    // Trigger UI updates hook
    window.triggerUIUpdates = function() {
        logToOutput('\n=== TRIGGERING UI UPDATES HOOK ===');
        
        var uiData = {
            page: 'dashboard',
            user: 'admin',
            timestamp: new Date().toISOString(),
            stats: {
                visitors: 1234,
                sessions: 567,
                bounce_rate: 0.34
            }
        };
        
        $.executeHook('ui_update', uiData).then(function() {
            var results = Array.prototype.slice.call(arguments);
            logToOutput('Results:');
            results.forEach(function(result, index) {
                logToOutput('  ' + (index + 1) + '. ' + JSON.stringify(result));
            });
        });
    };

    // Test all hooks
    window.testAllHooks = function() {
        logToOutput('\n=== TESTING ALL HOOKS ===');
        
        // Test user actions
        triggerUserActions();
        
        setTimeout(function() {
            // Test data processing
            triggerDataProcessing();
        }, 1000);
        
        setTimeout(function() {
            // Test UI updates
            triggerUIUpdates();
        }, 2000);
        
        setTimeout(function() {
            logToOutput('\n🎉 All hooks tested!');
            $.createNotification('All hooks tested successfully!', 'success');
        }, 3000);
    };

    // Generate and process random data
    window.generateRandomData = function() {
        logToOutput('\n=== GENERATING RANDOM DATA ===');
        
        $.generateRandomData().then(function(result) {
            logToOutput('Generated: ' + JSON.stringify(result.generated_data, null, 2));
            
            // Process the generated data
            $.executeHook('data_processing', result.generated_data).then(function() {
                var results = Array.prototype.slice.call(arguments);
                logToOutput('Processing Results:');
                results.forEach(function(result, index) {
                    logToOutput('  ' + (index + 1) + '. ' + JSON.stringify(result, null, 2));
                });
                
                // Update UI with generated data
                $.executeHook('ui_update', result.generated_data);
            });
        });
    };

    // Clear all output and reset
    window.clearOutput = function() {
        if ($output && $output.length) {
            $output.empty();
        }
        
        // Clear other UI elements
        $('#main-display, #data-table, #progress-indicator').remove();
        
        logToOutput('🧹 Output cleared');
        $.createNotification('Output and displays cleared', 'info');
    };

    // Show hook information
    window.showHookInfo = function() {
        logToOutput('\n=== HOOK SYSTEM INFORMATION ===');
        
        var hooks = $.getHooks();
        logToOutput('📊 Registered Hooks:');
        
        for (var hookName in hooks) {
            if (hooks.hasOwnProperty(hookName)) {
                logToOutput('  • ' + hookName + ': ' + hooks[hookName] + ' function(s)');
            }
        }
        
        logToOutput('Total hooks: ' + Object.keys(hooks).length);
        
        // Show performance info if available
        if (window.activityLogs) {
            logToOutput('📝 Activity logs: ' + window.activityLogs.length + ' entries');
        }
    };

    // Initialize when document is ready
    $(document).ready(function() {
        init();
        
        // Add some interactive features
        $(document).on('click', '.notification', function() {
            $(this).fadeOut(300, function() {
                $(this).remove();
            });
        });
        
        console.log('📱 jQuery Hooks Application Ready');
    });

})(jQuery);
