// User Roles
export const ROLES = {
  ADMIN: 'admin',
  TEAM_LEADER: 'team_leader',
  DEPUTY_LEADER: 'deputy_leader',
  STAFF: 'staff',
  RESIDENT: 'resident'
};

// Role Groups
export const ROLE_GROUPS = {
  MANAGEMENT: ['admin', 'team_leader', 'deputy_leader', 'staff'],
  ADMIN_ONLY: ['admin', 'team_leader'],
  RESIDENTS: ['resident']
};

// Helper function to check if user has management role
export const isManagementRole = (role) => {
  return ROLE_GROUPS.MANAGEMENT.includes(role);
};

// Helper function to check if user has admin privileges
export const isAdminRole = (role) => {
  return ROLE_GROUPS.ADMIN_ONLY.includes(role);
};

// Helper function to check if user is resident
export const isResidentRole = (role) => {
  return role === ROLES.RESIDENT;
};

// Get redirect path based on role
export const getRedirectPath = (role) => {
  if (isManagementRole(role)) {
    return '/admin/dashboard';
  }
  return '/home';
};

// Error Messages
export const ERROR_MESSAGES = {
  LOGIN_FAILED: 'Đăng nhập thất bại',
  REGISTRATION_FAILED: 'Đăng ký thất bại',
  GENERIC_ERROR: 'Có lỗi xảy ra. Vui lòng thử lại.',
  UNAUTHORIZED: 'Bạn không có quyền truy cập chức năng này',
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối của bạn.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: 'Đăng ký thành công!',
  SUBMISSION_SUCCESS: 'Gửi thành công!',
  UPDATE_SUCCESS: 'Cập nhật thành công!',
  DELETE_SUCCESS: 'Xóa thành công!'
};

// Residence Status
export const RESIDENCE_STATUS = {
  PERMANENT: 'permanent',
  TEMPORARY: 'temporary',
  TEMPORARILY_ABSENT: 'temporarily_absent'
};

// Residence Status Colors
export const RESIDENCE_COLORS = {
  permanent: '#4CAF50', // Green
  temporary: '#FFC107', // Yellow
  temporarily_absent: '#FF9800' // Orange
};

// Complaint Status
export const COMPLAINT_STATUS = {
  SUBMITTED: 'submitted',
  ACKNOWLEDGED: 'acknowledged',
  FORWARDED: 'forwarded',
  ANSWERED: 'answered'
};

export default {
  ROLES,
  ROLE_GROUPS,
  isManagementRole,
  isAdminRole,
  isResidentRole,
  getRedirectPath,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  RESIDENCE_STATUS,
  RESIDENCE_COLORS,
  COMPLAINT_STATUS
};
