# Phase 2: Course Platform Implementation

## 🎉 Implementation Status

### ✅ COMPLETED - Backend API

All Phase 2 backend infrastructure has been implemented successfully!

---

## 📊 Database Schema

### New Tables Created

1. **users** - Google OAuth student accounts
   - `google_id`, `email`, `name`, `profile_picture`
   - Separate from `admin_users` table

2. **courses** - Course catalog
   - `title`, `description`, `price`, `currency`, `thumbnail`
   - `category`, `level`, `duration_hours`, `status`

3. **course_modules** - Video lessons
   - `course_id`, `title`, `description`, `youtube_video_id`
   - `module_order`, `duration_minutes`

4. **payments** - M-Pesa transactions
   - `user_id`, `course_id`, `amount`, `phone_number`
   - `mpesa_transaction_id`, `mpesa_receipt_number`, `checkout_request_id`
   - `status` (pending/completed/failed/cancelled)

5. **course_enrollments** - Student course access
   - `user_id`, `course_id`, `payment_id`
   - `enrolled_at`, `progress`, `last_accessed_at`

6. **module_progress** - Per-module tracking
   - `user_id`, `module_id`, `completed`, `completed_at`
   - `watch_time_seconds`, `last_position_seconds`

### Setup Commands

```bash
# Run Phase 2 database setup
cd database
mysql -u root prestige_db < schema_phase2.sql

# Or use the PHP script
php setup_phase2.php
```

---

## 🔐 Authentication System

### Google OAuth Login

**Endpoint:** `POST /api/auth/google_login.php`

**Request:**
```json
{
  "id_token": "google-id-token-from-frontend"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://..."
  }
}
```

**How it works:**
1. Frontend gets ID token from Google Sign-In
2. Backend verifies token with Google's API
3. Creates/updates user in database
4. Returns JWT token for API authentication

### User Authentication Flow

1. **Admin Login:** `/api/auth/login.php` (existing - Phase 1)
   - Uses email/password
   - Returns JWT with `role: 'admin'`

2. **Student Login:** `/api/auth/google_login.php` (new - Phase 2)
   - Uses Google OAuth
   - Returns JWT with `role: 'user'`

3. **JWT Structure:**
   ```json
   {
     "user_id": 123,
     "email": "user@example.com",
     "role": "admin" | "user",
     "exp": 1234567890
   }
   ```

---

## 📚 Course Management API (Admin)

### List Courses
**GET** `/api/courses/list.php?status=active`

**Response:**
```json
{
  "success": true,
  "data": [{
    "id": 1,
    "title": "Web Development Bootcamp",
    "description": "...",
    "price": 5000.00,
    "currency": "KES",
    "thumbnail": "https://...",
    "category": "Programming",
    "level": "Beginner",
    "duration_hours": 40,
    "status": "active",
    "module_count": 15
  }]
}
```

### Get Single Course
**GET** `/api/courses/get.php?id=1`

Returns course with all modules included.

### Create Course (Admin Only)
**POST** `/api/courses/create.php`

**Headers:** `Authorization: Bearer <admin-jwt-token>`

**Request:**
```json
{
  "title": "Course Title",
  "description": "Course description",
  "price": 5000,
  "currency": "KES",
  "thumbnail": "https://...",
  "category": "Programming",
  "level": "Beginner",
  "duration_hours": 40,
  "status": "active"
}
```

### Update Course (Admin Only)
**PUT** `/api/courses/update.php`

Same fields as create, plus `id`.

### Delete Course (Admin Only)
**DELETE** `/api/courses/delete.php?id=1`

---

## 🎥 Module Management API (Admin)

### Add Module to Course
**POST** `/api/modules/create.php`

**Headers:** `Authorization: Bearer <admin-jwt-token>`

**Request:**
```json
{
  "course_id": 1,
  "title": "Introduction to HTML",
  "description": "Learn HTML basics",
  "youtube_video_id": "dQw4w9WgXcQ",
  "module_order": 1,
  "duration_minutes": 45
}
```

**Note:** For YouTube video `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, the video ID is `dQw4w9WgXcQ`.

---

## 💳 M-Pesa Payment Integration

### Initiate Payment (STK Push)
**POST** `/api/payments/initiate.php`

**Headers:** `Authorization: Bearer <user-jwt-token>`

**Request:**
```json
{
  "course_id": 1,
  "phone_number": "254712345678"
}
```

**Response:**
```json
{
  "success": true,
  "checkout_request_id": "ws_CO_...",
  "payment_id": 123,
  "message": "STK Push sent to 254712345678"
}
```

**What happens:**
1. Validates user is not already enrolled
2. Generates M-Pesa access token
3. Initiates STK Push to user's phone
4. Creates payment record with status `pending`
5. User enters M-Pesa PIN on their phone
6. M-Pesa calls callback endpoint
7. Callback updates payment status and creates enrollment

### M-Pesa Callback Handler
**POST** `/api/payments/callback.php`

- Called by Safaricom servers (not frontend)
- Logs all callbacks to `/public/logs/mpesa_callbacks.log`
- Updates payment status
- Creates course enrollment on successful payment

---

## 📖 Student Enrollment API

### My Courses
**GET** `/api/enrollments/my_courses.php`

**Headers:** `Authorization: Bearer <user-jwt-token>`

**Response:**
```json
{
  "success": true,
  "data": [{
    "enrollment_id": 1,
    "enrolled_at": "2026-02-28 12:00:00",
    "progress": 45.50,
    "course_id": 1,
    "title": "Web Development Bootcamp",
    "thumbnail": "https://...",
    "module_count": 15,
    "completed_modules": 7
  }]
}
```

### Check Enrollment Status
**GET** `/api/enrollments/check.php?course_id=1`

**Headers:** `Authorization: Bearer <user-jwt-token>`

**Response:**
```json
{
  "success": true,
  "enrolled": true,
  "data": {
    "id": 1,
    "enrolled_at": "2026-02-28 12:00:00",
    "progress": 45.50
  }
}
```

---

## ⚙️ Environment Configuration

### Required .env Variables

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# M-Pesa Daraja API
MPESA_ENVIRONMENT=sandbox  # or 'production'
MPESA_CONSUMER_KEY=your-consumer-key
MPESA_CONSUMER_SECRET=your-consumer-secret
MPESA_SHORTCODE=174379  # Your paybill/till number
MPESA_PASSKEY=your-passkey
MPESA_CALLBACK_URL=https://yourdomain.com/api/payments/callback.php
```

