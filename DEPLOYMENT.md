# 🚀 PRESTIGE STRATEGIES - DEPLOYMENT GUIDE

**Complete step-by-step instructions for deploying to cPanel hosting**

---

## 📋 PRE-DEPLOYMENT CHECKLIST

Before starting deployment, ensure you have:

- [ ] cPanel hosting account access
- [ ] FTP/File Manager credentials
- [ ] MySQL database creation permissions
- [ ] Domain name configured and pointing to hosting
- [ ] Node.js installed locally (for building React app)
- [ ] Git access to the repository
- [ ] Admin email: trononly1@gmail.com
- [ ] Admin password: Tront@lkno1

---

## 🔧 PHASE 1 DEPLOYMENT: ADMIN DASHBOARD

### **STEP 1: LOCAL BUILD**

#### 1.1 Build React Application

```bash
# Navigate to project directory
cd /home/tron/Documents/projects/prestige-strategies-revamp

# Install dependencies (if not already done)
npm install

# Build production version
npm run build
```

**Expected Output:**
- `dist/` folder created with:
  - `index.html`
  - `assets/` folder (CSS, JS, images)

#### 1.2 Verify Build

```bash
# Check dist folder contents
ls -la dist/

# Preview build locally (optional)
npm run preview
```

---

### **STEP 2: CPANEL PREPARATION**

#### 2.1 Create MySQL Database

1. Login to cPanel
2. Navigate to **MySQL® Databases**
3. Create new database:
   - Database name: `prestige` (full name will be `awinja31_prestige`)
   - Click **Create Database**
4. Create database user:
   - Username: `dbuser` (full name will be `awinja31_dbuser`)
   - Password: **Generate strong password** (save it!)
   - Click **Create User**
5. Add user to database:
   - User: `awinja31_dbuser`
   - Database: `awinja31_prestige`
   - Privileges: **ALL PRIVILEGES**
   - Click **Make Changes**

**Save these credentials:**
```
DB_HOST=localhost
DB_NAME=awinja31_prestige
DB_USER=awinja31_dbuser
DB_PASS=[your_generated_password]
```

#### 2.2 Select PHP Version

1. In cPanel, go to **Select PHP Version** (or **MultiPHP Manager**)
2. Select domain: `prestigestrategies.co.ke`
3. Choose PHP version: **8.1** or higher
4. Click **Apply**

---

### **STEP 3: UPLOAD FILES TO CPANEL**

#### 3.1 Using cPanel File Manager

1. Login to cPanel
2. Open **File Manager**
3. Navigate to `public_html` directory
4. **IMPORTANT:** Backup existing files (if any)
   - Select all files
   - Click **Compress** → Create `backup_[date].zip`
   - Download backup to local machine

#### 3.2 Upload React Build Files

**Option A: Upload via File Manager**

1. In `public_html`, click **Upload**
2. Upload contents of `dist/` folder:
   - `index.html`
   - `assets/` folder
   - `vite.svg` (if exists)
3. **Do NOT upload** `node_modules/`, `src/`, or config files

**Option B: Upload via FTP Client (FileZilla)**

1. Connect to FTP:
   - Host: `ftp.prestigestrategies.co.ke` (or provided by host)
   - Username: `awinja31` (your cPanel username)
   - Password: [your cPanel password]
   - Port: 21
2. Navigate to `/public_html/`
3. Upload contents of local `dist/` folder

**Directory Structure After Upload:**
```
public_html/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
├── jobs.php (existing)
├── jobs.json (existing - will be replaced by API)
├── events.json (existing - will be replaced by API)
└── resources.json (existing)
```

---

### **STEP 4: CREATE PHP API STRUCTURE**

#### 4.1 Create API Directory

In `public_html`, create folder structure:

```
public_html/
└── api/
    ├── config/
    ├── auth/
    ├── jobs/
    └── events/
```

**Using File Manager:**
1. Navigate to `public_html`
2. Click **+ Folder**
3. Create `api` folder
4. Inside `api`, create: `config`, `auth`, `jobs`, `events`

