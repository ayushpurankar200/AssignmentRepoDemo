import React from 'react';
import { Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { getStoredUsers } from '../../utils/auth';

export default function Profile() {
  const { user } = useAuth();
  const allUsers = getStoredUsers();
  const patients = Object.entries(allUsers)
    .filter(([email, data]) => data.type === 'patient')
    .map(([email]) => email);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Signed in as: {user.email} ({user.type})
      </Typography>

      {user.type === 'physician' && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Registered Patients
          </Typography>
          {patients.length > 0 ? (
            <List>
              {patients.map((email) => (
                <ListItem key={email} disablePadding>
                  <ListItemText primary={email} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No patients registered.</Typography>
          )}
        </Box>
      )}
    </Box>
  );
}