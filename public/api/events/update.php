<?php
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
    exit(json_encode(['error' => 'Event ID required']));
}

$db = Database::getConnection();
$updates = [];

$fields = ['title', 'date', 'time', 'location', 'event_type', 'description', 'registration_url', 'status'];

foreach ($fields as $field) {
    if (isset($data[$field])) {
        if ($data[$field] === '' || $data[$field] === null) {
            // None of the event fields should be nullable in our schema
            continue;
        } else {
            $value = Database::escape($data[$field]);
            $updates[] = "$field = '$value'";
        }
    }
}

if (empty($updates)) {
    http_response_code(400);
    exit(json_encode(['error' => 'No fields to update']));
}

$sql = "UPDATE events SET " . implode(', ', $updates) . " WHERE id = " . (int)$id;

if ($db->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update event']);
}
