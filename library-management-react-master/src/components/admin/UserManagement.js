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
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import UserForm from './UserForm';
import { fetchUsers, deleteUser, toggleUserStatus } from '../../services/userService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll simulate data
    const loadUsers = async () => {
      try {
        // const data = await fetchUsers();
        // Simulated data
        const data = [
          { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '555-123-4567', membershipType: 'Student', membershipDate: '2023-01-15', status: 'active', borrowedBooks: 2 },
          { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '555-987-6543', membershipType: 'Faculty', membershipDate: '2022-11-05', status: 'active', borrowedBooks: 1 },
          { id: 3, name: 'Robert Johnson', email: 'robert.j@example.com', phone: '555-456-7890', membershipType: 'Student', membershipDate: '2023-02-20', status: 'inactive', borrowedBooks: 0 },
          { id: 4, name: 'Emily Davis', email: 'emily.d@example.com', phone: '555-789-0123', membershipType: 'Standard', membershipDate: '2022-09-10', status: 'active', borrowedBooks: 3 },
          { id: 5, name: 'Michael Wilson', email: 'michael.w@example.com', phone: '555-234-5678', membershipType: 'Student', membershipDate: '2023-03-05', status: 'active', borrowedBooks: 0 },
          { id: 6, name: 'Sarah Brown', email: 'sarah.b@example.com', phone: '555-345-6789', membershipType: 'Faculty', membershipDate: '2022-10-15', status: 'active', borrowedBooks: 1 },
          { id: 7, name: 'David Miller', email: 'david.m@example.com', phone: '555-567-8901', membershipType: 'Standard', membershipDate: '2023-01-25', status: 'inactive', borrowedBooks: 0 },
          { id: 8, name: 'Jennifer Taylor', email: 'jennifer.t@example.com', phone: '555-678-9012', membershipType: 'Student', membershipDate: '2022-12-05', status: 'active', borrowedBooks: 2 },
          { id: 9, name: 'James Anderson', email: 'james.a@example.com', phone: '555-789-0123', membershipType: 'Faculty', membershipDate: '2023-02-10', status: 'active', borrowedBooks: 0 },
          { id: 10, name: 'Lisa Thomas', email: 'lisa.t@example.com', phone: '555-890-1234', membershipType: 'Standard', membershipDate: '2022-11-20', status: 'active', borrowedBooks: 1 },
          { id: 11, name: 'Daniel White', email: 'daniel.w@example.com', phone: '555-901-2345', membershipType: 'Student', membershipDate: '2023-03-15', status: 'inactive', borrowedBooks: 0 },
          { id: 12, name: 'Karen Martin', email: 'karen.m@example.com', phone: '555-012-3456', membershipType: 'Faculty', membershipDate: '2022-10-25', status: 'active', borrowedBooks: 2 },
        ];
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading users:', error);
        setLoading(false);
        showSnackbar('Failed to load users', 'error');
      }
    };
    
    loadUsers();
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

  const handleAddUser = () => {
    setOpenAddDialog(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setOpenEditDialog(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleToggleStatus = (user) => {
    try {
      // In a real app, this would call an API
      // await toggleUserStatus(user.id);
      
      // Update local state
      const updatedUsers = users.map(u => {
        if (u.id === user.id) {
          return { ...u, status: u.status === 'active' ? 'inactive' : 'active' };
        }
        return u;
      });
      
      setUsers(updatedUsers);
      showSnackbar(`User ${user.status === 'active' ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      console.error('Error toggling user status:', error);
      showSnackbar('Failed to update user status', 'error');
    }
  };

  const confirmDeleteUser = async () => {
    try {
      // In a real app, this would call an API
      // await deleteUser(selectedUser.id);
      
      // Update local state
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setOpenDeleteDialog(false);
      showSnackbar('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      showSnackbar('Failed to delete user', 'error');
    }
  };

  const handleSaveUser = (userData, isEdit) => {
    if (isEdit) {
      // Update existing user
      setUsers(users.map(user => user.id === userData.id ? userData : user));
      setOpenEditDialog(false);
      showSnackbar('User updated successfully');
    } else {
      // Add new user with a generated ID
      const newUser = {
        ...userData,
        id: Math.max(...users.map(u => u.id), 0) + 1,
        membershipDate: new Date().toISOString().split('T')[0],
        borrowedBooks: 0,
        status: 'active'
      };
      setUsers([...users, newUser]);
      setOpenAddDialog(false);
      showSnackbar('User added successfully');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
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
        <Typography variant="h4">User Management</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddUser}
        >
          Add New User
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name, email, or phone..."
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
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Membership Type</TableCell>
              <TableCell>Membership Date</TableCell>
              <TableCell align="center">Borrowed Books</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.membershipType}</TableCell>
                  <TableCell>{user.membershipDate}</TableCell>
                  <TableCell align="center">{user.borrowedBooks}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={user.status === 'active' ? 'Active' : 'Inactive'} 
                      color={user.status === 'active' ? "success" : "error"} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color="primary" 
                      size="small"
                      onClick={() => handleEditUser(user)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => handleDeleteUser(user)}
                      disabled={user.borrowedBooks > 0}
                      title={user.borrowedBooks > 0 ? "Cannot delete user with borrowed books" : "Delete user"}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton 
                      color={user.status === 'active' ? "warning" : "success"} 
                      size="small"
                      onClick={() => handleToggleStatus(user)}
                      title={user.status === 'active' ? "Deactivate user" : "Activate user"}
                    >
                      {user.status === 'active' ? <BlockIcon /> : <CheckCircleIcon />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No users found matching your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add User Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <UserForm onSave={(userData) => handleSaveUser(userData, false)} />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <UserForm 
              user={selectedUser} 
              onSave={(userData) => handleSaveUser(userData, true)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user "{selectedUser?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDeleteUser} color="error" variant="contained">
            Delete
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

export default UserManagement;