#### 4.2 Upload PHP Files

**You need to create these files manually or upload them:**

Open a text editor (VS Code, Sublime, etc.) and create each PHP file as documented in `AGENT_IMPLEMENTATION.md`.

**Files to Create:**

1. **Config Files** (`public_html/api/config/`):
   - `Config.php` - Environment variable loader
   - `Database.php` - MySQL connection
   - `JWTHelper.php` - JWT token handler
   - `cors.php` - CORS headers
   - `auth_middleware.php` - Authentication middleware

2. **Auth Endpoints** (`public_html/api/auth/`):
   - `login.php` - Admin login
   - `verify.php` - Token verification

3. **Jobs Endpoints** (`public_html/api/jobs/`):
   - `list.php` - List jobs
   - `create.php` - Create job
   - `update.php` - Update job
   - `delete.php` - Delete job

4. **Events Endpoints** (`public_html/api/events/`):
   - `list.php` - List events
   - `create.php` - Create event
   - `update.php` - Update event
   - `delete.php` - Delete event

**Use File Manager to create each file:**
1. Navigate to appropriate folder
2. Click **+ File**
3. Name the file (e.g., `Config.php`)
4. Right-click → **Edit**
5. Paste code from `AGENT_IMPLEMENTATION.md`
6. Click **Save Changes**

---

### **STEP 5: CREATE ENVIRONMENT FILE**

#### 5.1 Navigate Outside public_html

**CRITICAL:** Environment file MUST be outside `public_html` for security!

1. In File Manager, click **Up One Level** (or go to `/home/awinja31/`)
2. You should now be in `/home/awinja31/` (home directory)

#### 5.2 Create .env File

1. Click **+ File**
2. Name: `.env`
3. Right-click → **Edit**
4. Paste this content (replace values):

```bash
# Database Configuration
DB_HOST=localhost
DB_NAME=awinja31_prestige
DB_USER=awinja31_dbuser
DB_PASS=YOUR_DATABASE_PASSWORD_HERE

# JWT Secret (CHANGE THIS - min 32 chars)
JWT_SECRET=change_this_to_random_32_character_minimum_secret_key_abc123xyz

# Admin Email
ADMIN_EMAIL=trononly1@gmail.com

# Application URL
APP_URL=https://prestigestrategies.co.ke
```

5. Click **Save Changes**

#### 5.3 Generate JWT Secret

**Recommended method:**

```bash
# Generate random 64-character string
openssl rand -base64 48
```

Or use online generator: https://randomkeygen.com/ (Fort Knox Password section)

**Copy generated string and paste as JWT_SECRET value**

---

### **STEP 6: DATABASE SETUP**

#### 6.1 Generate Admin Password Hash

**Option A: Using Online Tool**

1. Visit: https://bcrypt-generator.com/
2. Enter password: `Tront@lkno1`
3. Rounds: 10
4. Click **Generate**
5. Copy the hash (starts with `$2y$10$`)

**Option B: Using PHP Script**

1. Create temporary file `public_html/generate_hash.php`:

```php
<?php
$password = 'Tront@lkno1';
$hash = password_hash($password, PASSWORD_BCRYPT);
echo "Password Hash:\n" . $hash;
?>
```

2. Visit: `https://prestigestrategies.co.ke/generate_hash.php`
3. Copy the hash
4. **DELETE the file immediately after!**

#### 6.2 Import Database Schema

1. In cPanel, open **phpMyAdmin**
2. Select database: `awinja31_prestige`
3. Click **SQL** tab
4. Paste this SQL (replace `YOUR_PASSWORD_HASH_HERE`):

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

