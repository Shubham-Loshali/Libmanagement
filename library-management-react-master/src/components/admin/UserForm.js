import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';

const membershipTypes = [
  'Student',
  'Faculty',
  'Standard',
  'Premium'
];

const UserForm = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    membershipType: '',
    idNumber: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        // Ensure all expected fields exist
        address: user.address || '',
        idNumber: user.idNumber || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^[0-9-+() ]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    
    if (!formData.membershipType) newErrors.membershipType = 'Membership type is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="name"
            label="Full Name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            margin="normal"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="email"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            required
            type="email"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="phone"
            label="Phone Number"
            fullWidth
            value={formData.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            margin="normal"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal" error={!!errors.membershipType} required>
            <InputLabel>Membership Type</InputLabel>
            <Select
              name="membershipType"
              value={formData.membershipType}
              onChange={handleChange}
              label="Membership Type"
            >
              {membershipTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            {errors.membershipType && <FormHelperText>{errors.membershipType}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="idNumber"
            label="ID Number"
            fullWidth
            value={formData.idNumber || ''}
            onChange={handleChange}
            margin="normal"
            placeholder="Student/Employee ID (if applicable)"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          {user && (
            <TextField
              name="membershipDate"
              label="Membership Date"
              fullWidth
              value={formData.membershipDate || ''}
              margin="normal"
              disabled
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="address"
            label="Address"
            fullWidth
            multiline
            rows={3}
            value={formData.address || ''}
            onChange={handleChange}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            {user ? 'Update User' : 'Add User'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserForm;