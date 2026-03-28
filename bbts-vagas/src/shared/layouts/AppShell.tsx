import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { SideNav } from './SideNav';

const DRAWER_WIDTH = 240;

export function AppShell() {
  const [drawerOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <TopBar drawerOpen={drawerOpen} />
      <SideNav open={drawerOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: drawerOpen ? `${DRAWER_WIDTH}px` : 0,
          transition: 'margin-left 0.25s',
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}