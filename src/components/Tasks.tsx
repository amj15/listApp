import * as React from 'react';
import axios from 'axios';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import { Divider, Typography } from '@mui/material';

export default function Tasks() {
  const [checked, setChecked] = React.useState<number[]>([]);
  const [tasks, setTasks] = React.useState<any[]>([]); // Estado para almacenar las tareas

  React.useEffect(() => {
    // Llamada a la API para obtener las tareas
    axios.get('/api/tasks') // Reemplaza con la URL de tu API
      .then(response => {
        console.log(response);
        setTasks(response.data);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  }, []);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {tasks.map((task) => {
        const labelId = `checkbox-list-secondary-label-${task.id}`;
        return (
          <>
            <ListItem alignItems="flex-start"
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={handleToggle(task.id)}
                checked={checked.indexOf(task.id) !== -1}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            }>
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={task.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={task.title}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >{task.maxDueDate}
                    </Typography>
                    {task.description}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        );
      })}
          {/* <ListItem
            key={task.id}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={handleToggle(task.id)}
                checked={checked.indexOf(task.id) !== -1}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            }
            disablePadding
          >
            <ListItemButton>
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°${task.id}`}
                  src={`/static/images/avatar/${task.userId}.jpg`} // Puedes ajustar esto según tus necesidades
                />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={task.title} />
            </ListItemButton>
          </ListItem> */}
    </List>
  );
}
