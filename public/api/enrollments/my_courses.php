<?php
/**
 * My Courses - Get User's Enrollments
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

$db = Database::getConnection();

// Get user's enrollments with course details
$sql = "SELECT 
    e.id as enrollment_id,
    e.enrolled_at,
    e.progress,
    e.last_accessed_at,
    c.id as course_id,
    c.title,
    c.description,
    c.thumbnail,
    c.category,
    c.level,
    c.duration_hours,
    (SELECT COUNT(*) FROM course_modules WHERE course_id = c.id) as module_count,
    (SELECT COUNT(*) FROM module_progress mp 
     JOIN course_modules cm ON mp.module_id = cm.id 
     WHERE mp.user_id = $user_id AND cm.course_id = c.id AND mp.completed = 1) as completed_modules
FROM course_enrollments e
JOIN courses c ON e.course_id = c.id
WHERE e.user_id = $user_id
ORDER BY e.enrolled_at DESC";

$result = $db->query($sql);
$enrollments = [];

while ($row = $result->fetch_assoc()) {
    // Calculate progress based on completed modules
    if ($row['module_count'] > 0) {
        $row['progress'] = ($row['completed_modules'] / $row['module_count']) * 100;
    }
    $enrollments[] = $row;
}

echo json_encode([
    'success' => true,
    'data' => $enrollments
]);
