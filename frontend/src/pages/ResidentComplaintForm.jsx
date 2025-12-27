import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid
} from '@mui/material';
import { Send as SendIcon } from '@mui/material/icons';
import { useAuth } from '../context/AuthContext';
import { complaintService } from '../services';

const ResidentComplaintForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    submitterName: user?.fullName || '',
    submitterPhone: user?.phone || '',
    submitterEmail: user?.email || ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 1, name: 'Vệ sinh môi trường' },
    { id: 2, name: 'An ninh trật tự' },
    { id: 3, name: 'Hạ tầng cơ sở' },
    { id: 4, name: 'Dịch vụ công' },
    { id: 5, name: 'Khác' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await complaintService.create({
        ...formData,
        categoryId: parseInt(formData.category)
      });
      setSuccess(true);
      setFormData({
        title: '',
        category: '',
        description: '',
        submitterName: user?.fullName || '',
        submitterPhone: user?.phone || '',
        submitterEmail: user?.email || ''
      });

      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#0066CC', fontWeight: 'bold' }}>
          Gửi Phản ánh / Kiến nghị
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Gửi ý kiến, phản ánh, kiến nghị của bạn đến Ban quản lý tổ dân phố
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Gửi phản ánh thành công! Cảm ơn bạn đã đóng góp ý kiến. Chúng tôi sẽ xem xét và phản hồi sớm nhất.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="title"
                label="Tiêu đề"
                value={formData.title}
                onChange={handleChange}
                placeholder="Nhập tiêu đề ngắn gọn cho phản ánh của bạn"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Phân loại</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Phân loại"
                  onChange={handleChange}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="description"
                label="Nội dung chi tiết"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={6}
                placeholder="Mô tả chi tiết vấn đề bạn muốn phản ánh..."
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="submitterName"
                label="Họ và tên"
                value={formData.submitterName}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="submitterPhone"
                label="Số điện thoại"
                value={formData.submitterPhone}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="submitterEmail"
                label="Email (không bắt buộc)"
                type="email"
                value={formData.submitterEmail}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => navigate('/home')}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SendIcon />}
                  disabled={loading}
                  sx={{ bgcolor: '#0066CC', '&:hover': { bgcolor: '#0052A3' } }}
                >
                  {loading ? 'Đang gửi...' : 'Gửi phản ánh'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        <Box sx={{ mt: 4, p: 2, bgcolor: '#E3F2FD', borderRadius: 1 }}>
          <Typography variant="body2" fontWeight="medium" gutterBottom>
            Lưu ý:
          </Typography>
          <Typography variant="body2">
            • Phản ánh của bạn sẽ được gửi trực tiếp đến Ban quản lý tổ dân phố
            <br />
            • Chúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất
            <br />
            • Vui lòng cung cấp thông tin chính xác để chúng tôi có thể liên hệ khi cần thiết
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResidentComplaintForm;
