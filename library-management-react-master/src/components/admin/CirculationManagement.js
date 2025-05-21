import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import {
  Search as SearchIcon,
  QrCode as QrCodeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { fetchBorrowedBooks, issueBook, returnBook } from '../../services/circulationService';
import { fetchBooks } from '../../services/bookService';
import { fetchUsers } from '../../services/userService';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`circulation-tabpanel-${index}`}
      aria-labelledby={`circulation-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CirculationManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dueDate, setDueDate] = useState('');
  const [openQRDialog, setOpenQRDialog] = useState(false);
  const [qrScanResult, setQrScanResult] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll simulate data
    const loadData = async () => {
      try {
        // Simulated borrowed books data
        const borrowedData = [
          { id: 1, bookId: 1, bookTitle: 'To Kill a Mockingbird', userId: 1, userName: 'John Doe', issueDate: '2023-09-15', dueDate: '2023-10-15', returnDate: null, status: 'borrowed' },
          { id: 2, bookId: 2, bookTitle: 'The Great Gatsby', userId: 2, userName: 'Jane Smith', issueDate: '2023-09-20', dueDate: '2023-10-20', returnDate: null, status: 'borrowed' },
          { id: 3, bookId: 4, bookTitle: 'Pride and Prejudice', userId: 4, userName: 'Emily Davis', issueDate: '2023-09-05', dueDate: '2023-10-05', returnDate: null, status: 'overdue' },
          { id: 4, bookId: 5, bookTitle: 'The Lord of the Rings', userId: 6, userName: 'Sarah Brown', issueDate: '2023-09-25', dueDate: '2023-10-25', returnDate: null, status: 'borrowed' },
          { id: 5, bookId: 7, bookTitle: 'The Catcher in the Rye', userId: 8, userName: 'Jennifer Taylor', issueDate: '2023-09-10', dueDate: '2023-10-10', returnDate: null, status: 'overdue' },
          { id: 6, bookId: 8, bookTitle: 'Crime and Punishment', userId: 10, userName: 'Lisa Thomas', issueDate: '2023-09-30', dueDate: '2023-10-30', returnDate: null, status: 'borrowed' },
          { id: 7, bookId: 3, bookTitle: '1984', userId: 1, userName: 'John Doe', issueDate: '2023-09-01', dueDate: '2023-10-01', returnDate: '2023-09-28', status: 'returned' },
          { id: 8, bookId: 10, bookTitle: 'The Picture of Dorian Gray', userId: 2, userName: 'Jane Smith', issueDate: '2023-08-25', dueDate: '2023-09-25', returnDate: '2023-09-20', status: 'returned' },
          { id: 9, bookId: 11, bookTitle: 'Invisible Man', userId: 4, userName: 'Emily Davis', issueDate: '2023-08-15', dueDate: '2023-09-15', returnDate: '2023-09-10', status: 'returned' },
        ];
        
        // Simulated books data
        const booksData = [
          { id: 1, isbn: '9780061120084', title: 'To Kill a Mockingbird', author: 'Harper Lee', availableQuantity: 3 },
          { id: 2, isbn: '9780743273565', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', availableQuantity: 1 },
          { id: 3, isbn: '9780451524935', title: '1984', author: 'George Orwell', availableQuantity: 4 },
          { id: 4, isbn: '9780141439518', title: 'Pride and Prejudice', author: 'Jane Austen', availableQuantity: 0 },
          { id: 5, isbn: '9780618640157', title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', availableQuantity: 2 },
          { id: 6, isbn: '9780307277671', title: 'The Road', author: 'Cormac McCarthy', availableQuantity: 2 },
          { id: 7, isbn: '9780316769488', title: 'The Catcher in the Rye', author: 'J.D. Salinger', availableQuantity: 3 },
          { id: 8, isbn: '9780679783268', title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', availableQuantity: 1 },
          { id: 9, isbn: '9780060935467', title: 'To the Lighthouse', author: 'Virginia Woolf', availableQuantity: 1 },
          { id: 10, isbn: '9780143105427', title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', availableQuantity: 2 },
        ];
        
        // Simulated users data
        const usersData = [
          { id: 1, name: 'John Doe', email: 'john.doe@example.com', borrowedBooks: 2 },
          { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', borrowedBooks: 1 },
          { id: 4, name: 'Emily Davis', email: 'emily.d@example.com', borrowedBooks: 3 },
          { id: 6, name: 'Sarah Brown', email: 'sarah.b@example.com', borrowedBooks: 1 },
          { id: 8, name: 'Jennifer Taylor', email: 'jennifer.t@example.com', borrowedBooks: 2 },
          { id: 10, name: 'Lisa Thomas', email: 'lisa.t@example.com', borrowedBooks: 1 },
        ];
        
        setBorrowedBooks(borrowedData);
        setBooks(booksData);
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading circulation data:', error);
        setLoading(false);
        showSnackbar('Failed to load data', 'error');
      }
    };
    
    loadData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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

  const handleIssueBook = async () => {
    if (!selectedBook || !selectedUser || !dueDate) {
      showSnackbar('Please select a book, user, and due date', 'error');
      return;
    }

    if (selectedBook.availableQuantity <= 0) {
      showSnackbar('Selected book is not available', 'error');
      return;
    }

    try {
      // In a real app, this would call an API
      // await issueBook(selectedBook.id, selectedUser.id, dueDate);
      
      // Update local state
      const today = new Date().toISOString().split('T')[0];
      const newBorrowedBook = {
        id: Math.max(...borrowedBooks.map(b => b.id), 0) + 1,
        bookId: selectedBook.id,
        bookTitle: selectedBook.title,
        userId: selectedUser.id,
        userName: selectedUser.name,
        issueDate: today,
        dueDate: dueDate,
        returnDate: null,
        status: 'borrowed'
      };
      
      setBorrowedBooks([...borrowedBooks, newBorrowedBook]);
      
      // Update book availability
      setBooks(books.map(book => {
        if (book.id === selectedBook.id) {
          return { ...book, availableQuantity: book.availableQuantity - 1 };
        }
        return book;
      }));
      
      // Update user borrowed books count
      setUsers(users.map(user => {
        if (user.id === selectedUser.id) {
          return { ...user, borrowedBooks: user.borrowedBooks + 1 };
        }
        return user;
      }));
      
      // Reset form
      setSelectedBook(null);
      setSelectedUser(null);
      setDueDate('');
      
      showSnackbar('Book issued successfully');
    } catch (error) {
      console.error('Error issuing book:', error);
      showSnackbar('Failed to issue book', 'error');
    }
  };

  const handleReturnBook = async (borrowedBook) => {
    try {
      // In a real app, this would call an API
      // await returnBook(borrowedBook.id);
      
      // Update local state
      const today = new Date().toISOString().split('T')[0];
      
      setBorrowedBooks(borrowedBooks.map(book => {
        if (book.id === borrowedBook.id) {
          return { ...book, returnDate: today, status: 'returned' };
        }
        return book;
      }));
      
      // Update book availability
      setBooks(books.map(book => {
        if (book.id === borrowedBook.bookId) {
          return { ...book, availableQuantity: book.availableQuantity + 1 };
        }
        return book;
      }));
      
      // Update user borrowed books count
      setUsers(users.map(user => {
        if (user.id === borrowedBook.userId) {
          return { ...user, borrowedBooks: user.borrowedBooks - 1 };
        }
        return user;
      }));
      
      showSnackbar('Book returned successfully');
    } catch (error) {
      console.error('Error returning book:', error);
      showSnackbar('Failed to return book', 'error');
    }
  };

  const handleOpenQRScanner = () => {
    setOpenQRDialog(true);
    // In a real app, this would activate the camera for QR scanning
    // For now, we'll simulate a scan after a delay
    setTimeout(() => {
      const randomBook = books[Math.floor(Math.random() * books.length)];
      setQrScanResult(`book:${randomBook.isbn}`);
      setSelectedBook(randomBook);
      setOpenQRDialog(false);
    }, 2000);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredBorrowedBooks = borrowedBooks.filter(book => 
    book.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeBorrowedBooks = borrowedBooks.filter(book => book.status !== 'returned');

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
        Circulation Management
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Issue Book" />
          <Tab label="Return Book" />
          <Tab label="Borrowed Books History" />
        </Tabs>
        
        {/* Issue Book Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={books.filter(book => book.availableQuantity > 0)}
                getOptionLabel={(option) => `${option.title} by ${option.author}`}
                value={selectedBook}
                onChange={(event, newValue) => {
                  setSelectedBook(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Book"
                    variant="outlined"
                    fullWidth
                    required
                    helperText={selectedBook ? `Available: ${selectedBook.availableQuantity}` : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center">
                <Button
                  variant="outlined"
                  startIcon={<QrCodeIcon />}
                  onClick={handleOpenQRScanner}
                  sx={{ mr: 2 }}
                >
                  Scan Book
                </Button>
                <Typography variant="body2" color="textSecondary">
                  {qrScanResult ? `Scanned: ${qrScanResult}` : 'No book scanned'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={users}
                getOptionLabel={(option) => `${option.name} (${option.email})`}
                value={selectedUser}
                onChange={(event, newValue) => {
                  setSelectedUser(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select User"
                    variant="outlined"
                    fullWidth
                    required
                    helperText={selectedUser ? `Currently borrowed: ${selectedUser.borrowedBooks}` : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Due Date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0]
                }}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleIssueBook}
                disabled={!selectedBook || !selectedUser || !dueDate}
              >
                Issue Book
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Return Book Tab */}
        <TabPanel value={tabValue} index={1}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by book title or user name..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Book Title</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Issue Date</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeBorrowedBooks
                  .filter(book => 
                    book.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    book.userName.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((book) => {
                    const isOverdue = new Date(book.dueDate) < new Date() && book.status !== 'returned';
                    
                    return (
                      <TableRow key={book.id}>
                        <TableCell>{book.bookTitle}</TableCell>
                        <TableCell>{book.userName}</TableCell>
                        <TableCell>{book.issueDate}</TableCell>
                        <TableCell>{book.dueDate}</TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={isOverdue ? 'Overdue' : 'Borrowed'} 
                            color={isOverdue ? "error" : "primary"} 
                            size="small"
                            icon={isOverdue ? <WarningIcon /> : undefined}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleReturnBook(book)}
                          >
                            Return
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {activeBorrowedBooks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No active borrowed books found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={activeBorrowedBooks.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </TabPanel>
        
        {/* Borrowed Books History Tab */}
        <TabPanel value={tabValue} index={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by book title or user name..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Book Title</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Issue Date</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Return Date</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBorrowedBooks
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((book) => {
                    const isOverdue = book.status === 'overdue' || 
                                     (new Date(book.dueDate) < new Date() && book.status !== 'returned');
                    
                    return (
                      <TableRow key={book.id}>
                        <TableCell>{book.bookTitle}</TableCell>
                        <TableCell>{book.userName}</TableCell>
                        <TableCell>{book.issueDate}</TableCell>
                        <TableCell>{book.dueDate}</TableCell>
                        <TableCell>{book.returnDate || '-'}</TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={book.status === 'returned' ? 'Returned' : isOverdue ? 'Overdue' : 'Borrowed'} 
                            color={book.status === 'returned' ? "success" : isOverdue ? "error" : "primary"} 
                            size="small"
                            icon={isOverdue && book.status !== 'returned' ? <WarningIcon /> : undefined}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {filteredBorrowedBooks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No borrowed books found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredBorrowedBooks.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </TabPanel>
      </Paper>
      
      {/* QR Scanner Dialog */}
      <Dialog open={openQRDialog} onClose={() => setOpenQRDialog(false)}>
        <DialogTitle>Scan Book QR Code</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" p={2}>
            <Box 
              sx={{ 
                width: 300, 
                height: 300, 
                bgcolor: '#f5f5f5', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                mb: 2
              }}
            >
              {/* In a real app, this would be a camera view */}
              <CircularProgress />
            </Box>
            <Typography variant="body2" color="textSecondary">
              Position the QR code within the frame to scan
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenQRDialog(false)}>Cancel</Button>
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

export default CirculationManagement;