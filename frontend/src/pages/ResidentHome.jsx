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
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ResidentHome = () => {
  const { user } = useAuth();
  const [householdInfo, setHouseholdInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHouseholdInfo();
  }, []);

  const loadHouseholdInfo = async () => {
    try {
      // Try to get household information for the user
      // Note: This endpoint needs to be implemented in the backend
      // For now, we'll gracefully handle the error
      const response = await api.get('/population/my-household');
      setHouseholdInfo(response.data);
    } catch (error) {
      // Endpoint not yet implemented, show placeholder
      console.log('Household info endpoint not available yet');
      setHouseholdInfo(null);
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#0066CC', fontWeight: 'bold' }}>
        Thông tin cá nhân
      </Typography>

      {/* Personal Information */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <PersonIcon sx={{ fontSize: 32, color: '#0066CC', mr: 1 }} />
              <Typography variant="h6" sx={{ color: '#0066CC' }}>
                Thông tin cá nhân
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Họ và tên
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {user?.fullName || 'N/A'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Ngày sinh
              </Typography>
              <Typography variant="body1">
                {user?.dateOfBirth 
                  ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN')
                  : 'N/A'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Số CMND/CCCD
              </Typography>
              <Typography variant="body1">
                {user?.citizenIdentificationCard || 'N/A'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Email
              </Typography>
              <Typography variant="body1">
                {user?.email || 'N/A'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Số điện thoại
              </Typography>
              <Typography variant="body1">
                {user?.phone || 'N/A'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <HomeIcon sx={{ fontSize: 32, color: '#0066CC', mr: 1 }} />
              <Typography variant="h6" sx={{ color: '#0066CC' }}>
                Thông tin hộ gia đình
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {householdInfo ? (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Mã hộ khẩu
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {householdInfo.householdCode || 'N/A'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Chủ hộ
                  </Typography>
                  <Typography variant="body1">
                    {householdInfo.householdHead?.fullName || 'N/A'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Địa chỉ
                  </Typography>
                  <Typography variant="body1">
                    {householdInfo.address?.houseNumber && `Số nhà ${householdInfo.address.houseNumber}, `}
                    {householdInfo.address?.street && `${householdInfo.address.street}, `}
                    {householdInfo.address?.ward || 'N/A'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Số thành viên
                  </Typography>
                  <Chip 
                    label={`${householdInfo.members?.length || 0} người`} 
                    color="primary" 
                    size="small" 
                  />
                </Box>

                {householdInfo.members && householdInfo.members.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Các thành viên trong hộ
                    </Typography>
                    {householdInfo.members.map((member, index) => (
                      <Box 
                        key={index}
                        sx={{ 
                          p: 1.5, 
                          mb: 1, 
                          bgcolor: '#f5f5f5', 
                          borderRadius: 1,
                          border: '1px solid #e0e0e0'
                        }}
                      >
                        <Typography variant="body2">
                          <strong>{member.fullName}</strong>
                          {member.relationshipToHead && ` - ${member.relationshipToHead}`}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {member.dateOfBirth 
                            ? new Date(member.dateOfBirth).toLocaleDateString('vi-VN')
                            : ''}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="textSecondary">
                  Chưa có thông tin hộ khẩu
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#0066CC' }}>
              Dịch vụ nhanh
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 4 },
                    bgcolor: '#E3F2FD'
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      📝
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      Khai báo Tạm trú/Tạm vắng
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 4 },
                    bgcolor: '#FFF3E0'
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      💬
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      Gửi phản ánh
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 4 },
                    bgcolor: '#F3E5F5'
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      🔔
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      Thông báo
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 4 },
                    bgcolor: '#E8F5E9'
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      📋
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      Lịch sử yêu cầu
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ResidentHome;
