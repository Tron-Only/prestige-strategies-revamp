<?php
require_once __DIR__ . '/JWTHelper.php';

class AuthMiddleware {
    
    public static function verify($requiredRole = null) {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
        
        if (!$authHeader || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            http_response_code(401);
            die(json_encode(['error' => 'Unauthorized - Missing token']));
        }
        
        $token = $matches[1];
        $payload = JWTHelper::decode($token);
        
        if (!$payload) {
            http_response_code(401);
            die(json_encode(['error' => 'Unauthorized - Invalid token']));
        }
        
        if ($requiredRole && isset($payload['role']) && $payload['role'] !== $requiredRole) {
            http_response_code(403);
            die(json_encode(['error' => 'Forbidden - Insufficient permissions']));
        }
        
        return $payload;
    }
}
