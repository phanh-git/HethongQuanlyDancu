import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import {
  Info as InfoIcon,
  Notifications as NotificationsIcon
} from '@mui/material/Icon';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Lịch họp tổ dân phố tháng 12',
      message: 'Kính mời các hộ gia đình tham dự cuộc họp tổ dân phố vào 8h ngày 30/12/2024 tại Hội trường tổ dân phố.',
      date: '2024-12-20',
      type: 'meeting',
      isRead: false
    },
    {
      id: 2,
      title: 'Thông báo thu phí vệ sinh',
      message: 'Kính mời các hộ gia đình đóng phí vệ sinh quý 4/2024. Hạn chót: 31/12/2024.',
      date: '2024-12-15',
      type: 'fee',
      isRead: true
    },
    {
      id: 3,
      title: 'Chương trình tết trồng cây',
      message: 'Tổ dân phố tổ chức chương trình tết trồng cây vào sáng ngày 05/01/2025. Mời các hộ tham gia.',
      date: '2024-12-10',
      type: 'event',
      isRead: true
    }
  ]);

  const getTypeLabel = (type) => {
    const labels = {
      meeting: 'Cuộc họp',
      fee: 'Thu phí',
      event: 'Sự kiện',
      announcement: 'Thông báo'
    };
    return labels[type] || 'Thông báo';
  };

  const getTypeColor = (type) => {
    const colors = {
      meeting: 'warning',
      fee: 'error',
      event: 'success',
      announcement: 'info'
    };
    return colors[type] || 'default';
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#0066CC', fontWeight: 'bold' }}>
        Thông báo
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Các thông báo từ Ban quản lý tổ dân phố
      </Typography>

      {notifications.some(n => !n.isRead) && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Bạn có {notifications.filter(n => !n.isRead).length} thông báo mới chưa đọc
        </Alert>
      )}

      <Paper>
        <List>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  bgcolor: notification.isRead ? 'transparent' : '#E3F2FD',
                  '&:hover': { bgcolor: '#F5F5F5' }
                }}
              >
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Typography variant="body1" fontWeight={notification.isRead ? 'normal' : 'bold'}>
                        {notification.title}
                      </Typography>
                      <Chip
                        label={getTypeLabel(notification.type)}
                        color={getTypeColor(notification.type)}
                        size="small"
                      />
                      {!notification.isRead && (
                        <Chip label="Mới" color="primary" size="small" />
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.primary" paragraph>
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Ngày: {new Date(notification.date).toLocaleDateString('vi-VN')}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>

        {notifications.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Chưa có thông báo nào
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Notifications;