-- Insert Admin User
INSERT INTO admin_users (email, password_hash, first_name, last_name) 
VALUES (
  'trononly1@gmail.com', 
  'YOUR_PASSWORD_HASH_HERE',  -- REPLACE THIS
  'Admin', 
  'User'
);
```

5. Click **Go**
6. Verify success: You should see "3 tables created" and "1 row inserted"

#### 6.3 Migrate Existing Data

**Migrate Jobs:**

1. Open `public_html/jobs.json` in File Manager
2. For each job, run SQL:

```sql
INSERT INTO jobs (title, description, location, type, companyemail) 
VALUES ('Senior React Developer', 'We are looking for an experienced React developer...', 'New York, NY', 'Full-time', 'hr@example.com');

INSERT INTO jobs (title, description, location, type, companyemail) 
VALUES ('UI/UX Designer', 'We are seeking a talented UI/UX Designer...', 'San Francisco, CA', 'Full-time', 'design.hr@example.com');
```

**Migrate Events:**

```sql
INSERT INTO events (title, start_date, description, location) 
VALUES ('Orientation: Intro to Prestige', '2026-02-10', 'Full-day orientation. Edit this file to change details.', 'Training Room A');

INSERT INTO events (title, start_date, end_date, description, instructor, capacity, url) 
VALUES ('Advanced Excel for Analysts', '2026-02-15 13:00:00', '2026-02-15 16:00:00', 'Pivot tables, Power Query, automation tips.', 'Jane Doe', 20, 'https://example.com/resources/excel-guide.pdf');

INSERT INTO events (title, start_date, end_date, description, location) 
VALUES ('Leadership Bootcamp (Day 1)', '2026-03-01 09:00:00', '2026-03-03 17:00:00', 'Multi-day bootcamp.', 'Conference Centre A');

INSERT INTO events (title, start_date, end_date, description, instructor, capacity, url) 
VALUES ('Data Visualization with Tableau', '2026-02-20 10:00:00', '2026-02-20 14:00:00', 'Learn to create interactive dashboards and reports.', 'John Smith', 15, 'https://example.com/resources/tableau-tutorial.pdf');

INSERT INTO events (title, start_date, end_date, description, location, capacity) 
VALUES ('Project Management Fundamentals', '2026-02-25 09:00:00', '2026-02-25 17:00:00', 'Introduction to Agile and Scrum methodologies.', 'Training Room B', 25);

INSERT INTO events (title, start_date, end_date, description, instructor, capacity, url) 
VALUES ('Cybersecurity Awareness', '2026-03-05 13:00:00', '2026-03-05 15:00:00', 'Protecting data and preventing breaches.', 'Alice Johnson', 30, 'https://example.com/resources/cybersecurity-guide.pdf');

INSERT INTO events (title, start_date, description, location, capacity) 
VALUES ('Team Building Workshop', '2026-03-10', 'Interactive activities to build team cohesion.', 'Outdoor Pavilion', 50);

INSERT INTO events (title, start_date, end_date, description, instructor, capacity, url) 
VALUES ('Advanced Python Programming', '2026-03-15 09:00:00', '2026-03-15 16:00:00', 'Data analysis, machine learning basics.', 'Bob Lee', 20, 'https://example.com/resources/python-advanced.pdf');

INSERT INTO events (title, start_date, end_date, description, location, capacity) 
VALUES ('Marketing Strategies Seminar', '2026-03-20 10:00:00', '2026-03-20 12:00:00', 'Digital marketing trends and tactics.', 'Conference Centre B', 40);

INSERT INTO events (title, start_date, end_date, description, instructor, capacity, url) 
VALUES ('Financial Planning for Managers', '2026-03-25 14:00:00', '2026-03-25 17:00:00', 'Budgeting, forecasting, and financial decision-making.', 'Carol White', 18, 'https://example.com/resources/finance-planning.pdf');

INSERT INTO events (title, start_date, end_date, description, location, capacity) 
VALUES ('AI Ethics and Bias Training', '2026-04-01 09:00:00', '2026-04-01 12:00:00', 'Understanding ethical implications of AI.', 'Training Room C', 22);

