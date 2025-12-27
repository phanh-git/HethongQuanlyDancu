import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Typography,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import { Add as AddIcon, Edit, Block, CheckCircle } from '@mui/icons-material';
import { adminService } from '../services';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'staff'
  });

  useEffect(() => {
    loadStaff();
  }, [search]);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const data = await adminService.getStaffList({ search });
      setStaff(data.staff);
    } catch (error) {
      console.error('Error loading staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      username: '',
      password: '',
      fullName: '',
      email: '',
      phone: '',
      role: 'staff'
    });
    setError('');
    setSuccess('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await adminService.createStaff(formData);
      setSuccess('Tạo tài khoản cán bộ thành công!');
      setTimeout(() => {
        handleCloseDialog();
        loadStaff();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    if (window.confirm(`Bạn có chắc chắn muốn ${currentStatus ? 'vô hiệu hóa' : 'kích hoạt'} tài khoản này?`)) {
      try {
        await adminService.updateStaffStatus(id, { isActive: !currentStatus });
        loadStaff();
      } catch (error) {
        console.error('Error updating status:', error);
        alert('Có lỗi xảy ra khi cập nhật trạng thái');
      }
    }
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Quản trị viên',
      team_leader: 'Tổ trưởng',
      deputy_leader: 'Phó tổ trưởng',
      staff: 'Cán bộ'
    };
    return labels[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'error',
      team_leader: 'success',
      deputy_leader: 'info',
      staff: 'default'
    };
    return colors[role] || 'default';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: '#0066CC', fontWeight: 'bold' }}>
          Quản lý Cán bộ
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ bgcolor: '#0066CC', '&:hover': { bgcolor: '#0052A3' } }}
        >
          Tạo tài khoản
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          label="Tìm kiếm theo tên, username hoặc email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#E3F2FD' }}>
                <TableCell><strong>Username</strong></TableCell>
                <TableCell><strong>Họ và tên</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Vai trò</strong></TableCell>
                <TableCell><strong>Trạng thái</strong></TableCell>
                <TableCell align="center"><strong>Thao tác</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell>{member.username}</TableCell>
                  <TableCell>{member.fullName}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleLabel(member.role)}
                      color={getRoleColor(member.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={member.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
                      color={member.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color={member.isActive ? 'error' : 'success'}
                      onClick={() => handleToggleStatus(member.id, member.isActive)}
                      title={member.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                    >
                      {member.isActive ? <Block /> : <CheckCircle />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {staff.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create Staff Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Tạo tài khoản cán bộ</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Họ và tên"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Tên đăng nhập"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Mật khẩu"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  inputProps={{ minLength: 6 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Vai trò</InputLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    label="Vai trò"
                    onChange={handleChange}
                  >
                    <MenuItem value="staff">Cán bộ</MenuItem>
                    <MenuItem value="deputy_leader">Phó tổ trưởng</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!!success}
          >
            Tạo tài khoản
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StaffManagement;
