<?php
/**
 * List Courses (Public)
 * 
 * Returns all active courses with basic information
 */

require_once '../config/cors.php';
require_once '../config/Database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$status = $_GET['status'] ?? 'published';
$status = Database::escape($status);

$db = Database::getConnection();

// Get courses
if ($status === 'all') {
    $result = $db->query("SELECT * FROM courses ORDER BY created_at DESC");
} else {
    $result = $db->query("SELECT * FROM courses WHERE status = '$status' ORDER BY created_at DESC");
}

$courses = [];
while ($row = $result->fetch_assoc()) {
    // Count modules for each course
    $course_id = (int)$row['id'];
    $module_count_result = $db->query("SELECT COUNT(*) as count FROM course_modules WHERE course_id = $course_id");
    $module_count = $module_count_result->fetch_assoc()['count'];
    
    $row['module_count'] = (int)$module_count;
    $courses[] = $row;
}

echo json_encode([
    'success' => true,
    'data' => $courses
]);
