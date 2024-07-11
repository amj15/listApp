import { useState } from 'react'
import './App.css'
import UserList from './components/UserList';
import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import BasicTabs from './components/BasicTabs.jsx';


function App() {
  const [count, setCount] = useState(0)

  return (
    <Container fixed>
      <BasicTabs />
      <Box sx={{ bgcolor: '#cfe8fc', height: '100w' }} />
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Material UI Vite.js example
        </Typography>
      </Box>
    </Container>
  )
}

export default App
