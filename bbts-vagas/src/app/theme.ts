import { createTheme } from '@mui/material/styles';

const BBTS_BLUE = '#1A3A8F';      // azul royal forte
const BBTS_BLUE_DARK = '#0F2560'; // hover/active
const BBTS_BLUE_LIGHT = '#E8EDF8';// fundo suave
const BBTS_YELLOW = '#F5A800';    // acento amarelo ouro
const BBTS_YELLOW_DARK = '#C98900';

export const theme = createTheme({
  palette: {
    primary: {
      main: BBTS_BLUE,
      dark: BBTS_BLUE_DARK,
      light: BBTS_BLUE_LIGHT,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: BBTS_YELLOW,
      dark: BBTS_YELLOW_DARK,
      contrastText: '#1A1A1A',
    },
    background: {
      default: '#F7F8FC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A2E',
      secondary: '#4A5568',
    },
    success: { main: '#27AE60' },
    warning: { main: '#F39C12' },
    error: { main: '#E74C3C' },
    info: { main: '#2980B9' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
    h1: { fontWeight: 700, fontSize: '2.25rem', letterSpacing: '-0.5px' },
    h2: { fontWeight: 700, fontSize: '1.875rem', letterSpacing: '-0.3px' },
    h3: { fontWeight: 600, fontSize: '1.5rem' },
    h4: { fontWeight: 600, fontSize: '1.25rem' },
    h5: { fontWeight: 600, fontSize: '1.125rem' },
    h6: { fontWeight: 600, fontSize: '1rem' },
    body1: { fontSize: '0.9375rem', lineHeight: 1.65 },
    body2: { fontSize: '0.875rem', lineHeight: 1.6 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.2px' },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 4px rgba(26,58,143,0.08)',
    '0px 2px 8px rgba(26,58,143,0.10)',
    '0px 4px 16px rgba(26,58,143,0.12)',
    '0px 8px 24px rgba(26,58,143,0.14)',
    // ... preenche os demais com o padrão
    ...Array(20).fill('none'),
  ] as any,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F7F8FC',
        },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: BBTS_BLUE,
          borderBottom: `3px solid ${BBTS_YELLOW}`,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 8,
          paddingBottom: 8,
        },
        containedPrimary: {
          '&:hover': { backgroundColor: BBTS_BLUE_DARK },
        },
        outlinedPrimary: {
          borderColor: BBTS_BLUE,
          '&:hover': {
            backgroundColor: BBTS_BLUE_LIGHT,
            borderColor: BBTS_BLUE_DARK,
          },
        },
        containedSecondary: {
          color: '#1A1A1A',
          '&:hover': { backgroundColor: BBTS_YELLOW_DARK },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          transition: 'box-shadow 0.2s ease',
          '&:hover': { boxShadow: '0px 4px 16px rgba(26,58,143,0.12)' },
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: '1px solid #E2E8F0',
          borderRadius: 16,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #E2E8F0',
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 8 },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            backgroundColor: BBTS_BLUE_LIGHT,
            color: BBTS_BLUE,
            fontWeight: 700,
            fontSize: '0.8125rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: '#F0F4FF' },
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
  },
});