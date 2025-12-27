import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { complaintService } from '../services';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaints, setSelectedComplaints] = useState([]);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', note: '', resolution: '' });
  const navigate = useNavigate();

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const data = await complaintService.getAll({});
      setComplaints(data.complaints);
    } catch (error) {
      console.error('Error loading complaints:', error);
    }
  };

  const handleMerge = async () => {
    if (selectedComplaints.length < 2) {
      alert('Vui lòng chọn ít nhất 2 kiến nghị để gộp');
      return;
    }

    try {
      await complaintService.merge({
        complaintIds: selectedComplaints,
        mainComplaintId: selectedComplaints[0]
      });
      setMergeDialogOpen(false);
      setSelectedComplaints([]);
      loadComplaints();
    } catch (error) {
      console.error('Error merging complaints:', error);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await complaintService.updateStatus(selectedComplaint, statusUpdate);
      setStatusDialogOpen(false);
      loadComplaints();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      received: 'Tiếp nhận',
      in_progress: 'Đang xử lý',
      resolved: 'Đã giải quyết',
      rejected: 'Từ chối'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      received: 'info',
      in_progress: 'warning',
      resolved: 'success',
      rejected: 'error'
    };
    return colors[status] || 'default';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      environment: 'Môi trường',
      security: 'An ninh',
      infrastructure: 'Cơ sở hạ tầng',
      social: 'Xã hội',
      other: 'Khác'
    };
    return labels[category] || category;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: '#0066CC', fontWeight: 'bold' }}>
          Quản lý Phản ánh & Kiến nghị
        </Typography>
        <Box>
          {selectedComplaints.length > 0 && (
            <Button
              variant="outlined"
              onClick={() => setMergeDialogOpen(true)}
              sx={{ mr: 2 }}
            >
              Gộp kiến nghị ({selectedComplaints.length})
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/complaints/new')}
            sx={{ bgcolor: '#0066CC', '&:hover': { bgcolor: '#0052A3' } }}
          >
            Tạo phiếu
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#E3F2FD' }}>
                <TableCell padding="checkbox"></TableCell>
                <TableCell><strong>Mã phiếu</strong></TableCell>
                <TableCell><strong>Tiêu đề</strong></TableCell>
                <TableCell><strong>Phân loại</strong></TableCell>
                <TableCell><strong>Người gửi</strong></TableCell>
                <TableCell><strong>Trạng thái</strong></TableCell>
                <TableCell><strong>Ngày tạo</strong></TableCell>
                <TableCell align="center"><strong>Thao tác</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint._id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedComplaints.includes(complaint._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedComplaints([...selectedComplaints, complaint._id]);
                        } else {
                          setSelectedComplaints(
                            selectedComplaints.filter((id) => id !== complaint._id)
                          );
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{complaint.complaintCode}</TableCell>
                  <TableCell>{complaint.title}</TableCell>
                  <TableCell>{getCategoryLabel(complaint.category)}</TableCell>
                  <TableCell>
                    {complaint.submittedBy?.length > 1
                      ? `${complaint.submittedBy[0]?.fullName} +${complaint.submittedBy.length - 1}`
                      : complaint.submittedBy[0]?.fullName}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(complaint.status)}
                      color={getStatusColor(complaint.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(complaint.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedComplaint(complaint._id);
                        setStatusUpdate({ status: complaint.status, note: '', resolution: '' });
                        setStatusDialogOpen(true);
                      }}
                    >
                      Cập nhật
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Merge Dialog */}
      <Dialog open={mergeDialogOpen} onClose={() => setMergeDialogOpen(false)}>
        <DialogTitle>Gộp kiến nghị</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn gộp {selectedComplaints.length} kiến nghị đã chọn?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMergeDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleMerge} variant="contained" color="primary">
            Gộp
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cập nhật trạng thái</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusUpdate.status}
              label="Trạng thái"
              onChange={(e) =>
                setStatusUpdate({ ...statusUpdate, status: e.target.value })
              }
            >
              <MenuItem value="received">Tiếp nhận</MenuItem>
              <MenuItem value="in_progress">Đang xử lý</MenuItem>
              <MenuItem value="resolved">Đã giải quyết</MenuItem>
              <MenuItem value="rejected">Từ chối</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Ghi chú"
            value={statusUpdate.note}
            onChange={(e) => setStatusUpdate({ ...statusUpdate, note: e.target.value })}
            sx={{ mt: 2 }}
          />
          {statusUpdate.status === 'resolved' && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Kết quả xử lý"
              value={statusUpdate.resolution}
              onChange={(e) =>
                setStatusUpdate({ ...statusUpdate, resolution: e.target.value })
              }
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleUpdateStatus} variant="contained" color="primary">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Complaints;
