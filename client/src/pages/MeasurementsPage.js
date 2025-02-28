import React, { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  TextField,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Tabs,
  Tab,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { UserContext } from '../context/UserContext';
import { 
  getUserMeasurements, 
  createMeasurement, 
  updateMeasurement, 
  deleteMeasurement 
} from '../services/api';

const MeasurementsPage = () => {
  const { activeUser } = useContext(UserContext);
  const queryClient = useQueryClient();
  
  // State
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const [formData, setFormData] = useState({
    weight: '',
    body_fat: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);
  
  // Fetch measurements
  const { data: measurements, isLoading } = useQuery(
    ['measurements', activeUser?._id],
    () => getUserMeasurements({ userId: activeUser?._id }),
    {
      enabled: !!activeUser,
      staleTime: 60000 // 1 minute
    }
  );
  
  // Create measurement mutation
  const createMeasurementMutation = useMutation(createMeasurement, {
    onSuccess: () => {
      queryClient.invalidateQueries(['measurements', activeUser?._id]);
      setSnackbar({
        open: true,
        message: 'Measurement added successfully!',
        severity: 'success'
      });
      handleCloseDialog();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error adding measurement: ${error.message}`,
        severity: 'error'
      });
    }
  });
  
  // Update measurement mutation
  const updateMeasurementMutation = useMutation(
    (data) => updateMeasurement({ id: data.id, measurementData: data.measurementData }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['measurements', activeUser?._id]);
        setSnackbar({
          open: true,
          message: 'Measurement updated successfully!',
          severity: 'success'
        });
        handleCloseDialog();
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: `Error updating measurement: ${error.message}`,
          severity: 'error'
        });
      }
    }
  );
  
  // Delete measurement mutation
  const deleteMeasurementMutation = useMutation(deleteMeasurement, {
    onSuccess: () => {
      queryClient.invalidateQueries(['measurements', activeUser?._id]);
      setSnackbar({
        open: true,
        message: 'Measurement deleted successfully!',
        severity: 'success'
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error deleting measurement: ${error.message}`,
        severity: 'error'
      });
    }
  });
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Open dialog for adding new measurement
  const handleAddMeasurement = () => {
    setEditingMeasurement(null);
    setFormData({
      weight: '',
      body_fat: '',
      date: format(new Date(), 'yyyy-MM-dd')
    });
    setOpenDialog(true);
  };
  
  // Open dialog for editing measurement
  const handleEditMeasurement = (measurement) => {
    setEditingMeasurement(measurement);
    setFormData({
      weight: measurement.weight,
      body_fat: measurement.body_fat || '',
      date: format(new Date(measurement.date), 'yyyy-MM-dd')
    });
    setOpenDialog(true);
  };
  
  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMeasurement(null);
  };
  
  // Save measurement
  const handleSaveMeasurement = () => {
    if (!activeUser) {
      setSnackbar({
        open: true,
        message: 'Please select a user profile first',
        severity: 'error'
      });
      return;
    }
    
    if (!formData.weight) {
      setSnackbar({
        open: true,
        message: 'Weight is required',
        severity: 'error'
      });
      return;
    }
    
    const measurementData = {
      user_id: activeUser._id,
      weight: Number(formData.weight),
      body_fat: formData.body_fat ? Number(formData.body_fat) : undefined,
      date: new Date(formData.date)
    };
    
    if (editingMeasurement) {
      updateMeasurementMutation.mutate({
        id: editingMeasurement._id,
        measurementData
      });
    } else {
      createMeasurementMutation.mutate(measurementData);
    }
  };
  
  // Delete measurement
  const handleDeleteMeasurement = (id) => {
    if (window.confirm('Are you sure you want to delete this measurement?')) {
      deleteMeasurementMutation.mutate(id);
    }
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Body Measurements
      </Typography>
      
      {/* Tabs for different views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <Tab label="History" />
          <Tab label="Stats" disabled={!measurements || measurements.length < 2} />
        </Tabs>
      </Box>
      
      {/* History Tab */}
      {tabValue === 0 && (
        <>
          {/* Measurements list */}
          {measurements && measurements.length > 0 ? (
            <Card>
              <List>
                {measurements.map((measurement, index) => (
                  <React.Fragment key={measurement._id}>
                    <ListItem>
                      <ListItemText
                        primary={format(new Date(measurement.date), 'MMMM d, yyyy')}
                        secondary={
                          <React.Fragment>
                            <Typography component="span" variant="body2" color="text.primary">
                              Weight: {measurement.weight} kg
                            </Typography>
                            {measurement.body_fat && (
                              <Typography component="span" variant="body2" color="text.primary" sx={{ ml: 2 }}>
                                Body Fat: {measurement.body_fat}%
                              </Typography>
                            )}
                          </React.Fragment>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          aria-label="edit"
                          onClick={() => handleEditMeasurement(measurement)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={() => handleDeleteMeasurement(measurement._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < measurements.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <Typography variant="body1" align="center">
                  No measurements recorded yet
                </Typography>
              </CardContent>
            </Card>
          )}
          
          {/* Add measurement button */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddMeasurement}
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Measurement
            </Button>
          </Box>
        </>
      )}
      
      {/* Stats Tab - Will be implemented in Phase 3 */}
      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="body1" align="center">
              Measurement statistics will be available in a future update
            </Typography>
          </CardContent>
        </Card>
      )}
      
      {/* Add/Edit Measurement Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingMeasurement ? 'Edit Measurement' : 'Add Measurement'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Weight (kg)"
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{ inputProps: { min: 0, step: 0.1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Body Fat (%)"
                type="number"
                name="body_fat"
                value={formData.body_fat}
                onChange={handleInputChange}
                fullWidth
                InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveMeasurement} 
            variant="contained"
            disabled={createMeasurementMutation.isLoading || updateMeasurementMutation.isLoading}
          >
            {createMeasurementMutation.isLoading || updateMeasurementMutation.isLoading ? (
              <CircularProgress size={24} />
            ) : (
              'Save'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MeasurementsPage;