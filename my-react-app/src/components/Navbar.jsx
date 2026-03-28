import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Stack, IconButton, Tooltip, Box, Typography, Button, Avatar,
  Drawer, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import {
  LightMode, DarkMode, Logout, Settings, Menu as MenuIcon, Close,
} from '@mui/icons-material';
import { useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/images/trident.png';
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setLogoutConfirm(false);
    setDrawerOpen(false);
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
    setDrawerOpen(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const isHomeActive = location.pathname === '/';
  const isSavedActive = location.pathname === '/saved';
  const isPlansActive = location.pathname.startsWith('/plans');
  const isProgressActive = location.pathname === '/progress';
  const isSettingsActive = location.pathname === '/settings';

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

  // Nav links config
  const navLinks = [
    { label: 'Home', path: '/', active: isHomeActive, onClick: handleHomeClick, always: true },
    { label: 'Saved', path: '/saved', active: isSavedActive, authOnly: true },
    { label: 'Plans', path: '/plans', active: isPlansActive, authOnly: true },
    { label: 'Progress', path: '/progress', active: isProgressActive, authOnly: true },
  ];

  const visibleLinks = navLinks.filter((l) => l.always || (l.authOnly && user));

  // ─── Mobile Drawer ──────────────────────────────────────────────────────────

  const mobileDrawer = (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      PaperProps={{
        sx: {
          width: '280px',
          backgroundColor: 'background.paper',
          borderLeft: `1px solid ${theme.palette.divider}`,
          p: '24px 20px',
        },
      }}
    >
      {/* Drawer header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb="28px">
        <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '20px', letterSpacing: '0.06em', color: 'text.primary' }}>
          Menu
        </Typography>
        <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ color: 'text.secondary' }}>
          <Close sx={{ fontSize: '20px' }} />
        </IconButton>
      </Stack>

      {/* Nav links */}
      <Stack gap="4px" mb="28px">
        {visibleLinks.map((link) => (
          <Box
            key={link.path}
            onClick={link.onClick || (() => handleNavClick(link.path))}
            sx={{
              py: '12px',
              px: '14px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '15px',
              fontWeight: link.active ? 700 : 500,
              color: link.active ? '#fff' : 'text.primary',
              background: link.active
                ? 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)'
                : 'transparent',
              transition: 'all 0.2s ease',
              '&:hover': link.active ? {} : {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            {link.label}
          </Box>
        ))}
      </Stack>

      {/* Divider */}
      <Box sx={{ height: '1px', backgroundColor: theme.palette.divider, mb: '20px' }} />

      {/* Auth section */}
      {user ? (
        <Stack gap="4px">
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: 'text.secondary', px: '14px', mb: '8px' }}>
            Signed in as <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>{user.username}</Box>
          </Typography>
          <Box
            onClick={() => handleNavClick('/settings')}
            sx={{
              py: '12px',
              px: '14px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '15px',
              fontWeight: isSettingsActive ? 700 : 500,
              color: isSettingsActive ? '#fff' : 'text.primary',
              background: isSettingsActive
                ? 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)'
                : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s ease',
              '&:hover': isSettingsActive ? {} : {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            <Settings sx={{ fontSize: '18px' }} />
            Settings
          </Box>
          <Box
            onClick={() => setLogoutConfirm(true)}
            sx={{
              py: '12px',
              px: '14px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '15px',
              fontWeight: 500,
              color: '#d32f2f',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(211, 47, 47, 0.06)',
              },
            }}
          >
            <Logout sx={{ fontSize: '18px' }} />
            Sign Out
          </Box>
        </Stack>
      ) : (
        <Button
          onClick={() => handleNavClick('/login')}
          variant="outlined"
          fullWidth
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 700,
            fontSize: '14px',
            borderRadius: '10px',
            borderColor: theme.palette.divider,
            color: 'text.primary',
            py: '10px',
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
    </Drawer>
  );

  // ─── Sign Out Confirmation Dialog ───────────────────────────────────────────

  const logoutDialog = (
    <Dialog
      open={logoutConfirm}
      onClose={() => setLogoutConfirm(false)}
      PaperProps={{
        sx: {
          borderRadius: '14px',
          backgroundColor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
          maxWidth: '340px',
          m: '16px',
        },
      }}
    >
      <DialogTitle sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '24px', letterSpacing: '0.04em', pb: '4px' }}>
        Sign Out?
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: 'text.secondary' }}>
          Are you sure you want to sign out?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: '20px', pb: '16px', gap: '8px' }}>
        <Button
          onClick={() => setLogoutConfirm(false)}
          sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '13px', color: 'text.secondary', borderRadius: '8px' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleLogout}
          variant="contained"
          sx={{
            fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '13px',
            borderRadius: '8px', px: '20px',
            background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
          }}
        >
          Sign Out
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
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
            position: 'relative',
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
              style={{
                height: '36px',
                objectFit: 'contain',
                filter: mode === 'dark' ? 'invert(1) brightness(0.85)' : 'none',
              }}
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

          {/* Mobile: avatar + hi name + theme toggle — absolutely centered */}
          {isMobile && user && (
            <Stack
              direction="row"
              alignItems="center"
              gap="8px"
              sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                pointerEvents: 'auto',
              }}
            >
              <Avatar
                src={user.avatarUrl}
                sx={{
                  width: 26, height: 26,
                  fontSize: '11px',
                  fontFamily: '"Bebas Neue", sans-serif',
                  letterSpacing: '0.04em',
                  background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
                  color: '#fff',
                }}
              >
                {(user.username ?? 'U').slice(0, 2).toUpperCase()}
              </Avatar>
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'text.secondary',
                  whiteSpace: 'nowrap',
                }}
              >
                Hi,{' '}
                <Box component="span" sx={{ color: 'primary.main' }}>
                  {user.username}
                </Box>
              </Typography>
            </Stack>
          )}

          {/* Right side */}
          <Stack direction="row" alignItems="center" gap={{ xs: '10px', sm: '20px', lg: '24px' }}>

            {/* Desktop nav links — hidden on mobile */}
            {!isMobile && (
              <>
                {visibleLinks.map((link) => (
                  <Box key={link.path} sx={{ position: 'relative' }}>
                    <Link
                      to={link.path}
                      onClick={link.onClick}
                      style={{
                        ...navLinkStyle,
                        color: link.active ? theme.palette.primary.main : theme.palette.text.secondary,
                      }}
                    >
                      {link.label}
                    </Link>
                    <AnimatePresence>{link.active && <NavUnderline />}</AnimatePresence>
                  </Box>
                ))}
              </>
            )}

            {/* Desktop auth section — hidden on mobile */}
            {!isMobile && (
              <>
                <Box sx={{ width: '1px', height: '20px', backgroundColor: theme.palette.divider }} />
                {user ? (
                  <Stack direction="row" alignItems="center" gap="10px">
                    <Avatar
                      src={user.avatarUrl}
                      sx={{
                        width: 28, height: 28,
                        fontSize: '12px',
                        fontFamily: '"Bebas Neue", sans-serif',
                        letterSpacing: '0.04em',
                        background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
                        color: '#fff',
                      }}
                    >
                      {(user.username ?? 'U').slice(0, 2).toUpperCase()}
                    </Avatar>
                    <Typography
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'text.secondary',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Hi,{' '}
                      <Box component="span" sx={{ color: 'primary.main' }}>
                        {user.username}
                      </Box>
                    </Typography>
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
                    <Tooltip title="Settings">
                      <IconButton onClick={() => navigate('/settings')} size="small" sx={iconBtnSx}>
                        <Settings sx={{ fontSize: '18px' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sign out">
                      <IconButton onClick={() => setLogoutConfirm(true)} size="small" sx={iconBtnSx}>
                        <Logout sx={{ fontSize: '18px' }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                ) : (
                  <Stack direction="row" alignItems="center" gap="10px">
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
                  </Stack>
                )}
              </>
            )}

            {/* Theme toggle + hamburger — mobile only */}
            {isMobile && (
              <>
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
                <IconButton onClick={() => setDrawerOpen(true)} size="small" sx={iconBtnSx}>
                  <MenuIcon sx={{ fontSize: '20px' }} />
                </IconButton>
              </>
            )}
          </Stack>
        </Stack>
      </motion.div>

      {mobileDrawer}
      {logoutDialog}
    </>
  );
}
