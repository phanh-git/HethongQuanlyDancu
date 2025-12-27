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
  Typography,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Block as BlockIcon } from '@mui/icons-material';
import api from '../services/api';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    role: 'staff'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      // Get all users with staff roles
      const response = await api.get('/auth/me');
      // In a real implementation, we would have a proper endpoint to list all staff
      // For now, we'll use a mock list
      setStaff([
        {
          id: 1,
          username: 'staff01',
          fullName: 'Nguyễn Văn A',
          email: 'staff01@example.com',
          role: 'staff',
          isActive: true,
          lastLogin: '2024-12-20'
        },
        {
          id: 2,
          username: 'deputy01',
          fullName: 'Trần Thị B',
          email: 'deputy01@example.com',
          role: 'deputy_leader',
          isActive: true,
          lastLogin: '2024-12-22'
        }
      ]);
    } catch (error) {
      console.error('Error loading staff:', error);
    }
  };

  const handleCreateStaff = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/auth/create-staff', formData);
      setSuccess('Tạo tài khoản cán bộ thành công!');
      setDialogOpen(false);
      setFormData({
        username: '',
        password: '',
        fullName: '',
        email: '',
        role: 'staff'
      });
      loadStaff();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateStaff = async (staffId) => {
    if (!window.confirm('Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?')) {
      return;
    }

    try {
      await api.put(`/auth/users/${staffId}`, { isActive: false });
      setSuccess('Vô hiệu hóa tài khoản thành công!');
      loadStaff();
    } catch (err) {
      setError('Có lỗi xảy ra khi vô hiệu hóa tài khoản.');
    }
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Quản trị viên',
      team_leader: 'Tổ trưởng',
      deputy_leader: 'Tổ phó',
      staff: 'Cán bộ',
      resident: 'Người dân'
    };
    return labels[role] || role;
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
          onClick={() => setDialogOpen(true)}
          sx={{ bgcolor: '#0066CC', '&:hover': { bgcolor: '#0052A3' } }}
        >
          Thêm cán bộ
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#E3F2FD' }}>
                <TableCell><strong>Tên đăng nhập</strong></TableCell>
                <TableCell><strong>Họ và tên</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Vai trò</strong></TableCell>
                <TableCell><strong>Trạng thái</strong></TableCell>
                <TableCell><strong>Đăng nhập gần nhất</strong></TableCell>
                <TableCell align="center"><strong>Thao tác</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staff.map((person) => (
                <TableRow key={person.id} hover>
                  <TableCell>{person.username}</TableCell>
                  <TableCell>{person.fullName}</TableCell>
                  <TableCell>{person.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleLabel(person.role)}
                      color={person.role === 'staff' ? 'default' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={person.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
                      color={person.isActive ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {person.lastLogin ? new Date(person.lastLogin).toLocaleDateString('vi-VN') : 'Chưa đăng nhập'}
                  </TableCell>
                  <TableCell align="center">
                    {person.isActive && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeactivateStaff(person.id)}
                        title="Vô hiệu hóa"
                      >
                        <BlockIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {staff.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Chưa có cán bộ nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create Staff Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tạo tài khoản cán bộ mới</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Tên đăng nhập"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Mật khẩu"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Họ và tên"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={formData.role}
                label="Vai trò"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="staff">Cán bộ</MenuItem>
                <MenuItem value="deputy_leader">Tổ phó</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleCreateStaff}
            variant="contained"
            disabled={loading || !formData.username || !formData.password || !formData.fullName || !formData.email}
            sx={{ bgcolor: '#0066CC', '&:hover': { bgcolor: '#0052A3' } }}
          >
            {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StaffManagement;
