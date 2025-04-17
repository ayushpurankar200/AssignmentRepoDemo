import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Now uses Vite proxy
const API_URL = '/api';

const validationSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
});

const Login = () => {
  const [userType, setUserType] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const authenticateUser = async (email, password, userType) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, userType }),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Invalid email or password');
    }
    return response.json();
  };

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await authenticateUser(values.email, values.password, userType);
        login({ email: values.email, userType });
        toast.success('Login successful!');
        navigate('/dashboard');
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Paper sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Sign In
        </Typography>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <ToggleButtonGroup
            value={userType}
            exclusive
            onChange={(_, v) => v && setUserType(v)}
            aria-label="user type"
          >
            <ToggleButton value="user">Patient</ToggleButton>
            <ToggleButton value="doctor">Doctor</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            fullWidth
            margin="normal"
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ mt: 3 }}
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
        <Button fullWidth sx={{ mt: 2 }} onClick={() => navigate('/signup')}>
          Don’t have an account? Sign Up
        </Button>
      </Paper>
    </Container>
  );
};

export default Login;
