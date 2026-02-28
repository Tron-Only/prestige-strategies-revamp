<?php
/**
 * Get Module Progress for a Course
 * 
 * Returns which modules the user has completed for a specific course
 */

require_once '../config/cors.php';
require_once '../config/Database.php';
require_once '../config/auth_middleware.php';

// Verify user is logged in
$user = AuthMiddleware::verify('user');
$user_id = (int)$user['user_id'];

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$course_id = $_GET['course_id'] ?? null;

if (!$course_id) {
    http_response_code(400);
    exit(json_encode(['error' => 'Course ID required']));
}

$db = Database::getConnection();
$course_id = (int)$course_id;

// Get enrollment
$result = $db->query("SELECT id FROM course_enrollments WHERE user_id = $user_id AND course_id = $course_id LIMIT 1");

if ($result->num_rows === 0) {
    http_response_code(403);
    exit(json_encode(['error' => 'Not enrolled in this course']));
}

// Get completed module IDs for this course
$result = $db->query("SELECT mp.module_id 
                      FROM module_progress mp
                      INNER JOIN course_modules cm ON mp.module_id = cm.id
                      WHERE mp.user_id = $user_id AND cm.course_id = $course_id AND mp.completed = 1");

$completed_modules = [];
while ($row = $result->fetch_assoc()) {
    $completed_modules[] = (int)$row['module_id'];
}

echo json_encode([
    'success' => true,
    'completed_modules' => $completed_modules
]);
