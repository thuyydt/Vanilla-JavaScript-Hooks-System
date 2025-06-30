// jQuery UI Updates - Handle DOM manipulation and visual updates
(function($) {
    'use strict';

    // Update main display area
    function updateMainDisplay(data) {
        console.log('🖼️ Updating main display with:', data);
        
        var $display = $('#main-display');
        if ($display.length === 0) {
            $display = $('<div id="main-display" class="main-display"></div>')
                .appendTo('.container');
        }

        // Create display content
        var displayContent = '<h3>📊 Data Display</h3>';
        displayContent += '<div class="data-preview">';
        displayContent += '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        displayContent += '</div>';
        displayContent += '<div class="timestamp">Updated: ' + new Date().toLocaleString() + '</div>';

        $display.html(displayContent);

        return $.Deferred().resolve({
            success: true,
            updated_element: 'main-display',
            timestamp: new Date().toISOString(),
            action: 'display_update'
        }).promise();
    }

    // Update status indicators
    function updateStatusIndicators(data) {
        console.log('🔔 Updating status indicators');
        
        var $statusBar = $('#status-bar');
        if ($statusBar.length === 0) {
            $statusBar = $('<div id="status-bar" class="status-bar"></div>')
                .prependTo('.container');
        }

        // Update various status indicators
        var statusItems = [
            { icon: '🟢', label: 'System Active', value: 'Online' },
            { icon: '📈', label: 'Data Items', value: Object.keys(data).length },
            { icon: '⏰', label: 'Last Update', value: new Date().toLocaleTimeString() }
        ];

        var statusHtml = statusItems.map(function(item) {
            return '<span class="status-item">' + 
                   item.icon + ' ' + item.label + ': <strong>' + item.value + '</strong>' +
                   '</span>';
        }).join(' | ');

        $statusBar.html(statusHtml);

        return $.Deferred().resolve({
            success: true,
            updated_element: 'status-bar',
            status_items: statusItems.length,
            action: 'status_update'
        }).promise();
    }

    // Create progress indicators
    function showProgressIndicator(data) {
        console.log('⏳ Showing progress indicator');
        
        var $progress = $('#progress-indicator');
        if ($progress.length === 0) {
            $progress = $('<div id="progress-indicator" class="progress-indicator"></div>')
                .appendTo('.container');
        }

        // Simulate progress
        $progress.html('<div class="progress-bar"><div class="progress-fill"></div></div>' +
                      '<div class="progress-text">Processing data...</div>');
        
        var $fill = $progress.find('.progress-fill');
        var $text = $progress.find('.progress-text');
        
        // Animate progress
        $fill.animate({width: '100%'}, 1500, function() {
            $text.text('✅ Processing complete!');
            setTimeout(function() {
                $progress.fadeOut(300);
            }, 1000);
        });

        return $.Deferred().resolve({
            success: true,
            updated_element: 'progress-indicator',
            action: 'progress_show'
        }).promise();
    }

    // Update data table
    function updateDataTable(data) {
        console.log('📋 Updating data table');
        
        var $table = $('#data-table');
        if ($table.length === 0) {
            $table = $('<div id="data-table" class="data-table"></div>')
                .appendTo('.container');
        }

        var tableHtml = '<h4>📋 Data Table</h4><table>';
        tableHtml += '<thead><tr><th>Property</th><th>Value</th><th>Type</th></tr></thead>';
        tableHtml += '<tbody>';

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var value = data[key];
                var type = Array.isArray(value) ? 'array' : typeof value;
                var displayValue = type === 'object' ? JSON.stringify(value) : String(value);
                
                tableHtml += '<tr>';
                tableHtml += '<td><strong>' + key + '</strong></td>';
                tableHtml += '<td>' + displayValue + '</td>';
                tableHtml += '<td><em>' + type + '</em></td>';
                tableHtml += '</tr>';
            }
        }

        tableHtml += '</tbody></table>';
        $table.html(tableHtml);

        return $.Deferred().resolve({
            success: true,
            updated_element: 'data-table',
            rows_count: Object.keys(data).length,
            action: 'table_update'
        }).promise();
    }

    // Animate elements
    function animateUIUpdates() {
        console.log('✨ Animating UI elements');
        
        // Add pulse animation to recently updated elements
        $('.container > div').addClass('pulse-animation');
        
        setTimeout(function() {
            $('.pulse-animation').removeClass('pulse-animation');
        }, 2000);

        return $.Deferred().resolve({
            success: true,
            action: 'ui_animation'
        }).promise();
    }

    // Register hooks when document is ready
    $(document).ready(function() {
        // Register UI update hooks
        $.addHook('ui_update', updateStatusIndicators, 1);
        $.addHook('ui_update', showProgressIndicator, 5);
        $.addHook('ui_update', updateMainDisplay, 10);
        $.addHook('ui_update', updateDataTable, 15);
        $.addHook('ui_update', animateUIUpdates, 20);
        
        // Also register for data processing to auto-update UI
        $.addHook('data_processing', updateMainDisplay, 20);
        
        console.log('🎨 UI update hooks registered');
    });

})(jQuery);
