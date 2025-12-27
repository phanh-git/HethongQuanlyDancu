import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Campaign as CampaignIcon
} from '@mui/icons-material';

const Notifications = () => {
  // Mock notifications - in a real app, this would come from an API
  const notifications = [
    {
      id: 1,
      title: 'Thông báo họp tổ dân phố',
      message: 'Tổ dân phố 7 tổ chức họp vào lúc 19h00 ngày 30/12/2024 tại nhà văn hóa. Đề nghị các hộ cử đại diện tham gia.',
      date: '2024-12-27',
      type: 'meeting',
      read: false
    },
    {
      id: 2,
      title: 'Lịch thu phí vệ sinh',
      message: 'Thông báo lịch thu phí vệ sinh môi trường tháng 01/2025 vào các ngày 5-7/01/2025.',
      date: '2024-12-26',
      type: 'info',
      read: false
    },
    {
      id: 3,
      title: 'Cảnh báo thời tiết',
      message: 'Dự báo có mưa lớn trong 2-3 ngày tới. Người dân lưu ý phòng chống úng ngập.',
      date: '2024-12-25',
      type: 'warning',
      read: true
    },
    {
      id: 4,
      title: 'Chương trình văn nghệ Tết',
      message: 'Tổ dân phố tổ chức chương trình văn nghệ chào mừng Tết Nguyên đán 2025. Kính mời mọi người tham gia.',
      date: '2024-12-24',
      type: 'event',
      read: true
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'meeting':
        return <CampaignIcon sx={{ color: '#1976d2' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: '#f57c00' }} />;
      case 'event':
        return <CampaignIcon sx={{ color: '#7b1fa2' }} />;
      default:
        return <InfoIcon sx={{ color: '#0288d1' }} />;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <NotificationsIcon sx={{ fontSize: 32, color: '#0066CC', mr: 1 }} />
        <Typography variant="h4" sx={{ color: '#0066CC', fontWeight: 'bold' }}>
          Thông báo
        </Typography>
      </Box>

      <Paper sx={{ p: 0 }}>
        <List>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  bgcolor: notification.read ? 'transparent' : '#E3F2FD',
                  '&:hover': { bgcolor: '#F5F5F5' },
                  py: 2
                }}
              >
                <Box sx={{ mr: 2, mt: 0.5 }}>
                  {getNotificationIcon(notification.type)}
                </Box>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="body1" fontWeight={notification.read ? 'normal' : 'bold'}>
                        {notification.title}
                      </Typography>
                      {!notification.read && (
                        <Chip label="Mới" color="primary" size="small" />
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: 'block', mt: 1 }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 1 }}
                      >
                        {new Date(notification.date).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
          
          {notifications.length === 0 && (
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" color="textSecondary" align="center">
                    Chưa có thông báo nào
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </Paper>

      <Paper sx={{ p: 3, mt: 3, bgcolor: '#FFF3E0' }}>
        <Typography variant="body2" color="textSecondary">
          <strong>💡 Mẹo:</strong> Bạn sẽ nhận được thông báo về các hoạt động, sự kiện và thông tin quan trọng từ Tổ dân phố qua hệ thống này.
          Hãy thường xuyên kiểm tra để không bỏ lỡ thông tin quan trọng.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Notifications;
