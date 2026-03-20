<?php
require_once '../config/cors.php';
require_once '../config/auth_middleware.php';

AuthMiddleware::verify('admin');

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$payload = json_decode(file_get_contents('php://input'), true);
$resources = $payload['resources'] ?? null;

if (!is_array($resources)) {
    http_response_code(400);
    exit(json_encode(['error' => 'Invalid payload: resources array required']));
}

$normalized = [];

foreach ($resources as $index => $resource) {
    if (!is_array($resource)) {
        continue;
    }

    $id = isset($resource['id']) ? trim((string)$resource['id']) : (string)($index + 1);
    $title = isset($resource['title']) ? trim((string)$resource['title']) : '';

    if ($title === '') {
        http_response_code(400);
        exit(json_encode(['error' => 'Each resource must have a title']));
    }

    $item = [
        'id' => $id,
        'title' => $title,
        'description' => isset($resource['description']) ? trim((string)$resource['description']) : '',
    ];

    if (isset($resource['fileName'])) {
        $item['fileName'] = trim((string)$resource['fileName']);
    }

    if (isset($resource['category'])) {
        $item['category'] = trim((string)$resource['category']);
    }

    if (isset($resource['tags']) && is_array($resource['tags'])) {
        $tags = array_values(array_filter(array_map(function ($tag) {
            return trim((string)$tag);
        }, $resource['tags']), function ($tag) {
            return $tag !== '';
        }));
        $item['tags'] = $tags;
    }

    if (isset($resource['size'])) {
        $item['size'] = trim((string)$resource['size']);
    }

    if (isset($resource['url'])) {
        $item['url'] = trim((string)$resource['url']);
    }

    if (isset($resource['date'])) {
        $item['date'] = trim((string)$resource['date']);
    }

    $normalized[] = $item;
}

$filePath = dirname(__DIR__, 2) . '/resources.json';
$json = json_encode($normalized, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

if ($json === false) {
    http_response_code(500);
    exit(json_encode(['error' => 'Failed to encode JSON']));
}

$jsonWithNewline = $json . "\n";

if (file_put_contents($filePath, $jsonWithNewline, LOCK_EX) === false) {
    http_response_code(500);
    exit(json_encode(['error' => 'Failed to write resources.json']));
}

echo json_encode([
    'success' => true,
    'message' => 'Resources updated successfully',
    'count' => count($normalized),
]);
