import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLayout from './components/AdminLayout';
import ResidentLayout from './components/ResidentLayout';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Households from './pages/Households';
import Population from './pages/Population';
import Complaints from './pages/Complaints';
import ComplaintForm from './pages/ComplaintForm';
import ResidentHome from './pages/ResidentHome';
import ResidentComplaintForm from './pages/ResidentComplaintForm';
import TemporaryResidenceForm from './pages/TemporaryResidenceForm';
import Notifications from './pages/Notifications';
import StaffManagement from './pages/StaffManagement';

// Create blue theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#03A9F4', // Light Blue
      light: '#4FC3F7',
      dark: '#0288D1',
      contrastText: '#fff',
    },
    secondary: {
      main: '#0277BD',
      light: '#58A5F0',
      dark: '#004C8C',
      contrastText: '#fff',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    success: {
      main: '#4CAF50',
    },
    error: {
      main: '#F44336',
    },
    warning: {
      main: '#FF9800',
    },
    info: {
      main: '#2196F3',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// Role-based route wrapper
const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate home based on role
    if (user.role === 'resident') {
      return <Navigate to="/home" replace />;
    } else {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }
  
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Admin/Staff Routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['admin', 'team_leader', 'deputy_leader', 'staff']}>
              <AdminLayout />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="households" element={<Households />} />
        <Route path="population" element={<Population />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="temporary-residence" element={<div>Tạm trú/Tạm vắng (Coming soon)</div>} />
        <Route path="reports" element={<div>Báo cáo (Coming soon)</div>} />
        <Route 
          path="staff" 
          element={
            <RoleBasedRoute allowedRoles={['admin', 'team_leader']}>
              <StaffManagement />
            </RoleBasedRoute>
          } 
        />
      </Route>

      {/* Resident Routes */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <RoleBasedRoute allowedRoles={['resident']}>
              <ResidentLayout />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      >
        <Route index element={<ResidentHome />} />
        <Route path="services" element={<TemporaryResidenceForm />} />
        <Route path="complaints" element={<ResidentComplaintForm />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* Legacy/Public Routes */}
      <Route path="/complaints/new" element={<ComplaintForm />} />
      
      {/* Default redirect based on role */}
      <Route 
        path="/" 
        element={
          user ? (
            user.role === 'resident' ? 
              <Navigate to="/home" replace /> : 
              <Navigate to="/admin/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      
      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