INSERT INTO events (title, start_date, end_date, description, instructor, capacity, url) 
VALUES ('Public Speaking Mastery', '2026-04-05 13:00:00', '2026-04-05 16:00:00', 'Techniques for effective presentations.', 'David Kim', 15, 'https://example.com/resources/speaking-tips.pdf');
```

---

### **STEP 7: TEST BACKEND API**

#### 7.1 Test Database Connection

1. Create test file: `public_html/test_db.php`

```php
<?php
require_once 'api/config/Database.php';

$db = Database::getConnection();

if ($db) {
    echo "✅ Database connection successful!\n";
    
    // Test query
    $result = $db->query("SELECT COUNT(*) as count FROM jobs");
    $row = $result->fetch_assoc();
    echo "Jobs count: " . $row['count'] . "\n";
} else {
    echo "❌ Database connection failed!\n";
}
?>
```

2. Visit: `https://prestigestrategies.co.ke/test_db.php`
3. Should see: "✅ Database connection successful!"
4. **DELETE test_db.php after verification**

#### 7.2 Test Admin Login API

**Using Browser Console (Chrome/Firefox DevTools):**

```javascript
// Open DevTools (F12) → Console tab
fetch('https://prestigestrategies.co.ke/api/auth/login.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'trononly1@gmail.com',
    password: 'Tront@lkno1'
  })
})
.then(r => r.json())
.then(data => console.log(data));

// Expected response:
// { success: true, token: "eyJ0eXAi...", user: {...} }
```

**Using cURL (Terminal):**

```bash
curl -X POST https://prestigestrategies.co.ke/api/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"trononly1@gmail.com","password":"Tront@lkno1"}'
```

#### 7.3 Test Jobs API

```javascript
// List all jobs
fetch('https://prestigestrategies.co.ke/api/jobs/list.php')
  .then(r => r.json())
  .then(data => console.log(data));

// Should return array of jobs
```

#### 7.4 Test Events API

```javascript
// List all events
fetch('https://prestigestrategies.co.ke/api/events/list.php')
  .then(r => r.json())
  .then(data => console.log(data));

// Should return array of events
```

---

### **STEP 8: TEST ADMIN DASHBOARD**

#### 8.1 Access Admin Login

1. Visit: `https://prestigestrategies.co.ke/admin/login`
2. Enter credentials:
   - Email: `trononly1@gmail.com`
   - Password: `Tront@lkno1`
3. Click **Sign In**

**Expected behavior:**
- Should redirect to `/admin/dashboard`
- Should see admin layout with sidebar
- Should display stats (if dashboard implemented)

#### 8.2 Test Jobs Management

1. Navigate to "Jobs" in sidebar
2. Should see list of jobs
3. Click **New Job**
4. Fill in form and submit
5. Verify new job appears in list
6. Click **Edit** on a job
7. Modify fields and save
8. Click **Delete** and confirm
9. Verify job is removed

#### 8.3 Test Events Management

1. Navigate to "Events" in sidebar
2. Should see list of events
3. Click **New Event**
4. Fill in form with date/time
5. Submit and verify creation
6. Edit existing event
7. Delete event and confirm

---

### **STEP 9: UPDATE PUBLIC PAGES**

#### 9.1 Modify Jobs Page

**Important:** Before making changes, backup the file!

1. Open `src/pages/Jobs.tsx`
2. Find the fetch call to `/jobs.json`
3. Replace with: `/api/jobs/list.php?status=active`
4. Rebuild app: `npm run build`
5. Re-upload `dist/` contents to `public_html/`

#### 9.2 Modify Events Page

1. Open `src/pages/Events.tsx`
2. Find the fetch call to `/events.json`
3. Replace with: `/api/events/list.php?status=active`
4. Rebuild app: `npm run build`
5. Re-upload `dist/` contents to `public_html/`

#### 9.3 Test Public Pages

1. Visit: `https://prestigestrategies.co.ke/jobs`
   - Should display jobs from database
   - Try filtering/searching
2. Visit: `https://prestigestrategies.co.ke/events`
   - Should display events from database
   - Calendar should work correctly

