# Role-Based UI Implementation

## Overview
This document describes the implementation of role-based user interface separation for the Population Management System.

## Changes Made

### Backend Changes

#### 1. Admin Controller (`backend/controllers/adminController.js`)
New controller for managing staff accounts:
- `createStaffAccount`: Create new staff/deputy_leader accounts (admin/team_leader only)
- `getStaffList`: Get list of all staff members with filtering
- `updateStaffStatus`: Activate/deactivate staff accounts
- `updateStaffInfo`: Update staff information

#### 2. Admin Routes (`backend/routes/admin.js`)
New route file for admin endpoints:
- `POST /api/admin/create-staff`: Create staff account (requires admin/team_leader role)
- `GET /api/admin/staff`: Get staff list (requires admin/team_leader role)
- `PUT /api/admin/staff/:id/status`: Update staff status (requires admin/team_leader role)
- `PUT /api/admin/staff/:id`: Update staff info (requires admin/team_leader role)

All routes are protected by authentication and role-based authorization middleware.

#### 3. Auth Controller Update
Modified `register` endpoint to force role to be 'citizen' for public registration:
```javascript
// Always set to citizen for public registration
role: 'citizen'
```

This prevents privilege escalation through the public registration endpoint.

#### 4. Server Configuration
Added admin routes to server:
```javascript
app.use('/api/admin', require('./routes/admin'));
```

### Frontend Changes

#### 1. New Layouts

**AdminLayout** (`frontend/src/components/AdminLayout.jsx`)
- Sidebar navigation for admin/staff users
- Menu items: Dashboard, Households, Population, Temporary Residence, Complaints, Reports
- Staff Management menu (only visible for admin/team_leader)
- Role-based header display

**ResidentLayout** (`frontend/src/components/ResidentLayout.jsx`)
- Sidebar navigation for residents
- Menu items: Home, Online Services, Submit Complaint, Notifications
- Simplified interface focused on citizen services

#### 2. New Pages

**ResidentHome** (`frontend/src/pages/ResidentHome.jsx`)
- Displays personal information
- Shows household information and family members
- Quick access cards for common services

**OnlineServices** (`frontend/src/pages/OnlineServices.jsx`)
- Form for declaring temporary residence/absence
- Fields: type, start date, end date, destination, reason, contact phone
- Service information section

**Notifications** (`frontend/src/pages/Notifications.jsx`)
- Mock notification system
- Displays announcements from the neighborhood committee
- Visual indicators for read/unread status

**StaffManagement** (`frontend/src/pages/StaffManagement.jsx`)
- Admin interface for managing staff accounts
- Create new staff/deputy_leader accounts
- Activate/deactivate staff members
- Search and filter functionality

#### 3. Updated Components

**App.jsx**
- Restructured routing with separate sections for admin and resident
- Admin routes under `/admin/*`
- Resident routes under `/*`
- Role-based route protection

**PrivateRoute.jsx**
- Enhanced with role-based access control
- Accepts `allowedRoles` prop
- Redirects users to appropriate dashboard based on their role

**Login.jsx**
- Added role-based redirect after login
- Citizens redirect to `/home`
- Admin/staff redirect to `/admin/dashboard`

#### 4. Services

**adminService** (`frontend/src/services/index.js`)
- `createStaff`: Create new staff account
- `getStaffList`: Get list of staff members
- `updateStaffStatus`: Toggle staff active status
- `updateStaffInfo`: Update staff information

## User Flows

### 1. Login Flow
1. User enters credentials
2. System validates and returns user data with role
3. Frontend redirects based on role:
   - `citizen` → `/home`
   - `admin`, `team_leader`, `deputy_leader`, `staff` → `/admin/dashboard`

### 2. Registration Flow
1. User fills registration form
2. Role is automatically set to 'citizen'
3. User redirected to login page
4. After login, redirected to resident dashboard

### 3. Staff Creation Flow (Admin Only)
1. Admin navigates to Staff Management
2. Clicks "Create Account"
3. Fills form with staff details
4. Selects role (staff or deputy_leader)
5. Staff account created and appears in list

### 4. Resident Services Flow
1. Resident logs in and sees home dashboard
2. Navigates to "Online Services"
3. Fills temporary residence/absence form
4. Submits declaration
5. Notification sent to admin for review

## Security Features

### Role-Based Access Control
1. **Backend Middleware**: All admin routes protected by `authorize()` middleware
2. **Frontend Guards**: PrivateRoute component checks user role
3. **Forced Role Assignment**: Public registration always creates 'citizen' role

### Role Hierarchy
- `admin`: Full system access
- `team_leader`: Staff management + all features
- `deputy_leader`: All features except staff management
- `staff`: Standard administrative features
- `citizen`: Personal dashboard and services only

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Build Test
```bash
cd frontend
npm run build
```

### Manual Testing Checklist
- [ ] Login as citizen → redirects to /home
- [ ] Login as admin → redirects to /admin/dashboard
- [ ] Register new account → creates citizen role
- [ ] Admin can create staff account
- [ ] Admin can activate/deactivate staff
- [ ] Resident can submit temporary residence declaration
- [ ] Resident can view notifications
- [ ] Role-based menu visibility works correctly

## Future Enhancements

1. **Notification System**
   - Backend API for notifications
   - Real-time updates using WebSocket
   - Email notifications

2. **Household Information API**
   - Backend endpoint to get household by user
   - Display actual household data in resident home

3. **Temporary Residence Processing**
   - Admin review workflow
   - Status tracking
   - Approval/rejection system

4. **Audit Logging**
   - Track staff account changes
   - Log administrative actions
   - Compliance reporting

## Migration Notes

### Existing Users
- Existing admin/staff accounts work with new routing
- Citizens need to be redirected to new layout
- No database migration required

### Breaking Changes
- Old route structure replaced with role-based routes
- Direct navigation to `/` now requires role check
- Bookmark updates may be needed

## Support

For questions or issues, contact the development team.
