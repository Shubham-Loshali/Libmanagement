import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Rating,
  TextField,
  Avatar,
  Card,
  CardContent,
  Snackbar,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchBookById, reserveBook } from '../../services/bookService';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulated login state

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll simulate data
    const loadBook = async () => {
      try {
        // Simulated book data
        const bookData = {
          id: parseInt(id),
          isbn: '9780061120084',
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          category: 'Fiction',
          publisher: 'HarperCollins',
          publicationYear: 1960,
          language: 'English',
          pages: 336,
          coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg',
          available: true,
          availableQuantity: 3,
          totalQuantity: 5,
          description: 'To Kill a Mockingbird is a novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature. The plot and characters are loosely based on Lee\'s observations of her family, her neighbors and an event that occurred near her hometown of Monroeville, Alabama, in 1936, when she was 10 years old.\n\nThe novel is renowned for its warmth and humor, despite dealing with the serious issues of rape and racial inequality. The narrator\'s father, Atticus Finch, has served as a moral hero for many readers and as a model of integrity for lawyers.',
          location: 'A1-S2',
          reviews: [
            { id: 1, user: 'John Doe', rating: 5, date: '2023-05-15', text: 'A timeless classic that everyone should read. The characters are so well-developed and the story is powerful and moving.' },
            { id: 2, user: 'Jane Smith', rating: 4, date: '2023-04-20', text: 'Beautifully written with important themes that are still relevant today. The narrative through Scout\'s eyes gives a unique perspective.' },
            { id: 3, user: 'Robert Johnson', rating: 5, date: '2023-03-10', text: 'One of the greatest American novels ever written. Atticus Finch is the epitome of moral courage and integrity.' },
          ],
          relatedBooks: [
            { id: 2, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg' },
            { id: 7, title: 'The Catcher in the Rye', author: 'J.D. Salinger', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg' },
            { id: 14, title: 'The Alchemist', author: 'Paulo Coelho', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg' },
          ]
        };
        
        setBook(bookData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading book details:', error);
        setLoading(false);
        showSnackbar('Failed to load book details', 'error');
      }
    };
    
    loadBook();
    
    // Check if user is logged in (simulated)
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, [id]);

  const handleReserveBook = async () => {
    if (!isLoggedIn) {
      showSnackbar('Please log in to reserve books', 'warning');
      return;
    }
    
    try {
      // In a real app, this would call an API
      // await reserveBook(book.id);
      
      showSnackbar('Book reserved successfully! Please pick it up within 48 hours.');
    } catch (error) {
      console.error('Error reserving book:', error);
      showSnackbar('Failed to reserve book', 'error');
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      showSnackbar('Please log in to submit reviews', 'warning');
      return;
    }
    
    if (rating === 0) {
      showSnackbar('Please select a rating', 'warning');
      return;
    }
    
    if (!reviewText.trim()) {
      showSnackbar('Please enter a review', 'warning');
      return;
    }
    
    // In a real app, this would call an API to submit the review
    const newReview = {
      id: book.reviews.length + 1,
      user: 'Current User',
      rating,
      date: new Date().toISOString().split('T')[0],
      text: reviewText
    };
    
    setBook({
      ...book,
      reviews: [newReview, ...book.reviews]
    });
    
    setReviewText('');
    setRating(0);
    showSnackbar('Review submitted successfully');
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return sum / reviews.length;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!book) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h5" color="error" align="center">
          Book not found
        </Typography>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/catalog')}
          >
            Back to Catalog
          </Button>
        </Box>
      </Container>
    );
  }

  const averageRating = calculateAverageRating(book.reviews);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/" underline="hover" color="inherit">
          Home
        </MuiLink>
        <MuiLink component={Link} to="/catalog" underline="hover" color="inherit">
          Catalog
        </MuiLink>
        <Typography color="text.primary">{book.title}</Typography>
      </Breadcrumbs>
      
      {/* Book Details */}
      <Grid container spacing={4}>
        {/* Book Cover and Actions */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                mb: 3
              }}
            >
              <Box 
                component="img"
                src={book.coverImage}
                alt={book.title}
                sx={{ 
                  width: '100%', 
                  maxWidth: 300, 
                  height: 'auto',
                  objectFit: 'cover',
                  borderRadius: 1,
                  boxShadow: 3
                }}
              />
              
              <Box sx={{ width: '100%', mt: 3 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  disabled={!book.available}
                  onClick={handleReserveBook}
                  sx={{ mb: 2 }}
                >
                  {book.available ? 'Reserve Book' : 'Currently Unavailable'}
                </Button>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      startIcon={<BookmarkIcon />}
                    >
                      Wishlist
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      startIcon={<ShareIcon />}
                    >
                      Share
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
            
            {/* Book Availability */}
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Availability
              </Typography>
              <List dense disablePadding>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemText 
                    primary="Status" 
                    secondary={
                      <Chip 
                        label={book.available ? "Available" : "Unavailable"} 
                        size="small" 
                        color={book.available ? "success" : "error"}
                        sx={{ mt: 0.5 }}
                      />
                    } 
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemText 
                    primary="Copies Available" 
                    secondary={`${book.availableQuantity} of ${book.totalQuantity}`} 
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem disablePadding sx={{ py: 1 }}>
                  <ListItemText 
                    primary="Shelf Location" 
                    secondary={book.location} 
                  />
                </ListItem>
              </List>
            </Paper>
          </Box>
        </Grid>
        
        {/* Book Information */}
        <Grid item xs={12} md={8}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {book.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              by {book.author}
            </Typography>
            
            <Box display="flex" alignItems="center" mb={2}>
              <Rating value={averageRating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" ml={1}>
                {averageRating.toFixed(1)} ({book.reviews.length} reviews)
              </Typography>
            </Box>
            
            <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
              <Chip label={book.category} color="primary" />
              <Chip label={`${book.pages} pages`} variant="outlined" />
              <Chip label={book.language} variant="outlined" />
              <Chip label={`Published: ${book.publicationYear}`} variant="outlined" />
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
              {book.description}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            {/* Book Details */}
            <Typography variant="h6" gutterBottom>
              Book Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <List dense>
                  <ListItem>
                    <ListItemText primary="ISBN" secondary={book.isbn} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Publisher" secondary={book.publisher} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Publication Year" secondary={book.publicationYear} />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} sm={6}>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Language" secondary={book.language} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Pages" secondary={book.pages} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Category" secondary={book.category} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            {/* Reviews Section */}
            <Box mb={4}>
              <Typography variant="h6" gutterBottom>
                Reviews
              </Typography>
              
              {/* Review Form */}
              <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Write a Review
                </Typography>
                <Box component="form" onSubmit={handleSubmitReview}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="body2" mr={2}>
                      Your Rating:
                    </Typography>
                    <Rating
                      value={rating}
                      onChange={(event, newValue) => {
                        setRating(newValue);
                      }}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Share your thoughts about this book..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button 
                    type="submit" 
                    variant="contained"
                    disabled={!isLoggedIn}
                  >
                    Submit Review
                  </Button>
                  {!isLoggedIn && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                      Please log in to submit a review
                    </Typography>
                  )}
                </Box>
              </Paper>
              
              {/* Review List */}
              {book.reviews.length > 0 ? (
                book.reviews.map((review) => (
                  <Card key={review.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1">
                            {review.user}
                          </Typography>
                          <Box display="flex" alignItems="center">
                            <Rating value={review.rating} size="small" readOnly />
                            <Typography variant="caption" color="text.secondary" ml={1}>
                              {review.date}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Typography variant="body2">
                        {review.text}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No reviews yet. Be the first to review this book!
                </Typography>
              )}
            </Box>
            
            {/* Related Books */}
            {book.relatedBooks && book.relatedBooks.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  You May Also Like
                </Typography>
                <Grid container spacing={2}>
                  {book.relatedBooks.map((relatedBook) => (
                    <Grid item key={relatedBook.id} xs={12} sm={4}>
                      <Card 
                        sx={{ 
                          display: 'flex', 
                          flexDirection: 'column',
                          height: '100%',
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: 3
                          }
                        }}
                        onClick={() => navigate(`/book/${relatedBook.id}`)}
                      >
                        <Box 
                          component="img"
                          src={relatedBook.coverImage}
                          alt={relatedBook.title}
                          sx={{ 
                            height: 180, 
                            objectFit: 'cover'
                          }}
                        />
                        <CardContent>
                          <Typography variant="subtitle1" noWrap>
                            {relatedBook.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            by {relatedBook.author}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BookDetail;