---

### **STEP 10: SECURITY HARDENING**

#### 10.1 Create .htaccess File

In `public_html/`, create `.htaccess`:

```apache
# Prevent directory listing
Options -Indexes

# Prevent access to sensitive files
<FilesMatch "^\.env|\.git|composer\.(json|lock)|package(-lock)?\.json">
  Order allow,deny
  Deny from all
</FilesMatch>

# Prevent access to API config files directly
<FilesMatch "^(Database|Config|JWTHelper|auth_middleware)\.php$">
  Order allow,deny
  Deny from all
</FilesMatch>

# Enable HTTPS (if SSL certificate installed)
# RewriteEngine On
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# PHP security settings
php_value display_errors 0
php_value log_errors 1
php_value error_log /home/awinja31/php_errors.log
```

#### 10.2 Set File Permissions

**Via File Manager:**

1. Select `.env` file
2. Right-click → **Change Permissions**
3. Set to: `600` (Owner: Read+Write only)
4. For API PHP files: `644` (Owner: Read+Write, Others: Read)
5. For folders: `755` (Owner: All, Others: Read+Execute)

**Via SSH (if available):**

```bash
chmod 600 /home/awinja31/.env
chmod 644 /home/awinja31/public_html/api/**/*.php
chmod 755 /home/awinja31/public_html/api/
```

#### 10.3 Enable Error Logging

1. Create `php_errors.log` in `/home/awinja31/`
2. Set permissions to `666` (writable)
3. Monitor for errors during testing

---

### **STEP 11: BACKUP SETUP**

#### 11.1 Database Backup

1. In cPanel, go to **Backup Wizard**
2. Choose **Backup** → **MySQL Database**
3. Select `awinja31_prestige`
4. Download `.sql.gz` file
5. Store securely (Google Drive, Dropbox, etc.)

**Automate weekly backups:**
- Set up cron job in cPanel:
  - Navigate to **Cron Jobs**
  - Schedule: `0 2 * * 0` (2 AM every Sunday)
  - Command: `mysqldump -u awinja31_dbuser -p'PASSWORD' awinja31_prestige > /home/awinja31/backups/db_$(date +\%Y\%m\%d).sql`

#### 11.2 File Backup

1. Create `backups/` folder in `/home/awinja31/`
2. Regularly backup:
   - `.env` file
   - `public_html/api/` folder
   - `public_html/uploads/` folder (when implemented)
3. Use cPanel **Backup** tool or FTP download

---

## ✅ PHASE 1 DEPLOYMENT COMPLETE CHECKLIST

- [ ] React app built and uploaded to `public_html/`
- [ ] PHP API structure created in `public_html/api/`
- [ ] All PHP files uploaded and tested
- [ ] `.env` file created outside `public_html/`
- [ ] MySQL database created and configured
- [ ] Database schema imported successfully
- [ ] Admin user created with hashed password
- [ ] Existing jobs/events migrated to database
- [ ] Backend API endpoints tested (login, jobs, events)
- [ ] Admin dashboard login works
- [ ] Jobs CRUD operations work in admin
- [ ] Events CRUD operations work in admin
- [ ] Public Jobs page loads from API
- [ ] Public Events page loads from API
- [ ] `.htaccess` security rules applied
- [ ] File permissions set correctly
- [ ] Database backup completed
- [ ] Admin credentials shared with client securely

---

## 🎓 PHASE 2 DEPLOYMENT: COURSE PLATFORM

**⚠️ Only proceed after Phase 1 is fully tested and approved by client!**

### **STEP 1: GOOGLE OAUTH SETUP**

#### 1.1 Create Google Cloud Project

1. Go to: https://console.cloud.google.com/
2. Click **Select a project** → **New Project**
3. Project name: `Prestige Strategies Courses`
4. Organization: (leave blank if personal)
5. Click **Create**

#### 1.2 Enable Google APIs

1. In project dashboard, click **Enable APIs and Services**
2. Search for: **Google+ API**
3. Click **Enable**

#### 1.3 Configure OAuth Consent Screen

1. Navigate to **APIs & Services** → **OAuth consent screen**
2. User Type: **External**
3. Click **Create**
4. Fill in details:
   - App name: `Prestige Strategies Courses`
   - User support email: `trononly1@gmail.com`
   - App logo: (upload Prestige logo - optional)
   - Authorized domains: `prestigestrategies.co.ke`
   - Developer contact: `trononly1@gmail.com`
5. Click **Save and Continue**
6. Scopes: Click **Add or Remove Scopes**
   - Select: `userinfo.email`, `userinfo.profile`, `openid`
7. Click **Save and Continue**
8. Test users: Add `trononly1@gmail.com` for testing
9. Click **Save and Continue**

#### 1.4 Create OAuth Client ID

1. Navigate to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
2. Application type: **Web application**
3. Name: `Prestige Courses Web Client`
4. Authorized JavaScript origins:
   - `https://prestigestrategies.co.ke`
   - `http://localhost:5173` (for local testing)
5. Authorized redirect URIs:
   - `https://prestigestrategies.co.ke/courses`
   - `https://prestigestrategies.co.ke/auth/callback`
6. Click **Create**
7. **IMPORTANT:** Copy and save:
   - Client ID: `1234567890-abc...apps.googleusercontent.com`
   - Client Secret: `GOCSPX-abc123...`

#### 1.5 Update .env File

Add to `/home/awinja31/.env`:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
```

---

### **STEP 2: M-PESA DARAJA SETUP**

#### 2.1 Create Daraja Developer Account

1. Go to: https://developer.safaricom.co.ke/
2. Click **Sign Up**
3. Fill in details:
   - Email: `trononly1@gmail.com`
   - Phone: Your phone number
   - Organization: `Prestige Strategies`
4. Verify email
5. Login to portal

#### 2.2 Create Daraja App

1. Go to **My Apps** → **Create App**
2. App name: `Prestige Courses Payment`
3. Select APIs:
   - ✅ Lipa Na M-Pesa Online
4. Click **Create**

#### 2.3 Get Sandbox Credentials

1. Click on your app
2. Navigate to **Keys** tab
3. Copy:
   - Consumer Key
   - Consumer Secret
4. Navigate to **Lipa Na M-Pesa Online** → **Test Credentials**
5. Copy:
   - Shortcode: `174379`
   - Passkey: (long string)

#### 2.4 Configure Callback URL

1. In app settings, find **Callback URL**
2. Enter: `https://prestigestrategies.co.ke/api/payments/callback.php`
3. Click **Save**

#### 2.5 Update .env File

Add to `/home/awinja31/.env`:

```bash
# M-Pesa Daraja Configuration (SANDBOX)
MPESA_CONSUMER_KEY=YOUR_CONSUMER_KEY_HERE
MPESA_CONSUMER_SECRET=YOUR_CONSUMER_SECRET_HERE
MPESA_PASSKEY=YOUR_PASSKEY_HERE
MPESA_SHORTCODE=174379
MPESA_CALLBACK_URL=https://prestigestrategies.co.ke/api/payments/callback.php
MPESA_ENVIRONMENT=sandbox
```

---

### **STEP 3: DATABASE SCHEMA FOR PHASE 2**

#### 3.1 Import Course Tables

1. Open **phpMyAdmin**
2. Select `awinja31_prestige` database
3. Click **SQL** tab
4. Paste this SQL:

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

-- Module Progress Tracking
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

5. Click **Go**
6. Verify: "5 tables created"

---

### **STEP 4: UPLOAD PHASE 2 PHP FILES**

#### 4.1 Create New API Folders

In `public_html/api/`, create:
- `courses/`
- `modules/`
- `payments/`

#### 4.2 Upload Course API Files

**Google OAuth:**
- `api/auth/google_login.php`

