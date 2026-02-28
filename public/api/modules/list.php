<?php
/**
 * List Modules for a Course
 * 
 * Returns all modules for a specific course
 */

require_once '../config/cors.php';
require_once '../config/Database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

if (!isset($_GET['course_id'])) {
    http_response_code(400);
    exit(json_encode(['error' => 'Missing course_id parameter']));
}

$course_id = (int)$_GET['course_id'];

$db = Database::getConnection();

// Get modules for the course, ordered by module_order
$result = $db->query("SELECT * FROM course_modules WHERE course_id = $course_id ORDER BY module_order ASC");

$modules = [];
while ($row = $result->fetch_assoc()) {
    // Convert numeric fields to integers
    $row['id'] = (int)$row['id'];
    $row['course_id'] = (int)$row['course_id'];
    $row['module_order'] = (int)$row['module_order'];
    $row['duration_minutes'] = (int)$row['duration_minutes'];
    $modules[] = $row;
}

echo json_encode([
    'success' => true,
    'data' => $modules
]);
