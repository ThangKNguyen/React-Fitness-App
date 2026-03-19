import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Stack, IconButton, Tooltip, Box, Typography, Button } from '@mui/material';
import { LightMode, DarkMode, Logout } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/images/Logo.png';
import { useAuth } from '../utils/useAuth';

const NavUnderline = () => (
  <motion.div
    initial={{ opacity: 0, scaleX: 0 }}
    animate={{ opacity: 1, scaleX: 1 }}
    exit={{ opacity: 0, scaleX: 0 }}
    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: 'linear-gradient(90deg, #FF2625, #FF6B35)',
      borderRadius: '2px',
      transformOrigin: 'center',
    }}
  />
);

export default function Navbar({ mode, toggleMode }) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
    }
  };

  const isHomeActive = location.pathname === '/';
  const isSavedActive = location.pathname === '/saved';
  const isPlansActive = location.pathname.startsWith('/plans');

  const navLinkStyle = {
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: '"DM Sans", sans-serif',
    letterSpacing: '0.4px',
    position: 'relative',
    paddingBottom: '4px',
    transition: 'color 0.2s ease',
    display: 'inline-block',
    cursor: 'pointer',
  };

  const iconBtnSx = {
    color: theme.palette.text.secondary,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '8px',
    width: '36px',
    height: '36px',
    transition: 'all 0.2s ease',
    '&:hover': {
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
      backgroundColor: 'rgba(255, 38, 37, 0.08)',
    },
  };

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      style={{ position: 'sticky', top: 0, zIndex: 1100 }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: { xs: '16px', sm: '32px', lg: '48px' },
          py: { xs: '12px', sm: '14px' },
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          backgroundColor:
            mode === 'dark'
              ? 'rgba(10, 10, 10, 0.85)'
              : 'rgba(245, 245, 245, 0.90)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={handleHomeClick}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
        >
          <motion.img
            src={Logo}
            alt="Muscle Forger logo"
            whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
            style={{ width: '38px', height: '38px', objectFit: 'contain' }}
          />
          <Box
            component="span"
            sx={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: '22px',
              letterSpacing: '0.08em',
              color: 'text.primary',
              display: { xs: 'none', sm: 'block' },
              lineHeight: 1,
            }}
          >
            Muscle{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Forger
            </Box>
          </Box>
        </Link>

        {/* Right side */}
        <Stack direction="row" alignItems="center" gap={{ xs: '14px', sm: '20px', lg: '24px' }}>

          {/* Nav text links */}
          <Box sx={{ position: 'relative' }}>
            <Link
              to="/"
              onClick={handleHomeClick}
              style={{
                ...navLinkStyle,
                color: isHomeActive ? theme.palette.primary.main : theme.palette.text.secondary,
              }}
            >
              Home
            </Link>
            <AnimatePresence>{isHomeActive && <NavUnderline />}</AnimatePresence>
          </Box>

          {/* Saved — only when logged in */}
          {user && (
            <Box sx={{ position: 'relative' }}>
              <Link
                to="/saved"
                style={{
                  ...navLinkStyle,
                  color: isSavedActive ? theme.palette.primary.main : theme.palette.text.secondary,
                }}
              >
                Saved
              </Link>
              <AnimatePresence>{isSavedActive && <NavUnderline />}</AnimatePresence>
            </Box>
          )}

          {/* Plans — only when logged in */}
          {user && (
            <Box sx={{ position: 'relative' }}>
              <Link
                to="/plans"
                style={{
                  ...navLinkStyle,
                  color: isPlansActive ? theme.palette.primary.main : theme.palette.text.secondary,
                }}
              >
                Plans
              </Link>
              <AnimatePresence>{isPlansActive && <NavUnderline />}</AnimatePresence>
            </Box>
          )}

          {/* Theme toggle */}
          <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton onClick={toggleMode} size="small" sx={iconBtnSx}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mode}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  {mode === 'dark' ? (
                    <LightMode sx={{ fontSize: '18px' }} />
                  ) : (
                    <DarkMode sx={{ fontSize: '18px' }} />
                  )}
                </motion.div>
              </AnimatePresence>
            </IconButton>
          </Tooltip>

          {/* Divider */}
          <Box
            sx={{
              width: '1px',
              height: '20px',
              backgroundColor: theme.palette.divider,
              display: { xs: 'none', sm: 'block' },
            }}
          />

          {/* Auth section */}
          {user ? (
            <Stack direction="row" alignItems="center" gap="10px">
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'text.secondary',
                  display: { xs: 'none', sm: 'block' },
                  whiteSpace: 'nowrap',
                }}
              >
                Hi,{' '}
                <Box component="span" sx={{ color: 'primary.main' }}>
                  {user.username}
                </Box>
              </Typography>
              <Tooltip title="Sign out">
                <IconButton onClick={handleLogout} size="small" sx={iconBtnSx}>
                  <Logout sx={{ fontSize: '18px' }} />
                </IconButton>
              </Tooltip>
            </Stack>
          ) : (
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              size="small"
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 700,
                fontSize: '13px',
                borderRadius: '8px',
                borderColor: theme.palette.divider,
                color: 'text.secondary',
                px: '14px',
                py: '6px',
                whiteSpace: 'nowrap',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  backgroundColor: 'rgba(255,38,37,0.06)',
                },
              }}
            >
              Sign In
            </Button>
          )}
        </Stack>
      </Stack>
    </motion.div>
  );
}
