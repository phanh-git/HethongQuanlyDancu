import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
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
import OnlineServices from './pages/OnlineServices';
import Notifications from './pages/Notifications';
import StaffManagement from './pages/StaffManagement';

// Create blue theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#0066CC',
      light: '#3399FF',
      dark: '#0052A3'
    },
    secondary: {
      main: '#66B2FF'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif'
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={['admin', 'team_leader', 'deputy_leader', 'staff']}>
                  <AdminLayout />
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
              <Route path="staff" element={<StaffManagement />} />
            </Route>

            {/* Resident Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute allowedRoles={['citizen']}>
                  <ResidentLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<ResidentHome />} />
              <Route path="services" element={<OnlineServices />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>

            {/* Shared complaint form */}
            <Route path="/complaints/new" element={<ComplaintForm />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
