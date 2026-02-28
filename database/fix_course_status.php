<?php
/**
 * Fix Course Status Enum
 * 
 * Updates the courses table status enum from (active, inactive, draft)
 * to (draft, published, archived) to match the frontend
 */

require_once __DIR__ . '/../public/api/config/Database.php';

$db = Database::getConnection();

echo "Fixing course status enum...\n\n";

// First, check what courses exist and their current status
$result = $db->query("SELECT id, title, status FROM courses");
$existingCourses = [];
while ($row = $result->fetch_assoc()) {
    $existingCourses[] = $row;
    echo "Found course #{$row['id']}: {$row['title']} - Status: {$row['status']}\n";
}

if (count($existingCourses) > 0) {
    echo "\nBacking up current status values...\n";
    // Map old status to new status
    // active -> published
    // inactive -> archived
    // draft -> draft
    
    foreach ($existingCourses as $course) {
        $oldStatus = $course['status'];
        $newStatus = match($oldStatus) {
            'active' => 'draft',  // Temporarily set to draft
            'inactive' => 'draft',
            'draft' => 'draft',
            default => 'draft'
        };
        
        $db->query("UPDATE courses SET status = '$newStatus' WHERE id = {$course['id']}");
    }
}

// Now modify the enum
echo "\nUpdating status ENUM...\n";
$sql = "ALTER TABLE courses MODIFY COLUMN status ENUM('draft', 'published', 'archived') DEFAULT 'draft'";

if ($db->query($sql)) {
    echo "✓ Successfully updated courses status enum to: draft, published, archived\n\n";
} else {
    echo "✗ Error: " . $db->error . "\n";
    exit(1);
}

// Restore the proper status values
if (count($existingCourses) > 0) {
    echo "Restoring status values with new enum...\n";
    foreach ($existingCourses as $course) {
        $oldStatus = $course['status'];
        $newStatus = match($oldStatus) {
            'active' => 'published',  // active becomes published
            'inactive' => 'archived',  // inactive becomes archived
            'draft' => 'draft',        // draft stays draft
            default => 'draft'
        };
        
        $db->query("UPDATE courses SET status = '$newStatus' WHERE id = {$course['id']}");
        echo "  - Course #{$course['id']}: $oldStatus -> $newStatus\n";
    }
}

echo "\n✓ Done! Course status enum fixed.\n\n";

// Show final result
$result = $db->query("SELECT id, title, status FROM courses");
echo "Final courses:\n";
while ($row = $result->fetch_assoc()) {
    echo "  - Course #{$row['id']}: {$row['title']} - Status: {$row['status']}\n";
}
