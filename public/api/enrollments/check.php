<?php
/**
 * Check Enrollment Status
 * 
 * Check if user is enrolled in a specific course
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

$result = $db->query("SELECT id, enrolled_at, progress 
                      FROM course_enrollments 
                      WHERE user_id = $user_id AND course_id = $course_id 
                      LIMIT 1");

if ($result->num_rows > 0) {
    $enrollment = $result->fetch_assoc();
    echo json_encode([
        'success' => true,
        'enrolled' => true,
        'data' => $enrollment
    ]);
} else {
    echo json_encode([
        'success' => true,
        'enrolled' => false
    ]);
}
