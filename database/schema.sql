-- Prestige Strategies Database Schema
-- Phase 1: Admin Dashboard with Jobs and Events Management

-- Create database
CREATE DATABASE IF NOT EXISTS prestige_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE prestige_db;

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Events table
CREATE TABLE IF NOT EXISTS events (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: Tront@lkno1)
-- The password hash is generated using password_hash('Tront@lkno1', PASSWORD_BCRYPT)
INSERT INTO admin_users (email, password_hash) VALUES 
  ('trononly1@gmail.com', '$2y$10$LBy31JjAo3VCG7nIiWecnOJrfKYwuxU0vO0ELdq/awLF14AwMBb22')
ON DUPLICATE KEY UPDATE password_hash='$2y$10$LBy31JjAo3VCG7nIiWecnOJrfKYwuxU0vO0ELdq/awLF14AwMBb22';
