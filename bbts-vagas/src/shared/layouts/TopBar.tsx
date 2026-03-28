import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Chip,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { useAuth } from '../../features/auth/authContext';
import { useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 240;

export function TopBar({ drawerOpen }: { drawerOpen: boolean }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: drawerOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
        ml: drawerOpen ? `${DRAWER_WIDTH}px` : 0,
        transition: 'width 0.25s, margin-left 0.25s',
        zIndex: (t) => t.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <WorkOutlineIcon sx={{ fontSize: 28 }} />
        <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
          BBTS — Gestão de Vagas
        </Typography>

        {user && (
          <Box display="flex" alignItems="center" gap={1.5}>
            <Chip
              label={user.role === 'RH' ? 'Recursos Humanos' : 'Solicitante'}
              size="small"
              sx={{
                bgcolor: 'secondary.main',
                color: 'secondary.contrastText',
                fontWeight: 700,
              }}
            />
            <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.dark', fontSize: 14 }}>
              {user.name.charAt(0)}
            </Avatar>
            <Typography variant="body2" color="inherit" fontWeight={500}>
              {user.name}
            </Typography>
            <Tooltip title="Sair">
              <IconButton color="inherit" onClick={handleLogout} size="small">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}