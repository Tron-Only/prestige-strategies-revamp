<?php
require_once '../config/cors.php';
require_once '../config/auth_middleware.php';

AuthMiddleware::verify('admin');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$filePath = dirname(__DIR__, 2) . '/resources.json';

if (!file_exists($filePath)) {
    http_response_code(404);
    exit(json_encode(['error' => 'resources.json not found']));
}

$content = file_get_contents($filePath);
if ($content === false) {
    http_response_code(500);
    exit(json_encode(['error' => 'Failed to read resources.json']));
}

$decoded = json_decode($content, true);
if (!is_array($decoded)) {
    http_response_code(500);
    exit(json_encode(['error' => 'Invalid resources.json format']));
}

echo json_encode([
    'success' => true,
    'data' => $decoded,
]);
