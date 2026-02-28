<?php
class Config {
    private static $env = null;
    
    public static function loadEnv() {
        if (self::$env !== null) return;
        
        // Try multiple possible .env locations
        $possiblePaths = [
            '/home/awinja31/.env',  // Production cPanel
            __DIR__ . '/../../../.env',  // Local development (project root)
            $_SERVER['DOCUMENT_ROOT'] . '/../.env'  // Relative to document root
        ];
        
        $envPath = null;
        foreach ($possiblePaths as $path) {
            if (file_exists($path)) {
                $envPath = $path;
                break;
            }
        }
        
        if (!$envPath) {
            die(json_encode(['error' => 'Environment file not found']));
        }
        
        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        self::$env = [];
        
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line) || strpos($line, '#') === 0) continue;
            
            list($key, $value) = explode('=', $line, 2);
            self::$env[trim($key)] = trim($value);
        }
    }
    
    public static function get($key, $default = null) {
        self::loadEnv();
        return self::$env[$key] ?? $default;
    }
}
