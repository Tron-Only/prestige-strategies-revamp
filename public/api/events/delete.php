<?php
require_once '../config/cors.php';
require_once '../config/Database.php';
require_once '../config/auth_middleware.php';

AuthMiddleware::verify('admin');

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    exit(json_encode(['error' => 'Event ID required']));
}

$db = Database::getConnection();
$id = (int)$id;

if ($db->query("DELETE FROM events WHERE id = $id")) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete event']);
}
