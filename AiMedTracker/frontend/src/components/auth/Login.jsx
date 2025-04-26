// src/components/auth/Login.jsx

import React, { useState } from 'react';
import {
  Box, Container, TextField, Button, Typography, Paper,
  ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getStoredUsers } from '../../utils/auth';

const validationSchema = yup.object({
  email: yup.string().email('Enter a valid email').required(),
  password: yup.string().min(8).required(),
});

export default function Login() {
  const [userType, setUserType] = useState('patient');
  const navigate = useNavigate();
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: ({ email, password }) => {
      const users = getStoredUsers();
      const u = users[email];
      if (u && u.password === password && u.type === userType) {
        login({ email, type: userType });
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error('Invalid credentials or user type');
      }
    },
  });

  return (
    <Container maxWidth="xs">
      <Paper sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Sign In
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <ToggleButtonGroup
            value={userType}
            exclusive
            onChange={(_, v) => v && setUserType(v)}
          >
            <ToggleButton value="patient">Patient</ToggleButton>
            <ToggleButton value="physician">Physician</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth margin="normal" id="email" name="email" label="Email"
            value={formik.values.email} onChange={formik.handleChange}
            error={formik.touched.email && !!formik.errors.email}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            fullWidth margin="normal" id="password" name="password"
            label="Password" type="password"
            value={formik.values.password} onChange={formik.handleChange}
            error={formik.touched.password && !!formik.errors.password}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Sign In
          </Button>
        </form>
        <Button fullWidth sx={{ mt: 2 }} onClick={() => navigate('/signup')}>
          Don’t have an account? Sign Up
        </Button>
      </Paper>
    </Container>
  );
}
