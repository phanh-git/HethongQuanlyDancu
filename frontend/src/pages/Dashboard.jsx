import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { dashboardService } from '../services';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonOffIcon from '@mui/icons-material/PersonOff';

const COLORS = ['#0066CC', '#3399FF', '#66B2FF', '#99CCFF'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const data = await dashboardService.getStatistics();
      setStats(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const ageData = stats?.ageDistribution ? [
    { name: 'Mầm non (< 6 tuổi)', value: stats.ageDistribution.preschool },
    { name: 'Học sinh (6-17)', value: stats.ageDistribution.student },
    { name: 'Lao động (18-59)', value: stats.ageDistribution.working },
    { name: 'Nghỉ hưu (≥ 60)', value: stats.ageDistribution.retired }
  ] : [];

  const genderData = stats?.genderDistribution ? [
    { name: 'Nam', value: stats.genderDistribution.male || 0 },
    { name: 'Nữ', value: stats.genderDistribution.female || 0 },
    { name: 'Khác', value: stats.genderDistribution.other || 0 }
  ].filter(item => item.value > 0) : [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#0066CC', fontWeight: 'bold' }}>
        Tổng quan
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#0066CC', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.totalHouseholds || 0}
                  </Typography>
                  <Typography variant="body2">Tổng số hộ</Typography>
                </Box>
                <HomeIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#3399FF', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.totalPopulation || 0}
                  </Typography>
                  <Typography variant="body2">Tổng dân số</Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#66B2FF', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.temporaryResidents || 0}
                  </Typography>
                  <Typography variant="body2">Tạm trú</Typography>
                </Box>
                <PersonAddIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#99CCFF', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats?.temporarilyAbsent || 0}
                  </Typography>
                  <Typography variant="body2">Tạm vắng</Typography>
                </Box>
                <PersonOffIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#0066CC' }}>
              Thống kê nhân khẩu theo độ tuổi - Tổ dân phố 7
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#0066CC" name="Số người" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#0066CC' }}>
              Phân bố theo độ tuổi
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#0066CC' }}>
              Phân bố theo giới tính
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={genderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#0066CC" name="Số người" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Expiring Residences */}
        {stats?.expiringResidences && stats.expiringResidences.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#D32F2F' }}>
                Giấy tạm trú sắp hết hạn (7 ngày tới)
              </Typography>
              <Box>
                {stats.expiringResidences.map((residence, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      mb: 1,
                      bgcolor: '#FFEBEE',
                      borderRadius: 1,
                      border: '1px solid #FFCDD2'
                    }}
                  >
                    <Typography variant="body1">
                      <strong>{residence.person?.fullName}</strong> - Hết hạn:{' '}
                      {new Date(residence.endDate).toLocaleDateString('vi-VN')}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;
