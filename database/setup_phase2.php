<?php
/**
 * Phase 2 Database Setup - Course Platform
 * 
 * This script adds the course platform tables to the existing database.
 * It should be run AFTER Phase 1 setup.php has been completed.
 */

require_once __DIR__ . '/../public/api/config/Config.php';
Config::loadEnv();

$dbHost = Config::get('DB_HOST');
$dbName = Config::get('DB_NAME');
$dbUser = Config::get('DB_USER');
$dbPass = Config::get('DB_PASS');

echo "=== Prestige Strategies Phase 2 Setup ===\n";
echo "Course Platform Database Setup\n\n";

// Connect to database
echo "Step 1: Connecting to database...\n";
$conn = @mysqli_connect($dbHost, $dbUser, $dbPass, $dbName);

if (!$conn) {
    die("✗ Failed to connect to MySQL: " . mysqli_connect_error() . "\n");
}
echo "✓ Connected to database '$dbName'\n\n";

// Read and execute schema
echo "Step 2: Creating Phase 2 tables...\n";
$schema = file_get_contents(__DIR__ . '/schema_phase2.sql');

// Split by semicolons and execute each statement
$statements = array_filter(array_map('trim', explode(';', $schema)));

$tables_created = 0;
foreach ($statements as $statement) {
    if (empty($statement) || strpos($statement, '--') === 0) continue;
    
    // Extract table name for display
    if (preg_match('/CREATE TABLE.*?`?(\w+)`?\s*\(/i', $statement, $matches)) {
        $table_name = $matches[1];
        
        if (mysqli_query($conn, $statement)) {
            echo "✓ Created/verified table: $table_name\n";
            $tables_created++;
        } else {
            echo "⚠ Table $table_name: " . mysqli_error($conn) . "\n";
        }
    }
}

echo "\nTables created/verified: $tables_created\n\n";

mysqli_close($conn);

echo "=== Phase 2 Setup Complete! ===\n\n";
echo "New tables added:\n";
echo "  - users (Google OAuth students)\n";
echo "  - courses\n";
echo "  - course_modules (video lessons)\n";
echo "  - payments (M-Pesa transactions)\n";
echo "  - course_enrollments\n";
echo "  - module_progress\n\n";

echo "Next steps:\n";
echo "1. Configure M-Pesa credentials in .env\n";
echo "2. Configure Google OAuth credentials in .env\n";
echo "3. Add sample courses via admin dashboard\n";
echo "4. Test the course purchase flow\n\n";

echo "Done!\n";
