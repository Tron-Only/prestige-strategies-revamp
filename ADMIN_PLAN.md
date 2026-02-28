# Admin Dashboard Implementation Plan

## Overview
This document outlines the planned implementation for an admin dashboard to manage jobs and calendar events for Prestige Strategies website.

## Current Status
- Jobs are currently loaded from `/jobs.json`
- No backend API exists yet for CRUD operations
- No authentication system in place

---

## Phase 1: Backend Infrastructure

### 1.1 Database Schema

**Jobs Table:**
```sql
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL, -- Full-time, Part-time, Contract
  companyemail VARCHAR(255) NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  currency VARCHAR(10) DEFAULT 'KES',
  requirements TEXT[], -- Array of requirements
  benefits TEXT[], -- Array of benefits
  status VARCHAR(50) DEFAULT 'active', -- active, closed, draft
  featured BOOLEAN DEFAULT false,
  posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  closing_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Events/Calendar Table:**
```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(100) NOT NULL, -- training, workshop, webinar, conference
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  location VARCHAR(255),
  is_virtual BOOLEAN DEFAULT false,
  meeting_link VARCHAR(500),
  max_attendees INTEGER,
  registration_deadline TIMESTAMP,
  status VARCHAR(50) DEFAULT 'upcoming', -- upcoming, ongoing, completed, cancelled
  banner_image VARCHAR(500),
  price DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'KES',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

**Event Registrations Table:**
```sql
CREATE TABLE event_registrations (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  job_title VARCHAR(255),
  dietary_requirements TEXT,
  status VARCHAR(50) DEFAULT 'registered', -- registered, attended, cancelled
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Admin Users Table:**
```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'editor', -- admin, editor, viewer
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 1.2 API Endpoints

**Authentication:**
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current admin info

