<?php
/**
 * Get Single Course (Public/Admin)
 * 
 * Returns course details with modules
 */

require_once '../config/cors.php';
require_once '../config/Database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    exit(json_encode(['error' => 'Course ID required']));
}

$db = Database::getConnection();
$id = (int)$id;

// Get course
$result = $db->query("SELECT * FROM courses WHERE id = $id LIMIT 1");

if ($result->num_rows === 0) {
    http_response_code(404);
    exit(json_encode(['error' => 'Course not found']));
}

$course = $result->fetch_assoc();

// Get modules
$modules_result = $db->query("SELECT * FROM course_modules WHERE course_id = $id ORDER BY module_order ASC");
$modules = [];
while ($module = $modules_result->fetch_assoc()) {
    $modules[] = $module;
}

$course['modules'] = $modules;

echo json_encode([
    'success' => true,
    'data' => $course
]);
