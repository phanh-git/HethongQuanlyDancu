import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Households from './pages/Households';
import Population from './pages/Population';
import Complaints from './pages/Complaints';
import ComplaintForm from './pages/ComplaintForm';

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
            <Route path="/complaints/new" element={<ComplaintForm />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="households" element={<Households />} />
              <Route path="population" element={<Population />} />
              <Route path="complaints" element={<Complaints />} />
              <Route path="temporary-residence" element={<div>Tạm trú/Tạm vắng (Coming soon)</div>} />
              <Route path="reports" element={<div>Báo cáo (Coming soon)</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
