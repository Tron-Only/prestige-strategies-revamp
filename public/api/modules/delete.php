<?php
/**
 * Delete Module (Admin Only)
 */

require_once '../config/cors.php';
require_once '../config/Database.php';
require_once '../config/auth_middleware.php';

AuthMiddleware::verify('admin');

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

if (!isset($_GET['id'])) {
    http_response_code(400);
    exit(json_encode(['error' => 'Missing id parameter']));
}

$id = (int)$_GET['id'];

$db = Database::getConnection();

// Delete the module
if ($db->query("DELETE FROM course_modules WHERE id = $id")) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete module']);
}
