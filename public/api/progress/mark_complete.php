<?php
/**
 * Mark Module as Complete
 * 
 * Records that a student has completed a course module
 */

require_once '../config/cors.php';
require_once '../config/Database.php';
require_once '../config/JWTHelper.php';
require_once '../config/auth_middleware.php';

// Verify user is logged in
$user = AuthMiddleware::verify('user');
$user_id = (int)$user['user_id'];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$data = json_decode(file_get_contents('php://input'), true);
$module_id = $data['module_id'] ?? null;

if (!$module_id) {
    http_response_code(400);
    exit(json_encode(['error' => 'Module ID required']));
}

$db = Database::getConnection();
$module_id = (int)$module_id;

// Get course_id from module
$result = $db->query("SELECT course_id FROM course_modules WHERE id = $module_id LIMIT 1");

if ($result->num_rows === 0) {
    http_response_code(404);
    exit(json_encode(['error' => 'Module not found']));
}

$module = $result->fetch_assoc();
$course_id = (int)$module['course_id'];

// Check if user is enrolled in this course
$result = $db->query("SELECT id FROM course_enrollments WHERE user_id = $user_id AND course_id = $course_id LIMIT 1");

if ($result->num_rows === 0) {
    http_response_code(403);
    exit(json_encode(['error' => 'Not enrolled in this course']));
}

$enrollment = $result->fetch_assoc();
$enrollment_id = (int)$enrollment['id'];

// Mark module as complete (insert or ignore if already exists)
$db->query("INSERT INTO module_progress (user_id, module_id, completed, completed_at) 
            VALUES ($user_id, $module_id, 1, NOW())
            ON DUPLICATE KEY UPDATE completed = 1, completed_at = NOW()");

// Calculate overall course progress
$total_modules = $db->query("SELECT COUNT(*) as count FROM course_modules WHERE course_id = $course_id")->fetch_assoc()['count'];
$completed_modules = $db->query("SELECT COUNT(DISTINCT mp.module_id) as count 
                                  FROM module_progress mp 
                                  INNER JOIN course_modules cm ON mp.module_id = cm.id 
                                  WHERE mp.user_id = $user_id AND cm.course_id = $course_id AND mp.completed = 1")->fetch_assoc()['count'];

$progress = $total_modules > 0 ? round(($completed_modules / $total_modules) * 100) : 0;

// Update enrollment progress
$db->query("UPDATE course_enrollments SET progress = $progress WHERE id = $enrollment_id");

echo json_encode([
    'success' => true,
    'progress' => $progress,
    'completed_modules' => $completed_modules,
    'total_modules' => $total_modules
]);
