import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  Event as EventIcon,
  CalendarMonth as CalendarMonthIcon,
  LocationOn as LocationOnIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  FilterList as FilterListIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Events = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentTab, setCurrentTab] = useState(0);

  // Mock event data
  const events = [
    {
      id: 1,
      title: "Book Club: 'The Midnight Library' Discussion",
      description: "Join us for an engaging discussion about Matt Haig's bestselling novel 'The Midnight Library'. We'll explore themes of regret, possibility, and the choices that make a life worth living.",
      date: "October 15, 2023",
      time: "6:00 PM - 7:30 PM",
      location: "Main Library Hall",
      category: "Book Club",
      host: "Sarah Johnson",
      hostImage: "https://randomuser.me/api/portraits/women/44.jpg",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      attendees: 18,
      maxAttendees: 25,
      featured: true
    },
    {
      id: 2,
      title: "Author Talk: Modern Fiction Writing",
      description: "Award-winning author James Patterson shares insights into the craft of fiction writing in the modern publishing landscape. Learn about character development, plot structure, and getting published.",
      date: "October 20, 2023",
      time: "5:30 PM - 7:00 PM",
      location: "Conference Room B",
      category: "Author Talk",
      host: "Library Events Team",
      hostImage: "https://randomuser.me/api/portraits/men/32.jpg",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      attendees: 45,
      maxAttendees: 60,
      featured: true
    },
    {
      id: 3,
      title: "Children's Story Time",
      description: "A fun-filled hour of storytelling for children ages 3-6. This week's theme is 'Adventures in Space' featuring books about planets, stars, and space exploration.",
      date: "October 22, 2023",
      time: "10:00 AM - 11:00 AM",
      location: "Children's Section",
      category: "Children",
      host: "Emily Parker",
      hostImage: "https://randomuser.me/api/portraits/women/68.jpg",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      attendees: 12,
      maxAttendees: 20,
      featured: false
    },
    {
      id: 4,
      title: "Digital Literacy Workshop: Basics of Internet Safety",
      description: "Learn essential skills for staying safe online. Topics include password security, recognizing phishing attempts, protecting personal information, and safe browsing practices.",
      date: "October 25, 2023",
      time: "4:00 PM - 6:00 PM",
      location: "Computer Lab",
      category: "Workshop",
      host: "Tech Team",
      hostImage: "https://randomuser.me/api/portraits/men/22.jpg",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      attendees: 15,
      maxAttendees: 20,
      featured: false
    },
    {
      id: 5,
      title: "Poetry Reading Night",
      description: "An evening celebrating poetry both classic and contemporary. Local poets will share their work, and attendees are welcome to bring a poem to read during the open mic portion.",
      date: "November 2, 2023",
      time: "7:00 PM - 9:00 PM",
      location: "Reading Garden",
      category: "Literary",
      host: "Michael Chang",
      hostImage: "https://randomuser.me/api/portraits/men/42.jpg",
      image: "https://images.unsplash.com/photo-1470549638415-0a0755be0619?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      attendees: 28,
      maxAttendees: 40,
      featured: true
    },
    {
      id: 6,
      title: "Research Database Training",
      description: "Learn how to effectively use the library's research databases for academic and professional research. Perfect for students, educators, and lifelong learners.",
      date: "November 5, 2023",
      time: "3:00 PM - 4:30 PM",
      location: "Study Room 3",
      category: "Educational",
      host: "Research Team",
      hostImage: "https://randomuser.me/api/portraits/women/28.jpg",
      image: "https://images.unsplash.com/photo-1423592707957-3b212afa6733?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      attendees: 10,
      maxAttendees: 15,
      featured: false
    },
    {
      id: 7,
      title: "Film Screening: Classic Cinema Series",
      description: "Join us for a screening of Alfred Hitchcock's 'Rear Window' followed by a discussion about the film's themes, cinematography, and historical context.",
      date: "November 10, 2023",
      time: "6:30 PM - 9:00 PM",
      location: "Multimedia Room",
      category: "Film",
      host: "Film Club",
      hostImage: "https://randomuser.me/api/portraits/men/52.jpg",
      image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      attendees: 32,
      maxAttendees: 40,
      featured: false
    },
    {
      id: 8,
      title: "Local History Lecture Series",
      description: "Discover the fascinating history of our community with local historian Dr. Amanda Lewis. This month's topic: 'The Industrial Revolution's Impact on Our Town'.",
      date: "November 15, 2023",
      time: "5:00 PM - 6:30 PM",
      location: "Main Library Hall",
      category: "Educational",
      host: "Dr. Amanda Lewis",
      hostImage: "https://randomuser.me/api/portraits/women/76.jpg",
      image: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      attendees: 38,
      maxAttendees: 50,
      featured: true
    }
  ];

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would trigger a search
    console.log('Searching for:', searchQuery);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Filter events based on search query, category filter, and current tab
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'all' || event.category === filter;
    
    const matchesTab = (currentTab === 0) || // All events
                      (currentTab === 1 && new Date(event.date) >= new Date()) || // Upcoming
                      (currentTab === 2 && event.featured); // Featured
    
    return matchesSearch && matchesFilter && matchesTab;
  });

  // Get unique categories for filter dropdown
  const categories = ['all', ...new Set(events.map(event => event.category))];

  return (
    <Box sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          py: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(rgba(30, 64, 175, 0.85), rgba(30, 64, 175, 0.95)), url(https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Decorative elements */}
        <Box sx={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
          top: '-100px',
          right: '10%',
          zIndex: 0
        }} />
        <Box sx={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
          bottom: '-50px',
          left: '5%',
          zIndex: 0
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
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
                Library Events & Programs
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
                Discover our diverse range of events, workshops, and activities designed to engage, educate, and entertain our community.
              </Typography>
              
              {/* Search Bar */}
              <Box 
                component="form" 
                onSubmit={handleSearch}
                sx={{ 
                  display: 'flex', 
                  maxWidth: '500px',
                  bgcolor: 'white',
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  overflow: 'hidden'
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    ),
                    sx: { 
                      borderRadius: 2,
                      bgcolor: 'white',
                      '& fieldset': { border: 'none' }
                    }
                  }}
                />
                <Button 
                  type="submit"
                  variant="contained" 
                  size="large"
                  sx={{ 
                    borderRadius: '0 8px 8px 0',
                    px: 3
                  }}
                >
                  Search
                </Button>
              </Box>
            </Grid>
            
            {!isMobile && (
              <Grid item xs={12} md={5}>
                <Box 
                  sx={{ 
                    position: 'relative',
                    height: '300px',
                    width: '100%'
                  }}
                >
                  {/* Decorative calendar elements */}
                  <Paper 
                    elevation={6}
                    sx={{
                      position: 'absolute',
                      width: '200px',
                      height: '220px',
                      borderRadius: 4,
                      top: '10%',
                      left: '15%',
                      background: 'white',
                      transform: 'rotate(-5deg)',
                      overflow: 'hidden',
                      zIndex: 2
                    }}
                  >
                    <Box sx={{ 
                      bgcolor: 'secondary.main', 
                      color: 'white', 
                      p: 1,
                      textAlign: 'center'
                    }}>
                      <Typography variant="h6" fontWeight="bold">OCTOBER</Typography>
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Grid container spacing={1}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20, 22, 25].map((day) => (
                          <Grid item key={day} xs={3}>
                            <Box 
                              sx={{ 
                                width: '100%',
                                aspectRatio: '1/1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 1,
                                bgcolor: [15, 20, 22].includes(day) ? 'primary.main' : 'grey.100',
                                color: [15, 20, 22].includes(day) ? 'white' : 'text.primary',
                                fontWeight: [15, 20, 22].includes(day) ? 'bold' : 'normal'
                              }}
                            >
                              {day}
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Paper>
                  
                  <Paper 
                    elevation={6}
                    sx={{
                      position: 'absolute',
                      width: '180px',
                      height: '200px',
                      borderRadius: 4,
                      top: '25%',
                      right: '10%',
                      background: 'white',
                      transform: 'rotate(8deg)',
                      overflow: 'hidden',
                      zIndex: 1
                    }}
                  >
                    <Box sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white', 
                      p: 1,
                      textAlign: 'center'
                    }}>
                      <Typography variant="h6" fontWeight="bold">NOVEMBER</Typography>
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Grid container spacing={1}>
                        {[1, 2, 5, 7, 8, 10, 12, 15, 18, 20, 22, 25].map((day) => (
                          <Grid item key={day} xs={3}>
                            <Box 
                              sx={{ 
                                width: '100%',
                                aspectRatio: '1/1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 1,
                                bgcolor: [2, 5, 10, 15].includes(day) ? 'secondary.main' : 'grey.100',
                                color: [2, 5, 10, 15].includes(day) ? 'white' : 'text.primary',
                                fontWeight: [2, 5, 10, 15].includes(day) ? 'bold' : 'normal'
                              }}
                            >
                              {day}
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Paper>
                </Box>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      {/* Events Content */}
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        {/* Filters and Tabs */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'center' },
            mb: 4,
            gap: 2
          }}
        >
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0'
              },
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                minWidth: 100
              }
            }}
          >
            <Tab label="All Events" />
            <Tab label="Upcoming" />
            <Tab label="Featured" />
          </Tabs>
          
          <TextField
            select
            value={filter}
            onChange={handleFilterChange}
            variant="outlined"
            size="small"
            sx={{ 
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterListIcon fontSize="small" />
                </InputAdornment>
              )
            }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="300px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            {filteredEvents.length === 0 ? (
              <Paper 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  borderRadius: 3,
                  bgcolor: 'grey.50'
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No events found matching your criteria
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search or filters to find events
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {filteredEvents.map((event) => (
                  <Grid item key={event.id} xs={12} md={6} lg={4}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                          '& .event-image': {
                            transform: 'scale(1.05)'
                          }
                        }
                      }}
                    >
                      {event.featured && (
                        <Chip 
                          label="Featured" 
                          color="secondary"
                          sx={{ 
                            position: 'absolute', 
                            top: 16, 
                            right: 16, 
                            zIndex: 2,
                            fontWeight: 'bold',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                          }} 
                        />
                      )}
                      
                      <Box 
                        sx={{ 
                          position: 'relative',
                          height: 200,
                          overflow: 'hidden'
                        }}
                      >
                        <Box 
                          component="img"
                          className="event-image"
                          src={event.image}
                          alt={event.title}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease'
                          }}
                        />
                        <Box 
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
                            p: 2,
                            pt: 4
                          }}
                        >
                          <Chip 
                            label={event.category} 
                            size="small"
                            sx={{ 
                              bgcolor: 'white', 
                              fontWeight: 'bold',
                              color: 'primary.main'
                            }} 
                          />
                        </Box>
                      </Box>
                      
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography 
                          variant="h5" 
                          component="h2" 
                          gutterBottom
                          sx={{ 
                            fontWeight: 'bold',
                            fontSize: '1.25rem',
                            lineHeight: 1.3
                          }}
                        >
                          {event.title}
                        </Typography>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            mb: 3,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {event.description}
                        </Typography>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CalendarMonthIcon 
                                fontSize="small" 
                                color="primary" 
                                sx={{ mr: 1 }} 
                              />
                              <Typography variant="body2" fontWeight={500}>
                                {event.date}
                              </Typography>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTimeIcon 
                                fontSize="small" 
                                color="action" 
                                sx={{ mr: 1 }} 
                              />
                              <Typography variant="body2" color="text.secondary">
                                {event.time}
                              </Typography>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LocationOnIcon 
                                fontSize="small" 
                                color="action" 
                                sx={{ mr: 1 }} 
                              />
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                noWrap
                              >
                                {event.location}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              src={event.hostImage} 
                              alt={event.host}
                              sx={{ width: 32, height: 32, mr: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {event.host}
                            </Typography>
                          </Box>
                          
                          <Chip 
                            label={`${event.attendees}/${event.maxAttendees}`} 
                            size="small"
                            icon={<PersonIcon fontSize="small" />}
                            color={event.attendees >= event.maxAttendees ? "error" : "default"}
                          />
                        </Box>
                      </CardContent>
                      
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Button 
                          variant="contained" 
                          fullWidth
                          sx={{ 
                            borderRadius: 2,
                            py: 1,
                            background: event.attendees >= event.maxAttendees 
                              ? 'grey.500' 
                              : 'linear-gradient(45deg, #1e40af, #3b82f6)',
                            boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)',
                            '&:hover': {
                              boxShadow: '0 6px 15px rgba(59, 130, 246, 0.4)',
                            }
                          }}
                          disabled={event.attendees >= event.maxAttendees}
                        >
                          {event.attendees >= event.maxAttendees ? 'Fully Booked' : 'Register Now'}
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Container>
      
      {/* Call to Action */}
      <Container maxWidth="lg" sx={{ mt: 10, mb: 6 }}>
        <Paper
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
            top: '-150px',
            right: '-50px',
            zIndex: 0
          }} />
          
          <Grid container spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid item xs={12} md={7}>
              <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
                Host Your Own Event
              </Typography>
              <Typography variant="h6" paragraph sx={{ opacity: 0.9, mb: 3 }}>
                Have an idea for a community event? We welcome proposals from individuals and organizations.
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  bgcolor: 'white', 
                  color: 'primary.dark',
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
              >
                Submit a Proposal
              </Button>
            </Grid>
            
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box 
                component="img"
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="People collaborating"
                sx={{
                  width: '100%',
                  height: 300,
                  objectFit: 'cover',
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Events;