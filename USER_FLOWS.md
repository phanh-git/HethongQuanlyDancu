# User Flows and Authentication

## Overview
This document describes the authentication flows and user journeys for different roles in the system.

## Role-Based Access Matrix

| Feature | Admin | Team Leader | Deputy Leader | Staff | Citizen |
|---------|-------|-------------|---------------|-------|---------|
| Dashboard Statistics | ✅ | ✅ | ✅ | ✅ | ❌ |
| Manage Households | ✅ | ✅ | ✅ | ✅ | ❌ |
| Manage Population | ✅ | ✅ | ✅ | ✅ | ❌ |
| View Complaints | ✅ | ✅ | ✅ | ✅ | ❌ |
| Create Staff Accounts | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage Staff | ✅ | ✅ | ❌ | ❌ | ❌ |
| Personal Dashboard | ❌ | ❌ | ❌ | ❌ | ✅ |
| Submit Temp Residence | ❌ | ❌ | ❌ | ❌ | ✅ |
| View Notifications | ❌ | ❌ | ❌ | ❌ | ✅ |

## User Journey Diagrams

### 1. Public Registration Flow

```
┌──────────────┐
│ Visit Website│
└──────┬───────┘
       │
       v
┌──────────────────┐
│ Click "Register" │
└──────┬───────────┘
       │
       v
┌────────────────────────┐
│ Fill Registration Form │
│ - Full Name            │
│ - Date of Birth        │
│ - CCCD Number          │
│ - Username             │
│ - Password             │
│ - Email                │
└──────┬─────────────────┘
       │
       v
┌───────────────────────────┐
│ Backend: Force role       │
│ role = 'citizen'          │
└──────┬────────────────────┘
       │
       v
┌──────────────────────┐
│ Account Created      │
│ Redirect to Login    │
└──────────────────────┘
```

### 2. Login Flow

```
┌────────────┐
│ Enter Login│
│ Page       │
└──────┬─────┘
       │
       v
┌─────────────────┐
│ Enter Credentials│
│ - Username       │
│ - Password       │
└──────┬──────────┘
       │
       v
┌──────────────────┐
│ Backend Validates│
│ Returns User Data│
└──────┬───────────┘
       │
       v
┌──────────────────────┐
│ Check User Role      │
└──────┬───────────────┘
       │
       ├───────────────────┐
       │                   │
       v                   v
┌──────────────┐    ┌─────────────────┐
│ role='citizen'│    │ role='admin'    │
│              │    │ 'team_leader'   │
│              │    │ 'deputy_leader' │
│              │    │ 'staff'         │
└──────┬───────┘    └─────┬───────────┘
       │                  │
       v                  v
┌──────────────┐    ┌──────────────────┐
│ Redirect to  │    │ Redirect to      │
│ /home        │    │ /admin/dashboard │
└──────────────┘    └──────────────────┘
```

### 3. Admin Creates Staff Account Flow

```
┌─────────────────┐
│ Admin/Team      │
│ Leader Login    │
└────────┬────────┘
         │
         v
┌─────────────────────┐
│ Navigate to Staff   │
│ Management          │
└────────┬────────────┘
         │
         v
┌─────────────────────┐
│ Click "Create       │
│ Account"            │
└────────┬────────────┘
         │
         v
┌─────────────────────┐
│ Fill Form           │
│ - Full Name         │
│ - Email             │
│ - Phone             │
│ - Username          │
│ - Password          │
│ - Role (staff or    │
│   deputy_leader)    │
└────────┬────────────┘
         │
         v
┌─────────────────────┐
│ Backend validates:  │
│ - User is admin or  │
│   team_leader       │
│ - Role is allowed   │
└────────┬────────────┘
         │
         v
┌─────────────────────┐
│ Create Staff Account│
│ Show in list        │
└─────────────────────┘
```

### 4. Resident Submits Temporary Residence

