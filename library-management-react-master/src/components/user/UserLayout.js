import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  useMediaQuery,
  useTheme,
  InputBase,
  alpha,
  Tooltip,
  Grid
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  MenuBook as MenuBookIcon,
  Event as EventIcon,
  Info as InfoIcon,
  ContactMail as ContactIcon,
  AccountCircle,
  Notifications as NotificationsIcon,
  Bookmark as BookmarkIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

const UserLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  // Use auth context instead of local state
  const { isAuthenticated, currentUser, logout } = useAuth();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      if (drawerOpen) {
        setDrawerOpen(false);
      }
    }
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Book Catalog', icon: <MenuBookIcon />, path: '/catalog' },
    { text: 'Events', icon: <EventIcon />, path: '/events' },
    { text: 'About Us', icon: <InfoIcon />, path: '/about' },
    { text: 'Contact', icon: <ContactIcon />, path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const notifications = [
    { id: 1, message: 'Your reserved book is ready for pickup', time: '2 hours ago' },
    { id: 2, message: 'Book due in 2 days: The Great Gatsby', time: '1 day ago' },
    { id: 3, message: 'New arrivals in your favorite category', time: '3 days ago' },
  ];

  const userMenuItems = isAuthenticated
    ? [
        { text: 'My Profile', icon: <AccountCircle />, path: '/profile' },
        { text: 'My Books', icon: <BookmarkIcon />, path: '/my-books' },
        { text: 'Borrowing History', icon: <HistoryIcon />, path: '/history' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
      ]
    : [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar 
        position="sticky" 
        sx={{ 
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              fontFamily: 'monospace',
              fontWeight: 800,
              letterSpacing: '.3rem',
              color: 'white',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 },
              textShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          >
            LIBRARY
          </Typography>
          
          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                component={Link}
                to={item.path}
                sx={{ 
                  my: 2, 
                  color: 'white', 
                  display: 'block',
                  borderBottom: isActive(item.path) ? '2px solid white' : 'none',
                  borderRadius: 0,
                  mx: 1,
                  fontWeight: isActive(item.path) ? 'bold' : 'normal',
                  px: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
          
          {/* Search Bar */}
          <Box 
            component="form"
            onSubmit={handleSearch}
            sx={{ 
              position: 'relative',
              borderRadius: theme.shape.borderRadius,
              backgroundColor: alpha(theme.palette.common.white, 0.15),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.25),
              },
              marginRight: theme.spacing(2),
              marginLeft: 0,
              width: '100%',
              display: { xs: 'none', sm: 'block' },
              maxWidth: 300
            }}
          >
            <Box sx={{ padding: theme.spacing(0, 2), height: '100%', position: 'absolute', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SearchIcon />
            </Box>
            <InputBase
              placeholder="Search books…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                color: 'inherit',
                width: '100%',
                '& .MuiInputBase-input': {
                  padding: theme.spacing(1, 1, 1, 0),
                  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                  transition: theme.transitions.create('width'),
                  width: '100%',
                },
              }}
            />
          </Box>
          
          {/* User Actions */}
          {isAuthenticated ? (
            <Box sx={{ display: 'flex' }}>
              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton 
                  color="inherit" 
                  onClick={handleNotificationMenuOpen}
                  sx={{ position: 'relative' }}
                >
                  <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              {/* Profile */}
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {currentUser?.name?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Box>
              <Button 
                variant="contained"
                color="secondary"
                component={Link}
                to="/login"
                sx={{ 
                  mr: 1, 
                  display: { xs: 'none', sm: 'inline-flex' },
                  fontWeight: 'bold'
                }}
              >
                Login
              </Button>
              <Button 
                variant="outlined" 
                color="secondary"
                component={Link}
                to="/register"
                sx={{ 
                  display: { xs: 'none', sm: 'inline-flex' },
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Register
              </Button>
              <IconButton
                color="inherit"
                component={Link}
                to="/login"
                sx={{ display: { sm: 'none' } }}
              >
                <AccountCircle />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 800,
                letterSpacing: '.3rem',
                flexGrow: 1,
                color: theme.palette.primary.main
              }}
            >
              LIBRARY
            </Typography>
            <IconButton onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          </Box>
          
          {/* Mobile Search */}
          <Box 
            component="form"
            onSubmit={handleSearch}
            sx={{ 
              display: 'flex',
              mb: 2
            }}
          >
            <InputBase
              placeholder="Search books…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                pl: 2,
                flexGrow: 1
              }}
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {/* Navigation Items */}
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={isActive(item.path)}
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          {/* User Menu Items */}
          {isAuthenticated ? (
            <List>
              {userMenuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    onClick={handleDrawerToggle}
                  >
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </List>
          ) : (
            <Box sx={{ mt: 'auto', p: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                fullWidth 
                component={Link}
                to="/login"
                onClick={handleDrawerToggle}
                sx={{ 
                  mb: 1,
                  fontWeight: 'bold',
                  py: 1
                }}
              >
                Login
              </Button>
              <Button 
                variant="outlined" 
                color="primary"
                fullWidth
                component={Link}
                to="/register"
                onClick={handleDrawerToggle}
                sx={{
                  fontWeight: 'bold',
                  py: 1
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
      
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <FooterGrid container spacing={4}>
            <FooterGrid item xs={12} sm={4}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Library Management System
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Providing knowledge and resources to our community since 2023.
              </Typography>
            </FooterGrid>
            <FooterGrid item xs={12} sm={4}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Quick Links
              </Typography>
              <Link to="/catalog" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Book Catalog
                </Typography>
              </Link>
              <Link to="/events" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Events
                </Typography>
              </Link>
              <Link to="/about" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  About Us
                </Typography>
              </Link>
              <Link to="/contact" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="text.secondary">
                  Contact
                </Typography>
              </Link>
            </FooterGrid>
            <FooterGrid item xs={12} sm={4}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                123 Library Street, Booktown
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Email: info@library.com
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phone: (123) 456-7890
              </Typography>
            </FooterGrid>
          </FooterGrid>
          <Box mt={3}>
            <Divider />
            <Typography variant="body2" color="text.secondary" align="center" sx={{ pt: 2 }}>
              © {new Date().getFullYear()} Library Management System. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
      
      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {isAuthenticated ? (
          [
            <MenuItem key="profile" onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              My Profile
            </MenuItem>,
            <MenuItem key="books" onClick={() => { handleProfileMenuClose(); navigate('/my-books'); }}>
              <ListItemIcon>
                <BookmarkIcon fontSize="small" />
              </ListItemIcon>
              My Books
            </MenuItem>,
            <MenuItem key="history" onClick={() => { handleProfileMenuClose(); navigate('/history'); }}>
              <ListItemIcon>
                <HistoryIcon fontSize="small" />
              </ListItemIcon>
              Borrowing History
            </MenuItem>,
            <Divider key="divider" />,
            <MenuItem key="logout" onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          ]
        ) : (
          [
            <MenuItem key="login" onClick={() => { handleProfileMenuClose(); navigate('/login'); }}>
              Login
            </MenuItem>,
            <MenuItem key="register" onClick={() => { handleProfileMenuClose(); navigate('/register'); }}>
              Register
            </MenuItem>
          ]
        )}
      </Menu>
      
      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
          <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
        </Box>
        {notifications.map((notification) => (
          <MenuItem key={notification.id} onClick={handleNotificationMenuClose} sx={{ py: 1.5 }}>
            <Box>
              <Typography variant="body2">{notification.message}</Typography>
              <Typography variant="caption" color="text.secondary">{notification.time}</Typography>
            </Box>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleNotificationMenuClose} sx={{ justifyContent: 'center' }}>
          <Typography variant="body2" color="primary">View All Notifications</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

// Custom Grid component for the footer
const FooterGrid = ({ container, item, xs, sm, md, lg, children, spacing, ...props }) => {
  const getGridStyles = () => {
    let styles = {};
    
    if (container) {
      styles.display = 'flex';
      styles.flexWrap = 'wrap';
      styles.margin = spacing ? `-${spacing * 4}px` : 0;
    }
    
    if (item) {
      styles.padding = spacing ? `${spacing * 4}px` : 0;
      
      // Handle responsive widths
      if (xs) styles.width = `${(xs / 12) * 100}%`;
      
      if (sm) {
        styles['@media (min-width: 600px)'] = {
          width: `${(sm / 12) * 100}%`
        };
      }
      
      if (md) {
        styles['@media (min-width: 900px)'] = {
          width: `${(md / 12) * 100}%`
        };
      }
      
      if (lg) {
        styles['@media (min-width: 1200px)'] = {
          width: `${(lg / 12) * 100}%`
        };
      }
    }
    
    return styles;
  };
  
  return (
    <Box sx={getGridStyles()} {...props}>
      {children}
    </Box>
  );
};

export default UserLayout;