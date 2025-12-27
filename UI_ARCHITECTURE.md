# UI Architecture Documentation

## Role-Based UI Separation

This document describes the new role-based UI architecture implemented in the system.

## User Roles

The system supports the following roles:
- **admin**: Full system administrator
- **team_leader**: Team/neighborhood leader
- **deputy_leader**: Deputy team leader
- **staff**: Staff member
- **resident**: Regular citizen/resident

## UI Flows

### Login Flow
```
┌─────────────┐
│ Login Page  │
│ (Shared)    │
└──────┬──────┘
       │
       ├─ Role: resident ────────────> /home (Resident Interface)
       │
       └─ Role: admin/team_leader ──> /admin/dashboard (Admin Interface)
          deputy_leader/staff
```

## Admin Interface (`/admin/*`)

### Layout: AdminLayout.jsx
```
┌────────────────────────────────────────────────────┐
│ AppBar: "Hệ thống Quản lý Dân cư - Quản lý"       │
│ User: [Name] (Role) | [Logout Menu]               │
├──────────────┬─────────────────────────────────────┤
│  Sidebar     │  Main Content Area                  │
│              │                                      │
│ ┌──────────┐│                                      │
│ │Dashboard ││                                      │
│ │Hộ khẩu   ││  Route-specific content loads here  │
│ │Nhân khẩu ││                                      │
│ │Tạm trú   ││                                      │
│ │Phản ánh  ││                                      │
│ │Báo cáo   ││                                      │
│ │Cán bộ *  ││  * Only for admin/team_leader       │
│ └──────────┘│                                      │
└──────────────┴─────────────────────────────────────┘
```

### Admin Dashboard Features
1. **Statistics Cards**
   - Total Households (Tổng số hộ)
   - Total Population (Tổng dân số)
   - Temporary Residents (Tạm trú)
   - Temporarily Absent (Tạm vắng)

2. **Charts**
   - **Bar Chart**: "Thống kê nhân khẩu theo độ tuổi - Tổ dân phố 7"
   - **Pie Chart**: Age distribution
   - **Bar Chart**: Gender distribution

3. **Alerts**
   - Expiring temporary residence permits (7 days)

### Population Management Features
- **Color Coding**:
  - 🟢 Green chip: Thường trú (Permanent residence)
  - 🟡 Yellow chip: Tạm trú (Temporary residence)
  - 🟠 Orange chip: Tạm vắng (Temporarily absent)
  
- **Visual Indicators**:
  - Grayed out rows for deceased/moved out persons
  - Red "Đã khai tử" chip for deceased
  - Yellow "Đã chuyển đi" chip for moved out

### Complaints Management Features
- **Status Filter Dropdown**:
  - Tất cả (All)
  - Đang chờ (Pending) - submitted
  - Đã tiếp nhận (Acknowledged)
  - Đã gửi lên cấp trên (Forwarded)
  - Đã xử lý (Processed/Answered)

### Staff Management (Admin/Team Leader Only)
- Create new staff accounts
- Role selection: staff or deputy_leader
- Deactivate staff accounts
- View last login time
- Track active/inactive status

## Resident Interface (`/home/*`)

### Layout: ResidentLayout.jsx
```
┌────────────────────────────────────────────────────┐
│ AppBar: "Cổng thông tin Dân cư"                   │
│ User: [Name] | [Logout Menu]                      │
├──────────────┬─────────────────────────────────────┤
│  Sidebar     │  Main Content Area                  │
│              │                                      │
│ ┌──────────┐│                                      │
│ │Trang chủ ││                                      │
│ │Dịch vụ   ││  Route-specific content loads here  │
│ │Phản ánh  ││                                      │
│ │Thông báo ││                                      │
│ └──────────┘│                                      │
└──────────────┴─────────────────────────────────────┘
```

### Resident Home Page
**Personal Information Card**
- Full name
- Date of birth
- Gender
- ID number (CCCD)
- Residence status

**Household Information Card**
- Household code
- Head of household
- Address
- Number of members

