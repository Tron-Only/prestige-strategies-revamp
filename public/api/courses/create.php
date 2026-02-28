<?php
/**
 * Create Course (Admin Only)
 */

require_once '../config/cors.php';
require_once '../config/Database.php';
require_once '../config/auth_middleware.php';

AuthMiddleware::verify('admin');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$data = json_decode(file_get_contents('php://input'), true);

$required = ['title', 'description', 'price'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        exit(json_encode(['error' => "Missing required field: $field"]));
    }
}

$db = Database::getConnection();

$title = Database::escape($data['title']);
$description = Database::escape($data['description']);
$price = (float)$data['price'];
$currency = Database::escape($data['currency'] ?? 'KES');
$thumbnail = isset($data['thumbnail']) ? "'" . Database::escape($data['thumbnail']) . "'" : 'NULL';
$category = isset($data['category']) ? "'" . Database::escape($data['category']) . "'" : 'NULL';
$level = Database::escape($data['level'] ?? 'Beginner');
$duration_hours = isset($data['duration_hours']) ? (int)$data['duration_hours'] : 'NULL';
$status = Database::escape($data['status'] ?? 'draft');

$sql = "INSERT INTO courses (title, description, price, currency, thumbnail, category, level, duration_hours, status) 
        VALUES ('$title', '$description', $price, '$currency', $thumbnail, $category, '$level', $duration_hours, '$status')";

if ($db->query($sql)) {
    echo json_encode([
        'success' => true,
        'id' => $db->insert_id
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create course']);
}
