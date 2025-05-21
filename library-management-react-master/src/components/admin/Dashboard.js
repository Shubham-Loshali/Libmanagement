import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Card, 
  CardContent, 
  CardActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  Book as BookIcon, 
  Person as PersonIcon, 
  Assignment as AssignmentIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchStats } from '../../services/adminService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    totalUsers: 0,
    overdueBooks: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll simulate data
    const loadStats = async () => {
      try {
        // const data = await fetchStats();
        // Simulated data
        const data = {
          totalBooks: 1250,
          availableBooks: 980,
          borrowedBooks: 270,
          totalUsers: 345,
          overdueBooks: 15,
          recentActivities: [
            { id: 1, action: 'Book borrowed', user: 'John Doe', book: 'The Great Gatsby', date: '2023-10-15' },
            { id: 2, action: 'Book returned', user: 'Jane Smith', book: 'To Kill a Mockingbird', date: '2023-10-14' },
            { id: 3, action: 'New book added', user: 'Admin', book: 'The Hobbit', date: '2023-10-13' },
            { id: 4, action: 'User registered', user: 'Mark Johnson', book: '', date: '2023-10-12' },
          ]
        };
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
        setLoading(false);
      }
    };
    
    loadStats();
  }, []);

  const StatCard = ({ title, value, icon, color, onClick }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: color }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {icon}
          <Typography variant="h6" component="div" ml={1}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" component="div" align="center" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onClick}>View Details</Button>
      </CardActions>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Books" 
            value={stats.totalBooks} 
            icon={<BookIcon />} 
            color="#e3f2fd"
            onClick={() => navigate('/admin/books')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Borrowed Books" 
            value={stats.borrowedBooks} 
            icon={<AssignmentIcon />} 
            color="#e8f5e9"
            onClick={() => navigate('/admin/borrowed')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon={<PersonIcon />} 
            color="#fff8e1"
            onClick={() => navigate('/admin/users')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Overdue Books" 
            value={stats.overdueBooks} 
            icon={<WarningIcon />} 
            color="#ffebee"
            onClick={() => navigate('/admin/overdue')}
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <List>
              {stats.recentActivities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem>
                    <ListItemText 
                      primary={activity.action} 
                      secondary={`${activity.user}${activity.book ? ` - ${activity.book}` : ''} (${activity.date})`} 
                    />
                  </ListItem>
                  {index < stats.recentActivities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button variant="text" onClick={() => navigate('/admin/activities')}>
                View All Activities
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  startIcon={<BookIcon />}
                  onClick={() => navigate('/admin/books/add')}
                >
                  Add New Book
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  startIcon={<PersonIcon />}
                  onClick={() => navigate('/admin/users/add')}
                >
                  Register User
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  startIcon={<AssignmentIcon />}
                  onClick={() => navigate('/admin/issue-book')}
                >
                  Issue Book
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  startIcon={<AssignmentIcon />}
                  onClick={() => navigate('/admin/return-book')}
                >
                  Return Book
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;