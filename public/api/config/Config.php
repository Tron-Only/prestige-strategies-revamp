<?php
class Config {
    private static $env = null;
    
    public static function loadEnv() {
        if (self::$env !== null) return;
        
        // Try multiple possible .env locations
        $possiblePaths = [];

        // cPanel/shared hosting: home directory
        $home = getenv('HOME');
        if ($home) {
            $possiblePaths[] = rtrim($home, '/') . '/.env';
        }

        // Relative to server document root
        if (!empty($_SERVER['DOCUMENT_ROOT'])) {
            $docRoot = rtrim($_SERVER['DOCUMENT_ROOT'], '/');
            $possiblePaths[] = $docRoot . '/.env';
            $possiblePaths[] = dirname($docRoot) . '/.env';
        }

        // Walk up from current config directory (supports local + custom deployments)
        $current = __DIR__;
        for ($i = 0; $i < 6; $i++) {
            $possiblePaths[] = $current . '/.env';
            $current = dirname($current);
        }

        // Remove duplicates while preserving order
        $possiblePaths = array_values(array_unique($possiblePaths));
        
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
            if (strpos($line, '=') === false) continue;

            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);

            if (strlen($value) >= 2) {
                $startsWithQuote = $value[0] === '"' || $value[0] === "'";
                $endsWithQuote = $value[strlen($value) - 1] === '"' || $value[strlen($value) - 1] === "'";
                if ($startsWithQuote && $endsWithQuote) {
                    $value = substr($value, 1, -1);
                }
            }

            self::$env[$key] = $value;
        }
    }
    
    public static function get($key, $default = null) {
        self::loadEnv();
        return self::$env[$key] ?? $default;
    }
}
