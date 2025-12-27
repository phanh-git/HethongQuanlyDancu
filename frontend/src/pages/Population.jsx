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
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';
import { Add as AddIcon, Visibility, Edit } from '@mui/icons-material';
import { populationService } from '../services';
import { RESIDENCE_COLORS } from '../constants';

const Population = () => {
  const [population, setPopulation] = useState([]);
  const [search, setSearch] = useState('');
  const [residenceStatus, setResidenceStatus] = useState('');
  const [gender, setGender] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadPopulation();
  }, [page, search, residenceStatus, gender]);

  const loadPopulation = async () => {
    try {
      setLoading(true);
      const data = await populationService.getAll({
        page,
        search,
        residenceStatus,
        gender,
        limit: 10
      });
      setPopulation(data.population);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error loading population:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResidenceStatusLabel = (status) => {
    const labels = {
      permanent: 'Thường trú',
      temporary: 'Tạm trú',
      temporarily_absent: 'Tạm vắng'
    };
    return labels[status] || status;
  };

  const getResidenceStatusColor = (status) => {
    return RESIDENCE_COLORS[status] || 'default';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: '#0066CC', fontWeight: 'bold' }}>
          Quản lý Nhân khẩu
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/population/new')}
          sx={{ bgcolor: '#0066CC', '&:hover': { bgcolor: '#0052A3' } }}
        >
          Thêm nhân khẩu
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            label="Thường trú" 
            sx={{ bgcolor: RESIDENCE_COLORS.permanent, color: 'white' }} 
            size="small"
          />
          <Chip 
            label="Tạm trú" 
            sx={{ bgcolor: RESIDENCE_COLORS.temporary, color: 'black' }} 
            size="small"
          />
          <Chip 
            label="Tạm vắng" 
            sx={{ bgcolor: RESIDENCE_COLORS.temporarily_absent, color: 'white' }} 
            size="small"
          />
        </Box>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tìm kiếm theo tên hoặc CMND/CCCD"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Diện</InputLabel>
              <Select
                value={residenceStatus}
                label="Diện"
                onChange={(e) => {
                  setResidenceStatus(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="permanent">Thường trú</MenuItem>
                <MenuItem value="temporary">Tạm trú</MenuItem>
                <MenuItem value="temporarily_absent">Tạm vắng</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Giới tính</InputLabel>
              <Select
                value={gender}
                label="Giới tính"
                onChange={(e) => {
                  setGender(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="male">Nam</MenuItem>
                <MenuItem value="female">Nữ</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#E3F2FD' }}>
                <TableCell><strong>Họ và tên</strong></TableCell>
                <TableCell><strong>Ngày sinh</strong></TableCell>
                <TableCell><strong>Giới tính</strong></TableCell>
                <TableCell><strong>CMND/CCCD</strong></TableCell>
                <TableCell><strong>Mã hộ</strong></TableCell>
                <TableCell><strong>Diện</strong></TableCell>
                <TableCell align="center"><strong>Thao tác</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {population.map((person) => {
                const isDeceased = person.status === 'deceased';
                const isMovedOut = person.status === 'moved_out';
                const isInactive = isDeceased || isMovedOut;
                
                return (
                  <TableRow 
                    key={person._id} 
                    hover
                    sx={{
                      opacity: isInactive ? 0.5 : 1,
                      bgcolor: isInactive ? '#F5F5F5' : 'transparent'
                    }}
                  >
                    <TableCell>
                      {person.fullName}
                      {isDeceased && <Chip label="Đã khai tử" color="error" size="small" sx={{ ml: 1 }} />}
                      {isMovedOut && <Chip label="Đã chuyển đi" color="warning" size="small" sx={{ ml: 1 }} />}
                    </TableCell>
                    <TableCell>
                      {new Date(person.dateOfBirth).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      {person.gender === 'male' ? 'Nam' : person.gender === 'female' ? 'Nữ' : 'Khác'}
                    </TableCell>
                    <TableCell>{person.idNumber || 'N/A'}</TableCell>
                    <TableCell>{person.household?.householdCode || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        label={getResidenceStatusLabel(person.residenceStatus)}
                        sx={{
                          bgcolor: RESIDENCE_COLORS[person.residenceStatus],
                          color: person.residenceStatus === 'temporary' ? 'black' : 'white'
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/population/${person._id}`)}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/population/${person._id}/edit`)}
                      >
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {population.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
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

export default Population;
