import * as React from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Avatar, IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

export default function UserList() {
  const [users, setUsers] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [newUser, setNewUser] = React.useState({ id: '', name: '', image: null });
  const [editMode, setEditMode] = React.useState(false);

  React.useEffect(() => {
    axios.get('/api/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleClickOpen = (user) => {
    setNewUser(user || { id: '', name: '', image: null });
    setEditMode(!!user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append('name', newUser.name);
    if (newUser.image) {
      formData.append('image', newUser.image);
    }

    const method = editMode ? 'put' : 'post';
    const url = editMode ? `/api/users/${newUser.id}` : '/api/users';
    axios[method](url, formData)
      .then((response) => {
        setUsers(editMode
          ? users.map(u => (u.id === newUser.id ? response.data : u))
          : [...users, response.data]);
        setOpen(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`/api/users/${id}`)
      .then(() => {
        setUsers(users.filter(u => u.id !== id));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Avatar</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Avatar src={user.image} />
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleClickOpen(user)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(user.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="contained" color="primary" onClick={() => handleClickOpen()}>
        <Add /> Add User
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="upload-avatar"
            type="file"
            onChange={(e) => setNewUser({ ...newUser, image: e.target.files[0] })}
          />
          <label htmlFor="upload-avatar">
            <Button variant="contained" color="primary" component="span">
              Upload Avatar
            </Button>
          </label>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} color="primary">{editMode ? 'Update' : 'Save'}</Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}
