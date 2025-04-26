// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/layout/Layout';
import Login   from './components/auth/Login';
import SignUp  from './components/auth/SignUp';
import Profile from './components/auth/Profile';
import MedicationLog    from './components/medication/MedicationLog';
import InteractionAlerts from './components/medication/InteractionAlerts';
import { AuthProvider, useAuth } from './context/AuthContext';

const theme = createTheme({
  palette: { primary: { main: '#1976d2' }, secondary: { main: '#dc004e' } },
});

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <ToastContainer position="top-right" />

          <Routes>
            {/* public */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login"  element={<Login />} />

            {/* protected */}
            <Route path="/" element={<PrivateRoute><Layout><Navigate to="/dashboard" replace/></Layout></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Layout><MedicationLog/></Layout></PrivateRoute>} />
            <Route path="/medications" element={<PrivateRoute><Layout><MedicationLog/></Layout></PrivateRoute>} />
            <Route path="/interactions" element={<PrivateRoute><Layout><InteractionAlerts/></Layout></PrivateRoute>} />

            {/* 👉 profile */}
            <Route path="/profile" element={
              <PrivateRoute>
                <Layout>
                  <Profile />
                </Layout>
              </PrivateRoute>
            }/>

            {/* catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
