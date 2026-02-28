<?php
require_once '../config/cors.php';
require_once '../config/Database.php';
require_once '../config/auth_middleware.php';

AuthMiddleware::verify('admin');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$data = json_decode(file_get_contents('php://input'), true);

$required = ['title', 'date', 'time', 'location', 'description', 'registration_url'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        exit(json_encode(['error' => "Missing required field: $field"]));
    }
}

$db = Database::getConnection();

$title = Database::escape($data['title']);
$date = Database::escape($data['date']);
$time = Database::escape($data['time']);
$location = Database::escape($data['location']);
$event_type = Database::escape($data['event_type'] ?? 'Workshop');
$description = Database::escape($data['description']);
$registration_url = Database::escape($data['registration_url']);
$status = Database::escape($data['status'] ?? 'active');

$sql = "INSERT INTO events (title, date, time, location, event_type, description, registration_url, status) 
        VALUES ('$title', '$date', '$time', '$location', '$event_type', '$description', '$registration_url', '$status')";

if ($db->query($sql)) {
    echo json_encode([
        'success' => true,
        'id' => $db->insert_id
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create event']);
}