**Jobs Management:**
- `GET /api/jobs` - List all jobs (with pagination, filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `PATCH /api/jobs/:id/status` - Update job status
- `PATCH /api/jobs/:id/featured` - Toggle featured status

**Events Management:**
- `GET /api/events` - List all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/:id/registrations` - Get event registrations
- `PATCH /api/events/:id/status` - Update event status

**Dashboard Stats:**
- `GET /api/dashboard/stats` - Get overview stats
- `GET /api/dashboard/recent-jobs` - Recent job postings
- `GET /api/dashboard/upcoming-events` - Upcoming events
- `GET /api/dashboard/applications-count` - Application statistics

### 1.3 Technology Stack Options

**Option A: Serverless (Recommended for small scale)**
- Supabase (PostgreSQL + Auth + Storage)
- Vercel/Netlify for hosting
- Row Level Security (RLS) for data protection

**Option B: Traditional Server**
- Node.js + Express
- PostgreSQL database
- JWT authentication
- AWS/Digital Ocean hosting

**Option C: Headless CMS**
- Strapi CMS
- Built-in admin panel
- REST/GraphQL API
- Self-hosted or cloud

---

## Phase 2: Admin Dashboard UI

### 2.1 Routes Structure
```
/admin
  /login - Admin login page
  /dashboard - Overview dashboard
  /jobs - Jobs list
    /jobs/new - Create job
    /jobs/:id/edit - Edit job
  /events - Events list
    /events/new - Create event
    /events/:id/edit - Edit event
    /events/:id/registrations - View registrations
  /settings - Admin settings
```

### 2.2 Dashboard Components

**Layout:**
- Sidebar navigation
- Top header with user info
- Breadcrumb navigation
- Main content area

**Dashboard Overview Page:**
- Stats cards (Total Jobs, Active Jobs, Upcoming Events, Total Applications)
- Recent job postings table
- Upcoming events list
- Quick action buttons

**Jobs Management Page:**
- Data table with columns: Title, Location, Type, Status, Posted Date, Actions
- Search and filter bar
- Bulk actions (Delete, Change Status)
- "New Job" button
- Edit/Delete actions per row
- Featured toggle

**Job Editor Page:**
- Form fields:
  - Job Title (text)
  - Description (rich text editor)
  - Location (text with autocomplete)
  - Job Type (select: Full-time, Part-time, Contract, Internship)
  - Company Email (email)
  - Salary Range (min/max with currency)
  - Requirements (tag input)
  - Benefits (tag input)
  - Closing Date (date picker)
  - Featured (toggle)
  - Status (draft/active/closed)
- Preview button
- Save/Publish buttons

**Events Management Page:**
- Calendar view (month/week/day toggle)
- List view option
- Filter by type and status
- "New Event" button
- Edit/Delete actions

**Event Editor Page:**
- Form fields:
  - Event Title
  - Description (rich text)
  - Event Type (select)
  - Start/End Date & Time
  - Location (virtual toggle)
  - Meeting Link (if virtual)
  - Max Attendees
  - Registration Deadline
  - Banner Image upload
  - Price (if paid)
  - Status
- Registration list view

### 2.3 UI Component Requirements

**New Components Needed:**
- `DataTable` - Reusable table with sorting, filtering, pagination
- `RichTextEditor` - For job/event descriptions
- `ImageUploader` - Drag & drop image upload
- `DateRangePicker` - For event scheduling
- `TagInput` - For requirements/benefits
- `StatsCard` - Dashboard stat display
- `StatusBadge` - Job/event status indicators

---

## Phase 3: Authentication & Security

### 3.1 Authentication Flow
1. Admin navigates to `/admin/login`
2. Enter email/password
3. Validate credentials against database
4. Generate JWT token with expiration (24 hours)
5. Store token in httpOnly cookie
6. Redirect to `/admin/dashboard`
7. Validate token on each API request
8. Refresh token before expiration

### 3.2 Security Measures
- Password hashing with bcrypt (min 10 rounds)
- Rate limiting on login attempts (5 attempts per 15 min)
- HTTPS only
- CSRF protection
- Input sanitization
- SQL injection prevention (use ORM)
- XSS protection

### 3.3 Role-Based Access Control (RBAC)
**Roles:**
- **Admin**: Full access (create/edit/delete users, all content)
- **Editor**: Create/edit content, cannot delete or manage users
- **Viewer**: Read-only access to dashboard and reports

---

## Phase 4: Public API Integration

### 4.1 Update Frontend to Use Real API
Replace `/jobs.json` with API calls:
```typescript
// Current
const response = await fetch("/jobs.json");

// New
const response = await fetch("/api/jobs?status=active");
```

### 4.2 Add Application Submission Endpoint
- `POST /api/jobs/:id/apply` - Submit job application with CV
- Store applications in database
- Send email notification to companyemail
- Admin can view applications in dashboard

---

## Phase 5: Additional Features

### 5.1 Email Notifications
- New job application received
- Event registration confirmation
- Job closing date reminder
- Event reminder (24 hours before)

### 5.2 Analytics
- Job view counts
- Application conversion rates
- Most popular job categories
- Event registration stats

### 5.3 Content Management
- SEO meta tags editor per job/event
- Slug/URL management
- Draft auto-save
- Content scheduling (publish later)

### 5.4 File Management
- CV/Resume storage
- Event banner images
- Company logo uploads
- Document templates

---

## Implementation Timeline

**Week 1-2: Backend Setup**
- Set up database
- Create API endpoints
- Implement authentication

**Week 3-4: Admin Dashboard UI**
- Create admin layout and navigation
- Build dashboard overview
- Implement jobs management

**Week 5: Events Management**
- Calendar integration
- Event CRUD operations
- Registration management

**Week 6: Polish & Testing**
- UI/UX refinements
- Security audit
- Testing and bug fixes
- Documentation

---

## Current Recommendations

### Immediate Steps:
1. Choose backend approach (recommend Supabase for quick setup)
2. Set up development environment
3. Create database schema
4. Implement basic auth

### Migration Plan:
1. Keep current static jobs.json working
2. Build admin dashboard in parallel
3. Test with staging data
4. Switch frontend to API when ready
5. Archive old jobs.json

---

## Notes for Future Development

- Consider adding job categories/tags
- Implement job alerts/subscriptions for users
- Add multi-language support
- Consider mobile app for admin
- Integration with HR systems (SAP, Workday)
- LinkedIn job posting integration
