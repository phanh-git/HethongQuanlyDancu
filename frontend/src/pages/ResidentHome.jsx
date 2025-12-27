import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Home as HomeIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ResidentHome = () => {
  const { user } = useAuth();
  const [householdInfo, setHouseholdInfo] = useState(null);
  const [personalInfo, setPersonalInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResidentData();
  }, []);

  const loadResidentData = async () => {
    try {
      // Fetch personal information based on citizen ID
      const response = await api.get('/population', {
        params: { search: user.citizenIdentificationCard }
      });
      
      if (response.data.population && response.data.population.length > 0) {
        const person = response.data.population[0];
        setPersonalInfo(person);
        
        // Fetch household information if available
        if (person.household) {
          const householdResponse = await api.get(`/households/${person.household}`);
          setHouseholdInfo(householdResponse.data);
        }
      }
    } catch (error) {
      console.error('Error loading resident data:', error);
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#0066CC', fontWeight: 'bold' }}>
        Xin chào, {user?.fullName}!
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Chào mừng bạn đến với Cổng thông tin Dân cư
      </Typography>

      <Grid container spacing={3}>
        {/* Personal Information Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PersonIcon sx={{ fontSize: 32, color: '#0066CC', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#0066CC', fontWeight: 'bold' }}>
                  Thông tin cá nhân
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {personalInfo ? (
                <Box>
                  <Box mb={1}>
                    <Typography variant="body2" color="textSecondary">Họ và tên:</Typography>
                    <Typography variant="body1" fontWeight="medium">{personalInfo.fullName}</Typography>
                  </Box>
                  <Box mb={1}>
                    <Typography variant="body2" color="textSecondary">Ngày sinh:</Typography>
                    <Typography variant="body1">
                      {new Date(personalInfo.dateOfBirth).toLocaleDateString('vi-VN')}
                    </Typography>
                  </Box>
                  <Box mb={1}>
                    <Typography variant="body2" color="textSecondary">Giới tính:</Typography>
                    <Typography variant="body1">
                      {personalInfo.gender === 'male' ? 'Nam' : personalInfo.gender === 'female' ? 'Nữ' : 'Khác'}
                    </Typography>
                  </Box>
                  <Box mb={1}>
                    <Typography variant="body2" color="textSecondary">CMND/CCCD:</Typography>
                    <Typography variant="body1">{personalInfo.idNumber}</Typography>
                  </Box>
                  <Box mb={1}>
                    <Typography variant="body2" color="textSecondary">Trạng thái:</Typography>
                    <Chip 
                      label={getResidenceStatusLabel(personalInfo.residenceStatus)}
                      color={personalInfo.residenceStatus === 'permanent' ? 'success' : 'info'}
                      size="small"
                    />
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Chưa có thông tin cá nhân trong hệ thống
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Household Information Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <HomeIcon sx={{ fontSize: 32, color: '#0066CC', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#0066CC', fontWeight: 'bold' }}>
                  Thông tin hộ khẩu
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {householdInfo ? (
                <Box>
                  <Box mb={1}>
                    <Typography variant="body2" color="textSecondary">Mã hộ:</Typography>
                    <Typography variant="body1" fontWeight="medium">{householdInfo.householdCode}</Typography>
                  </Box>
                  <Box mb={1}>
                    <Typography variant="body2" color="textSecondary">Chủ hộ:</Typography>
                    <Typography variant="body1">{householdInfo.householdHead?.fullName || 'N/A'}</Typography>
                  </Box>
                  <Box mb={1}>
                    <Typography variant="body2" color="textSecondary">Địa chỉ:</Typography>
                    <Typography variant="body1">
                      Số nhà {householdInfo.address.houseNumber}
                      {householdInfo.address.street && `, ${householdInfo.address.street}`}
                      {householdInfo.address.ward && `, ${householdInfo.address.ward}`}
                    </Typography>
                  </Box>
                  <Box mb={1}>
                    <Typography variant="body2" color="textSecondary">Số thành viên:</Typography>
                    <Typography variant="body1">{householdInfo.members?.length || 0} người</Typography>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Chưa có thông tin hộ khẩu
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Household Members Card */}
        {householdInfo && householdInfo.members && householdInfo.members.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <PeopleIcon sx={{ fontSize: 32, color: '#0066CC', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#0066CC', fontWeight: 'bold' }}>
                    Thành viên trong hộ
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  {householdInfo.members.map((member, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper sx={{ p: 2, bgcolor: '#F5F5F5' }}>
                        <Typography variant="body1" fontWeight="medium">{member.fullName}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {member.relationshipToHead}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Sinh: {new Date(member.dateOfBirth).toLocaleDateString('vi-VN')}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Quick Actions Info */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: '#E3F2FD' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#0066CC' }}>
              Hướng dẫn sử dụng
            </Typography>
            <Typography variant="body2" paragraph>
              • <strong>Dịch vụ trực tuyến:</strong> Khai báo tạm trú, tạm vắng
            </Typography>
            <Typography variant="body2" paragraph>
              • <strong>Gửi phản ánh:</strong> Gửi ý kiến, kiến nghị đến tổ dân phố
            </Typography>
            <Typography variant="body2">
              • <strong>Thông báo:</strong> Xem thông báo từ Ban quản lý tổ dân phố
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ResidentHome;
