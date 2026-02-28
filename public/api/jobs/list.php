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

// If status is 'all', get all jobs
if ($status === 'all') {
    $result = $db->query("SELECT * FROM jobs ORDER BY created_at DESC");
} else {
    $result = $db->query("SELECT * FROM jobs WHERE status = '$status' ORDER BY created_at DESC");
}

$jobs = [];
while ($row = $result->fetch_assoc()) {
    $jobs[] = $row;
}

echo json_encode([
    'success' => true,
    'data' => $jobs
]);
