// src/components/auth/SignUp.jsx

import React, { useState } from 'react';
import {
  Box, Container, TextField, Button, Typography, Paper,
  ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getStoredUsers, saveStoredUsers } from '../../utils/auth';

const validationSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email:    yup.string().email('Enter a valid email').required(),
  password: yup.string().min(8, 'Min. 8 characters').required(),
});

export default function SignUp() {
  const [userType, setUserType] = useState('patient');
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { fullName: '', email: '', password: '' },
    validationSchema,
    onSubmit: ({ fullName, email, password }) => {
      const users = getStoredUsers();
      if (users[email]) {
        toast.error('Email already registered');
        return;
      }
      // Save the new user record (including fullName)
      users[email] = { fullName, password, type: userType };
      saveStoredUsers(users);

      toast.success('Account created!');
      navigate('/login');
    },
  });

  return (
    <Container maxWidth="xs">
      <Paper sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Sign Up
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
            fullWidth margin="normal" id="fullName" name="fullName"
            label="Full Name"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
          />
          <TextField
            fullWidth margin="normal" id="email" name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            fullWidth margin="normal" id="password" name="password"
            label="Password" type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Sign Up
          </Button>
        </form>

        <Button fullWidth sx={{ mt: 2 }} onClick={() => navigate('/login')}>
          Back to Login
        </Button>
      </Paper>
    </Container>
  );
}
