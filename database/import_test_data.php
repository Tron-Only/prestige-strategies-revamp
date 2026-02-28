<?php
/**
 * Import test data from JSON files into database
 */

require_once __DIR__ . '/../public/api/config/Config.php';
require_once __DIR__ . '/../public/api/config/Database.php';

echo "Starting data import...\n\n";

$db = Database::getConnection();

// Import Jobs
echo "=== Importing Jobs ===\n";
$jobsJson = file_get_contents(__DIR__ . '/../public/jobs.json');
$jobs = json_decode($jobsJson, true);

if (!$jobs) {
    die("Failed to parse jobs.json\n");
}

$jobsImported = 0;
foreach ($jobs as $job) {
    $title = Database::escape($job['title']);
    $description = Database::escape($job['description']);
    $location = Database::escape($job['location']);
    $type = Database::escape($job['type']);
    
    // Extract company name from email domain
    $email = $job['companyemail'] ?? 'hr@example.com';
    $domain = explode('@', $email)[1] ?? 'example.com';
    $companyName = ucfirst(explode('.', $domain)[0]);
    $company = Database::escape($companyName);
    
    // Use description as requirements if not specified
    $requirements = Database::escape("See job description for requirements");
    
    // Create application URL from email
    $applicationUrl = Database::escape("mailto:$email");
    
    // Default salary range
    $salaryRange = "Competitive";
    
    $sql = "INSERT INTO jobs (title, company, location, type, description, requirements, salary_range, application_url, status) 
            VALUES ('$title', '$company', '$location', '$type', '$description', '$requirements', '$salaryRange', '$applicationUrl', 'active')";
    
    if ($db->query($sql)) {
        $jobsImported++;
        echo "✓ Imported: $title\n";
    } else {
        echo "✗ Failed to import: $title - " . $db->error . "\n";
    }
}

echo "\nJobs imported: $jobsImported\n\n";

// Import Events
echo "=== Importing Events ===\n";
$eventsJson = file_get_contents(__DIR__ . '/../public/events.json');
$events = json_decode($eventsJson, true);

if (!$events) {
    die("Failed to parse events.json\n");
}

$eventsImported = 0;
foreach ($events as $event) {
    $title = Database::escape($event['title']);
    $description = Database::escape($event['description'] ?? 'Event description');
    $location = Database::escape($event['location'] ?? 'TBA');
    
    // Parse start date/time
    $startStr = $event['start'];
    if (strpos($startStr, 'T') !== false) {
        // Has time component (ISO 8601 format)
        $datetime = new DateTime($startStr);
        $date = $datetime->format('Y-m-d');
        $time = $datetime->format('H:i:s');
    } else {
        // Date only
        $date = $startStr;
        $time = '09:00:00'; // Default to 9 AM
    }
    
    // Determine event type from title
    $eventType = 'Workshop'; // Default
    $titleLower = strtolower($title);
    if (strpos($titleLower, 'bootcamp') !== false) {
        $eventType = 'Bootcamp';
    } elseif (strpos($titleLower, 'seminar') !== false) {
        $eventType = 'Seminar';
    } elseif (strpos($titleLower, 'training') !== false) {
        $eventType = 'Training';
    } elseif (strpos($titleLower, 'orientation') !== false) {
        $eventType = 'Orientation';
    }
    
    $eventType = Database::escape($eventType);
    
    // Default registration URL
    $registrationUrl = Database::escape($event['url'] ?? 'https://example.com/register');
    
    $sql = "INSERT INTO events (title, date, time, location, event_type, description, registration_url, status) 
            VALUES ('$title', '$date', '$time', '$location', '$eventType', '$description', '$registrationUrl', 'active')";
    
    if ($db->query($sql)) {
        $eventsImported++;
        echo "✓ Imported: $title ($date $time)\n";
    } else {
        echo "✗ Failed to import: $title - " . $db->error . "\n";
    }
}

echo "\nEvents imported: $eventsImported\n\n";

// Summary
echo "=== Import Summary ===\n";
echo "Jobs imported: $jobsImported\n";
echo "Events imported: $eventsImported\n";
echo "\nDone!\n";
