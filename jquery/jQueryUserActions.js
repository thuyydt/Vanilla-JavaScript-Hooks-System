// jQuery User Actions - Handle user interactions
(function($) {
    'use strict';

    // User login action
    function handleUserLogin(userData) {
        console.log('🔐 Processing user login:', userData);
        
        // Simulate login validation
        var loginResult = {
            success: true,
            user_id: Math.floor(Math.random() * 1000),
            username: userData.username,
            timestamp: new Date().toISOString(),
            action: 'login'
        };

        // Update UI to show logged in state
        $('#user-status').html('✅ Logged in as: ' + userData.username);
        
        return $.Deferred().resolve(loginResult).promise();
    }

    // User logout action
    function handleUserLogout(userData) {
        console.log('🚪 Processing user logout:', userData);
        
        var logoutResult = {
            success: true,
            message: 'User logged out successfully',
            timestamp: new Date().toISOString(),
            action: 'logout'
        };

        // Update UI
        $('#user-status').html('❌ Not logged in');
        
        return $.Deferred().resolve(logoutResult).promise();
    }

    // User profile update
    function updateUserProfile(userData) {
        console.log('👤 Updating user profile:', userData);
        
        var updateResult = {
            success: true,
            updated_fields: Object.keys(userData),
            timestamp: new Date().toISOString(),
            action: 'profile_update'
        };

        return $.Deferred().resolve(updateResult).promise();
    }

    // User notification handler
    function sendUserNotification(userData) {
        console.log('📧 Sending notification to user:', userData);
        
        var notificationResult = {
            success: true,
            notification_id: 'notif_' + Date.now(),
            recipient: userData.email || userData.username,
            timestamp: new Date().toISOString(),
            action: 'notification_sent'
        };

        // Show notification in UI
        var $notification = $('<div class="notification">')
            .text('📧 Notification sent to ' + (userData.email || userData.username))
            .appendTo('#notifications');
        
        setTimeout(function() {
            $notification.fadeOut(300, function() {
                $(this).remove();
            });
        }, 3000);

        return $.Deferred().resolve(notificationResult).promise();
    }

    // Register hooks when document is ready
    $(document).ready(function() {
        // Register user action hooks
        $.addHook('user_action', handleUserLogin, 5);
        $.addHook('user_action', sendUserNotification, 15);
        $.addHook('user_action', updateUserProfile, 10);
        
        // Register logout hook
        $.addHook('user_logout', handleUserLogout, 5);
        
        console.log('📝 User action hooks registered');
    });

})(jQuery);