### Getting Credentials

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable Google+ API
3. Create OAuth 2.0 Client ID
4. Add authorized origins: `http://localhost:5173`, `https://yourdomain.com`

**M-Pesa Sandbox:**
1. Go to [Daraja Portal](https://developer.safaricom.co.ke/)
2. Create account → Create app
3. Get test credentials from sandbox
4. Use test shortcode: `174379`
5. Get passkey from sandbox

---

## 🚧 What's Left to Build

### Frontend Components Needed

1. **Course Catalog Page** (`/courses`)
   - Grid/list of courses
   - Search and filter by category/level
   - Course cards with price, thumbnail, description
   - "Enroll Now" button (triggers payment or shows "Enrolled")

2. **Course Detail Page** (`/courses/:id`)
   - Full course description
   - List of modules (locked if not enrolled)
   - Price and "Enroll" button
   - Shows "Continue Learning" if enrolled

3. **Student Dashboard** (`/dashboard`)
   - Google Sign-In button
   - List of enrolled courses
   - Progress bars for each course
   - "Continue" buttons to resume learning

4. **Course Player** (`/courses/:id/learn`)
   - YouTube video embed (current module)
   - Module list sidebar
   - Mark complete button
   - Next/Previous navigation
   - Progress tracking

5. **Admin Course Management** (in admin panel)
   - Course list (CRUD)
   - Add/edit course form
   - Module management (add/reorder/delete)
   - View enrollments and payments

### React Context for Students

Create `src/contexts/StudentAuthContext.tsx`:
- Google Sign-In integration
- Student JWT token management
- Different from admin auth

### Payment Flow UI

1. User clicks "Enroll Now"
2. Modal with phone number input
3. Call `/api/payments/initiate.php`
4. Show "Check your phone for M-Pesa prompt"
5. Poll payment status or use webhooks
6. Redirect to course player on success

---

## 📋 Testing Checklist

### Backend API Testing

```bash
# Test course creation (need admin token)
curl -X POST http://localhost:8001/api/courses/create.php \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Course",
    "description": "Test description",
    "price": 1000,
    "status": "active"
  }'

# Test course listing (public)
curl http://localhost:8001/api/courses/list.php?status=active

# Test Google OAuth login (need real Google ID token)
curl -X POST http://localhost:8001/api/auth/google_login.php \
  -H "Content-Type: application/json" \
  -d '{"id_token": "GOOGLE_ID_TOKEN"}'
```

### M-Pesa Sandbox Testing

1. Use test phone numbers from Daraja docs
2. Test amount: Use exact amounts from sandbox guide
3. Check callback logs: `public/logs/mpesa_callbacks.log`
4. Verify enrollment created after payment

---

## 🔒 Security Notes

1. **NEVER commit credentials** - `.env` is gitignored
2. **Production M-Pesa** - Remove `CURLOPT_SSL_VERIFYPEER` disabling
3. **Google OAuth** - Validate token server-side (already done)
4. **JWT tokens** - Set appropriate expiry (7 days default)
5. **Callback URL** - Must be HTTPS in production
6. **SQL Injection** - Using `Database::escape()` (already done)

---

## 📁 File Structure

```
public/api/
├── auth/
│   ├── login.php (admin - Phase 1)
│   ├── verify.php (admin - Phase 1)
│   └── google_login.php (students - Phase 2) ✅
├── courses/
│   ├── list.php ✅
│   ├── get.php ✅
│   ├── create.php (admin) ✅
│   ├── update.php (admin) ✅
│   └── delete.php (admin) ✅
├── modules/
│   └── create.php (admin) ✅
├── payments/
│   ├── initiate.php (STK Push) ✅
│   └── callback.php (M-Pesa webhook) ✅
└── enrollments/
    ├── my_courses.php ✅
    └── check.php ✅
```

---

## 🎯 Next Steps

1. **Configure credentials** in `.env` (Google OAuth + M-Pesa)
2. **Test API endpoints** with Postman/curl
3. **Build frontend** components (courses catalog, player, dashboard)
4. **Integrate Google Sign-In** in React
5. **Add payment UI** with M-Pesa phone input
6. **Test end-to-end** flow: Sign in → Browse → Pay → Learn

---

## 📞 Support

For M-Pesa integration issues:
- [Daraja Documentation](https://developer.safaricom.co.ke/Documentation)
- Sandbox support: apisupport@safaricom.co.ke

For Google OAuth issues:
- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)

---

**Status:** Phase 2 Backend Complete ✅  
**Next:** Frontend Implementation
