import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(credentials);
      
      // Redirect based on user role
      if (userData.role === 'admin' || userData.role === 'team_leader' || userData.role === 'deputy_leader' || userData.role === 'staff') {
        navigate('/admin/dashboard');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper sx={{ p: 4, width: '100%' }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ color: '#0066CC', fontWeight: 'bold' }}
          >
            Hệ thống Quản lý Dân cư
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 3 }}>
            Đăng nhập để tiếp tục
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Tên đăng nhập"
              margin="normal"
              required
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Mật khẩu"
              type="password"
              margin="normal"
              required
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                bgcolor: '#0066CC',
                '&:hover': { bgcolor: '#0052A3' }
              }}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Chưa có tài khoản?{' '}
              <Link to="/register" style={{ color: '#0066CC', textDecoration: 'none' }}>
                Đăng ký ngay
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
