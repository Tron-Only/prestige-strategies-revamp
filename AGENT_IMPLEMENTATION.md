# 🎯 PRESTIGE STRATEGIES - AGENT IMPLEMENTATION GUIDE

**Project:** Admin Dashboard + Course Platform with M-Pesa Integration  
**Database:** `awinja31_prestige`  
**Admin Account:** trononly1@gmail.com / Tront@lkno1  
**Currency:** KES (Kenyan Shilling)  
**Deployment:** cPanel with PHP 8.1+ and MySQL

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Architecture Summary](#architecture-summary)
3. [Phase 1: Admin Dashboard](#phase-1-admin-dashboard)
4. [Phase 2: Course Platform](#phase-2-course-platform)
5. [Database Schemas](#database-schemas)
6. [PHP API Structure](#php-api-structure)
7. [React Component Structure](#react-component-structure)
8. [Security Implementation](#security-implementation)
9. [Testing Checklist](#testing-checklist)

---

## 🎯 PROJECT OVERVIEW

### **Goals**
- Enable client to manage jobs, events, and courses via admin dashboard
- Implement course platform with Google OAuth login
- Integrate Safaricom M-Pesa for course payments
- Deploy to cPanel hosting (no Node.js backend required)

### **Key Requirements**
- ✅ Admin dashboard accessible only to trononly1@gmail.com
- ✅ Password stored securely (NOT in code)
- ✅ Edit jobs and calendar events
- ✅ Manage courses with multiple modules
- ✅ YouTube video embedding (unlisted videos)
- ✅ Google OAuth for user authentication
- ✅ M-Pesa Daraja STK Push for payments
- ✅ Lifetime course access after payment

### **Tech Stack**
- **Frontend:** React 18 + TypeScript + React Router v7 + Tailwind CSS 4
- **Backend:** PHP 8.1+ (native, no frameworks, no Composer)
- **Database:** MySQL (cPanel default)
- **Authentication:** JWT (admin) + Google OAuth (users)
- **Payments:** Safaricom Daraja M-Pesa API
- **Hosting:** cPanel shared hosting

---

## 🏗️ ARCHITECTURE SUMMARY

```
┌─────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (SPA)                     │
├─────────────────────────────────────────────────────────────┤
│  Public Pages      │  Admin Dashboard   │  Course Platform │
│  - Home            │  - Login           │  - Browse        │
│  - Jobs            │  - Jobs CRUD       │  - Detail        │
│  - Events          │  - Events CRUD     │  - Checkout      │
│  - Resources       │  - Courses CRUD    │  - Learning      │
│  - Contact         │  - Modules CRUD    │  - My Courses    │
└─────────────────────────────────────────────────────────────┘
                              ↓ API Calls (fetch)
┌─────────────────────────────────────────────────────────────┐
│                   PHP REST API (public_html/api/)           │
├─────────────────────────────────────────────────────────────┤
│  Auth APIs         │  Content APIs      │  Payment APIs    │
│  - Admin Login     │  - Jobs CRUD       │  - M-Pesa STK    │
│  - Google OAuth    │  - Events CRUD     │  - Callback      │
│  - JWT Verify      │  - Courses CRUD    │  - Status Check  │
│                    │  - Modules CRUD    │                  │
└─────────────────────────────────────────────────────────────┘
                              ↓ Database Queries
┌─────────────────────────────────────────────────────────────┐
│                    MySQL DATABASE                           │
├─────────────────────────────────────────────────────────────┤
│  - admin_users             - courses                        │
│  - jobs                    - course_modules                 │
│  - events                  - users (Google OAuth)           │
│  - payments                - course_enrollments             │
└─────────────────────────────────────────────────────────────┘
```

### **Environment Variables (.env location)**
```
/home/awinja31/.env  ← OUTSIDE public_html directory for security
```

### **File Structure on cPanel**
```
/home/awinja31/
├── .env                              # Environment variables
├── mpesa_logs.txt                    # M-Pesa callback logs
│
└── public_html/                      # Web root
    ├── index.html                    # React app entry
    ├── assets/                       # React built assets (CSS, JS)
    ├── api/                          # PHP Backend
    │   ├── config/                   # Database, JWT, CORS
    │   ├── auth/                     # Login endpoints
    │   ├── jobs/                     # Jobs CRUD
    │   ├── events/                   # Events CRUD
    │   ├── courses/                  # Courses CRUD
    │   ├── modules/                  # Modules CRUD
    │   └── payments/                 # M-Pesa integration
    ├── uploads/                      # User uploads
    │   ├── events/                   # Event banner images
    │   └── courses/                  # Course thumbnails
    └── .htaccess                     # URL rewriting, security
```

---

## 📦 PHASE 1: ADMIN DASHBOARD

**Timeline:** 2-3 weeks  
**Goal:** Enable client to manage jobs and events without touching code

### **Phase 1A: Database Setup** (Week 1 - Day 1-2)

#### **Database Schema**

```sql
-- Admin Users Table
CREATE TABLE admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'admin',
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- Jobs Table
CREATE TABLE jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  companyemail VARCHAR(255) NOT NULL,
  salary_min INT,
  salary_max INT,
  currency VARCHAR(10) DEFAULT 'KES',
  requirements TEXT,
  benefits TEXT,
  status VARCHAR(50) DEFAULT 'active',
  posted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  closing_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_posted_date (posted_date)
);

-- Events Table
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATETIME NOT NULL,
  end_date DATETIME,
  location VARCHAR(255),
  instructor VARCHAR(255),
  capacity INT,
  url VARCHAR(500),
  banner_image VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_start_date (start_date),
  INDEX idx_status (status)
);

-- Insert initial admin user
INSERT INTO admin_users (email, password_hash, first_name, last_name) 
VALUES (
  'trononly1@gmail.com', 
  '$2y$10$YourHashedPasswordHere',  -- Will be generated during deployment
  'Admin', 
  'User'
);
```

#### **Data Migration from JSON**

```sql
-- Migrate existing jobs.json data
-- (SQL will be generated from /public/jobs.json during deployment)
INSERT INTO jobs (title, description, location, type, companyemail) VALUES
  ('Senior React Developer', 'We are looking for...', 'New York, NY', 'Full-time', 'hr@example.com'),
  ('UI/UX Designer', 'We are seeking...', 'San Francisco, CA', 'Full-time', 'design.hr@example.com');

-- Migrate existing events.json data
-- (SQL will be generated from /public/events.json during deployment)
INSERT INTO events (title, start_date, end_date, description, location, instructor, capacity, url) VALUES
  ('Orientation: Intro to Prestige', '2026-02-10', NULL, 'Full-day orientation...', 'Training Room A', NULL, NULL, NULL),
  ('Advanced Excel for Analysts', '2026-02-15 13:00:00', '2026-02-15 16:00:00', 'Pivot tables...', NULL, 'Jane Doe', 20, 'https://example.com/resources/excel-guide.pdf');
```

---

### **Phase 1B: PHP API Implementation** (Week 1 - Day 3-7)

#### **Core PHP Classes (No Composer Required)**

**1. Config Loader**

File: `public_html/api/config/Config.php`

```php
<?php
class Config {
    private static $env = null;
    
    public static function loadEnv() {
        if (self::$env !== null) return;
        
        $envPath = '/home/awinja31/.env';
        if (!file_exists($envPath)) {
            die('Environment file not found');
        }
        
        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        self::$env = [];
        
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line) || strpos($line, '#') === 0) continue;
            
            list($key, $value) = explode('=', $line, 2);
            self::$env[trim($key)] = trim($value);
        }
    }
    
    public static function get($key, $default = null) {
        self::loadEnv();
        return self::$env[$key] ?? $default;
    }
}
?>
```

**2. Database Connection**

File: `public_html/api/config/Database.php`

```php
<?php
require_once __DIR__ . '/Config.php';

class Database {
    private static $instance = null;
    
    public static function getConnection() {
        if (self::$instance === null) {
            $host = Config::get('DB_HOST', 'localhost');
            $db = Config::get('DB_NAME');
            $user = Config::get('DB_USER');
            $pass = Config::get('DB_PASS');
            
            self::$instance = new mysqli($host, $user, $pass, $db);
            
            if (self::$instance->connect_error) {
                http_response_code(500);
                die(json_encode(['error' => 'Database connection failed']));
            }
            
            self::$instance->set_charset('utf8mb4');
        }
        
        return self::$instance;
    }
    
    public static function escape($value) {
        return self::getConnection()->real_escape_string($value);
    }
}
?>
```

**3. JWT Helper (Manual Implementation)**

File: `public_html/api/config/JWTHelper.php`

```php
<?php
require_once __DIR__ . '/Config.php';

class JWTHelper {
    
    private static function getSecret() {
        return Config::get('JWT_SECRET');
    }
    
    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    private static function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/'));
    }
    
    public static function encode($payload, $expiresIn = 86400) {
        $payload['iat'] = time();
        $payload['exp'] = time() + $expiresIn;
        
        $header = ['typ' => 'JWT', 'alg' => 'HS256'];
        
        $segments = [];
        $segments[] = self::base64UrlEncode(json_encode($header));
        $segments[] = self::base64UrlEncode(json_encode($payload));
        
        $signing_input = implode('.', $segments);
        $signature = hash_hmac('sha256', $signing_input, self::getSecret(), true);
        $segments[] = self::base64UrlEncode($signature);
        
        return implode('.', $segments);
    }
    
    public static function decode($jwt) {
        $segments = explode('.', $jwt);
        
        if (count($segments) !== 3) {
            return null;
        }
        
        list($header64, $payload64, $signature64) = $segments;
        
        $header = json_decode(self::base64UrlDecode($header64), true);
        $payload = json_decode(self::base64UrlDecode($payload64), true);
        
        // Verify signature
        $signing_input = $header64 . '.' . $payload64;
        $signature = self::base64UrlDecode($signature64);
        $expected_signature = hash_hmac('sha256', $signing_input, self::getSecret(), true);
        
        if ($signature !== $expected_signature) {
            return null;
        }
        
        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null;
        }
        
        return $payload;
    }
}
?>
```

**4. CORS Headers**

File: `public_html/api/config/cors.php`

```php
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
?>
```

**5. Auth Middleware**

File: `public_html/api/config/auth_middleware.php`

```php
<?php
require_once __DIR__ . '/JWTHelper.php';

class AuthMiddleware {
    
    public static function verify($requiredRole = null) {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
        
        if (!$authHeader || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            http_response_code(401);
            die(json_encode(['error' => 'Unauthorized - Missing token']));
        }
        
        $token = $matches[1];
        $payload = JWTHelper::decode($token);
        
        if (!$payload) {
            http_response_code(401);
            die(json_encode(['error' => 'Unauthorized - Invalid token']));
        }
        
        if ($requiredRole && isset($payload['role']) && $payload['role'] !== $requiredRole) {
            http_response_code(403);
            die(json_encode(['error' => 'Forbidden - Insufficient permissions']));
        }
        
        return $payload;
    }
}
?>
```

#### **Auth Endpoints**

**Admin Login**

File: `public_html/api/auth/login.php`

```php
<?php
require_once '../config/cors.php';
require_once '../config/Database.php';
require_once '../config/JWTHelper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if (!$email || !$password) {
    http_response_code(400);
    exit(json_encode(['error' => 'Email and password required']));
}

$db = Database::getConnection();
$email = Database::escape($email);

$result = $db->query("SELECT * FROM admin_users WHERE email = '$email' LIMIT 1");

if ($result->num_rows === 0) {
    http_response_code(401);
    exit(json_encode(['error' => 'Invalid credentials']));
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    exit(json_encode(['error' => 'Invalid credentials']));
}

// Update last login
$db->query("UPDATE admin_users SET last_login = NOW() WHERE id = {$user['id']}");

// Generate JWT token
$token = JWTHelper::encode([
    'user_id' => $user['id'],
    'email' => $user['email'],
    'role' => 'admin'
], 86400 * 7); // 7 days

echo json_encode([
    'success' => true,
    'token' => $token,
    'user' => [
        'id' => $user['id'],
        'email' => $user['email'],
        'first_name' => $user['first_name'],
        'last_name' => $user['last_name']
    ]
]);
?>
```

**Token Verification**

File: `public_html/api/auth/verify.php`

```php
<?php
require_once '../config/cors.php';
require_once '../config/auth_middleware.php';

$user = AuthMiddleware::verify('admin');

echo json_encode([
    'success' => true,
    'user' => $user
]);
?>
```

#### **Jobs CRUD Endpoints**

**List Jobs (Public)**

File: `public_html/api/jobs/list.php`

```php
<?php
require_once '../config/cors.php';
require_once '../config/Database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$status = $_GET['status'] ?? 'active';
$status = Database::escape($status);

$db = Database::getConnection();
$result = $db->query("SELECT * FROM jobs WHERE status = '$status' ORDER BY posted_date DESC");

$jobs = [];
while ($row = $result->fetch_assoc()) {
    $jobs[] = $row;
}

echo json_encode($jobs);
?>
```

**Create Job (Admin Only)**

File: `public_html/api/jobs/create.php`

```php
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

$required = ['title', 'description', 'location', 'type', 'companyemail'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        exit(json_encode(['error' => "Missing required field: $field"]));
    }
}

$db = Database::getConnection();

$title = Database::escape($data['title']);
$description = Database::escape($data['description']);
$location = Database::escape($data['location']);
$type = Database::escape($data['type']);
$companyemail = Database::escape($data['companyemail']);
$salary_min = isset($data['salary_min']) ? (int)$data['salary_min'] : 'NULL';
$salary_max = isset($data['salary_max']) ? (int)$data['salary_max'] : 'NULL';
$requirements = isset($data['requirements']) ? Database::escape($data['requirements']) : 'NULL';
$benefits = isset($data['benefits']) ? Database::escape($data['benefits']) : 'NULL';
$status = Database::escape($data['status'] ?? 'active');
$closing_date = isset($data['closing_date']) ? "'" . Database::escape($data['closing_date']) . "'" : 'NULL';

$sql = "INSERT INTO jobs (title, description, location, type, companyemail, salary_min, salary_max, requirements, benefits, status, closing_date) 
        VALUES ('$title', '$description', '$location', '$type', '$companyemail', $salary_min, $salary_max, " . 
        ($requirements === 'NULL' ? 'NULL' : "'$requirements'") . ", " . 
        ($benefits === 'NULL' ? 'NULL' : "'$benefits'") . ", '$status', $closing_date)";

if ($db->query($sql)) {
    echo json_encode([
        'success' => true,
        'id' => $db->insert_id
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create job']);
}
?>
```

**Update Job (Admin Only)**

File: `public_html/api/jobs/update.php`

```php
<?php
require_once '../config/cors.php';
require_once '../config/Database.php';
require_once '../config/auth_middleware.php';

AuthMiddleware::verify('admin');

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;

if (!$id) {
    http_response_code(400);
    exit(json_encode(['error' => 'Job ID required']));
}

$db = Database::getConnection();
$updates = [];

$fields = ['title', 'description', 'location', 'type', 'companyemail', 'salary_min', 'salary_max', 'requirements', 'benefits', 'status', 'closing_date'];

foreach ($fields as $field) {
    if (isset($data[$field])) {
        $value = Database::escape($data[$field]);
        if (in_array($field, ['salary_min', 'salary_max'])) {
            $updates[] = "$field = " . (int)$value;
        } elseif ($field === 'closing_date') {
            $updates[] = "$field = " . ($value ? "'$value'" : 'NULL');
        } else {
            $updates[] = "$field = '$value'";
        }
    }
}

if (empty($updates)) {
    http_response_code(400);
    exit(json_encode(['error' => 'No fields to update']));
}

$sql = "UPDATE jobs SET " . implode(', ', $updates) . " WHERE id = " . (int)$id;

if ($db->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update job']);
}
?>
```

**Delete Job (Admin Only)**

File: `public_html/api/jobs/delete.php`

```php
<?php
require_once '../config/cors.php';
require_once '../config/Database.php';
require_once '../config/auth_middleware.php';

AuthMiddleware::verify('admin');

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
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

if ($db->query("DELETE FROM jobs WHERE id = $id")) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete job']);
}
?>
```

#### **Events CRUD Endpoints**

**List Events (Public)**

File: `public_html/api/events/list.php`

```php
<?php
require_once '../config/cors.php';
require_once '../config/Database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$status = $_GET['status'] ?? 'active';
$status = Database::escape($status);

$db = Database::getConnection();
$result = $db->query("SELECT * FROM events WHERE status = '$status' ORDER BY start_date ASC");

$events = [];
while ($row = $result->fetch_assoc()) {
    $events[] = $row;
}

echo json_encode($events);
?>
```

**Create Event (Admin Only)**

File: `public_html/api/events/create.php`

```php
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

$required = ['title', 'start_date'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        exit(json_encode(['error' => "Missing required field: $field"]));
    }
}

$db = Database::getConnection();

$title = Database::escape($data['title']);
$description = isset($data['description']) ? "'" . Database::escape($data['description']) . "'" : 'NULL';
$start_date = Database::escape($data['start_date']);
$end_date = isset($data['end_date']) ? "'" . Database::escape($data['end_date']) . "'" : 'NULL';
$location = isset($data['location']) ? "'" . Database::escape($data['location']) . "'" : 'NULL';
$instructor = isset($data['instructor']) ? "'" . Database::escape($data['instructor']) . "'" : 'NULL';
$capacity = isset($data['capacity']) ? (int)$data['capacity'] : 'NULL';
$url = isset($data['url']) ? "'" . Database::escape($data['url']) . "'" : 'NULL';
$banner_image = isset($data['banner_image']) ? "'" . Database::escape($data['banner_image']) . "'" : 'NULL';
$status = Database::escape($data['status'] ?? 'active');

$sql = "INSERT INTO events (title, description, start_date, end_date, location, instructor, capacity, url, banner_image, status) 
        VALUES ('$title', $description, '$start_date', $end_date, $location, $instructor, $capacity, $url, $banner_image, '$status')";

if ($db->query($sql)) {
    echo json_encode([
        'success' => true,
        'id' => $db->insert_id
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create event']);
}
?>
```

**Update Event (Admin Only)**

File: `public_html/api/events/update.php`

```php
<?php
require_once '../config/cors.php';
require_once '../config/Database.php';
require_once '../config/auth_middleware.php';

AuthMiddleware::verify('admin');

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;

if (!$id) {
    http_response_code(400);
    exit(json_encode(['error' => 'Event ID required']));
}

$db = Database::getConnection();
$updates = [];

$fields = ['title', 'description', 'start_date', 'end_date', 'location', 'instructor', 'capacity', 'url', 'banner_image', 'status'];

foreach ($fields as $field) {
    if (isset($data[$field])) {
        $value = Database::escape($data[$field]);
        if ($field === 'capacity') {
            $updates[] = "$field = " . (int)$value;
        } else {
            $updates[] = "$field = '$value'";
        }
    }
}

if (empty($updates)) {
    http_response_code(400);
    exit(json_encode(['error' => 'No fields to update']));
}

$sql = "UPDATE events SET " . implode(', ', $updates) . " WHERE id = " . (int)$id;

if ($db->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update event']);
}
?>
```

**Delete Event (Admin Only)**

File: `public_html/api/events/delete.php`

```php
<?php
require_once '../config/cors.php';
require_once '../config/Database.php';
require_once '../config/auth_middleware.php';

AuthMiddleware::verify('admin');

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    exit(json_encode(['error' => 'Event ID required']));
}

$db = Database::getConnection();
$id = (int)$id;

if ($db->query("DELETE FROM events WHERE id = $id")) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete event']);
}
?>
```

---

### **Phase 1C: React Admin Dashboard** (Week 2)

#### **New React Files to Create**

```
src/
├── pages/admin/
│   ├── AdminLogin.tsx
│   ├── Dashboard.tsx
│   ├── JobsList.tsx
│   ├── JobForm.tsx
│   ├── EventsList.tsx
│   └── EventForm.tsx
│
├── components/admin/
│   ├── AdminLayout.tsx
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── ProtectedRoute.tsx
│   └── DataTable.tsx
│
├── services/
│   ├── api.ts
│   ├── auth.ts
│   ├── jobs.ts
│   └── events.ts
│
└── contexts/
    └── AuthContext.tsx
```

#### **React Router Setup**

File: `src/main.tsx` (modify existing)

```typescript
// Add admin routes to existing router configuration
{
  path: "/admin",
  children: [
    { path: "login", element: <AdminLogin /> },
    {
      path: "",
      element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
      children: [
        { index: true, element: <Navigate to="/admin/dashboard" replace /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "jobs", element: <JobsList /> },
        { path: "jobs/new", element: <JobForm /> },
        { path: "jobs/:id/edit", element: <JobForm /> },
        { path: "events", element: <EventsList /> },
        { path: "events/new", element: <EventForm /> },
        { path: "events/:id/edit", element: <EventForm /> },
      ]
    }
  ]
}
```

#### **Auth Context**

File: `src/contexts/AuthContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiService } from '@/services/api';

interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      ApiService.get('/auth/verify.php')
        .then(data => {
          if (data.success) {
            setUser(data.user);
          } else {
            localStorage.removeItem('admin_token');
          }
        })
        .catch(() => localStorage.removeItem('admin_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await ApiService.post('/auth/login.php', { email, password });
    
    if (response.success) {
      localStorage.setItem('admin_token', response.token);
      setUser(response.user);
    } else {
      throw new Error(response.error || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

#### **API Service**

File: `src/services/api.ts`

```typescript
const API_BASE = '/api';

export class ApiService {
  private static getToken(): string | null {
    return localStorage.getItem('admin_token');
  }

  private static async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const token = this.getToken();
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    // Only add Content-Type if body is not FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const text = await response.text();
    
    try {
      const data = JSON.parse(text);
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (e) {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${text}`);
      }
      throw e;
    }
  }

  static get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  }

  static post(endpoint: string, data: any) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request(endpoint, { method: 'POST', body });
  }

  static put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}
```

#### **Protected Route Component**

File: `src/components/admin/ProtectedRoute.tsx`

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
```

#### **Admin Login Page**

File: `src/pages/admin/AdminLogin.tsx`

```typescript
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Prestige Strategies Dashboard
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

#### **Admin Layout with Sidebar**

File: `src/components/admin/AdminLayout.tsx`

```typescript
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Briefcase, Calendar, BookOpen, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Jobs', path: '/admin/jobs', icon: Briefcase },
    { name: 'Events', path: '/admin/events', icon: Calendar },
    { name: 'Courses', path: '/admin/courses', icon: BookOpen },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Prestige Admin</h1>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.first_name} {user?.last_name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

#### **Jobs List Page**

File: `src/pages/admin/JobsList.tsx`

```typescript
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiService } from '@/services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  location: string;
  type: string;
  status: string;
  posted_date: string;
}

export default function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const endpoint = statusFilter === 'all' 
        ? '/jobs/list.php' 
        : `/jobs/list.php?status=${statusFilter}`;
      const data = await ApiService.get(endpoint);
      setJobs(data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      await ApiService.delete(`/jobs/delete.php?id=${id}`);
      setJobs(jobs.filter(job => job.id !== id));
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Jobs Management</h1>
        <Link
          to="/admin/jobs/new"
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          <span>New Job</span>
        </Link>
      </div>

      <div className="flex space-x-4">
        {['all', 'active', 'closed', 'draft'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg transition ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posted Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {job.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      job.status === 'active' ? 'bg-green-100 text-green-800' :
                      job.status === 'closed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(job.posted_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      to={`/admin/jobs/${job.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="text-red-600 hover:text-red-900 inline-flex items-center"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

#### **Job Form (Create/Edit)**

File: `src/pages/admin/JobForm.tsx`

```typescript
import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiService } from '@/services/api';

export default function JobForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'Full-time',
    companyemail: '',
    salary_min: '',
    salary_max: '',
    requirements: '',
    benefits: '',
    status: 'active',
    closing_date: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      // Fetch job data for editing
      ApiService.get(`/jobs/list.php?id=${id}`)
        .then(data => {
          if (data.length > 0) {
            setFormData(data[0]);
          }
        })
        .catch(err => console.error('Failed to fetch job:', err));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await ApiService.put('/jobs/update.php', { ...formData, id });
      } else {
        await ApiService.post('/jobs/create.php', formData);
      }
      navigate('/admin/jobs');
    } catch (err: any) {
      alert(err.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Edit Job' : 'Create New Job'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Senior React Developer"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Detailed job description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Nairobi, Kenya"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Type *
            </label>
            <select
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Email *
            </label>
            <input
              type="email"
              name="companyemail"
              required
              value={formData.companyemail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="hr@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Min (KES)
            </label>
            <input
              type="number"
              name="salary_min"
              value={formData.salary_min}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="50000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Max (KES)
            </label>
            <input
              type="number"
              name="salary_max"
              value={formData.salary_max}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="100000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Closing Date
            </label>
            <input
              type="date"
              name="closing_date"
              value={formData.closing_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements (comma-separated)
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="3+ years React, TypeScript experience, Team leadership"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Benefits (comma-separated)
            </label>
            <textarea
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Health insurance, Remote work, Professional development"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Job' : 'Create Job'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/jobs')}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
```

---

### **Phase 1D: Update Public Pages** (Week 3)

#### **Update Jobs Page to Use API**

File: `src/pages/Jobs.tsx` (modify existing)

```typescript
// Replace:
// fetch("/jobs.json")

// With:
fetch("/api/jobs/list.php?status=active")
  .then(response => response.json())
  .then(data => setJobs(data))
  .catch(err => console.error('Failed to fetch jobs:', err));
```

#### **Update Events Page to Use API**

File: `src/pages/Events.tsx` (modify existing)

```typescript
// Replace:
// fetch("/events.json", { cache: "no-cache" })

// With:
fetch("/api/events/list.php?status=active", { cache: "no-cache" })
  .then(response => response.json())
  .then(data => setEvents(data))
  .catch(err => console.error('Failed to fetch events:', err));
```

---

## 📦 PHASE 2: COURSE PLATFORM

**Timeline:** 3-4 weeks  
**Goal:** Implement course platform with Google OAuth and M-Pesa payments

### **Phase 2A: Database Schema for Courses** (Week 4)

```sql
-- Users Table (from Google OAuth)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  google_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  profile_picture VARCHAR(500),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_google_id (google_id),
  INDEX idx_email (email)
);

-- Courses Table
CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'KES',
  thumbnail VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status)
);

-- Course Modules Table
CREATE TABLE course_modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  youtube_video_id VARCHAR(255) NOT NULL,
  module_order INT NOT NULL,
  duration_minutes INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  INDEX idx_course_id (course_id),
  INDEX idx_module_order (module_order)
);

-- Payments Table (M-Pesa)
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'KES',
  phone_number VARCHAR(20) NOT NULL,
  mpesa_transaction_id VARCHAR(255) UNIQUE,
  mpesa_receipt_number VARCHAR(255),
  checkout_request_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50) DEFAULT 'mpesa',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_checkout_request_id (checkout_request_id)
);

-- Course Enrollments Table
CREATE TABLE course_enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  payment_id INT,
  enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  access_expires_at DATETIME DEFAULT NULL,
  last_accessed_at DATETIME,
  progress DECIMAL(5,2) DEFAULT 0.00,
  UNIQUE KEY unique_enrollment (user_id, course_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_course_id (course_id)
);

-- Module Progress Tracking (optional)
CREATE TABLE module_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  module_id INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at DATETIME,
  UNIQUE KEY unique_progress (user_id, module_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE
);
```

### **Phase 2B: Google OAuth PHP Implementation** (Week 5)

#### **Google OAuth Login Endpoint**

File: `public_html/api/auth/google_login.php`

```php
<?php
require_once '../config/cors.php';
require_once '../config/Database.php';
require_once '../config/JWTHelper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$data = json_decode(file_get_contents('php://input'), true);
$google_id_token = $data['id_token'] ?? null;

if (!$google_id_token) {
    http_response_code(400);
    exit(json_encode(['error' => 'Missing ID token']));
}

// Verify Google ID token with Google's API
$google_api_url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . $google_id_token;
$response = @file_get_contents($google_api_url);

if ($response === false) {
    http_response_code(401);
    exit(json_encode(['error' => 'Failed to verify token with Google']));
}

$google_user = json_decode($response, true);

if (!isset($google_user['email']) || isset($google_user['error'])) {
    http_response_code(401);
    exit(json_encode(['error' => 'Invalid Google token']));
}

// Extract user info
$google_id = $google_user['sub'];
$email = $google_user['email'];
$name = $google_user['name'] ?? '';
$picture = $google_user['picture'] ?? null;

// Create or update user in database
$db = Database::getConnection();
$google_id_escaped = Database::escape($google_id);
$email_escaped = Database::escape($email);
$name_escaped = Database::escape($name);
$picture_escaped = $picture ? Database::escape($picture) : 'NULL';

$picture_sql = $picture ? "'$picture_escaped'" : 'NULL';

$sql = "INSERT INTO users (google_id, email, name, profile_picture) 
        VALUES ('$google_id_escaped', '$email_escaped', '$name_escaped', $picture_sql) 
        ON DUPLICATE KEY UPDATE 
          name = '$name_escaped', 
          profile_picture = $picture_sql, 
          updated_at = NOW()";

$db->query($sql);

// Get user ID
$result = $db->query("SELECT id FROM users WHERE google_id = '$google_id_escaped' LIMIT 1");
$user = $result->fetch_assoc();
$user_id = $user['id'];

// Generate JWT token
$token = JWTHelper::encode([
    'user_id' => $user_id,
    'email' => $email,
    'role' => 'user',
    'exp' => time() + (7 * 24 * 60 * 60) // 7 days
]);

echo json_encode([
    'success' => true,
    'token' => $token,
    'user' => [
        'id' => $user_id,
        'email' => $email,
        'name' => $name,
        'picture' => $picture
    ]
]);
?>
```

### **Phase 2C: M-Pesa Daraja Integration** (Week 5-6)

#### **M-Pesa STK Push Initiation**

File: `public_html/api/payments/initiate.php`

```php
<?php
require_once '../config/cors.php';
require_once '../config/Database.php';
require_once '../config/JWTHelper.php';
require_once '../config/auth_middleware.php';
require_once '../config/Config.php';

// Verify user is logged in
$user = AuthMiddleware::verify();

$data = json_decode(file_get_contents('php://input'), true);
$course_id = $data['course_id'] ?? null;
$phone_number = $data['phone_number'] ?? null;

if (!$course_id || !$phone_number) {
    http_response_code(400);
    exit(json_encode(['error' => 'Course ID and phone number required']));
}

// Validate phone number format (254XXXXXXXXX)
$phone_number = preg_replace('/[^0-9]/', '', $phone_number);
if (!preg_match('/^254[0-9]{9}$/', $phone_number)) {
    http_response_code(400);
    exit(json_encode(['error' => 'Invalid phone number format. Use 254XXXXXXXXX']));
}

// Get course details
$db = Database::getConnection();
$course_id = (int)$course_id;
$result = $db->query("SELECT id, title, price FROM courses WHERE id = $course_id AND status = 'active' LIMIT 1");

if ($result->num_rows === 0) {
    http_response_code(404);
    exit(json_encode(['error' => 'Course not found']));
}

$course = $result->fetch_assoc();

// Check if already enrolled
$user_id = (int)$user['user_id'];
$result = $db->query("SELECT id FROM course_enrollments WHERE user_id = $user_id AND course_id = $course_id LIMIT 1");

if ($result->num_rows > 0) {
    http_response_code(400);
    exit(json_encode(['error' => 'Already enrolled in this course']));
}

// Generate M-Pesa access token
$consumer_key = Config::get('MPESA_CONSUMER_KEY');
$consumer_secret = Config::get('MPESA_CONSUMER_SECRET');
$credentials = base64_encode($consumer_key . ':' . $consumer_secret);

$env = Config::get('MPESA_ENVIRONMENT') === 'production' 
    ? 'https://api.safaricom.co.ke' 
    : 'https://sandbox.safaricom.co.ke';

$auth_url = $env . '/oauth/v1/generate?grant_type=client_credentials';
$ch = curl_init($auth_url);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Basic ' . $credentials]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$auth_response = json_decode(curl_exec($ch), true);
curl_close($ch);

if (!isset($auth_response['access_token'])) {
    http_response_code(500);
    exit(json_encode(['error' => 'Failed to authenticate with M-Pesa']));
}

$access_token = $auth_response['access_token'];

// Prepare STK Push request
$shortcode = Config::get('MPESA_SHORTCODE');
$passkey = Config::get('MPESA_PASSKEY');
$timestamp = date('YmdHis');
$password = base64_encode($shortcode . $passkey . $timestamp);

$stk_url = $env . '/mpesa/stkpush/v1/processrequest';
$amount = (int)$course['price'];
$callback_url = Config::get('MPESA_CALLBACK_URL');

$stk_data = [
    'BusinessShortCode' => $shortcode,
    'Password' => $password,
    'Timestamp' => $timestamp,
    'TransactionType' => 'CustomerPayBillOnline',
    'Amount' => $amount,
    'PartyA' => $phone_number,
    'PartyB' => $shortcode,
    'PhoneNumber' => $phone_number,
    'CallBackURL' => $callback_url,
    'AccountReference' => 'Course-' . $course_id,
    'TransactionDesc' => 'Payment for ' . substr($course['title'], 0, 30)
];

$ch = curl_init($stk_url);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $access_token,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($stk_data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$stk_response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Store payment record
$checkout_request_id = $stk_response['CheckoutRequestID'] ?? null;
$response_code = $stk_response['ResponseCode'] ?? null;

if ($response_code === '0' && $checkout_request_id) {
    $phone_escaped = Database::escape($phone_number);
    $checkout_escaped = Database::escape($checkout_request_id);
    
    $db->query("INSERT INTO payments (user_id, course_id, amount, currency, phone_number, checkout_request_id, status) 
                VALUES ($user_id, $course_id, {$course['price']}, 'KES', '$phone_escaped', '$checkout_escaped', 'pending')");
    
    $payment_id = $db->insert_id;
    
    echo json_encode([
        'success' => true,
        'checkout_request_id' => $checkout_request_id,
        'payment_id' => $payment_id,
        'message' => 'STK Push sent to ' . $phone_number
    ]);
} else {
    http_response_code(500);
    $error_message = $stk_response['errorMessage'] ?? $stk_response['ResponseDescription'] ?? 'Failed to initiate payment';
    exit(json_encode(['error' => $error_message]));
}
?>
```

#### **M-Pesa Callback Handler**

File: `public_html/api/payments/callback.php`

```php
<?php
require_once '../config/Database.php';

// Get callback data from Safaricom
$callback_data = file_get_contents('php://input');

// Log for debugging
$log_file = '/home/awinja31/mpesa_logs.txt';
file_put_contents($log_file, date('Y-m-d H:i:s') . " - " . $callback_data . "\n", FILE_APPEND);

$response = json_decode($callback_data, true);

if (!$response || !isset($response['Body']['stkCallback'])) {
    echo json_encode(['ResultCode' => 0, 'ResultDesc' => 'Accepted']);
    exit;
}

$callback = $response['Body']['stkCallback'];
$result_code = $callback['ResultCode'] ?? null;
$checkout_request_id = $callback['CheckoutRequestID'] ?? null;

if (!$checkout_request_id) {
    echo json_encode(['ResultCode' => 0, 'ResultDesc' => 'Accepted']);
    exit;
}

$db = Database::getConnection();
$checkout_escaped = Database::escape($checkout_request_id);

if ($result_code === 0) {
    // Payment successful
    $items = $callback['CallbackMetadata']['Item'] ?? [];
    $transaction_id = null;
    $receipt_number = null;
    
    foreach ($items as $item) {
        if ($item['Name'] === 'MpesaReceiptNumber') {
            $receipt_number = $item['Value'];
        }
        if ($item['Name'] === 'TransactionDate') {
            $transaction_id = $item['Value'];
        }
    }
    
    $receipt_escaped = $receipt_number ? "'" . Database::escape($receipt_number) . "'" : 'NULL';
    $trans_escaped = $transaction_id ? "'" . Database::escape($transaction_id) . "'" : 'NULL';
    
    // Update payment record
    $db->query("UPDATE payments 
                SET status = 'completed', 
                    mpesa_transaction_id = $trans_escaped, 
                    mpesa_receipt_number = $receipt_escaped,
                    completed_at = NOW() 
                WHERE checkout_request_id = '$checkout_escaped'");
    
    // Get payment details
    $result = $db->query("SELECT user_id, course_id, id FROM payments WHERE checkout_request_id = '$checkout_escaped' LIMIT 1");
    
    if ($result->num_rows > 0) {
        $payment = $result->fetch_assoc();
        
        // Create enrollment
        $db->query("INSERT INTO course_enrollments (user_id, course_id, payment_id) 
                    VALUES ({$payment['user_id']}, {$payment['course_id']}, {$payment['id']})
                    ON DUPLICATE KEY UPDATE payment_id = {$payment['id']}");
    }
} else {
    // Payment failed
    $db->query("UPDATE payments SET status = 'failed' WHERE checkout_request_id = '$checkout_escaped'");
}

// Always return success to Safaricom
echo json_encode(['ResultCode' => 0, 'ResultDesc' => 'Accepted']);
?>
```

#### **Payment Status Check**

File: `public_html/api/payments/status.php`

```php
<?php
require_once '../config/cors.php';
require_once '../config/Database.php';
require_once '../config/auth_middleware.php';

$user = AuthMiddleware::verify();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$payment_id = $_GET['id'] ?? null;

if (!$payment_id) {
    http_response_code(400);
    exit(json_encode(['error' => 'Payment ID required']));
}

$db = Database::getConnection();
$payment_id = (int)$payment_id;
$user_id = (int)$user['user_id'];

$result = $db->query("SELECT * FROM payments WHERE id = $payment_id AND user_id = $user_id LIMIT 1");

if ($result->num_rows === 0) {
    http_response_code(404);
    exit(json_encode(['error' => 'Payment not found']));
}

$payment = $result->fetch_assoc();

echo json_encode([
    'success' => true,
    'payment' => $payment
]);
?>
```

### **Phase 2D: Course & Module API Endpoints** (Week 6)

#### **List Courses (Public)**

File: `public_html/api/courses/list.php`

```php
<?php
require_once '../config/cors.php';
require_once '../config/Database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$db = Database::getConnection();
$result = $db->query("SELECT id, title, description, price, currency, thumbnail, status, created_at 
                      FROM courses 
                      WHERE status = 'active' 
                      ORDER BY created_at DESC");

$courses = [];
while ($row = $result->fetch_assoc()) {
    // Get module count
    $course_id = $row['id'];
    $module_count = $db->query("SELECT COUNT(*) as count FROM course_modules WHERE course_id = $course_id")->fetch_assoc()['count'];
    $row['module_count'] = (int)$module_count;
    
    $courses[] = $row;
}

echo json_encode($courses);
?>
```

#### **Get Single Course with Modules (Public)**

File: `public_html/api/courses/get.php`

```php
<?php
require_once '../config/cors.php';
require_once '../config/Database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$course_id = $_GET['id'] ?? null;

if (!$course_id) {
    http_response_code(400);
    exit(json_encode(['error' => 'Course ID required']));
}

$db = Database::getConnection();
$course_id = (int)$course_id;

$result = $db->query("SELECT * FROM courses WHERE id = $course_id AND status = 'active' LIMIT 1");

if ($result->num_rows === 0) {
    http_response_code(404);
    exit(json_encode(['error' => 'Course not found']));
}

$course = $result->fetch_assoc();

// Get modules
$modules_result = $db->query("SELECT id, title, description, module_order, duration_minutes 
                               FROM course_modules 
                               WHERE course_id = $course_id 
                               ORDER BY module_order ASC");

$modules = [];
while ($row = $modules_result->fetch_assoc()) {
    $modules[] = $row;
}

$course['modules'] = $modules;

echo json_encode($course);
?>
```

#### **Check Course Enrollment (Protected)**

File: `public_html/api/courses/enroll_check.php`

```php
<?php
require_once '../config/cors.php';
require_once '../config/Database.php';
require_once '../config/auth_middleware.php';

$user = AuthMiddleware::verify();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$course_id = $_GET['course_id'] ?? null;

if (!$course_id) {
    http_response_code(400);
    exit(json_encode(['error' => 'Course ID required']));
}

$db = Database::getConnection();
$course_id = (int)$course_id;
$user_id = (int)$user['user_id'];

$result = $db->query("SELECT * FROM course_enrollments 
                      WHERE user_id = $user_id AND course_id = $course_id 
                      LIMIT 1");

if ($result->num_rows > 0) {
    $enrollment = $result->fetch_assoc();
    echo json_encode([
        'enrolled' => true,
        'enrollment' => $enrollment
    ]);
} else {
    echo json_encode(['enrolled' => false]);
}
?>
```

#### **Get Module with Video (Enrolled Users Only)**

File: `public_html/api/modules/get.php`

```php
<?php
require_once '../config/cors.php';
require_once '../config/Database.php';
require_once '../config/auth_middleware.php';

$user = AuthMiddleware::verify();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$module_id = $_GET['id'] ?? null;

if (!$module_id) {
    http_response_code(400);
    exit(json_encode(['error' => 'Module ID required']));
}

$db = Database::getConnection();
$module_id = (int)$module_id;

// Get module details
$result = $db->query("SELECT * FROM course_modules WHERE id = $module_id LIMIT 1");

if ($result->num_rows === 0) {
    http_response_code(404);
    exit(json_encode(['error' => 'Module not found']));
}

$module = $result->fetch_assoc();
$course_id = (int)$module['course_id'];
$user_id = (int)$user['user_id'];

// Check if user is enrolled
$enrollment_result = $db->query("SELECT id FROM course_enrollments 
                                  WHERE user_id = $user_id AND course_id = $course_id 
                                  LIMIT 1");

if ($enrollment_result->num_rows === 0) {
    http_response_code(403);
    exit(json_encode(['error' => 'Not enrolled in this course']));
}

echo json_encode($module);
?>
```

#### **Create Course (Admin Only)**

File: `public_html/api/courses/create.php`

```php
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

$required = ['title', 'description', 'price'];
foreach ($required as $field) {
    if (!isset($data[$field]) || $data[$field] === '') {
        http_response_code(400);
        exit(json_encode(['error' => "Missing required field: $field"]));
    }
}

$db = Database::getConnection();

$title = Database::escape($data['title']);
$description = Database::escape($data['description']);
$price = (float)$data['price'];
$currency = Database::escape($data['currency'] ?? 'KES');
$thumbnail = isset($data['thumbnail']) ? "'" . Database::escape($data['thumbnail']) . "'" : 'NULL';
$status = Database::escape($data['status'] ?? 'active');

$sql = "INSERT INTO courses (title, description, price, currency, thumbnail, status) 
        VALUES ('$title', '$description', $price, '$currency', $thumbnail, '$status')";

if ($db->query($sql)) {
    echo json_encode([
        'success' => true,
        'id' => $db->insert_id
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create course']);
}
?>
```

#### **Create Module (Admin Only)**

File: `public_html/api/modules/create.php`

```php
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

$required = ['course_id', 'title', 'youtube_video_id', 'module_order'];
foreach ($required as $field) {
    if (!isset($data[$field]) || $data[$field] === '') {
        http_response_code(400);
        exit(json_encode(['error' => "Missing required field: $field"]));
    }
}

$db = Database::getConnection();

$course_id = (int)$data['course_id'];
$title = Database::escape($data['title']);
$description = isset($data['description']) ? "'" . Database::escape($data['description']) . "'" : 'NULL';
$youtube_video_id = Database::escape($data['youtube_video_id']);
$module_order = (int)$data['module_order'];
$duration_minutes = isset($data['duration_minutes']) ? (int)$data['duration_minutes'] : 'NULL';

$sql = "INSERT INTO course_modules (course_id, title, description, youtube_video_id, module_order, duration_minutes) 
        VALUES ($course_id, '$title', $description, '$youtube_video_id', $module_order, $duration_minutes)";

if ($db->query($sql)) {
    echo json_encode([
        'success' => true,
        'id' => $db->insert_id
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create module']);
}
?>
```

---

## 🔐 SECURITY IMPLEMENTATION

### **Environment Variables**

File: `/home/awinja31/.env`

```bash
# Database Configuration
DB_HOST=localhost
DB_NAME=awinja31_prestige
DB_USER=awinja31_dbuser
DB_PASS=YourSecurePassword123!

# JWT Secret (min 32 characters)
JWT_SECRET=your_super_secret_random_string_here_minimum_32_characters_long

# Admin Email
ADMIN_EMAIL=trononly1@gmail.com

# M-Pesa Daraja Configuration
MPESA_CONSUMER_KEY=your_consumer_key_from_daraja
MPESA_CONSUMER_SECRET=your_consumer_secret_from_daraja
MPESA_PASSKEY=your_lipa_na_mpesa_passkey
MPESA_SHORTCODE=174379
MPESA_CALLBACK_URL=https://prestigestrategies.co.ke/api/payments/callback.php
MPESA_ENVIRONMENT=sandbox

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### **.htaccess Security**

File: `public_html/.htaccess`

```apache
# Prevent direct access to .env files
<FilesMatch "^\.env">
  Order allow,deny
  Deny from all
</FilesMatch>

# Prevent directory listing
Options -Indexes

# Enable HTTPS redirect (optional)
# RewriteEngine On
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# API URL rewriting (optional, for clean URLs)
# RewriteRule ^api/(.*)$ api/$1 [L]
```

### **Password Hashing Script**

For generating the admin password hash during deployment:

File: `generate_password_hash.php` (run once, then delete)

```php
<?php
// Run this once to generate password hash
$password = 'Tront@lkno1';
$hash = password_hash($password, PASSWORD_BCRYPT);

echo "Password Hash: " . $hash . "\n";
echo "Use this in your SQL INSERT statement for admin_users table.\n";
?>
```

---

## ✅ TESTING CHECKLIST

### **Phase 1 Testing**

#### **Backend API Tests**
- [ ] Admin login works with correct credentials
- [ ] Admin login fails with wrong credentials
- [ ] JWT token is generated and stored
- [ ] Protected endpoints reject requests without token
- [ ] Protected endpoints reject expired tokens
- [ ] Jobs CRUD operations work (create, read, update, delete)
- [ ] Events CRUD operations work (create, read, update, delete)
- [ ] Public endpoints work without authentication
- [ ] CORS headers allow frontend requests

#### **Frontend Admin Dashboard Tests**
- [ ] Admin login page renders correctly
- [ ] Login form validation works
- [ ] Successful login redirects to dashboard
- [ ] Protected routes redirect to login when not authenticated
- [ ] Dashboard shows stats correctly
- [ ] Jobs list page loads and displays data
- [ ] Create new job form works
- [ ] Edit job form loads existing data
- [ ] Delete job confirmation works
- [ ] Events list page loads and displays data
- [ ] Create new event form works
- [ ] Edit event form loads existing data
- [ ] Delete event confirmation works
- [ ] Logout works and clears token
- [ ] Sidebar navigation works

#### **Public Pages Integration Tests**
- [ ] Jobs page loads from API instead of JSON
- [ ] Events page loads from API instead of JSON
- [ ] Job applications still work with existing CV upload
- [ ] Calendar view displays events correctly

### **Phase 2 Testing**

#### **Google OAuth Tests**
- [ ] Google login button appears on courses page
- [ ] Google OAuth popup opens correctly
- [ ] After Google login, user is redirected back
- [ ] User info is stored in database
- [ ] JWT token is generated for user session
- [ ] User menu shows logged-in state
- [ ] Logout clears user session

#### **Course Platform Tests**
- [ ] Courses list page displays all active courses
- [ ] Course detail page shows modules preview
- [ ] "Buy Course" button only shows for non-enrolled users
- [ ] Enrolled users see "Go to Course" button
- [ ] Course learning page only accessible to enrolled users
- [ ] Module videos load correctly (YouTube embed)
- [ ] Module list shows correct order
- [ ] Progress tracking updates

#### **M-Pesa Payment Tests (Sandbox)**
- [ ] Payment form validates phone number
- [ ] STK Push is sent to test phone number
- [ ] Payment record is created with "pending" status
- [ ] Callback endpoint receives M-Pesa response
- [ ] Successful payment updates status to "completed"
- [ ] Course enrollment is created after payment
- [ ] Failed payment updates status to "failed"
- [ ] Payment status polling works
- [ ] User is redirected to course after successful payment

#### **Admin Course Management Tests**
- [ ] Create course form works
- [ ] Course list shows all courses
- [ ] Edit course form loads existing data
- [ ] Delete course confirmation works
- [ ] Create module form works
- [ ] Module list shows correct order
- [ ] Edit module form loads existing data
- [ ] Delete module confirmation works
- [ ] Reorder modules works (if implemented)

---

## 📝 IMPORTANT NOTES

### **Development Workflow**
1. Always test locally before deploying to cPanel
2. Use browser DevTools to debug API calls
3. Check PHP error logs in cPanel for backend issues
4. Keep M-Pesa in sandbox mode until fully tested
5. Never commit `.env` file to git

### **Deployment Sequence**
1. Deploy Phase 1 (Admin Dashboard) first
2. Test thoroughly with client
3. Get client approval before Phase 2
4. Deploy Phase 2 (Course Platform) incrementally
5. Test M-Pesa in sandbox extensively
6. Switch to production M-Pesa only after client approval

### **Client Communication**
- Provide client with admin login credentials securely
- Create video tutorial for admin dashboard usage
- Document how to add jobs, events, courses, modules
- Explain M-Pesa payment verification process
- Set up regular backups of database

### **Future Enhancements (Post-Launch)**
- Email notifications for payments and enrollments
- Advanced analytics dashboard
- Bulk course enrollment (promo codes)
- Certificate generation after course completion
- Mobile app for courses
- Integration with accounting software

---

## 🎓 GOOGLE OAUTH SETUP INSTRUCTIONS

**When Ready to Implement Phase 2:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "Prestige Strategies Courses"
3. Enable Google+ API (for user info)
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure consent screen:
   - App name: Prestige Strategies
   - User support email: trononly1@gmail.com
   - Authorized domains: prestigestrategies.co.ke
6. Create OAuth Client ID:
   - Application type: Web application
   - Authorized JavaScript origins: https://prestigestrategies.co.ke
   - Authorized redirect URIs: https://prestigestrategies.co.ke/courses
7. Copy Client ID and Client Secret to `.env` file
8. Download OAuth credentials JSON (keep secure)

---

## 💳 M-PESA DARAJA SETUP INSTRUCTIONS

**When Ready to Implement Phase 2:**

1. Go to [Daraja Portal](https://developer.safaricom.co.ke/)
2. Create account / Login
3. Create new app: "Prestige Courses Payment"
4. Select "Lipa Na M-Pesa Online" API
5. Get credentials:
   - Consumer Key
   - Consumer Secret
   - Passkey
   - Shortcode (use sandbox: 174379)
6. Configure callback URL: https://prestigestrategies.co.ke/api/payments/callback.php
7. Test in sandbox mode first
8. For production:
   - Apply for production credentials
   - Wait for approval (can take 1-2 weeks)
   - Update `.env` with production credentials
   - Change MPESA_ENVIRONMENT to "production"

---

**END OF AGENT_IMPLEMENTATION.MD**
