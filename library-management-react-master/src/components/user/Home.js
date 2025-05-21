import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Divider,
  Paper,
  CircularProgress,
  useTheme,
  Rating
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowForward as ArrowForwardIcon,
  MenuBook as MenuBookIcon,
  LocalLibrary as LocalLibraryIcon,
  Event as EventIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { fetchFeaturedBooks, fetchNewArrivals } from '../../services/bookService';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll simulate data
    const loadData = async () => {
      try {
        // Simulated featured books data with enhanced properties
        const featuredData = [
          { 
            id: 1, 
            title: 'To Kill a Mockingbird', 
            author: 'Harper Lee', 
            coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg', 
            category: 'Fiction',
            rating: 4.8,
            reviewCount: 1243,
            description: 'A gripping, heart-wrenching tale of racial injustice in the Deep South.',
            tags: ['Classic', 'Pulitzer Prize']
          },
          { 
            id: 2, 
            title: 'The Great Gatsby', 
            author: 'F. Scott Fitzgerald', 
            coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg', 
            category: 'Fiction',
            rating: 4.5,
            reviewCount: 987,
            description: 'A portrait of the Jazz Age in all of its decadence and excess.',
            tags: ['Classic', '1920s']
          },
          { 
            id: 3, 
            title: '1984', 
            author: 'George Orwell', 
            coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg', 
            category: 'Science Fiction',
            rating: 4.7,
            reviewCount: 1567,
            description: 'A dystopian social science fiction novel and cautionary tale.',
            tags: ['Dystopian', 'Political']
          },
          { 
            id: 4, 
            title: 'Pride and Prejudice', 
            author: 'Jane Austen', 
            coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg', 
            category: 'Romance',
            rating: 4.6,
            reviewCount: 1089,
            description: 'A romantic novel of manners that depicts the emotional development of the protagonist.',
            tags: ['Classic', 'Romance']
          },
        ];
        
        // Simulated new arrivals data with enhanced properties
        const newArrivalsData = [
          { 
            id: 5, 
            title: 'The Lord of the Rings', 
            author: 'J.R.R. Tolkien', 
            coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1566425108i/33.jpg', 
            category: 'Fantasy', 
            addedDate: '2023-10-01',
            rating: 4.9,
            reviewCount: 2134,
            description: 'An epic high-fantasy novel that follows the quest to destroy the One Ring.',
            tags: ['Epic', 'Adventure']
          },
          { 
            id: 6, 
            title: 'The Road', 
            author: 'Cormac McCarthy', 
            coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1600241424i/6288.jpg', 
            category: 'Post-Apocalyptic', 
            addedDate: '2023-09-28',
            rating: 4.3,
            reviewCount: 876,
            description: 'A post-apocalyptic novel about a journey of a father and his young son.',
            tags: ['Survival', 'Pulitzer Prize']
          },
          { 
            id: 7, 
            title: 'The Catcher in the Rye', 
            author: 'J.D. Salinger', 
            coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg', 
            category: 'Fiction', 
            addedDate: '2023-09-25',
            rating: 4.2,
            reviewCount: 945,
            description: 'A novel about the teenage angst and alienation of its protagonist.',
            tags: ['Coming-of-age', 'Classic']
          },
          { 
            id: 8, 
            title: 'Crime and Punishment', 
            author: 'Fyodor Dostoevsky', 
            coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1382846449i/7144.jpg', 
            category: 'Psychological Fiction', 
            addedDate: '2023-09-20',
            rating: 4.6,
            reviewCount: 1023,
            description: 'A novel that focuses on the mental anguish and moral dilemmas of its protagonist.',
            tags: ['Classic', 'Russian Literature']
          },
        ];
        
        // Short timeout to simulate loading
        setTimeout(() => {
          setFeaturedBooks(featuredData);
          setNewArrivals(newArrivalsData);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error loading home page data:', error);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const upcomingEvents = [
    { id: 1, title: 'Book Club Meeting', date: 'October 15, 2023', time: '6:00 PM', location: 'Main Library Hall' },
    { id: 2, title: 'Author Talk: Modern Fiction', date: 'October 20, 2023', time: '5:30 PM', location: 'Conference Room B' },
    { id: 3, title: 'Children\'s Story Time', date: 'October 22, 2023', time: '10:00 AM', location: 'Children\'s Section' },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  // Categories for quick navigation
  const categories = [
    { id: 'all', label: 'All Books' },
    { id: 'fiction', label: 'Fiction' },
    { id: 'science', label: 'Science Fiction' },
    { id: 'fantasy', label: 'Fantasy' },
    { id: 'trending', label: 'Trending Now' },
    { id: 'award', label: 'Award Winners' }
  ];

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId !== 'all') {
      navigate(`/catalog?category=${encodeURIComponent(categoryId)}`);
    } else {
      navigate('/catalog');
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          py: 8,
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                Discover Your Next Favorite Book
              </Typography>
              <Typography variant="h6" paragraph>
                Explore our vast collection of books, journals, and digital resources.
              </Typography>
              <Box 
                component="form" 
                onSubmit={handleSearch}
                sx={{ 
                  display: 'flex', 
                  mt: 4,
                  bgcolor: 'white',
                  borderRadius: 1,
                  boxShadow: 3
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Search by title, author, or ISBN..."
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
                      borderRadius: 1,
                      bgcolor: 'white',
                      '& fieldset': { border: 'none' }
                    }
                  }}
                />
                <Button 
                  type="submit"
                  variant="contained" 
                  size="large"
                  sx={{ borderRadius: '0 4px 4px 0' }}
                >
                  Search
                </Button>
              </Box>
              
              {/* Quick category navigation */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                  Quick Browse:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {categories.map(category => (
                    <Chip
                      key={category.id}
                      label={category.label}
                      onClick={() => handleCategorySelect(category.id)}
                      color={selectedCategory === category.id ? "primary" : "default"}
                      variant={selectedCategory === category.id ? "filled" : "outlined"}
                      sx={{
                        bgcolor: selectedCategory === category.id ? 'primary.main' : 'rgba(255, 255, 255, 0.9)',
                        color: selectedCategory === category.id ? 'white' : 'text.primary',
                        '&:hover': {
                          bgcolor: selectedCategory === category.id ? 'primary.dark' : 'rgba(255, 255, 255, 1)',
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  position: 'relative',
                  height: 300
                }}
              >
                {/* Stacked books illustration */}
                <Box 
                  sx={{ 
                    width: 180, 
                    height: 250, 
                    bgcolor: '#f44336', 
                    position: 'absolute',
                    bottom: 0,
                    transform: 'rotate(-10deg)',
                    boxShadow: 3,
                    zIndex: 3
                  }} 
                />
                <Box 
                  sx={{ 
                    width: 180, 
                    height: 220, 
                    bgcolor: '#2196f3', 
                    position: 'absolute',
                    bottom: 20,
                    left: 50,
                    transform: 'rotate(5deg)',
                    boxShadow: 3,
                    zIndex: 2
                  }} 
                />
                <Box 
                  sx={{ 
                    width: 180, 
                    height: 200, 
                    bgcolor: '#4caf50', 
                    position: 'absolute',
                    bottom: 40,
                    left: 100,
                    transform: 'rotate(15deg)',
                    boxShadow: 3,
                    zIndex: 1
                  }} 
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Books Section */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 6 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h2" fontWeight="bold">
            Featured Books
          </Typography>
          <Button 
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/catalog')}
          >
            View All Books
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {featuredBooks.map((book) => (
            <Grid item key={book.id} xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="250"
                  image={book.coverImage}
                  alt={book.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Chip 
                    label={book.category} 
                    size="small" 
                    color="primary" 
                    sx={{ mb: 1 }} 
                  />
                  <Typography variant="h6" component="div" gutterBottom noWrap>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    by {book.author}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Rating 
                      value={book.rating} 
                      precision={0.5} 
                      size="small" 
                      readOnly 
                    />
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ ml: 1, fontSize: '0.75rem' }}
                    >
                      ({book.reviewCount})
                    </Typography>
                  </Box>
                </CardContent>
                <Box p={2} pt={0}>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => navigate(`/book/${book.id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Services Section */}
      <Box sx={{ 
        py: 10, 
        background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decorative elements */}
        <Box sx={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 70%)',
          top: '-100px',
          left: '-100px',
          zIndex: 0
        }} />
        <Box sx={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, rgba(147, 51, 234, 0) 70%)',
          bottom: '-150px',
          right: '-150px',
          zIndex: 0
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center" mb={6}>
            <Typography 
              variant="h3" 
              component="h2" 
              fontWeight="bold" 
              gutterBottom
              sx={{
                background: 'linear-gradient(45deg, #1e40af, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              Our Services
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ maxWidth: '700px', mx: 'auto', mt: 2 }}
            >
              Discover the comprehensive range of services our library offers to enrich your reading and learning experience
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {/* Service 1 */}
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 4, 
                  height: '100%',
                  borderRadius: 4,
                  transition: 'all 0.3s ease',
                  background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                    '& .service-icon-container': {
                      transform: 'scale(1.1)',
                      background: 'linear-gradient(45deg, #1e40af, #3b82f6)'
                    },
                    '& .service-icon': {
                      color: '#ffffff'
                    }
                  }
                }}
              >
                <Box 
                  className="service-icon-container"
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '20px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <MenuBookIcon 
                    className="service-icon"
                    sx={{ 
                      fontSize: 40, 
                      color: 'primary.main',
                      transition: 'all 0.3s ease'
                    }} 
                  />
                </Box>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ fontWeight: 600, mb: 2 }}
                >
                  Book Borrowing
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Access our extensive collection of books, journals, and digital resources. Borrow up to 5 books at a time with your membership.
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1, 
                  mt: 2 
                }}>
                  <Chip label="5 Books" size="small" />
                  <Chip label="3 Week Period" size="small" />
                  <Chip label="Online Renewal" size="small" />
                </Box>
              </Paper>
            </Grid>
            
            {/* Service 2 */}
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 4, 
                  height: '100%',
                  borderRadius: 4,
                  transition: 'all 0.3s ease',
                  background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                    '& .service-icon-container': {
                      transform: 'scale(1.1)',
                      background: 'linear-gradient(45deg, #7e22ce, #a855f7)'
                    },
                    '& .service-icon': {
                      color: '#ffffff'
                    }
                  }
                }}
              >
                <Box 
                  className="service-icon-container"
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '20px',
                    background: 'rgba(147, 51, 234, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <LocalLibraryIcon 
                    className="service-icon"
                    sx={{ 
                      fontSize: 40, 
                      color: 'secondary.main',
                      transition: 'all 0.3s ease'
                    }} 
                  />
                </Box>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ fontWeight: 600, mb: 2 }}
                >
                  Study Spaces
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Quiet study areas, collaborative workspaces, and private rooms equipped with modern technology for individual or group study sessions.
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1, 
                  mt: 2 
                }}>
                  <Chip label="Wi-Fi" size="small" />
                  <Chip label="Power Outlets" size="small" />
                  <Chip label="Online Booking" size="small" />
                </Box>
              </Paper>
            </Grid>
            
            {/* Service 3 */}
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 4, 
                  height: '100%',
                  borderRadius: 4,
                  transition: 'all 0.3s ease',
                  background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                    '& .service-icon-container': {
                      transform: 'scale(1.1)',
                      background: 'linear-gradient(45deg, #0891b2, #06b6d4)'
                    },
                    '& .service-icon': {
                      color: '#ffffff'
                    }
                  }
                }}
              >
                <Box 
                  className="service-icon-container"
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '20px',
                    background: 'rgba(6, 182, 212, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <EventIcon 
                    className="service-icon"
                    sx={{ 
                      fontSize: 40, 
                      color: 'info.main',
                      transition: 'all 0.3s ease'
                    }} 
                  />
                </Box>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ fontWeight: 600, mb: 2 }}
                >
                  Events & Programs
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Engage in our diverse range of events including book clubs, author talks, workshops, and specialized programs for all age groups.
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1, 
                  mt: 2 
                }}>
                  <Chip label="Book Clubs" size="small" />
                  <Chip label="Author Talks" size="small" />
                  <Chip label="Workshops" size="small" />
                </Box>
              </Paper>
            </Grid>
          </Grid>
          
          <Box display="flex" justifyContent="center" mt={6}>
            <Button 
              variant="contained" 
              size="large"
              component={Link}
              to="/services"
              sx={{ 
                px: 4, 
                py: 1.5, 
                borderRadius: 2,
                background: 'linear-gradient(45deg, #1e40af, #3b82f6)',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(59, 130, 246, 0.6)',
                }
              }}
            >
              Explore All Services
            </Button>
          </Box>
        </Container>
      </Box>

      {/* New Arrivals & Events Section */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 6 }}>
        <Grid container spacing={4}>
          {/* New Arrivals */}
          <Grid item xs={12} md={8}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h4" component="h2" fontWeight="bold">
                New Arrivals
              </Typography>
              <Button 
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/catalog?sort=newest')}
              >
                View All
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {newArrivals.map((book) => (
                <Grid item key={book.id} xs={12} sm={6}>
                  <Card 
                    sx={{ 
                      display: 'flex', 
                      height: '100%',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <Box sx={{ width: 120, position: 'relative' }}>
                      <CardMedia
                        component="img"
                        sx={{ height: '100%', objectFit: 'cover' }}
                        image={book.coverImage}
                        alt={book.title}
                      />
                      <Box sx={{
                        position: 'absolute',
                        top: 10,
                        left: 0,
                        bgcolor: 'primary.main',
                        color: 'white',
                        py: 0.5,
                        px: 1,
                        borderRadius: '0 4px 4px 0',
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}>
                        NEW
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, width: '100%' }}>
                      <Typography variant="h6" component="div" gutterBottom noWrap>
                        {book.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        by {book.author}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Chip label={book.category} size="small" color="primary" />
                        <Typography variant="caption" color="text.secondary">
                          Added: {book.addedDate}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 'auto', pt: 2 }}>
                        <Button 
                          size="small" 
                          color="primary"
                          onClick={() => navigate(`/book/${book.id}`)}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
          
          {/* Upcoming Events */}
          <Grid item xs={12} md={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h4" component="h2" fontWeight="bold">
                Upcoming Events
              </Typography>
            </Box>
            
            <Box>
              {upcomingEvents.map((event) => (
                <Paper 
                  key={event.id}
                  elevation={1}
                  sx={{ 
                    p: 2, 
                    mb: 2,
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 2
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box sx={{ 
                      bgcolor: 'secondary.light', 
                      color: 'secondary.contrastText',
                      p: 1,
                      borderRadius: 1,
                      textAlign: 'center',
                      minWidth: 60,
                      mr: 2
                    }}>
                      <Typography variant="body2" fontWeight="bold">
                        {event.date.split(',')[0].split(' ')[1]}
                      </Typography>
                      <Typography variant="caption">
                        {event.date.split(',')[0].split(' ')[0]}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.time} • {event.location}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button size="small" color="secondary">
                      Register
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Box>
            
            <Box display="flex" justifyContent="center" mt={3}>
              <Button 
                variant="contained" 
                color="secondary"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/events')}
              >
                View All Events
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box 
        sx={{ 
          bgcolor: 'secondary.main', 
          color: 'white', 
          py: 6,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            Join Our Library Today
          </Typography>
          <Typography variant="subtitle1" paragraph>
            Get access to thousands of books, digital resources, and exclusive events.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            sx={{ mt: 2, bgcolor: 'white', color: 'secondary.main' }}
            onClick={() => navigate('/register')}
          >
            Become a Member
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;