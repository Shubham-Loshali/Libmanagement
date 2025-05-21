import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  useTheme
} from '@mui/material';
import {
  Lock as LockIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const Unauthorized = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        component={Paper}
        elevation={0}
        sx={{ 
          p: 4, 
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          textAlign: 'center'
        }}
      >
        <Box 
          sx={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            bgcolor: theme.palette.error.light,
            color: theme.palette.error.contrastText,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}
        >
          <LockIcon sx={{ fontSize: 40 }} />
        </Box>
        
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Access Denied
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 600, mx: 'auto' }}>
          You don't have permission to access this page. If you believe this is an error, please contact the library administrator.
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            component={RouterLink}
            to="/"
            startIcon={<HomeIcon />}
          >
            Go to Homepage
          </Button>
          
          <Button
            variant="outlined"
            component={RouterLink}
            to="/contact"
          >
            Contact Support
          </Button>
        </Box>
      </MotionBox>
    </Container>
  );
};

export default Unauthorized;