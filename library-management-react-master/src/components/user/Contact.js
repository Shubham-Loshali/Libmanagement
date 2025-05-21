import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  Divider,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AccessTime as AccessTimeIcon,
  Send as SendIcon
} from '@mui/icons-material';

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'membership', label: 'Membership Information' },
    { value: 'programs', label: 'Programs & Events' },
    { value: 'donations', label: 'Donations & Support' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'feedback', label: 'Feedback & Suggestions' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message should be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setSnackbar({
          open: true,
          message: 'Your message has been sent successfully! We will get back to you soon.',
          severity: 'success'
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          inquiryType: 'general'
        });
      }, 1500);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  // Library information
  const contactInfo = [
    {
      icon: <LocationOnIcon fontSize="large" color="primary" />,
      title: 'Address',
      content: [
        '123 Library Street',
        'Bookville, BK 12345',
        'United States'
      ]
    },
    {
      icon: <PhoneIcon fontSize="large" color="primary" />,
      title: 'Phone',
      content: [
        'Main: (555) 123-4567',
        'Reference Desk: (555) 123-4568',
        'Childrens Section: (555) 123-4569'
      ]
    },
    {
      icon: <EmailIcon fontSize="large" color="primary" />,
      title: 'Email',
      content: [
        'info@library.example.com',
        'reference@library.example.com',
        'programs@library.example.com'
      ]
    },
    {
      icon: <AccessTimeIcon fontSize="large" color="primary" />,
      title: 'Hours',
      content: [
        'Monday - Thursday: 9:00 AM - 8:00 PM',
        'Friday - Saturday: 10:00 AM - 6:00 PM',
        'Sunday: 12:00 PM - 5:00 PM'
      ]
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          py: { xs: 6, md: 8 },
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(rgba(30, 64, 175, 0.85), rgba(30, 64, 175, 0.95)), url(https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}
              >
                Contact Us
              </Typography>
              <Typography 
                variant="h6" 
                paragraph
                sx={{
                  maxWidth: '600px',
                  mb: 4,
                  opacity: 0.9
                }}
              >
                Have questions or need assistance? We're here to help. Reach out to our team using the contact information below or send us a message.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact Information Cards */}
      <Container maxWidth="lg" sx={{ mt: -4, mb: 8, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={3}>
          {contactInfo.map((info, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                elevation={3}
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    {info.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom
                    fontWeight="bold"
                  >
                    {info.title}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  {info.content.map((line, i) => (
                    <Typography 
                      key={i} 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        mb: 1,
                        fontSize: '0.9rem'
                      }}
                    >
                      {line}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Contact Form & Map Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 4,
                borderRadius: 3
              }}
            >
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom
                fontWeight="bold"
                sx={{
                  position: 'relative',
                  display: 'inline-block',
                  zIndex: 1,
                  mb: 3,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '30%',
                    width: '100%',
                    background: 'rgba(59, 130, 246, 0.2)',
                    zIndex: -1,
                    borderRadius: 1
                  }
                }}
              >
                Send Us a Message
              </Typography>
              
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={!!errors.name}
                      helperText={errors.name}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number (Optional)"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Inquiry Type"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      variant="outlined"
                    >
                      {inquiryTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      error={!!errors.subject}
                      helperText={errors.subject}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Your Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      error={!!errors.message}
                      helperText={errors.message}
                      required
                      multiline
                      rows={5}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={loading}
                      endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                      sx={{ 
                        py: 1.5,
                        px: 4,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #1e40af, #3b82f6)',
                        boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                        '&:hover': {
                          boxShadow: '0 6px 20px rgba(59, 130, 246, 0.6)',
                        }
                      }}
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
          
          {/* Map & Additional Info */}
          <Grid item xs={12} md={6}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Map */}
              <Paper 
                elevation={3}
                sx={{ 
                  borderRadius: 3,
                  overflow: 'hidden',
                  mb: 3,
                  flexGrow: 1
                }}
              >
                <Box 
                  component="iframe"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215573036935!2d-73.98784492426285!3d40.75838083646191!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b30eac9f%3A0x4170c937da3120f4!2sNew%20York%20Public%20Library%20-%20Stephen%20A.%20Schwarzman%20Building!5e0!3m2!1sen!2sus!4v1698078418827!5m2!1sen!2sus"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Library Location"
                />
              </Paper>
              
              {/* Additional Information */}
              <Paper 
                elevation={3}
                sx={{ 
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'primary.main',
                  color: 'white'
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Additional Information
                </Typography>
                <Typography variant="body2" paragraph sx={{ opacity: 0.9 }}>
                  For immediate assistance, please call our main line during business hours. For research inquiries, our reference librarians are available to help you find the resources you need.
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  We aim to respond to all email inquiries within 24-48 hours during business days.
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      {/* FAQ Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            component="h2" 
            align="center" 
            gutterBottom 
            fontWeight="bold"
            sx={{ mb: 6 }}
          >
            Frequently Asked Questions
          </Typography>
          
          <Grid container spacing={3}>
            {[
              {
                question: "How do I get a library card?",
                answer: "You can apply for a library card in person at any of our branches. Please bring a valid photo ID and proof of address. You can also start the application process online through our website."
              },
              {
                question: "What is the loan period for borrowed items?",
                answer: "Most books can be borrowed for 3 weeks. DVDs and high-demand items have a 1-week loan period. You can renew items up to 3 times if there are no holds on them."
              },
              {
                question: "How do I reserve a study room?",
                answer: "Study rooms can be reserved online through our website, by phone, or in person at the information desk. Reservations can be made up to 2 weeks in advance."
              },
              {
                question: "Do you offer interlibrary loans?",
                answer: "Yes, we participate in interlibrary loan programs. If we don't have an item you're looking for, we can often borrow it from another library. There may be a small fee for this service."
              },
              {
                question: "How can I donate books to the library?",
                answer: "We welcome donations of books in good condition. Please bring them to the circulation desk during regular hours. For large donations, please contact us in advance."
              },
              {
                question: "Are there late fees for overdue items?",
                answer: "We have eliminated daily late fees on most items. However, if an item is more than 30 days overdue, you will be charged a replacement fee. This fee will be waived if you return the item."
              }
            ].map((faq, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper 
                  elevation={1}
                  sx={{ 
                    p: 3,
                    height: '100%',
                    borderRadius: 3
                  }}
                >
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom
                    fontWeight="bold"
                    color="primary.main"
                  >
                    {faq.question}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Snackbar for form submission */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;