**Courses:**
- `api/courses/list.php`
- `api/courses/get.php`
- `api/courses/create.php`
- `api/courses/update.php`
- `api/courses/delete.php`
- `api/courses/enroll_check.php`

**Modules:**
- `api/modules/get.php`
- `api/modules/create.php`
- `api/modules/update.php`
- `api/modules/delete.php`

**Payments:**
- `api/payments/initiate.php`
- `api/payments/callback.php`
- `api/payments/status.php`

(Refer to `AGENT_IMPLEMENTATION.md` for file contents)

---

### **STEP 5: CREATE M-PESA LOG FILE**

1. In `/home/awinja31/`, create file: `mpesa_logs.txt`
2. Set permissions: `666` (writable)
3. This file will log M-Pesa callbacks for debugging

---

### **STEP 6: UPDATE REACT APP FOR PHASE 2**

#### 6.1 Install Google OAuth Library

```bash
npm install @react-oauth/google
```

#### 6.2 Build and Deploy

```bash
# Build updated app
npm run build

# Upload dist/ contents to public_html/
# (same process as Phase 1 Step 3)
```

---

### **STEP 7: TEST PHASE 2**

#### 7.1 Test Google OAuth

1. Visit course page
2. Click "Login with Google"
3. Complete Google OAuth flow
4. Verify user is created in `users` table (check phpMyAdmin)

#### 7.2 Test M-Pesa Payment (Sandbox)

1. Create a test course in admin dashboard
2. As user, attempt to purchase course
3. Enter test phone number: `254708374149`
4. Check `mpesa_logs.txt` for callback data
5. Verify payment record in `payments` table
6. Verify enrollment in `course_enrollments` table

**Sandbox Test Credentials:**
- Phone: `254708374149`
- PIN: `1234`

#### 7.3 Test Course Access

1. After successful payment, user should see "Go to Course" button
2. Click and verify modules load
3. Test YouTube video playback
4. Verify progress tracking

---

### **STEP 8: GO LIVE WITH M-PESA**

**⚠️ Only after thorough sandbox testing!**

#### 8.1 Apply for Production Credentials

1. Login to Daraja Portal
2. Navigate to **Go Live**
3. Submit application with:
   - Business registration documents
   - Till/Paybill number
   - Expected transaction volume
4. Wait for approval (1-2 weeks typically)

#### 8.2 Update Production Credentials

Once approved, update `.env`:

```bash
# M-Pesa Daraja Configuration (PRODUCTION)
MPESA_CONSUMER_KEY=YOUR_PRODUCTION_CONSUMER_KEY
MPESA_CONSUMER_SECRET=YOUR_PRODUCTION_CONSUMER_SECRET
MPESA_PASSKEY=YOUR_PRODUCTION_PASSKEY
MPESA_SHORTCODE=YOUR_PRODUCTION_SHORTCODE
MPESA_CALLBACK_URL=https://prestigestrategies.co.ke/api/payments/callback.php
MPESA_ENVIRONMENT=production
```

#### 8.3 Test Production Payments

1. Make small test payment (KES 1)
2. Verify callback received
3. Check real M-Pesa receipt
4. Verify enrollment created

---

## 🔧 TROUBLESHOOTING

### **Common Issues**

#### Issue: "Database connection failed"
**Solution:**
- Check `.env` file path is correct: `/home/awinja31/.env`
- Verify database credentials in cPanel
- Check user has ALL PRIVILEGES on database
- Test connection with `test_db.php`

#### Issue: "CORS errors in browser console"
**Solution:**
- Ensure `cors.php` is included in all API endpoints
- Check `Access-Control-Allow-Origin` header
- Verify API URL is correct (no typos)

#### Issue: "JWT token invalid"
**Solution:**
- Verify JWT_SECRET in `.env` is set
- Check token expiration (default 7 days)
- Clear localStorage and re-login
- Check `JWTHelper.php` decode function

#### Issue: "Admin login fails"
**Solution:**
- Verify password hash is correct in database
- Test password with bcrypt verifier online
- Check `login.php` error logs
- Ensure `password_verify()` function works

