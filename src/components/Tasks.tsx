import * as React from 'react';
import axios from 'axios';
import {
  List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Checkbox, Avatar, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Box, MenuItem, Select, InputLabel, FormControl, Typography
} from '@mui/material';

export default function Tasks() {
  const [tasks, setTasks] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [newTask, setNewTask] = React.useState({
    id: '',
    title: '',
    description: '',
    userId: '',
    done: false,
  });
  const [editMode, setEditMode] = React.useState(false);

  React.useEffect(() => {
    axios.get('/api/tasks')
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios.get('/api/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleToggle = (task) => () => {
    axios.put(`/api/tasks/${task.id}`, { ...task, done: !task.done })
      .then((response) => {
        setTasks(tasks.map(t => (t.id === task.id ? response.data : t)));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleClickOpen = (task) => {
    setNewTask(task || {
      id: '',
      title: '',
      description: '',
      userId: '',
      done: false,
    });
    setEditMode(!!task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    const method = editMode ? 'put' : 'post';
    const url = editMode ? `/api/tasks/${newTask.id}` : '/api/tasks';
    axios[method](url, newTask)
      .then((response) => {
        setTasks(editMode
          ? tasks.map(t => (t.id === newTask.id ? response.data : t))
          : [...tasks, response.data]);
        setOpen(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Task List
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleClickOpen()}>
        Add Task
      </Button>
      <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {tasks.filter(task => !task.done).map((task) => (
          <ListItem
            key={task.id}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={handleToggle(task)}
                checked={Boolean(task.done)}
                inputProps={{ 'aria-labelledby': `checkbox-list-secondary-label-${task.id}` }}
              />
            }
            disablePadding
          >
            <ListItemButton onClick={() => handleClickOpen(task)}>
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°${task.userId}`}
                  src={users.find(user => user.id === task.userId)?.image}
                />
              </ListItemAvatar>
              <ListItemText
                id={`checkbox-list-secondary-label-${task.id}`}
                primary={task.title}
                secondary={task.description}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
        {tasks.filter(task => task.done).map((task) => (
          <ListItem
            key={task.id}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={handleToggle(task)}
                checked={Boolean(task.done)}
                inputProps={{ 'aria-labelledby': `checkbox-list-secondary-label-${task.id}` }}
              />
            }
            disablePadding
          >
            <ListItemButton disabled>
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°${task.userId}`}
                  src={users.find(user => user.id === task.userId)?.image}
                />
              </ListItemAvatar>
              <ListItemText
                id={`checkbox-list-secondary-label-${task.id}`}
                primary={task.title}
                secondary={task.description}
                sx={{ textDecoration: task.done ? 'line-through' : 'none' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Task' : 'Add Task'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="user-select-label">User</InputLabel>
            <Select
              labelId="user-select-label"
              value={newTask.userId}
              onChange={(e) => setNewTask({ ...newTask, userId: e.target.value })}
              renderValue={(selected) => {
                const user = users.find(u => u.id === selected);
                return user ? `${user.name} (${user.id})` : '';
              }}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  <ListItemAvatar>
                    <Avatar src={`/static/images/avatar/${user.image}`} />
                  </ListItemAvatar>
                  <ListItemText primary={user.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} color="primary">{editMode ? 'Update' : 'Save'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
