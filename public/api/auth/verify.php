<?php
require_once '../config/cors.php';
require_once '../config/JWTHelper.php';
require_once '../config/Database.php';

// Get token from header
$headers = getallheaders();
$auth_header = $headers['Authorization'] ?? $headers['authorization'] ?? '';
$token = str_replace('Bearer ', '', $auth_header);

if (!$token) {
    http_response_code(401);
    exit(json_encode(['error' => 'No token provided']));
}

try {
    // Decode and verify token
    $payload = JWTHelper::decode($token);
    
    // Check if it's an admin or student token based on role
    $role = $payload['role'] ?? null;
    $user_id = $payload['user_id'] ?? null;
    
    if (!$role || !$user_id) {
        http_response_code(401);
        exit(json_encode(['error' => 'Invalid token']));
    }
    
    $db = Database::getConnection();
    $user_id_escaped = (int)$user_id;
    
    if ($role === 'admin') {
        // Get admin user
        $result = $db->query("SELECT id, email FROM admin_users WHERE id = $user_id_escaped LIMIT 1");
    } else {
        // Get student user
        $result = $db->query("SELECT id, email, name, profile_picture, google_id FROM users WHERE id = $user_id_escaped LIMIT 1");
    }
    
    if ($result->num_rows === 0) {
        http_response_code(401);
        exit(json_encode(['error' => 'User not found']));
    }
    
    $user = $result->fetch_assoc();
    $user['role'] = $role;
    
    echo json_encode([
        'success' => true,
        'user' => $user
    ]);
    
} catch (Exception $e) {
    http_response_code(401);
    exit(json_encode(['error' => 'Invalid or expired token']));
}

