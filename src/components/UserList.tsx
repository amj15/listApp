import * as React from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';

export default function UserList() {
  const [users, setUsers] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [newUser, setNewUser] = React.useState({ id: null, name: '', image: '' });

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleOpen = (user = { id: null, name: '', image: '' }) => {
    setNewUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      if (newUser.id) {
        // Update existing user
        await axios.put(`/api/users/${newUser.id}`, newUser);
      } else {
        // Create new user
        await axios.post('/api/users', newUser);
      }
      fetchUsers();
      handleClose();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell><img src={user.image} alt={user.name} width="50" /></TableCell>
              <TableCell>
                <Button onClick={() => handleOpen(user)}>Edit</Button>
                <Button onClick={() => handleDelete(user.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={() => handleOpen()}>Add User</Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{newUser.id ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {newUser.id ? 'Edit the details of the user.' : 'Enter the details of the new user.'}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Image URL"
            type="text"
            fullWidth
            value={newUser.image}
            onChange={(e) => setNewUser({ ...newUser, image: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}
