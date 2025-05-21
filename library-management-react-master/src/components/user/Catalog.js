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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchBooks } from '../../services/bookService';

const Catalog = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('title');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(!isMobile);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const booksPerPage = 12;

  useEffect(() => {
    // Get search query from URL if present
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    
    // In a real app, this would fetch from an API
    // For now, we'll simulate data
    const loadBooks = async () => {
      try {
        // Simulated books data
        const data = [
          { id: 1, isbn: '9780061120084', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', publisher: 'HarperCollins', publicationYear: 1960, coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg', available: true },
          { id: 2, isbn: '9780743273565', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', publisher: 'Scribner', publicationYear: 1925, coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg', available: true },
          { id: 3, isbn: '9780451524935', title: '1984', author: 'George Orwell', category: 'Science Fiction', publisher: 'Signet Classics', publicationYear: 1949, coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg', available: true },
          { id: 4, isbn: '9780141439518', title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Romance', publisher: 'Penguin Classics', publicationYear: 1813, coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg', available: false },
          { id: 5, isbn: '9780618640157', title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', category: 'Fantasy', publisher: 'Mariner Books', publicationYear: 1954, coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1566425108i/33.jpg', available: true },
          { id: 6, isbn: '9780307277671', title: 'The Road', author: 'Cormac McCarthy', category: 'Post-Apocalyptic', publisher: 'Vintage', publicationYear: 2006, coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1600241424i/6288.jpg', available: true },
          { id: 7, isbn: '9780316769488', title: 'The Catcher in the Rye', author: 'J.D. Salinger', category: 'Fiction', publisher: 'Little, Brown and Company', publicationYear: 1951, coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg', available: true },
          { id: 8, isbn: '9780679783268', title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', category: 'Psychological Fiction', publisher: 'Vintage', publicationYear: 1866, coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1382846449i/7144.jpg', available: true },
          { id: 9, isbn: '9780060935467', title: 'To the Lighthouse', author: 'Virginia Woolf', category: 'Modernist', publisher: 'Mariner Books', publicationYear: 1927, coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1346239665i/59716.jpg', available: true },
          { id: 10, isbn: '9780143105427', title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', category: 'Gothic Fiction', publisher: 'Penguin Classics', publicationYear: 1890, coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546103428i/5297.jpg', available: true },
          { id: 11, isbn: '9780679732761', title: 'Invisible Man', author: 'Ralph Ellison', category: 'Fiction', publisher: 'Vintage', publicationYear: 1952, coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1556482805i/16981.jpg', available: true },
          { id: 12, isbn: '9780140283334', title: 'On the Road', author: 'Jack Kerouac', category: 'Beat Generation', publisher: 'Penguin Books', publicationYear: 1957, coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1413588576i/70401.jpg', available: false },
          { id: 13, isbn: '9780679720201', title: 'The Stranger', author: 'Albert Camus', category: 'Philosophy', publisher: 'Vintage', publicationYear: 1942, coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1590930002i/49552.jpg', available: true },
          { id: 14, isbn: '9780062315007', title: 'The Alchemist', author: 'Paulo Coelho', category: 'Fiction', publisher: 'HarperOne', publicationYear: 1988, coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg', available: true },
          { id: 15, isbn: '9780553213119', title: 'Moby-Dick', author: 'Herman Melville', category: 'Adventure', publisher: 'Bantam Classics', publicationYear: 1851, coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327940656i/153747.jpg', available: true },
          { id: 16, isbn: '9780679735779', title: 'Beloved', author: 'Toni Morrison', category: 'Historical Fiction', publisher: 'Vintage', publicationYear: 1987, coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1347984578i/6149.jpg', available: true },
          { id: 17, isbn: '9780374528379', title: 'The Sound and the Fury', author: 'William Faulkner', category: 'Fiction', publisher: 'Vintage', publicationYear: 1929, coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1433588243i/10975.jpg', available: true },
          { id: 18, isbn: '9780679732242', title: 'Slaughterhouse-Five', author: 'Kurt Vonnegut', category: 'Science Fiction', publisher: 'Dial Press', publicationYear: 1969, coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1440319389i/4981.jpg', available: false },
          { id: 19, isbn: '9780679723165', title: 'The Trial', author: 'Franz Kafka', category: 'Fiction', publisher: 'Schocken', publicationYear: 1925, coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320399438i/17690.jpg', available: true },
          { id: 20, isbn: '9780679722762', title: 'The Metamorphosis', author: 'Franz Kafka', category: 'Fiction', publisher: 'Bantam Classics', publicationYear: 1915, coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1646444605i/485894.jpg', available: true },
        ];
        
        setBooks(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading books:', error);
        setLoading(false);
      }
    };
    
    loadBooks();
  }, [location.search]);

  useEffect(() => {
    applyFilters();
  }, [books, searchQuery, selectedCategories, sortBy]);

  const applyFilters = () => {
    let filtered = [...books];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery)
      );
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(book => selectedCategories.includes(book.category));
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'newest':
          return b.publicationYear - a.publicationYear;
        case 'oldest':
          return a.publicationYear - b.publicationYear;
        default:
          return 0;
      }
    });
    
    setFilteredBooks(filtered);
    setPage(1); // Reset to first page when filters change
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Update URL with search query
    navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryToggle = (category) => {
    const currentIndex = selectedCategories.indexOf(category);
    const newSelectedCategories = [...selectedCategories];
    
    if (currentIndex === -1) {
      newSelectedCategories.push(category);
    } else {
      newSelectedCategories.splice(currentIndex, 1);
    }
    
    setSelectedCategories(newSelectedCategories);
  };

  const toggleFilterDrawer = () => {
    setFilterDrawerOpen(!filterDrawerOpen);
  };

  // Extract unique categories from books
  const categories = [...new Set(books.map(book => book.category))];
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const displayedBooks = filteredBooks.slice(
    (page - 1) * booksPerPage,
    page * booksPerPage
  );

  const filterDrawerContent = (
    <Box sx={{ width: 250, p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Filters</Typography>
        {isMobile && (
          <IconButton onClick={toggleFilterDrawer}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Categories
      </Typography>
      <List>
        {categories.map((category) => (
          <ListItem key={category} disablePadding>
            <ListItemButton 
              dense 
              onClick={() => handleCategoryToggle(category)}
              sx={{ py: 0.5 }}
            >
              <Checkbox
                edge="start"
                checked={selectedCategories.indexOf(category) !== -1}
                tabIndex={-1}
                disableRipple
                size="small"
              />
              <ListItemText primary={category} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Box mt={3}>
        <Button 
          variant="outlined" 
          fullWidth
          onClick={() => setSelectedCategories([])}
        >
          Clear Filters
        </Button>
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Book Catalog
      </Typography>
      
      {/* Search and Sort Bar */}
      <Box 
        component="form" 
        onSubmit={handleSearch}
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 2, 
          mb: 4,
          alignItems: 'center'
        }}
      >
        <TextField
          fullWidth
          placeholder="Search by title, author, or ISBN..."
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        
        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' } }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              label="Sort By"
            >
              <MenuItem value="title">Title (A-Z)</MenuItem>
              <MenuItem value="author">Author (A-Z)</MenuItem>
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
            </Select>
          </FormControl>
          
          <Button 
            variant="outlined" 
            startIcon={<FilterListIcon />}
            onClick={toggleFilterDrawer}
            sx={{ display: { md: 'none' } }}
          >
            Filters
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={2}>
        {/* Filter Sidebar - Persistent on larger screens */}
        {!isMobile && (
          <Grid item md={3} lg={2}>
            {filterDrawerContent}
          </Grid>
        )}
        
        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="left"
          open={isMobile && filterDrawerOpen}
          onClose={toggleFilterDrawer}
        >
          {filterDrawerContent}
        </Drawer>
        
        {/* Book Grid */}
        <Grid item xs={12} md={9} lg={10}>
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredBooks.length} books
              {searchQuery && ` matching "${searchQuery}"`}
              {selectedCategories.length > 0 && ` in ${selectedCategories.length} categories`}
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {displayedBooks.length > 0 ? (
              displayedBooks.map((book) => (
                <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3
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
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Chip 
                          label={book.category} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                        <Chip 
                          label={book.available ? "Available" : "Unavailable"} 
                          size="small" 
                          color={book.available ? "success" : "error"}
                        />
                      </Box>
                      <Typography variant="h6" component="div" gutterBottom noWrap>
                        {book.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        by {book.author}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Published: {book.publicationYear}
                      </Typography>
                    </CardContent>
                    <Box p={2} pt={0}>
                      <Button 
                        variant="contained" 
                        fullWidth
                        onClick={() => navigate(`/book/${book.id}`)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center', 
                    bgcolor: 'background.paper',
                    borderRadius: 1
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    No books found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search or filter criteria
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary"
                size={isMobile ? "small" : "medium"}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Catalog;