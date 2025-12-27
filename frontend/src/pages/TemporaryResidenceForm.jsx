import React, { useState } from 'react';
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
import { Send as SendIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { temporaryResidenceService } from '../services';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';

const TemporaryResidenceForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: 'temporary_stay',
    startDate: '',
    endDate: '',
    reason: '',
    currentAddress: '',
    notes: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await temporaryResidenceService.create({
        ...formData,
        personId: user.id
      });
      setSuccess(true);
      setFormData({
        type: 'temporary_stay',
        startDate: '',
        endDate: '',
        reason: '',
        currentAddress: '',
        notes: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || ERROR_MESSAGES.GENERIC_ERROR);
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
          Khai báo Tạm trú / Tạm vắng
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Vui lòng điền đầy đủ thông tin bên dưới
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Gửi khai báo thành công! Đơn của bạn đang được xử lý.
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
              <FormControl fullWidth required>
                <InputLabel>Loại khai báo</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  label="Loại khai báo"
                  onChange={handleChange}
                >
                  <MenuItem value="temporary_stay">Tạm trú</MenuItem>
                  <MenuItem value="temporary_absence">Tạm vắng</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                name="startDate"
                label="Ngày bắt đầu"
                value={formData.startDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                name="endDate"
                label="Ngày kết thúc (dự kiến)"
                value={formData.endDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {formData.type === 'temporary_absence' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  name="currentAddress"
                  label="Nơi đến (địa chỉ tạm vắng)"
                  value={formData.currentAddress}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="reason"
                label="Lý do"
                value={formData.reason}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Ví dụ: Công tác, du học, thăm thân..."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="notes"
                label="Ghi chú thêm (nếu có)"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => setFormData({
                    type: 'temporary_stay',
                    startDate: '',
                    endDate: '',
                    reason: '',
                    currentAddress: '',
                    notes: ''
                  })}
                >
                  Nhập lại
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SendIcon />}
                  disabled={loading}
                  sx={{ bgcolor: '#0066CC', '&:hover': { bgcolor: '#0052A3' } }}
                >
                  {loading ? 'Đang gửi...' : 'Gửi khai báo'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        <Box sx={{ mt: 4, p: 2, bgcolor: '#F5F5F5', borderRadius: 1 }}>
          <Typography variant="body2" fontWeight="medium" gutterBottom>
            Lưu ý:
          </Typography>
          <Typography variant="body2" paragraph>
            • Khai báo tạm trú: Dành cho người từ nơi khác đến tạm trú tại địa phương
          </Typography>
          <Typography variant="body2">
            • Khai báo tạm vắng: Dành cho người thường trú tại địa phương nhưng tạm thời đi vắng
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default TemporaryResidenceForm;
