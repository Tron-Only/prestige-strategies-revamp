# Database Management Scripts

This folder contains scripts for managing the Prestige Strategies database.

## Scripts Overview

### 1. `setup.php` - Complete Database Setup
Initializes the entire database from scratch.

**What it does:**
- Creates the database (if not exists)
- Creates all tables (admin_users, jobs, events)
- Automatically syncs admin credentials from `.env`

**Usage:**
```bash
cd database
php setup.php
```

**When to use:**
- First-time setup
- After database corruption
- When resetting to clean state

---

### 2. `sync_admin_credentials.php` - Update Admin Password
Syncs admin email and password from `.env` to the database.

**What it does:**
- Reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`
- Generates bcrypt hash
- Updates/creates admin user in database
- Verifies password hash works

**Usage:**
```bash
cd database
php sync_admin_credentials.php
```

**When to use:**
- After changing `ADMIN_EMAIL` or `ADMIN_PASSWORD` in `.env`
- When admin can't login (password sync issue)
- After database restore

---

### 3. `import_test_data.php` - Import Sample Data
Imports test data from JSON files into the database.

**What it does:**
- Reads `public/jobs.json` and `public/events.json`
- Maps JSON structure to database schema
- Inserts records as active jobs/events

**Usage:**
```bash
cd database
php import_test_data.php
```

**When to use:**
- After initial setup for testing
- When you need sample data
- After editing the JSON files with new test data

---

### 4. `schema.sql` - Database Schema Reference
SQL schema definition for reference (not executable directly).

---

## Quick Start Guide

### Initial Setup (First Time)
```bash
# 1. Configure .env file
nano ../.env  # Edit ADMIN_EMAIL and ADMIN_PASSWORD

# 2. Run setup (creates database + tables + syncs admin)
cd database
php setup.php

# 3. Import test data (optional)
php import_test_data.php
```

### Changing Admin Password
```bash
# 1. Edit .env file
nano ../.env  # Change ADMIN_PASSWORD

# 2. Sync to database
cd database
php sync_admin_credentials.php

# 3. Test login at http://localhost:5173/admin/login
```

### Adding More Test Data
```bash
# 1. Edit JSON files
nano ../public/jobs.json
nano ../public/events.json

# 2. Import updated data
cd database
php import_test_data.php
```

---

## Environment Variables Required

Your `.env` file must contain:

```env
# Database Connection
DB_HOST=localhost
DB_NAME=prestige_db
DB_USER=root
DB_PASS=

# JWT Secret
JWT_SECRET=your-secret-key-here

# Admin Credentials (automatically synced to database)
ADMIN_EMAIL=your-admin@example.com
ADMIN_PASSWORD=YourSecurePassword123!
```

---

## Troubleshooting

### "Admin user not found"
Run: `php sync_admin_credentials.php`

### "Could not connect to database"
- Check MySQL/MariaDB is running: `sudo systemctl status mariadb`
- Verify `.env` credentials are correct
- Try: `php setup.php` to recreate database

### "Password not working"
1. Update password in `.env`
2. Run: `php sync_admin_credentials.php`
3. Try logging in again

### Import script fails
- Check JSON files exist in `public/` folder
- Verify JSON syntax is valid
- Ensure database tables exist (run `setup.php` first)

---

## Production Deployment Notes

For production (cPanel):
1. `.env` file should be at `/home/username/.env` (outside public_html)
2. Update `DB_NAME`, `DB_USER`, `DB_PASS` for production database
3. Run `php setup.php` via SSH or cPanel terminal
4. Keep `ADMIN_PASSWORD` secure and change it from default

---

## Database Schema

### Tables
- **admin_users** - Admin authentication
- **jobs** - Job listings
- **events** - Events/workshops

See `schema.sql` for full structure.
