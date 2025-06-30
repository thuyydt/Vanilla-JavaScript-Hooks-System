<?php
/**
 * Hook Functions
 * Collection of example hook functions for demonstration
 */

/**
 * User Authentication Hook Functions
 */
class UserAuthHooks {
    /**
     * Validate user credentials
     */
    public static function validateUser($username, $password) {
        echo "    🔐 Validating user credentials for: {$username}\n";
        // Simulate validation logic
        if ($username === 'admin' && $password === 'password123') {
            return ['status' => 'success', 'message' => 'User authenticated'];
        }
        return ['status' => 'error', 'message' => 'Invalid credentials'];
    }

    /**
     * Log login attempt
     */
    public static function logLoginAttempt($username, $password) {
        echo "    📝 Logging login attempt for: {$username}\n";
        // Simulate logging
        $timestamp = date('Y-m-d H:i:s');
        return ['logged' => true, 'timestamp' => $timestamp];
    }

    /**
     * Check user permissions
     */
    public static function checkUserPermissions($username, $password) {
        echo "    🛡️ Checking user permissions for: {$username}\n";
        // Simulate permission check
        $permissions = ['read', 'write'];
        if ($username === 'admin') {
            $permissions[] = 'admin';
        }
        return ['permissions' => $permissions];
    }
}

/**
 * Data Processing Hook Functions
 */
class DataProcessingHooks {
    /**
     * Validate data structure
     */
    public static function validateData($data) {
        echo "    ✅ Validating data structure\n";
        if (is_array($data) && !empty($data)) {
            return ['valid' => true, 'message' => 'Data is valid'];
        }
        return ['valid' => false, 'message' => 'Invalid data structure'];
    }

    /**
     * Sanitize data
     */
    public static function sanitizeData($data) {
        echo "    🧹 Sanitizing data\n";
        if (is_array($data)) {
            $sanitized = array_map('htmlspecialchars', $data);
            return ['sanitized' => $sanitized];
        }
        return ['sanitized' => $data];
    }

    /**
     * Cache processed data
     */
    public static function cacheData($data) {
        echo "    💾 Caching processed data\n";
        // Simulate caching
        $cacheKey = 'data_' . md5(serialize($data));
        return ['cached' => true, 'cache_key' => $cacheKey];
    }
}

/**
 * Email Notification Hook Functions
 */
class EmailNotificationHooks {
    /**
     * Send welcome email
     */
    public static function sendWelcomeEmail($userEmail, $userName) {
        echo "    📧 Sending welcome email to: {$userEmail}\n";
        // Simulate email sending
        return ['email_sent' => true, 'recipient' => $userEmail, 'type' => 'welcome'];
    }

    /**
     * Send admin notification
     */
    public static function sendAdminNotification($userEmail, $userName) {
        echo "    👨‍💼 Sending admin notification for new user: {$userName}\n";
        // Simulate admin notification
        return ['admin_notified' => true, 'new_user' => $userName];
    }

    /**
     * Update user statistics
     */
    public static function updateUserStats($userEmail, $userName) {
        echo "    📊 Updating user statistics\n";
        // Simulate stats update
        return ['stats_updated' => true, 'total_users' => 1250];
    }
}

/**
 * Legacy function-based hooks (for backward compatibility)
 */

function validateUser($username, $password) {
    return UserAuthHooks::validateUser($username, $password);
}

function logLoginAttempt($username, $password) {
    return UserAuthHooks::logLoginAttempt($username, $password);
}

function checkUserPermissions($username, $password) {
    return UserAuthHooks::checkUserPermissions($username, $password);
}

function validateData($data) {
    return DataProcessingHooks::validateData($data);
}

function sanitizeData($data) {
    return DataProcessingHooks::sanitizeData($data);
}

function cacheData($data) {
    return DataProcessingHooks::cacheData($data);
}

function sendWelcomeEmail($userEmail, $userName) {
    return EmailNotificationHooks::sendWelcomeEmail($userEmail, $userName);
}

function sendAdminNotification($userEmail, $userName) {
    return EmailNotificationHooks::sendAdminNotification($userEmail, $userName);
}

function updateUserStats($userEmail, $userName) {
    return EmailNotificationHooks::updateUserStats($userEmail, $userName);
}
