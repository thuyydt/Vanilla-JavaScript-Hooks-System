// jQuery Data Processing - Handle data transformation and validation
(function($) {
    'use strict';

    // Validate incoming data
    function validateData(data) {
        console.log('✅ Validating data:', data);
        
        var validation = {
            success: true,
            errors: [],
            warnings: [],
            validated_at: new Date().toISOString(),
            action: 'validation'
        };

        // Basic validation rules
        if (!data || typeof data !== 'object') {
            validation.success = false;
            validation.errors.push('Data must be an object');
        }

        if (data.name && data.name.length < 2) {
            validation.warnings.push('Name should be at least 2 characters');
        }

        if (data.value && isNaN(data.value)) {
            validation.warnings.push('Value should be a number');
        }

        return $.Deferred().resolve(validation).promise();
    }

    // Transform data format
    function transformData(data) {
        console.log('🔄 Transforming data:', data);
        
        var transformed = {
            original: data,
            transformed: {
                id: 'data_' + Date.now(),
                processed_at: new Date().toISOString(),
                data: {}
            },
            action: 'transformation'
        };

        // Transform each property
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var value = data[key];
                
                // Transform strings to uppercase
                if (typeof value === 'string') {
                    transformed.transformed.data[key + '_upper'] = value.toUpperCase();
                }
                
                // Transform numbers to squared values
                if (typeof value === 'number') {
                    transformed.transformed.data[key + '_squared'] = value * value;
                }
                
                // Transform arrays to counted items
                if (Array.isArray(value)) {
                    transformed.transformed.data[key + '_count'] = value.length;
                    transformed.transformed.data[key + '_items'] = value.join(', ');
                }
                
                // Keep original value too
                transformed.transformed.data[key] = value;
            }
        }

        return $.Deferred().resolve(transformed).promise();
    }

    // Filter and sanitize data
    function sanitizeData(data) {
        console.log('🧹 Sanitizing data:', data);
        
        var sanitized = {
            original_keys: Object.keys(data),
            sanitized_data: {},
            removed_properties: [],
            action: 'sanitization'
        };

        // Sanitize each property
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var value = data[key];
                
                // Remove properties starting with underscore (private)
                if (key.startsWith('_')) {
                    sanitized.removed_properties.push(key);
                    continue;
                }
                
                // Sanitize strings
                if (typeof value === 'string') {
                    sanitized.sanitized_data[key] = value.trim().replace(/[<>]/g, '');
                } else {
                    sanitized.sanitized_data[key] = value;
                }
            }
        }

        return $.Deferred().resolve(sanitized).promise();
    }

    // Cache processed data
    function cacheData(data) {
        console.log('💾 Caching data:', data);
        
        var cacheKey = 'cache_' + Date.now();
        var cacheResult = {
            cache_key: cacheKey,
            cached_at: new Date().toISOString(),
            data_size: JSON.stringify(data).length,
            action: 'caching'
        };

        // Store in sessionStorage (simulating cache)
        try {
            sessionStorage.setItem(cacheKey, JSON.stringify(data));
            cacheResult.success = true;
        } catch (e) {
            cacheResult.success = false;
            cacheResult.error = e.message;
        }

        return $.Deferred().resolve(cacheResult).promise();
    }

    // Register hooks when document is ready
    $(document).ready(function() {
        // Register data processing hooks in order of execution
        $.addHook('data_processing', validateData, 1);
        $.addHook('data_processing', sanitizeData, 5);
        $.addHook('data_processing', transformData, 10);
        $.addHook('data_processing', cacheData, 15);
        
        console.log('📊 Data processing hooks registered');
    });

})(jQuery);
