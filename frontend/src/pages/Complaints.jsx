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
      submitted: 'Đã phản ánh',
      acknowledged: 'Đã tiếp nhận',
      forwarded: 'Đã gửi lên cấp trên',
      answered: 'Đã có câu trả lời'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      submitted: 'default',
      acknowledged: 'info',
      forwarded: 'warning',
      answered: 'success'
    };
    return colors[status] || 'default';
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
                <TableRow key={complaint.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedComplaints.includes(complaint.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedComplaints([...selectedComplaints, complaint.id]);
                        } else {
                          setSelectedComplaints(
                            selectedComplaints.filter((id) => id !== complaint.id)
                          );
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{complaint.complaintCode}</TableCell>
                  <TableCell>{complaint.title}</TableCell>
                  <TableCell>{complaint.category?.name || 'N/A'}</TableCell>
                  <TableCell>{complaint.submitterName}</TableCell>
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
                        setSelectedComplaint(complaint.id);
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
              <MenuItem value="submitted">Đã phản ánh</MenuItem>
              <MenuItem value="acknowledged">Đã tiếp nhận</MenuItem>
              <MenuItem value="forwarded">Đã gửi lên cấp trên</MenuItem>
              <MenuItem value="answered">Đã có câu trả lời</MenuItem>
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
          {statusUpdate.status === 'answered' && (
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
