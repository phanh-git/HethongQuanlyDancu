# Quick Reference Guide - Role-Based UI

## 🎯 Summary of Changes

This implementation separates the UI into **two distinct interfaces** based on user role:
1. **Admin/Staff Interface** - For managing the community
2. **Resident Interface** - For personal services

## 🔐 Authentication & Authorization

### Public Registration
```javascript
// Public route - anyone can register
POST /api/auth/register
// Role is ALWAYS set to 'citizen' (hardcoded in backend)
```

### Staff Account Creation
```javascript
// Protected route - admin/team_leader only
POST /api/admin/create-staff
// Can create: 'staff' or 'deputy_leader' roles only
```

### Login Flow
```javascript
POST /api/auth/login
// Returns user with role
// Frontend redirects based on role:
// - citizen → /home
// - admin/team_leader/deputy_leader/staff → /admin/dashboard
```

## 📱 User Interfaces

### Admin/Staff Interface (`/admin/*`)
**Access:** admin, team_leader, deputy_leader, staff

**Features:**
- 📊 Dashboard with statistics
- 🏠 Household management
- 👥 Population management
- 📝 Complaint review and processing
- 📋 Temporary residence approval
- 📈 Reports generation
- ⚙️ Staff management (admin/team_leader only)

**Key Pages:**
```
/admin/dashboard         - Statistics overview
/admin/households        - Manage households
/admin/population        - Manage population records
/admin/complaints        - Review complaints
/admin/staff            - Manage staff accounts (restricted)
```

### Resident Interface (`/`)
**Access:** citizen

**Features:**
- 🏡 Personal & household information
- 📝 Submit temporary residence/absence
- 💬 Submit complaints/feedback
- 🔔 View notifications from administration

**Key Pages:**
```
/home                   - Personal dashboard
/services               - Online services (temp residence)
/complaints/new         - Submit complaint
/notifications          - View announcements
```

## 🛠️ Implementation Details

### Backend

**New Files:**
- `backend/controllers/adminController.js` - Staff management logic
- `backend/routes/admin.js` - Admin API routes

**Modified Files:**
- `backend/controllers/authController.js` - Force citizen role on registration
- `backend/server.js` - Register admin routes

**Security Features:**
- JWT authentication on all protected routes
- Role-based authorization middleware
- Rate limiting (100 requests per 15 minutes)
- Password hashing with bcrypt

### Frontend

**New Files:**
- `frontend/src/components/AdminLayout.jsx` - Admin interface layout
- `frontend/src/components/ResidentLayout.jsx` - Resident interface layout
- `frontend/src/pages/ResidentHome.jsx` - Resident dashboard
- `frontend/src/pages/OnlineServices.jsx` - Service forms
- `frontend/src/pages/Notifications.jsx` - Notification center
- `frontend/src/pages/StaffManagement.jsx` - Staff admin panel

**Modified Files:**
- `frontend/src/App.jsx` - Role-based routing structure
- `frontend/src/pages/Login.jsx` - Role-based redirect
- `frontend/src/components/PrivateRoute.jsx` - Role checking
- `frontend/src/services/index.js` - Admin API services

## 🔑 API Endpoints Quick Reference

### Authentication (Public)
```
POST /api/auth/register      - Register as citizen
POST /api/auth/login         - Login
GET  /api/auth/me           - Get current user (protected)
```

### Admin Management (Admin/Team Leader Only)
```
POST /api/admin/create-staff        - Create staff account
GET  /api/admin/staff               - List all staff
PUT  /api/admin/staff/:id/status    - Toggle staff active status
PUT  /api/admin/staff/:id           - Update staff info
```

### Household & Population (Admin/Staff Only)
```
GET  /api/households                - List households
GET  /api/population                - List population
GET  /api/dashboard/stats           - Get statistics
```

### Services (All Authenticated Users)
```
POST /api/temporary-residence       - Submit temp residence
POST /api/complaints                - Submit complaint
GET  /api/complaints/:id            - Get complaint details
```

## 🚀 Quick Start for Developers

### 1. Install Dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment
```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Run Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 4. Create First Admin Account
```sql
-- Run this SQL to create admin account
INSERT INTO "Users" (
  username, 
  password, 
  "fullName", 
  email, 
  role, 
  "isActive", 
  "createdAt", 
  "updatedAt"
)
VALUES (
  'admin',
  -- Use bcrypt to hash password 'admin123'
  '$2a$10$YourHashedPasswordHere',
  'System Administrator',
  'admin@example.com',
  'admin',
  true,
  NOW(),
  NOW()
);
```

## 🧪 Testing Checklist

### User Registration & Login
- [ ] Register new citizen account via /register
- [ ] Verify role is forced to 'citizen'
- [ ] Login as citizen redirects to /home
- [ ] Login as admin redirects to /admin/dashboard

### Admin Functions
- [ ] Admin can access staff management
- [ ] Admin can create staff account
- [ ] Admin can deactivate staff account
- [ ] Staff cannot access staff management
- [ ] Staff can access household/population management

### Resident Functions
- [ ] Resident can view personal info
- [ ] Resident can submit temporary residence
- [ ] Resident can view notifications
- [ ] Resident cannot access admin routes

### Security
- [ ] Unauthorized access redirects to login
- [ ] Role mismatch redirects to appropriate dashboard
- [ ] Rate limiting prevents abuse
- [ ] Passwords are hashed

## 📞 Troubleshooting

### Issue: Can't access admin pages
**Solution:**
1. Check user role in database
2. Clear browser localStorage
3. Verify JWT token contains role

### Issue: Registration creates wrong role
**Solution:**
- This should not happen - role is hardcoded to 'citizen'
- Check backend/controllers/authController.js line 35

### Issue: Redirect loop after login
**Solution:**
1. Clear browser cache and localStorage
2. Check App.jsx routing configuration
3. Verify user has valid role

### Issue: 404 on household info in resident home
**Solution:**
- This is expected - endpoint not yet implemented
- Will show "No household info" message
- Future enhancement

## 📚 Additional Resources

- **Full Implementation Guide:** ROLE_BASED_UI_IMPLEMENTATION.md
- **User Flow Diagrams:** USER_FLOWS.md
- **API Documentation:** API_DOCS.md
- **Migration Guide:** MIGRATION_GUIDE.md

## 🎉 Key Benefits

✅ **Separation of Concerns** - Admin and resident interfaces are completely separate
✅ **Security** - Role-based access control enforced on both frontend and backend
✅ **Scalability** - Easy to add new roles or features
✅ **User Experience** - Tailored interfaces for different user types
✅ **Maintainability** - Clear code organization and documentation

---

**Version:** 1.0.0  
**Last Updated:** December 2024  
**Author:** Development Team
