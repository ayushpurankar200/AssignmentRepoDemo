import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

const InteractionAlerts = ({ medications }) => {
  // This is a mock function - in a real app, this would call an AI service
  const checkInteractions = (medications) => {
    // Mock interactions for demonstration
    return [
      {
        id: 1,
        severity: 'high',
        medications: ['Medication A', 'Medication B'],
        description: 'Potential severe interaction between these medications. Consult your doctor immediately.',
      },
      {
        id: 2,
        severity: 'medium',
        medications: ['Medication C', 'Medication D'],
        description: 'Moderate interaction detected. Monitor for side effects.',
      },
    ];
  };

  const interactions = checkInteractions(medications);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Medication Interactions
        </Typography>

        {interactions.length === 0 ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            No medication interactions detected.
          </Alert>
        ) : (
          <List>
            {interactions.map((interaction) => (
              <Paper
                key={interaction.id}
                elevation={2}
                sx={{ mb: 2, p: 2 }}
              >
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    {interaction.severity === 'high' ? (
                      <WarningIcon color="error" />
                    ) : (
                      <InfoIcon color="warning" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" component="span">
                          Interaction Detected
                        </Typography>
                        <Chip
                          label={interaction.severity.toUpperCase()}
                          color={getSeverityColor(interaction.severity)}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          sx={{ display: 'block', mb: 1 }}
                        >
                          Medications involved: {interaction.medications.join(' + ')}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {interaction.description}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
};

export default InteractionAlerts; 