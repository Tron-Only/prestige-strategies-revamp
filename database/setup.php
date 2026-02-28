<?php
/**
 * Database Setup Script (using mysqli)
 */

// Load environment variables
require_once __DIR__ . '/../public/api/config/Config.php';
Config::loadEnv();

$dbHost = Config::get('DB_HOST');
$dbName = Config::get('DB_NAME');
$dbUser = Config::get('DB_USER');
$dbPass = Config::get('DB_PASS');

echo "=== Prestige Strategies Database Setup ===\n\n";

// Step 1: Connect to MySQL
echo "Step 1: Connecting to MySQL...\n";
$conn = @mysqli_connect($dbHost, $dbUser, $dbPass);

if (!$conn) {
    die("✗ Failed to connect to MySQL: " . mysqli_connect_error() . "\n");
}
echo "✓ Connected to MySQL\n\n";

// Step 2: Create database
echo "Step 2: Creating database '$dbName'...\n";
$sql = "CREATE DATABASE IF NOT EXISTS $dbName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
if (mysqli_query($conn, $sql)) {
    echo "✓ Database created/exists\n\n";
} else {
    die("✗ Failed to create database: " . mysqli_error($conn) . "\n");
}

// Step 3: Select database
mysqli_select_db($conn, $dbName);

// Step 4: Create tables
echo "Step 3: Creating tables...\n";

// Admin users table
$sql = "CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

if (mysqli_query($conn, $sql)) {
    echo "✓ Created table: admin_users\n";
} else {
    echo "⚠ Table admin_users: " . mysqli_error($conn) . "\n";
}

// Jobs table
$sql = "CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'Full-time',
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  salary_range VARCHAR(100) DEFAULT NULL,
  application_url VARCHAR(500) NOT NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_type (type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

if (mysqli_query($conn, $sql)) {
    echo "✓ Created table: jobs\n";
} else {
    echo "⚠ Table jobs: " . mysqli_error($conn) . "\n";
}

// Events table
$sql = "CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  event_type VARCHAR(50) NOT NULL DEFAULT 'Workshop',
  description TEXT NOT NULL,
  registration_url VARCHAR(500) NOT NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_date (date),
  INDEX idx_event_type (event_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

if (mysqli_query($conn, $sql)) {
    echo "✓ Created table: events\n\n";
} else {
    echo "⚠ Table events: " . mysqli_error($conn) . "\n\n";
}

mysqli_close($conn);

// Step 5: Sync admin credentials from .env
echo "Step 4: Syncing admin credentials from .env...\n";
echo str_repeat('-', 50) . "\n";

// Run the sync script
require_once __DIR__ . '/sync_admin_credentials.php';

echo str_repeat('-', 50) . "\n\n";

echo "=== Setup Complete! ===\n\n";
echo "Database and admin credentials are ready!\n";
echo "Login at: http://localhost:5173/admin/login\n";