```
┌─────────────────┐
│ Resident Login  │
└────────┬────────┘
         │
         v
┌─────────────────────┐
│ Navigate to Online  │
│ Services            │
└────────┬────────────┘
         │
         v
┌─────────────────────┐
│ Select Type:        │
│ - Temporary Absence │
│ - Temporary Residence│
└────────┬────────────┘
         │
         v
┌─────────────────────┐
│ Fill Form           │
│ - Start Date        │
│ - End Date          │
│ - Destination       │
│ - Reason            │
│ - Contact Phone     │
└────────┬────────────┘
         │
         v
┌─────────────────────┐
│ Submit to Backend   │
│ (temp-residence API)│
└────────┬────────────┘
         │
         v
┌─────────────────────┐
│ Success Message     │
│ Pending Admin Review│
└─────────────────────┘
```

## Screen Navigation Maps

### Admin/Staff Navigation

```
/admin/dashboard (Landing Page)
    │
    ├─── /admin/households
    │       └─── View/Edit Household Details
    │
    ├─── /admin/population
    │       └─── View/Edit Population Details
    │
    ├─── /admin/complaints
    │       └─── View/Update Complaint Status
    │
    ├─── /admin/temporary-residence
    │       └─── Review Temp Residence Requests
    │
    ├─── /admin/reports
    │       └─── Generate/Download Reports
    │
    └─── /admin/staff (Admin/Team Leader Only)
            ├─── View Staff List
            ├─── Create New Staff
            └─── Activate/Deactivate Staff
```

### Resident Navigation

```
/home (Landing Page)
    │
    ├─── Personal Information
    │       └─── View household members
    │
    ├─── /services
    │       └─── Submit temporary residence/absence
    │
    ├─── /complaints/new
    │       └─── Submit complaint/feedback
    │
    └─── /notifications
            └─── View announcements
```

## API Endpoints by Role

### Public Endpoints
- `POST /api/auth/register` - Register as citizen
- `POST /api/auth/login` - Login

### Admin/Staff Endpoints (Protected)
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/households` - List households
- `GET /api/population` - List population
- `GET /api/complaints` - View complaints
- `PUT /api/complaints/:id/status` - Update complaint status

### Admin/Team Leader Only (Protected)
- `POST /api/admin/create-staff` - Create staff account
- `GET /api/admin/staff` - List staff members
- `PUT /api/admin/staff/:id/status` - Activate/deactivate staff
- `PUT /api/admin/staff/:id` - Update staff info

### Citizen Endpoints (Protected)
- `GET /api/auth/me` - Get current user info
- `POST /api/temporary-residence` - Submit temp residence
- `POST /api/complaints` - Submit complaint

## Security Notes

1. **Authentication**: All protected routes require valid JWT token
2. **Authorization**: Admin routes check user role via middleware
3. **Role Enforcement**: Public registration always creates 'citizen' role
4. **Frontend Guards**: PrivateRoute component prevents unauthorized access
5. **Backend Validation**: All admin endpoints verify user role server-side

## Testing Accounts

For testing purposes, you may need to create test accounts:

```sql
-- Admin account (created via seed or manual DB insert)
INSERT INTO "Users" (username, password, "fullName", email, role, "isActive", "createdAt", "updatedAt")
VALUES ('admin', '$hashed_password', 'System Admin', 'admin@example.com', 'admin', true, NOW(), NOW());

-- Team Leader account
INSERT INTO "Users" (username, password, "fullName", email, role, "isActive", "createdAt", "updatedAt")
VALUES ('teamleader', '$hashed_password', 'Team Leader', 'leader@example.com', 'team_leader', true, NOW(), NOW());

-- Citizen account (via registration form)
-- Just use the /register page to create a citizen account
```

## Troubleshooting

### User can't access admin pages
- Check user role in database
- Verify JWT token contains correct role
- Check browser console for errors

### Staff creation fails
- Ensure logged in user is admin or team_leader
- Check selected role is 'staff' or 'deputy_leader' only
- Verify username/email doesn't already exist

### Redirect loops after login
- Clear browser localStorage
- Check user role is valid
- Verify routing configuration in App.jsx
