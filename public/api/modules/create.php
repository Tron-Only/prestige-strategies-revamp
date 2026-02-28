<?php
/**
 * Add Module to Course (Admin Only)
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

$required = ['course_id', 'title', 'youtube_video_id', 'module_order'];
foreach ($required as $field) {
    if (!isset($data[$field]) || $data[$field] === '') {
        http_response_code(400);
        exit(json_encode(['error' => "Missing required field: $field"]));
    }
}

$db = Database::getConnection();

$course_id = (int)$data['course_id'];
$title = Database::escape($data['title']);
$description = isset($data['description']) ? "'" . Database::escape($data['description']) . "'" : 'NULL';
$youtube_video_id = Database::escape($data['youtube_video_id']);
$module_order = (int)$data['module_order'];
$duration_minutes = isset($data['duration_minutes']) ? (int)$data['duration_minutes'] : 'NULL';

$sql = "INSERT INTO course_modules (course_id, title, description, youtube_video_id, module_order, duration_minutes) 
        VALUES ($course_id, '$title', $description, '$youtube_video_id', $module_order, $duration_minutes)";

if ($db->query($sql)) {
    echo json_encode([
        'success' => true,
        'id' => $db->insert_id
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create module']);
}
