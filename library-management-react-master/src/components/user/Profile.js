import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Notifications as NotificationsIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, changePassword } from '../../services/authService';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);

const Profile = () => {
  const theme = useTheme();
  const { currentUser, updateUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleEditToggle = () => {
    if (editMode) {
      // Reset form if canceling edit
      setProfileData({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        address: currentUser?.address || ''
      });
    }
    setEditMode(!editMode);
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate form
      if (!profileData.name || !profileData.email) {
        throw new Error('Name and email are required');
      }
      
      // Update profile
      const updatedUser = await updateProfile(profileData);
      
      // Update user in context
      updateUser(updatedUser);
      
      // Show success message
      setAlert({
        show: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
      
      // Exit edit mode
      setEditMode(false);
    } catch (error) {
      setAlert({
        show: true,
        message: error.message || 'Failed to update profile',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate form
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        throw new Error('All fields are required');
      }
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('New passwords do not match');
      }
      
      if (passwordData.newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long');
      }
      
      // Change password
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // Show success message
      setAlert({
        show: true,
        message: 'Password changed successfully',
        severity: 'success'
      });
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setAlert({
        show: true,
        message: error.message || 'Failed to change password',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        My Profile
      </Typography>
      
      <Grid container spacing={4}>
        {/* Left Column - Profile Info */}
        <Grid item xs={12} md={4}>
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            elevation={0}
            sx={{ 
              p: 3, 
              textAlign: 'center',
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                src={currentUser?.profileImage}
                alt={currentUser?.name}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: 'auto',
                  border: `4px solid ${theme.palette.primary.main}`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                {currentUser?.name?.charAt(0) || <PersonIcon fontSize="large" />}
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  }
                }}
              >
                <PhotoCameraIcon />
              </IconButton>
            </Box>
            
            <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
              {currentUser?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentUser?.email}
            </Typography>
            
            <Box 
              sx={{ 
                mt: 3, 
                p: 2, 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="body2" fontWeight="medium">
                Member since
              </Typography>
              <Typography variant="body2">
                {new Date(currentUser?.membershipDate || Date.now()).toLocaleDateString()}
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                mt: 2, 
                p: 2, 
                bgcolor: alpha(theme.palette.success.main, 0.1),
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="body2" fontWeight="medium">
                Membership Status
              </Typography>
              <Typography variant="body2" color="success.main" fontWeight="bold">
                Active
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                mt: 2, 
                p: 2, 
                bgcolor: alpha(theme.palette.info.main, 0.1),
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="body2" fontWeight="medium">
                Role
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {currentUser?.role === 'admin' ? 'Administrator' : 
                 currentUser?.role === 'librarian' ? 'Librarian' : 'Member'}
              </Typography>
            </Box>
          </MotionPaper>
        </Grid>
        
        {/* Right Column - Tabs */}
        <Grid item xs={12} md={8}>
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            elevation={0}
            sx={{ 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              overflow: 'hidden'
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
            >
              <Tab icon={<PersonIcon />} label="Personal Info" iconPosition="start" />
              <Tab icon={<LockIcon />} label="Security" iconPosition="start" />
              <Tab icon={<NotificationsIcon />} label="Notifications" iconPosition="start" />
              <Tab icon={<HistoryIcon />} label="Activity" iconPosition="start" />
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {alert.show && (
                <Alert 
                  severity={alert.severity} 
                  sx={{ mb: 3 }}
                  onClose={() => setAlert({ ...alert, show: false })}
                >
                  {alert.message}
                </Alert>
              )}
              
              {/* Personal Info Tab */}
              {activeTab === 0 && (
                <Box component="form" onSubmit={handleProfileSubmit}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6">Personal Information</Typography>
                    <Button
                      startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                      onClick={handleEditToggle}
                      color={editMode ? "error" : "primary"}
                      variant="outlined"
                      size="small"
                    >
                      {editMode ? 'Cancel' : 'Edit'}
                    </Button>
                  </Box>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                        multiline
                        rows={3}
                      />
                    </Grid>
                  </Grid>
                  
                  {editMode && (
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                        disabled={loading}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
              
              {/* Security Tab */}
              {activeTab === 1 && (
                <Box component="form" onSubmit={handlePasswordSubmit}>
                  <Typography variant="h6" gutterBottom>
                    Change Password
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Ensure your account is using a strong password to stay secure.
                  </Typography>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        helperText="Password must be at least 6 characters long"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                      disabled={loading}
                    >
                      Update Password
                    </Button>
                  </Box>
                </Box>
              )}
              
              {/* Notifications Tab */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Notification Preferences
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Manage how you receive notifications from the library.
                  </Typography>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="body1" align="center" color="text.secondary" sx={{ py: 4 }}>
                    Notification settings coming soon...
                  </Typography>
                </Box>
              )}
              
              {/* Activity Tab */}
              {activeTab === 3 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    View your recent account activity and login history.
                  </Typography>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="body1" align="center" color="text.secondary" sx={{ py: 4 }}>
                    Activity history coming soon...
                  </Typography>
                </Box>
              )}
            </Box>
          </MotionPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;