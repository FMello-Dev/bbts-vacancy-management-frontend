import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';

interface AppButtonProps extends ButtonProps {
  loading?: boolean;
}

export function AppButton({ loading, disabled, children, ...props }: AppButtonProps) {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      startIcon={
        loading
          ? <CircularProgress size={16} color="inherit" />
          : props.startIcon
      }
    >
      {children}
    </Button>
  );
}