<?php
require_once __DIR__ . '/Config.php';

class Database {
    private static $instance = null;
    
    public static function getConnection() {
        if (self::$instance === null) {
            $host = Config::get('DB_HOST', 'localhost');
            $db = Config::get('DB_NAME');
            $user = Config::get('DB_USER');
            $pass = Config::get('DB_PASS');
            
            self::$instance = new mysqli($host, $user, $pass, $db);
            
            if (self::$instance->connect_error) {
                http_response_code(500);
                die(json_encode(['error' => 'Database connection failed']));
            }
            
            self::$instance->set_charset('utf8mb4');
        }
        
        return self::$instance;
    }
    
    public static function escape($value) {
        return self::getConnection()->real_escape_string($value);
    }
}
