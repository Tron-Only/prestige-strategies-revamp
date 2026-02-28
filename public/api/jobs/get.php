<?php
require_once '../config/cors.php';
require_once '../config/Database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    exit(json_encode(['error' => 'Job ID required']));
}

$db = Database::getConnection();
$id = (int)$id;

$result = $db->query("SELECT * FROM jobs WHERE id = $id LIMIT 1");

if ($result->num_rows === 0) {
    http_response_code(404);
    exit(json_encode(['error' => 'Job not found']));
}

$job = $result->fetch_assoc();
echo json_encode([
    'success' => true,
    'data' => $job
]);
