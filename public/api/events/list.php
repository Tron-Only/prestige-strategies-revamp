<?php
require_once '../config/cors.php';
require_once '../config/Database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$status = $_GET['status'] ?? 'active';
$status = Database::escape($status);

$db = Database::getConnection();

// If status is 'all', get all events
if ($status === 'all') {
    $result = $db->query("SELECT * FROM events ORDER BY date ASC, time ASC");
} else {
    $result = $db->query("SELECT * FROM events WHERE status = '$status' ORDER BY date ASC, time ASC");
}

$events = [];
while ($row = $result->fetch_assoc()) {
    $events[] = $row;
}

echo json_encode([
    'success' => true,
    'data' => $events
]);
