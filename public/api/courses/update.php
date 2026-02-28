<?php
/**
 * Update Course (Admin Only)
 */

require_once '../config/cors.php';
require_once '../config/Database.php';
require_once '../config/auth_middleware.php';

AuthMiddleware::verify('admin');

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;

if (!$id) {
    http_response_code(400);
    exit(json_encode(['error' => 'Course ID required']));
}

$db = Database::getConnection();
$updates = [];

$fields = ['title', 'description', 'price', 'currency', 'thumbnail', 'category', 'level', 'duration_hours', 'status'];

foreach ($fields as $field) {
    if (isset($data[$field])) {
        $value = $data[$field];
        
        if ($value === '' || $value === null) {
            if (in_array($field, ['thumbnail', 'category', 'duration_hours'])) {
                $updates[] = "$field = NULL";
            }
        } else {
            if ($field === 'price') {
                $updates[] = "$field = " . (float)$value;
            } elseif ($field === 'duration_hours') {
                $updates[] = "$field = " . (int)$value;
            } else {
                $escaped = Database::escape($value);
                $updates[] = "$field = '$escaped'";
            }
        }
    }
}

if (empty($updates)) {
    http_response_code(400);
    exit(json_encode(['error' => 'No fields to update']));
}

$sql = "UPDATE courses SET " . implode(', ', $updates) . " WHERE id = " . (int)$id;

if ($db->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update course']);
}
