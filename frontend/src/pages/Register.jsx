import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid
} from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    citizenIdentificationCard: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    // Validate CAPTCHA
    const recaptchaValue = recaptchaRef.current?.getValue();
    if (!recaptchaValue) {
      setError('Vui lòng xác minh bạn không phải là robot');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        citizenIdentificationCard: formData.citizenIdentificationCard,
        username: formData.username,
        password: formData.password,
        email: formData.email,
        phone: formData.phone,
        role: 'citizen'
      });

      setSuccess('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
      recaptchaRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Paper sx={{ p: 4, width: '100%' }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ color: '#0066CC', fontWeight: 'bold' }}
          >
            Đăng ký tài khoản
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 3 }}>
            Tạo tài khoản để sử dụng dịch vụ
          </Typography>

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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ngày sinh"
                  name="dateOfBirth"
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số CCCD"
                  name="citizenIdentificationCard"
                  required
                  value={formData.citizenIdentificationCard}
                  onChange={handleChange}
                  inputProps={{
                    minLength: 9,
                    maxLength: 12
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
                  label="Tên đăng nhập"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mật khẩu"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  inputProps={{
                    minLength: 6
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                />
              </Grid>
            </Grid>

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
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Đã có tài khoản?{' '}
                <Link to="/login" style={{ color: '#0066CC', textDecoration: 'none' }}>
                  Đăng nhập
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
