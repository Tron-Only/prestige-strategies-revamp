<?php
/**
 * Google OAuth Login Endpoint
 * 
 * Verifies Google ID token and creates/updates user in database
 */

require_once '../config/cors.php';
require_once '../config/Database.php';
require_once '../config/JWTHelper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$data = json_decode(file_get_contents('php://input'), true);
$google_id_token = $data['id_token'] ?? null;

if (!$google_id_token) {
    http_response_code(400);
    exit(json_encode(['error' => 'Missing ID token']));
}

// Verify Google ID token with Google's API
$google_api_url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($google_id_token);
$response = @file_get_contents($google_api_url);

if ($response === false) {
    http_response_code(401);
    exit(json_encode(['error' => 'Failed to verify token with Google']));
}

$google_user = json_decode($response, true);

if (!isset($google_user['email']) || isset($google_user['error'])) {
    http_response_code(401);
    exit(json_encode(['error' => 'Invalid Google token']));
}

// Extract user info
$google_id = $google_user['sub'];
$email = $google_user['email'];
$name = $google_user['name'] ?? '';
$picture = $google_user['picture'] ?? null;

// Create or update user in database
$db = Database::getConnection();
$google_id_escaped = Database::escape($google_id);
$email_escaped = Database::escape($email);
$name_escaped = Database::escape($name);

$picture_sql = 'NULL';
if ($picture) {
    $picture_escaped = Database::escape($picture);
    $picture_sql = "'$picture_escaped'";
}

$sql = "INSERT INTO users (google_id, email, name, profile_picture) 
        VALUES ('$google_id_escaped', '$email_escaped', '$name_escaped', $picture_sql) 
        ON DUPLICATE KEY UPDATE 
          name = '$name_escaped', 
          profile_picture = $picture_sql, 
          updated_at = NOW()";

$db->query($sql);

// Get user ID
$result = $db->query("SELECT id FROM users WHERE google_id = '$google_id_escaped' LIMIT 1");
$user = $result->fetch_assoc();
$user_id = $user['id'];

// Generate JWT token (7 days expiry)
$token = JWTHelper::encode([
    'user_id' => $user_id,
    'email' => $email,
    'role' => 'user'
], 7 * 24 * 60 * 60);

echo json_encode([
    'success' => true,
    'token' => $token,
    'user' => [
        'id' => $user_id,
        'email' => $email,
        'name' => $name,
        'picture' => $picture
    ]
]);
