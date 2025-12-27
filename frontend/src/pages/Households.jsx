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
  TextField,
  Typography,
  Box,
  Chip,
  IconButton,
  Pagination
} from '@mui/material';
import { Add as AddIcon, Visibility, Edit } from '@mui/icons-material';
import { householdService } from '../services';

const Households = () => {
  const [households, setHouseholds] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadHouseholds();
  }, [page, search]);

  const loadHouseholds = async () => {
    try {
      setLoading(true);
      const data = await householdService.getAll({ page, search, limit: 10 });
      setHouseholds(data.households);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error loading households:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: '#0066CC', fontWeight: 'bold' }}>
          Quản lý Hộ khẩu
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/households/new')}
          sx={{ bgcolor: '#0066CC', '&:hover': { bgcolor: '#0052A3' } }}
        >
          Thêm hộ khẩu
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          label="Tìm kiếm theo mã hộ hoặc số nhà"
          value={search}
          onChange={handleSearch}
          sx={{ mb: 2 }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#E3F2FD' }}>
                <TableCell><strong>Mã hộ</strong></TableCell>
                <TableCell><strong>Chủ hộ</strong></TableCell>
                <TableCell><strong>Số nhà</strong></TableCell>
                <TableCell><strong>Địa chỉ</strong></TableCell>
                <TableCell><strong>Số thành viên</strong></TableCell>
                <TableCell align="center"><strong>Thao tác</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {households.map((household) => (
                <TableRow key={household._id} hover>
                  <TableCell>{household.householdCode}</TableCell>
                  <TableCell>{household.householdHead?.fullName || 'N/A'}</TableCell>
                  <TableCell>{household.address.houseNumber}</TableCell>
                  <TableCell>
                    {household.address.street && `${household.address.street}, `}
                    {household.address.ward}
                  </TableCell>
                  <TableCell>
                    <Chip label={household.members?.length || 0} color="primary" size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/households/${household._id}`)}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/households/${household._id}/edit`)}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {households.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Households;
