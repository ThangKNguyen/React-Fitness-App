import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Stack, IconButton, Tooltip, Box, Badge } from '@mui/material';
import { LightMode, DarkMode, FitnessCenter, Bookmark } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/images/Logo.png';
import { useWorkout } from '../utils/useWorkout';

// Shared underline indicator — no layoutId, each link has its own, animates independently
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

export default function Navbar({ mode, toggleMode, onOpenWorkout }) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const { workout } = useWorkout();

  useEffect(() => {
    const handleScroll = () => {
      const exercisesEl = document.getElementById('exercises');
      if (!exercisesEl) {
        setActiveSection('home');
        return;
      }
      const rect = exercisesEl.getBoundingClientRect();
      setActiveSection(rect.top <= 120 ? 'exercises' : 'home');
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveSection('home');
  }, [location.pathname]);

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('home');
    } else {
      navigate('/');
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
    }
  };

  const isHomeActive = location.pathname === '/' && activeSection === 'home';
  const isExercisesActive = location.pathname === '/' && activeSection === 'exercises';
  const isSavedActive = location.pathname === '/saved';

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
        {/* Logo + App name */}
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

        {/* Nav links + actions */}
        <Stack direction="row" alignItems="center" gap={{ xs: '14px', sm: '20px', lg: '24px' }}>
          {/* Home */}
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

          {/* Exercises */}
          <Box sx={{ position: 'relative' }}>
            <a
              href="#exercises"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('exercises');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              style={{
                ...navLinkStyle,
                color: isExercisesActive
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              }}
            >
              Exercises
            </a>
            <AnimatePresence>{isExercisesActive && <NavUnderline />}</AnimatePresence>
          </Box>

          {/* Saved */}
          <Box sx={{ position: 'relative', display: { xs: 'none', sm: 'block' } }}>
            <Link
              to="/saved"
              style={{
                ...navLinkStyle,
                color: isSavedActive
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              }}
            >
              Saved
            </Link>
            <AnimatePresence>{isSavedActive && <NavUnderline />}</AnimatePresence>
          </Box>

          {/* Workout button */}
          <Tooltip title={workout.length > 0 ? `Workout (${workout.length})` : 'My Workout'}>
            <IconButton
              onClick={onOpenWorkout}
              size="small"
              sx={{
                ...iconBtnSx,
                ...(workout.length > 0 && {
                  color: theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                  backgroundColor: 'rgba(255,38,37,0.06)',
                }),
              }}
            >
              <Badge
                badgeContent={workout.length || null}
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '10px',
                    minWidth: '16px',
                    height: '16px',
                    padding: '0 3px',
                  },
                }}
              >
                <FitnessCenter sx={{ fontSize: '18px' }} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Saved shortcut on mobile */}
          <Tooltip title="Saved exercises">
            <IconButton
              component={Link}
              to="/saved"
              size="small"
              sx={{
                ...iconBtnSx,
                display: { xs: 'flex', sm: 'none' },
                ...(isSavedActive && {
                  color: theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                }),
              }}
            >
              <Bookmark sx={{ fontSize: '18px' }} />
            </IconButton>
          </Tooltip>

          {/* Dark/light toggle */}
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
        </Stack>
      </Stack>
    </motion.div>
  );
}
