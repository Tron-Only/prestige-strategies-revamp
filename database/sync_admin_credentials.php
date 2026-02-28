<?php
/**
 * Sync Admin Credentials from .env to Database
 * 
 * This script reads ADMIN_EMAIL and ADMIN_PASSWORD from .env file
 * and automatically updates the admin_users table in the database.
 * 
 * Usage:
 *   php sync_admin_credentials.php
 * 
 * When to run:
 *   - After changing admin credentials in .env file
 *   - After initial database setup
 *   - Automatically runs as part of setup.php
 */

require_once __DIR__ . '/../public/api/config/Config.php';
require_once __DIR__ . '/../public/api/config/Database.php';

echo "=== Admin Credentials Sync ===\n\n";

// Load environment variables
Config::loadEnv();

// Get admin credentials from .env
$adminEmail = Config::get('ADMIN_EMAIL');
$adminPassword = Config::get('ADMIN_PASSWORD');

// Validate credentials exist
if (empty($adminEmail)) {
    die("ERROR: ADMIN_EMAIL not set in .env file\n");
}

if (empty($adminPassword)) {
    die("ERROR: ADMIN_PASSWORD not set in .env file\n");
}

echo "Admin Email: $adminEmail\n";
echo "Password: " . str_repeat('*', strlen($adminPassword)) . " (length: " . strlen($adminPassword) . ")\n\n";

// Hash the password
$passwordHash = password_hash($adminPassword, PASSWORD_BCRYPT);
echo "Generated password hash: " . substr($passwordHash, 0, 20) . "...\n\n";

// Connect to database
try {
    $db = Database::getConnection();
    echo "✓ Connected to database\n";
} catch (Exception $e) {
    die("ERROR: Could not connect to database: " . $e->getMessage() . "\n");
}

// Escape the email for SQL safety
$emailEscaped = Database::escape($adminEmail);

// Check if admin user exists
$result = $db->query("SELECT id, email FROM admin_users WHERE email = '$emailEscaped' LIMIT 1");

if ($result->num_rows > 0) {
    // Update existing admin user
    $admin = $result->fetch_assoc();
    echo "✓ Found existing admin user (ID: {$admin['id']})\n";
    
    $updateSql = "UPDATE admin_users 
                  SET password_hash = '$passwordHash', 
                      updated_at = CURRENT_TIMESTAMP 
                  WHERE email = '$emailEscaped'";
    
    if ($db->query($updateSql)) {
        echo "✓ Password updated successfully\n";
    } else {
        die("ERROR: Failed to update password: " . $db->error . "\n");
    }
} else {
    // Insert new admin user
    echo "⚠ Admin user not found, creating new user...\n";
    
    $insertSql = "INSERT INTO admin_users (email, password_hash) 
                  VALUES ('$emailEscaped', '$passwordHash')";
    
    if ($db->query($insertSql)) {
        echo "✓ Admin user created successfully (ID: {$db->insert_id})\n";
    } else {
        die("ERROR: Failed to create admin user: " . $db->error . "\n");
    }
}

echo "\n=== Sync Complete ===\n";
echo "You can now login with:\n";
echo "  Email: $adminEmail\n";
echo "  Password: " . str_repeat('*', strlen($adminPassword)) . "\n\n";

// Test the password hash
echo "Testing password verification...\n";
if (password_verify($adminPassword, $passwordHash)) {
    echo "✓ Password verification test PASSED\n";
} else {
    echo "✗ Password verification test FAILED\n";
}

echo "\nDone!\n";
