import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check if user role is allowed
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'citizen') {
      return <Navigate to="/home" />;
    } else if (['admin', 'team_leader', 'deputy_leader', 'staff'].includes(user.role)) {
      return <Navigate to="/admin/dashboard" />;
    }
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
