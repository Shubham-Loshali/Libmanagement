import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Chip,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  QrCode as QrCodeIcon
} from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import BookForm from './BookForm';
import { fetchBooks, deleteBook } from '../../services/bookService';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openQRDialog, setOpenQRDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll simulate data
    const loadBooks = async () => {
      try {
        // const data = await fetchBooks();
        // Simulated data
        const data = [
          { id: 1, isbn: '9780061120084', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', publisher: 'HarperCollins', publicationYear: 1960, quantity: 5, availableQuantity: 3, location: 'A1-S2' },
          { id: 2, isbn: '9780743273565', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', publisher: 'Scribner', publicationYear: 1925, quantity: 3, availableQuantity: 1, location: 'A1-S3' },
          { id: 3, isbn: '9780451524935', title: '1984', author: 'George Orwell', category: 'Science Fiction', publisher: 'Signet Classics', publicationYear: 1949, quantity: 4, availableQuantity: 4, location: 'A2-S1' },
          { id: 4, isbn: '9780141439518', title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Romance', publisher: 'Penguin Classics', publicationYear: 1813, quantity: 2, availableQuantity: 0, location: 'A2-S2' },
          { id: 5, isbn: '9780618640157', title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', category: 'Fantasy', publisher: 'Mariner Books', publicationYear: 1954, quantity: 3, availableQuantity: 2, location: 'A3-S1' },
          { id: 6, isbn: '9780307277671', title: 'The Road', author: 'Cormac McCarthy', category: 'Post-Apocalyptic', publisher: 'Vintage', publicationYear: 2006, quantity: 2, availableQuantity: 2, location: 'A3-S2' },
          { id: 7, isbn: '9780316769488', title: 'The Catcher in the Rye', author: 'J.D. Salinger', category: 'Fiction', publisher: 'Little, Brown and Company', publicationYear: 1951, quantity: 3, availableQuantity: 3, location: 'A4-S1' },
          { id: 8, isbn: '9780679783268', title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', category: 'Psychological Fiction', publisher: 'Vintage', publicationYear: 1866, quantity: 2, availableQuantity: 1, location: 'A4-S2' },
          { id: 9, isbn: '9780060935467', title: 'To the Lighthouse', author: 'Virginia Woolf', category: 'Modernist', publisher: 'Mariner Books', publicationYear: 1927, quantity: 1, availableQuantity: 1, location: 'A5-S1' },
          { id: 10, isbn: '9780143105427', title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', category: 'Gothic Fiction', publisher: 'Penguin Classics', publicationYear: 1890, quantity: 2, availableQuantity: 2, location: 'A5-S2' },
          { id: 11, isbn: '9780679732761', title: 'Invisible Man', author: 'Ralph Ellison', category: 'Fiction', publisher: 'Vintage', publicationYear: 1952, quantity: 2, availableQuantity: 1, location: 'A6-S1' },
          { id: 12, isbn: '9780140283334', title: 'On the Road', author: 'Jack Kerouac', category: 'Beat Generation', publisher: 'Penguin Books', publicationYear: 1957, quantity: 1, availableQuantity: 0, location: 'A6-S2' },
        ];
        setBooks(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading books:', error);
        setLoading(false);
        showSnackbar('Failed to load books', 'error');
      }
    };
    
    loadBooks();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleAddBook = () => {
    setOpenAddDialog(true);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setOpenEditDialog(true);
  };

  const handleDeleteBook = (book) => {
    setSelectedBook(book);
    setOpenDeleteDialog(true);
  };

  const handleShowQRCode = (book) => {
    setSelectedBook(book);
    setOpenQRDialog(true);
  };

  const confirmDeleteBook = async () => {
    try {
      // In a real app, this would call an API
      // await deleteBook(selectedBook.id);
      
      // Update local state
      setBooks(books.filter(book => book.id !== selectedBook.id));
      setOpenDeleteDialog(false);
      showSnackbar('Book deleted successfully');
    } catch (error) {
      console.error('Error deleting book:', error);
      showSnackbar('Failed to delete book', 'error');
    }
  };

  const handleSaveBook = (bookData, isEdit) => {
    if (isEdit) {
      // Update existing book
      setBooks(books.map(book => book.id === bookData.id ? bookData : book));
      setOpenEditDialog(false);
      showSnackbar('Book updated successfully');
    } else {
      // Add new book with a generated ID
      const newBook = {
        ...bookData,
        id: Math.max(...books.map(b => b.id), 0) + 1
      };
      setBooks([...books, newBook]);
      setOpenAddDialog(false);
      showSnackbar('Book added successfully');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.isbn.includes(searchQuery)
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Book Management</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddBook}
        >
          Add New Book
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by title, author, or ISBN..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ISBN</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Available</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.category}</TableCell>
                  <TableCell align="center">{book.quantity}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={book.availableQuantity} 
                      color={book.availableQuantity === 0 ? "error" : book.availableQuantity < book.quantity / 2 ? "warning" : "success"} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{book.location}</TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color="primary" 
                      size="small"
                      onClick={() => handleEditBook(book)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => handleDeleteBook(book)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton 
                      color="secondary" 
                      size="small"
                      onClick={() => handleShowQRCode(book)}
                    >
                      <QrCodeIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {filteredBooks.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No books found matching your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBooks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add Book Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Book</DialogTitle>
        <DialogContent>
          <BookForm onSave={(bookData) => handleSaveBook(bookData, false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Book Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Book</DialogTitle>
        <DialogContent>
          {selectedBook && (
            <BookForm 
              book={selectedBook} 
              onSave={(bookData) => handleSaveBook(bookData, true)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedBook?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDeleteBook} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={openQRDialog} onClose={() => setOpenQRDialog(false)}>
        <DialogTitle>Book QR Code</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" p={2}>
            {selectedBook && (
              <>
                <QRCodeSVG 
                  value={`book:${selectedBook.isbn}`} 
                  size={200}
                  level="H"
                  includeMargin={true}
                />
                <Typography variant="subtitle1" mt={2}>
                  {selectedBook.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ISBN: {selectedBook.isbn}
                </Typography>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenQRDialog(false)}>Close</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              // In a real app, this would trigger a download
              alert('Download functionality would be implemented here');
            }}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
};

export default BookManagement;