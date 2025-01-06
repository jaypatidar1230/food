import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Icon } from "@iconify/react";
import { useEffect } from 'react';

export default function Slider(props) {
  const { setIsSliderOpen } = props;
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => () => {
    setState({ ...state, [anchor]: open });
    setIsSliderOpen(open);
  };

  const icon = [
    'zmdi-accounts-alt', 'zmdi-balance-wallet', 'zmdi-cutlery', 
    'zmdi-star', 'zmdi-shield-check', 'zmdi-settings', 
    'zmdi-email', 'zmdi-assignment', 'zmdi-open-in-new'
  ];

  const list = (anchor) => (
    <Box
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['People', 'Wallet', 'Food Items', 'Reviews', 'Authentication', 'Settings', 'Support', 'Terms & Conditions', 'Logout'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Icon style={{ color: 'orange' }} icon={icon[index]} />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  useEffect(() => {
    toggleDrawer('right', true)();
  }, []);

  return (
    <div>
      <Drawer
        anchor="right"
        open={state.right}
        onClose={toggleDrawer('right', false)}
        PaperProps={{
          sx: {
            top: '70px', // Starts below the header
            height: `calc(100% - 70px)`, // Adjust height
          },
        }}
      >
        {list('right')}
      </Drawer>
    </div>
  );
}

