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

const categories = [
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Thriller',
  'Romance',
  'Biography',
  'History',
  'Science',
  'Technology',
  'Self-Help',
  'Children',
  'Poetry',
  'Reference',
  'Textbook',
  'Other'
];

const BookForm = ({ book, onSave }) => {
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    category: '',
    publisher: '',
    publicationYear: '',
    quantity: '',
    availableQuantity: '',
    location: '',
    description: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (book) {
      setFormData({
        ...book,
        publicationYear: book.publicationYear.toString()
      });
    }
  }, [book]);

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
    
    if (!formData.isbn) newErrors.isbn = 'ISBN is required';
    else if (!/^[0-9-]{10,17}$/.test(formData.isbn)) newErrors.isbn = 'Invalid ISBN format';
    
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.author) newErrors.author = 'Author is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.publisher) newErrors.publisher = 'Publisher is required';
    
    if (!formData.publicationYear) newErrors.publicationYear = 'Publication year is required';
    else if (!/^\d{4}$/.test(formData.publicationYear) || 
             parseInt(formData.publicationYear) < 1000 || 
             parseInt(formData.publicationYear) > new Date().getFullYear()) {
      newErrors.publicationYear = 'Invalid publication year';
    }
    
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    else if (parseInt(formData.quantity) <= 0) newErrors.quantity = 'Quantity must be positive';
    
    if (formData.availableQuantity === '') newErrors.availableQuantity = 'Available quantity is required';
    else if (parseInt(formData.availableQuantity) < 0) newErrors.availableQuantity = 'Available quantity cannot be negative';
    else if (parseInt(formData.availableQuantity) > parseInt(formData.quantity)) {
      newErrors.availableQuantity = 'Available quantity cannot exceed total quantity';
    }
    
    if (!formData.location) newErrors.location = 'Shelf location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert numeric fields to numbers
      const processedData = {
        ...formData,
        publicationYear: parseInt(formData.publicationYear),
        quantity: parseInt(formData.quantity),
        availableQuantity: parseInt(formData.availableQuantity),
        id: book?.id // Keep the ID if editing
      };
      
      onSave(processedData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="isbn"
            label="ISBN"
            fullWidth
            value={formData.isbn}
            onChange={handleChange}
            error={!!errors.isbn}
            helperText={errors.isbn}
            margin="normal"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="title"
            label="Title"
            fullWidth
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            margin="normal"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="author"
            label="Author"
            fullWidth
            value={formData.author}
            onChange={handleChange}
            error={!!errors.author}
            helperText={errors.author}
            margin="normal"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal" error={!!errors.category} required>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="publisher"
            label="Publisher"
            fullWidth
            value={formData.publisher}
            onChange={handleChange}
            error={!!errors.publisher}
            helperText={errors.publisher}
            margin="normal"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="publicationYear"
            label="Publication Year"
            fullWidth
            value={formData.publicationYear}
            onChange={handleChange}
            error={!!errors.publicationYear}
            helperText={errors.publicationYear}
            margin="normal"
            required
            inputProps={{ maxLength: 4 }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="quantity"
            label="Total Quantity"
            type="number"
            fullWidth
            value={formData.quantity}
            onChange={handleChange}
            error={!!errors.quantity}
            helperText={errors.quantity}
            margin="normal"
            required
            inputProps={{ min: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="availableQuantity"
            label="Available Quantity"
            type="number"
            fullWidth
            value={formData.availableQuantity}
            onChange={handleChange}
            error={!!errors.availableQuantity}
            helperText={errors.availableQuantity}
            margin="normal"
            required
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="location"
            label="Shelf Location"
            fullWidth
            value={formData.location}
            onChange={handleChange}
            error={!!errors.location}
            helperText={errors.location}
            margin="normal"
            required
            placeholder="e.g., A1-S2"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description || ''}
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
            {book ? 'Update Book' : 'Add Book'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookForm;