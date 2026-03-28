import React from 'react';
import { Paper, Box, Typography, Divider } from '@mui/material';

interface AppSectionProps {
  title?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  noPadding?: boolean;
}

export function AppSection({ title, actions, children, noPadding }: AppSectionProps) {
  return (
    <Paper sx={{ mb: 3, overflow: 'hidden' }}>
      {(title || actions) && (
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={3}
            py={2}
          >
            {title && (
              <Typography variant="h6" fontWeight={700} color="text.primary">
                {title}
              </Typography>
            )}
            {actions && <Box display="flex" gap={1}>{actions}</Box>}
          </Box>
          <Divider />
        </>
      )}
      <Box sx={noPadding ? {} : { p: 3 }}>{children}</Box>
    </Paper>
  );
}