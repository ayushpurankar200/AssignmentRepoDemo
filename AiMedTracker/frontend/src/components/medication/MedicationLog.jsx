import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';

const validationSchema = yup.object({
  medicationName: yup.string().required('Medication name is required'),
  dosage: yup.string().required('Dosage is required'),
  frequency: yup.string().required('Frequency is required'),
  startDate: yup.date().required('Start date is required'),
});

const MedicationLog = () => {
  const [medications, setMedications] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);

  const formik = useFormik({
    initialValues: {
      medicationName: '',
      dosage: '',
      frequency: '',
      startDate: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (editingMedication !== null) {
        // Update existing medication
        const updatedMedications = medications.map((med) =>
          med.id === editingMedication.id ? { ...values, id: med.id } : med
        );
        setMedications(updatedMedications);
        toast.success('Medication updated successfully!');
      } else {
        // Add new medication
        const newMedication = {
          ...values,
          id: Date.now(),
        };
        setMedications([...medications, newMedication]);
        toast.success('Medication added successfully!');
      }
      handleCloseDialog();
      resetForm();
    },
  });

  const handleOpenDialog = (medication = null) => {
    if (medication) {
      setEditingMedication(medication);
      formik.setValues(medication);
    } else {
      setEditingMedication(null);
      formik.resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMedication(null);
    formik.resetForm();
  };

  const handleDeleteMedication = (id) => {
    setMedications(medications.filter((med) => med.id !== id));
    toast.success('Medication deleted successfully!');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Medication Log
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
          sx={{ mb: 3 }}
        >
          Add New Medication
        </Button>

        <Paper elevation={3}>
          <List>
            {medications.map((medication) => (
              <ListItem key={medication.id} divider>
                <ListItemText
                  primary={medication.medicationName}
                  secondary={`Dosage: ${medication.dosage} | Frequency: ${medication.frequency} | Start Date: ${new Date(medication.startDate).toLocaleDateString()}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleOpenDialog(medication)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteMedication(medication.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {editingMedication ? 'Edit Medication' : 'Add New Medication'}
          </DialogTitle>
          <form onSubmit={formik.handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="medicationName"
                    name="medicationName"
                    label="Medication Name"
                    value={formik.values.medicationName}
                    onChange={formik.handleChange}
                    error={formik.touched.medicationName && Boolean(formik.errors.medicationName)}
                    helperText={formik.touched.medicationName && formik.errors.medicationName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="dosage"
                    name="dosage"
                    label="Dosage"
                    value={formik.values.dosage}
                    onChange={formik.handleChange}
                    error={formik.touched.dosage && Boolean(formik.errors.dosage)}
                    helperText={formik.touched.dosage && formik.errors.dosage}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="frequency"
                    name="frequency"
                    label="Frequency"
                    value={formik.values.frequency}
                    onChange={formik.handleChange}
                    error={formik.touched.frequency && Boolean(formik.errors.frequency)}
                    helperText={formik.touched.frequency && formik.errors.frequency}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="startDate"
                    name="startDate"
                    label="Start Date"
                    type="date"
                    value={formik.values.startDate}
                    onChange={formik.handleChange}
                    error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                    helperText={formik.touched.startDate && formik.errors.startDate}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {editingMedication ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Container>
  );
};

export default MedicationLog; 