#### Issue: "API returns 500 error"
**Solution:**
- Check PHP error logs: `/home/awinja31/php_errors.log`
- Enable error display temporarily in PHP
- Check SQL query syntax
- Verify all `require_once` paths are correct

#### Issue: "React app shows blank page"
**Solution:**
- Check browser console for errors
- Verify all `index.html` and assets uploaded
- Check `.htaccess` doesn't block assets
- Test with `npm run preview` locally first

#### Issue: "M-Pesa STK Push not received"
**Solution:**
- Check phone number format: `254XXXXXXXXX`
- Verify Daraja credentials in `.env`
- Check `mpesa_logs.txt` for errors
- Ensure callback URL is accessible publicly
- Test with Daraja sandbox first

#### Issue: "Google OAuth fails"
**Solution:**
- Check authorized domains in Google Console
- Verify Client ID in React app matches Google Console
- Check redirect URIs are correct
- Ensure HTTPS is enabled (required for OAuth)

---

## 📊 MONITORING & MAINTENANCE

### **Weekly Tasks**
- [ ] Check database backup completed
- [ ] Review `mpesa_logs.txt` for failed payments
- [ ] Check `php_errors.log` for errors
- [ ] Monitor disk space usage in cPanel
- [ ] Test admin dashboard functionality

### **Monthly Tasks**
- [ ] Update PHP version if new stable release
- [ ] Review and archive old logs
- [ ] Check SSL certificate expiration
- [ ] Test all critical user flows
- [ ] Database optimization (if needed)

### **Performance Optimization**
- Enable caching in `.htaccess`
- Compress images before upload
- Minify React build assets
- Use CDN for static assets (optional)
- Enable gzip compression

---

## 🆘 EMERGENCY PROCEDURES

### **Website Down**

1. Check cPanel service status
2. Verify DNS settings
3. Check .htaccess for syntax errors
4. Review recent changes
5. Restore from backup if needed

### **Database Corruption**

1. Access phpMyAdmin
2. Run "Repair Table" on affected tables
3. If fails, restore from latest backup
4. Contact hosting support

### **Security Breach**

1. Immediately change all passwords:
   - cPanel
   - Database user
   - Admin user
   - FTP
2. Check file modification dates
3. Review access logs
4. Restore from clean backup
5. Update all credentials in `.env`
6. Contact hosting support for investigation

---

## 📞 SUPPORT CONTACTS

**Hosting Support:**
- cPanel documentation: https://docs.cpanel.net/
- Contact hosting provider support

**M-Pesa Support:**
- Daraja Portal: https://developer.safaricom.co.ke/
- Email: apisupport@safaricom.co.ke

**Google OAuth Support:**
- Google Cloud Console: https://console.cloud.google.com/
- Documentation: https://developers.google.com/identity

**Developer Contact:**
- Email: trononly1@gmail.com

---

## ✅ FINAL DEPLOYMENT CHECKLIST

### **Phase 1 Complete**
- [ ] All backend API endpoints working
- [ ] Admin dashboard fully functional
- [ ] Public pages loading from database
- [ ] Security measures implemented
- [ ] Backups configured
- [ ] Client trained on admin dashboard

### **Phase 2 Complete**
- [ ] Google OAuth working
- [ ] Course management in admin functional
- [ ] M-Pesa sandbox payments working
- [ ] Course enrollment process tested
- [ ] Video playback working
- [ ] Production M-Pesa credentials configured
- [ ] Final security audit completed

### **Go-Live Approved**
- [ ] Client sign-off received
- [ ] All features tested by client
- [ ] Documentation provided
- [ ] Support plan established
- [ ] Monitoring tools in place

---

**🎉 DEPLOYMENT COMPLETE!**

**Next Steps:**
1. Share admin credentials with client securely
2. Provide training session
3. Monitor for first 48 hours closely
4. Schedule 1-week follow-up review

**END OF DEPLOYMENT.MD**
