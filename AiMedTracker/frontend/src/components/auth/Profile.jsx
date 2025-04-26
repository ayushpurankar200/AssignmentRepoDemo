// src/components/auth/Profile.jsx

import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { getStoredUsers } from '../../utils/auth';

export default function Profile() {
  const { user } = useAuth();
  const allUsers = getStoredUsers();

  // If you’re a physician, show everyone with type==='patient'
  const patients = Object.entries(allUsers)
    .filter(([email, data]) => data.type === 'patient')
    .map(([email, data]) => ({
      email,
      fullName: data.fullName || '(no name provided)',
    }));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {user.type === 'physician' ? 'Patient Directory' : 'My Profile'}
      </Typography>

      {user.type === 'physician' ? (
        <Paper sx={{ maxWidth: 500, p: 2, mt: 2 }}>
          <Typography variant="h6">Registered Patients</Typography>
          <List>
            {patients.map(({ email, fullName }) => (
              <ListItem key={email} divider>
                <ListItemText
                  primary={fullName}
                  secondary={email}
                />
              </ListItem>
            ))}
            {patients.length === 0 && (
              <Typography variant="body2" color="textSecondary">
                No patients registered yet.
              </Typography>
            )}
          </List>
        </Paper>
      ) : (
        <Paper sx={{ maxWidth: 400, p: 2, mt: 2 }}>
          <Typography>
            <strong>Name:</strong> {allUsers[user.email]?.fullName || '—'}
          </Typography>
          <Typography>
            <strong>Email:</strong> {user.email}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
