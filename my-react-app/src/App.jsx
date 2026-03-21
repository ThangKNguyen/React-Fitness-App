import { useState, useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import './App.css';
import Navbar from './components/Navbar';
import ExerciseDetail from './pages/ExerciseDetail';
import Home from './pages/Home';
import SavedPage from './pages/SavedPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PlansPage from './pages/PlansPage';
import TemplatePage from './pages/TemplatePage';
import Footer from './components/Footer';
import AuthPromptSnackbar from './components/AuthPromptSnackbar';

function App() {
  const [mode, setMode] = useState('dark');

  const toggleMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: '#FF2625',
        light: '#FF5C5B',
        dark: '#CC1E1D',
        contrastText: '#fff',
      },
      ...(mode === 'dark'
        ? {
            background: {
              default: '#0A0A0A',
              paper: '#111111',
            },
            text: {
              primary: '#F0F0F0',
              secondary: '#888888',
            },
            divider: 'rgba(255,255,255,0.07)',
          }
        : {
            background: {
              default: '#F5F5F5',
              paper: '#FFFFFF',
            },
            text: {
              primary: '#0A0A0A',
              secondary: '#5A5A5A',
            },
            divider: 'rgba(0,0,0,0.08)',
          }),
    },
    typography: {
      fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
      h1: { fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.04em' },
      h2: { fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.04em' },
      h3: { fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.03em' },
      h4: { fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.03em' },
      h5: { fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.02em' },
      h6: { fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.02em' },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 700,
            fontFamily: '"DM Sans", sans-serif',
            borderRadius: '8px',
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
            boxShadow: '0 4px 20px rgba(255, 38, 37, 0.35)',
            '&:hover': {
              background: 'linear-gradient(135deg, #CC1E1D 0%, #e55d2a 100%)',
              boxShadow: '0 6px 28px rgba(255, 38, 37, 0.5)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiPagination: {
        styleOverrides: {
          root: {
            '& .MuiPaginationItem-root': {
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 600,
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '50px',
              fontFamily: '"DM Sans", sans-serif',
            },
          },
        },
      },
    },
  }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ maxWidth: '1488px', width: '100%', mx: 'auto' }}>
        <Navbar mode={mode} toggleMode={toggleMode} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/exercise/:id" element={<ExerciseDetail />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/plans/:templateId" element={<TemplatePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
        <Footer />
      </Box>
      <AuthPromptSnackbar />
    </ThemeProvider>
  );
}

export default App;