**Household Members List**
- Grid view of all household members
- Shows name, relationship, date of birth

**Quick Guide**
- Instructions for using online services
- How to submit complaints
- How to view notifications

### Online Services (Dịch vụ trực tuyến)
**Temporary Residence/Absence Form**
- Type selection: Tạm trú or Tạm vắng
- Start date and end date
- Reason for temporary residence/absence
- Current address (for tạm vắng)
- Additional notes

### Complaint Submission
**Simplified form for residents**
- Pre-filled with user information
- Title field
- Category selection
- Detailed description
- Contact information

### Notifications
**View announcements from management**
- Meeting schedules
- Fee collection notices
- Community events
- Marked as new/read
- Color-coded by type:
  - 🟠 Orange: Meetings
  - 🔴 Red: Fees
  - 🟢 Green: Events
  - 🔵 Blue: General announcements

## Route Protection

### Admin Routes
Protected by: `PrivateRoute` + `RoleBasedRoute(['admin', 'team_leader', 'deputy_leader', 'staff'])`

Routes:
- `/admin/dashboard` - Dashboard
- `/admin/households` - Household management
- `/admin/population` - Population management
- `/admin/complaints` - Complaint management
- `/admin/temporary-residence` - Temporary residence management
- `/admin/reports` - Reports
- `/admin/staff` - Staff management (admin/team_leader only)

### Resident Routes
Protected by: `PrivateRoute` + `RoleBasedRoute(['resident'])`

Routes:
- `/home` - Personal home page
- `/home/services` - Online services (temporary residence form)
- `/home/complaints` - Submit complaints
- `/home/notifications` - View notifications

### Public Routes
No protection:
- `/login` - Login page
- `/register` - Registration (creates 'resident' role only)

## Authentication Flow

1. User logs in at `/login`
2. Backend returns user data with role
3. AuthContext stores user data
4. Login page redirects based on role:
   - `resident` → `/home`
   - Others → `/admin/dashboard`
5. Protected routes check authentication and role
6. Unauthorized access redirects to appropriate home

## Backend Integration

### Public Endpoints
- `POST /api/auth/register` - Register as resident (role locked to 'resident')
- `POST /api/auth/login` - Login (returns role)

### Protected Endpoints
- `POST /api/auth/create-staff` - Create staff account (admin/team_leader only)
  - Requires: `auth` middleware
  - Requires: `authorize('admin', 'team_leader')` middleware
  - Allows role selection: 'staff' or 'deputy_leader'

## UI Components

### Shared Components
- `AuthContext.jsx` - Authentication state management
- `PrivateRoute.jsx` - Protected route wrapper
- Material-UI theme configuration

### Admin Components
- `AdminLayout.jsx` - Admin interface layout
- `Dashboard.jsx` - Enhanced with charts
- `Population.jsx` - Enhanced with color coding
- `Complaints.jsx` - Enhanced with filtering
- `Households.jsx` - Existing
- `StaffManagement.jsx` - New

### Resident Components
- `ResidentLayout.jsx` - Resident interface layout
- `ResidentHome.jsx` - Personal information display
- `TemporaryResidenceForm.jsx` - Service request form
- `ResidentComplaintForm.jsx` - Complaint submission
- `Notifications.jsx` - Notification viewer

## Design Guidelines

### Color Scheme
- Primary: `#0066CC` (Blue)
- Success: `#4CAF50` (Green) - Permanent residence
- Warning: `#FFC107` (Yellow) - Temporary residence
- Error: `#F44336` (Red)
- Info: `#2196F3` (Light Blue)

### Typography
- Headers: Bold, Blue (#0066CC)
- Body: Regular, Dark Gray
- Labels: Medium weight

### Cards
- Border radius: 12px
- Shadow: Subtle (0 2px 8px rgba(0,0,0,0.1))
- Padding: 24px

### Buttons
- Border radius: 8px
- Primary: Blue background
- Hover: Darker blue
- Text transform: None (preserves Vietnamese casing)
