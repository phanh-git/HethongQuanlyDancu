import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';
import api from '../services/api';

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    submitterName: '',
    submitterPhone: '',
    submitterAddress: '',
    categoryId: '',
    title: '',
    description: '',
    submissionDate: new Date().toISOString().split('T')[0]
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.get('/complaints/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate CAPTCHA
    const recaptchaValue = recaptchaRef.current?.getValue();
    if (!recaptchaValue) {
      setError('Vui lòng xác minh bạn không phải là robot');
      return;
    }

    setLoading(true);

    try {
      await api.post('/complaints', formData);

      setSuccess('Phản ánh của bạn đã được gửi thành công! Chúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất.');
      
      // Reset form
      setFormData({
        submitterName: '',
        submitterPhone: '',
        submitterAddress: '',
        categoryId: '',
        title: '',
        description: '',
        submissionDate: new Date().toISOString().split('T')[0]
      });
      recaptchaRef.current?.reset();

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gửi phản ánh thất bại. Vui lòng thử lại.');
      recaptchaRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ color: '#0066CC', fontWeight: 'bold' }}
        >
          Gửi phản ánh - kiến nghị
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 4 }}>
          Vui lòng điền đầy đủ thông tin để gửi phản ánh đến tổ trưởng
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
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Họ và tên người phản ánh"
                name="submitterName"
                required
                value={formData.submitterName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                name="submitterPhone"
                value={formData.submitterPhone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ngày phản ánh"
                name="submissionDate"
                type="date"
                required
                value={formData.submissionDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                name="submitterAddress"
                value={formData.submitterAddress}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Phân loại</InputLabel>
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  label="Phân loại"
                  onChange={handleChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiêu đề"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nội dung phản ánh"
                name="description"
                required
                multiline
                rows={6}
                value={formData.description}
                onChange={handleChange}
                placeholder="Mô tả chi tiết nội dung phản ánh của bạn..."
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || (import.meta.env.DEV ? '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' : '')}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                bgcolor: '#0066CC',
                '&:hover': { bgcolor: '#0052A3' }
              }}
            >
              {loading ? 'Đang gửi...' : 'Gửi phản ánh'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ComplaintForm;
