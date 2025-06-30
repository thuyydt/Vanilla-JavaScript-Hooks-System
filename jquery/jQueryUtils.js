// jQuery Utilities - Helper functions and utilities
(function($) {
    'use strict';

    // Generate random data for testing
    function generateRandomData() {
        console.log('🎲 Generating random test data');
        
        var sampleNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
        var sampleItems = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
        
        var randomData = {
            id: Math.floor(Math.random() * 10000),
            name: sampleNames[Math.floor(Math.random() * sampleNames.length)],
            value: Math.floor(Math.random() * 100),
            score: Math.random() * 100,
            items: sampleItems.slice(0, Math.floor(Math.random() * 3) + 1),
            timestamp: new Date().toISOString(),
            active: Math.random() > 0.5,
            metadata: {
                source: 'jquery-utility',
                generated: true
            }
        };

        return $.Deferred().resolve({
            generated_data: randomData,
            action: 'random_generation'
        }).promise();
    }

    // Format data for display
    function formatDisplayData(data) {
        console.log('📝 Formatting data for display');
        
        var formatted = {
            original: data,
            formatted: {},
            action: 'formatting'
        };

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var value = data[key];
                
                // Format different types
                if (typeof value === 'number') {
                    formatted.formatted[key] = {
                        raw: value,
                        display: value.toLocaleString(),
                        type: 'number'
                    };
                } else if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
                    // ISO date string
                    formatted.formatted[key] = {
                        raw: value,
                        display: new Date(value).toLocaleString(),
                        type: 'datetime'
                    };
                } else if (Array.isArray(value)) {
                    formatted.formatted[key] = {
                        raw: value,
                        display: value.join(', '),
                        count: value.length,
                        type: 'array'
                    };
                } else if (typeof value === 'boolean') {
                    formatted.formatted[key] = {
                        raw: value,
                        display: value ? '✅ Yes' : '❌ No',
                        type: 'boolean'
                    };
                } else {
                    formatted.formatted[key] = {
                        raw: value,
                        display: String(value),
                        type: typeof value
                    };
                }
            }
        }

        return $.Deferred().resolve(formatted).promise();
    }

    // Log activity with timestamps
    function logActivity(data) {
        console.log('📝 Logging activity');
        
        var activityLog = {
            timestamp: new Date().toISOString(),
            data_keys: Object.keys(data),
            data_size: JSON.stringify(data).length,
            session_id: 'session_' + Date.now(),
            action: 'activity_logging'
        };

        // Store in array (simulating log storage)
        if (!window.activityLogs) {
            window.activityLogs = [];
        }
        window.activityLogs.push(activityLog);

        // Show in console for debugging
        console.log('Activity logged:', activityLog);

        return $.Deferred().resolve(activityLog).promise();
    }

    // Performance monitoring
    function monitorPerformance(data) {
        console.log('📊 Monitoring performance');
        
        var performanceData = {
            memory_used: window.performance && window.performance.memory ? 
                window.performance.memory.usedJSHeapSize : 'N/A',
            timing: window.performance && window.performance.now ? 
                window.performance.now() : Date.now(),
            data_processed: Object.keys(data).length,
            hooks_registered: Object.keys($.getHooks()).length,
            action: 'performance_monitoring'
        };

        return $.Deferred().resolve(performanceData).promise();
    }

    // Helper function to create notifications
    $.createNotification = function(message, type) {
        type = type || 'info';
        var icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };

        var $notification = $('<div class="notification notification-' + type + '">')
            .html(icons[type] + ' ' + message);
        
        $('#notifications').append($notification);
        
        $notification.fadeIn(300);
        setTimeout(function() {
            $notification.fadeOut(300, function() {
                $(this).remove();
            });
        }, 4000);
    };

    // Helper function to clear output
    $.clearOutput = function() {
        $('#output').empty();
        $.createNotification('Output cleared', 'info');
    };

    // Register hooks when document is ready
    $(document).ready(function() {
        // Register utility hooks
        $.addHook('data_processing', formatDisplayData, 12);
        $.addHook('data_processing', logActivity, 18);
        $.addHook('data_processing', monitorPerformance, 25);
        
        // Register utility hooks for user actions
        $.addHook('user_action', logActivity, 20);
        
        console.log('🛠️ Utility hooks registered');
    });

    // Add utility functions to jQuery namespace
    $.extend({
        generateRandomData: generateRandomData,
        formatDisplayData: formatDisplayData,
        logActivity: logActivity,
        monitorPerformance: monitorPerformance
    });

})(jQuery);
