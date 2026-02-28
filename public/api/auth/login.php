<?php
require_once '../config/cors.php';
require_once '../config/Database.php';
require_once '../config/JWTHelper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if (!$email || !$password) {
    http_response_code(400);
    exit(json_encode(['error' => 'Email and password required']));
}

$db = Database::getConnection();
$email = Database::escape($email);

$result = $db->query("SELECT * FROM admin_users WHERE email = '$email' LIMIT 1");

if ($result->num_rows === 0) {
    http_response_code(401);
    exit(json_encode(['error' => 'Invalid credentials']));
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    exit(json_encode(['error' => 'Invalid credentials']));
}

// Generate JWT token (7 days)
$token = JWTHelper::encode([
    'user_id' => $user['id'],
    'email' => $user['email'],
    'role' => 'admin'
], 86400 * 7);

echo json_encode([
    'success' => true,
    'token' => $token,
    'user' => [
        'id' => $user['id'],
        'email' => $user['email']
    ]
]);
