import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Shopping from './Shopping';
import Tasks from './Tasks';
import UserList from './UserList';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ height: '100%' }}
    >
      {value === index && (
        <Box sx={{ p: 3, height: '100%' }}>
          <Typography component="div" style={{ height: '100%' }}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Root = styled(Box)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

const TabsContainer = styled(Tabs)({
  borderBottom: '1px solid #e8e8e8',
});

const TabPanelContainer = styled(Box)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
});

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Root>
      
      <TabsContainer value={value} onChange={handleChange} indicatorColor='secondary' textColor='inherit' variant='fullWidth'>
        <Tab icon={<CalendarMonthIcon />} iconPosition="start" label="Calendario" {...a11yProps(0)} />
        <Tab icon={<AssignmentTurnedInIcon />} iconPosition="start" label="Lista de la compra" {...a11yProps(1)} />
        <Tab icon={<ShoppingCartIcon />} iconPosition="start" label="Tareas" {...a11yProps(2)} />
        <Tab icon={<ShoppingCartIcon />} iconPosition="start" label="Usuarios" {...a11yProps(3)} />
      </TabsContainer>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Shopping />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Tasks />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <UserList />
      </TabPanel>
    </Root>
  )
};
 
