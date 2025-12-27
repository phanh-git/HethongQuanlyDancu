import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import { temporaryResidenceService } from '../services';

const OnlineServices = () => {
  const [formData, setFormData] = useState({
    type: 'temporary_absence', // temporary_residence or temporary_absence
    startDate: '',
    endDate: '',
    reason: '',
    destination: '',
    contactPhone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      await temporaryResidenceService.create({
        ...formData,
        type: formData.type
      });
      
      setSuccess(
        formData.type === 'temporary_absence'
          ? 'Đã gửi khai báo tạm vắng thành công!'
          : 'Đã gửi khai báo tạm trú thành công!'
      );
      
      // Reset form
      setFormData({
        type: 'temporary_absence',
        startDate: '',
        endDate: '',
        reason: '',
        destination: '',
        contactPhone: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#0066CC', fontWeight: 'bold' }}>
        Dịch vụ trực tuyến
      </Typography>

      <Paper sx={{ p: 4, mt: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#0066CC' }}>
          Khai báo Tạm trú / Tạm vắng
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Vui lòng điền đầy đủ thông tin bên dưới để đăng ký tạm trú hoặc khai báo tạm vắng
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
              <FormControl fullWidth required>
                <InputLabel>Loại khai báo</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  label="Loại khai báo"
                  onChange={handleChange}
                >
                  <MenuItem value="temporary_absence">Tạm vắng</MenuItem>
                  <MenuItem value="temporary_residence">Tạm trú</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label={formData.type === 'temporary_absence' ? 'Ngày đi' : 'Ngày bắt đầu'}
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label={formData.type === 'temporary_absence' ? 'Ngày về dự kiến' : 'Ngày kết thúc'}
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label={
                  formData.type === 'temporary_absence'
                    ? 'Nơi đến (địa chỉ tạm vắng)'
                    : 'Địa chỉ tạm trú'
                }
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Lý do"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder={
                  formData.type === 'temporary_absence'
                    ? 'Ví dụ: Đi công tác, thăm người thân, du lịch...'
                    : 'Ví dụ: Công tác, học tập, chăm sóc người thân...'
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Số điện thoại liên hệ"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại để chúng tôi liên hệ khi cần"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: '#FFF3E0', borderRadius: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Lưu ý:</strong>
                  <ul style={{ marginTop: '8px', marginBottom: 0 }}>
                    <li>
                      {formData.type === 'temporary_absence'
                        ? 'Khai báo tạm vắng khi bạn rời khỏi nơi cư trú thường xuyên trong thời gian dài.'
                        : 'Khai báo tạm trú khi bạn lưu trú tại địa chỉ không phải nơi đăng ký thường trú.'}
                    </li>
                    <li>Thông tin của bạn sẽ được bảo mật và chỉ sử dụng cho mục đích quản lý dân cư.</li>
                    <li>Tổ dân phố sẽ xem xét và xác nhận đăng ký của bạn trong vòng 2-3 ngày làm việc.</li>
                  </ul>
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  bgcolor: '#0066CC',
                  '&:hover': { bgcolor: '#0052A3' }
                }}
              >
                {loading ? 'Đang gửi...' : 'Gửi khai báo'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Service Information */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#0066CC' }}>
          Các dịch vụ khác
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom fontWeight="bold">
            📋 Đăng ký thay đổi hộ khẩu
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Liên hệ trực tiếp với Tổ dân phố để được hỗ trợ thay đổi thông tin hộ khẩu.
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom fontWeight="bold">
            👶 Đăng ký khai sinh
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Liên hệ Phòng Tư pháp hoặc UBND phường để được hướng dẫn thủ tục.
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom fontWeight="bold">
            📞 Liên hệ
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Hotline Tổ dân phố 7: <strong>0123-456-789</strong>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default OnlineServices;
