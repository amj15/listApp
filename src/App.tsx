import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import BasicTabs from './components/BasicTabs';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg" style={{ height: '100%', display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>
        <Box sx={{flex: 1, display: 'flex', flexDirection: 'column' }}>
          <BasicTabs />
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default App;
