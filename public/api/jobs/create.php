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

$required = ['title', 'company', 'location', 'type', 'description', 'requirements', 'application_url'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        exit(json_encode(['error' => "Missing required field: $field"]));
    }
}

$db = Database::getConnection();

$title = Database::escape($data['title']);
$company = Database::escape($data['company']);
$location = Database::escape($data['location']);
$type = Database::escape($data['type']);
$description = Database::escape($data['description']);
$requirements = Database::escape($data['requirements']);
$salary_range = isset($data['salary_range']) ? Database::escape($data['salary_range']) : null;
$application_url = Database::escape($data['application_url']);
$status = Database::escape($data['status'] ?? 'active');

$sql = "INSERT INTO jobs (title, company, location, type, description, requirements, salary_range, application_url, status) 
        VALUES ('$title', '$company', '$location', '$type', '$description', '$requirements', " . ($salary_range ? "'$salary_range'" : "NULL") . ", '$application_url', '$status')";

if ($db->query($sql)) {
    echo json_encode([
        'success' => true,
        'id' => $db->insert_id
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create job']);
}
