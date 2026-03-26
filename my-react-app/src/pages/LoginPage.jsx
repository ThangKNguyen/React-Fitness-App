import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert, InputAdornment, IconButton, Tooltip } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useAuth } from '../utils/useAuth';

export default function LoginPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      fontFamily: '"DM Sans", sans-serif',
      fontSize: '15px',
      '& fieldset': { borderColor: theme.palette.divider, borderWidth: '1.5px' },
      '&:hover fieldset': { borderColor: theme.palette.primary.main },
      '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main, borderWidth: '2px' },
    },
    '& .MuiInputLabel-root': {
      fontFamily: '"DM Sans", sans-serif',
      fontSize: '14px',
    },
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 130px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: '16px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        style={{ width: '100%', maxWidth: '420px' }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: '40px', justifyContent: 'center' }}>
          <Typography
            sx={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: '24px',
              letterSpacing: '0.08em',
              color: 'text.primary',
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
          </Typography>
        </Box>

        {/* Card */}
        <Box
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: '16px',
            border: `1.5px solid ${theme.palette.divider}`,
            p: { xs: '28px 24px', sm: '40px' },
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: '32px',
              letterSpacing: '0.03em',
              color: 'text.primary',
              mb: '4px',
              lineHeight: 1,
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px',
              color: 'text.secondary',
              mb: '32px',
            }}
          >
            Sign in to your account to continue
          </Typography>

          {/* Demo credentials */}
          <Box
            sx={{
              mb: '24px',
              p: '14px 16px',
              borderRadius: '10px',
              border: '1.5px dashed',
              borderColor: 'primary.main',
              backgroundColor: 'rgba(255, 38, 37, 0.05)',
            }}
          >
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', fontWeight: 700, color: 'primary.main', mb: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Just browsing?
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: 'text.secondary', mb: '10px', lineHeight: 1.5 }}>
              Use the test account to explore the app without signing up.
            </Typography>
            <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Tooltip title="Click to fill email">
                <Box
                  onClick={() => setEmail('tester@gmail.com')}
                  sx={{
                    px: '10px', py: '5px',
                    borderRadius: '6px',
                    backgroundColor: 'background.default',
                    border: '1px solid',
                    borderColor: 'divider',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: 'text.primary',
                    cursor: 'pointer',
                    userSelect: 'all',
                    '&:hover': { borderColor: 'primary.main' },
                  }}
                >
                  tester@gmail.com
                </Box>
              </Tooltip>
              <Tooltip title="Click to fill password">
                <Box
                  onClick={() => setPassword('12345678')}
                  sx={{
                    px: '10px', py: '5px',
                    borderRadius: '6px',
                    backgroundColor: 'background.default',
                    border: '1px solid',
                    borderColor: 'divider',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: 'text.primary',
                    cursor: 'pointer',
                    userSelect: 'all',
                    '&:hover': { borderColor: 'primary.main' },
                  }}
                >
                  12345678
                </Box>
              </Tooltip>
            </Box>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: '24px',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '13px',
                borderRadius: '10px',
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
              sx={inputSx}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((p) => !p)}
                      edge="end"
                      size="small"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: '4px',
                py: '13px',
                fontSize: '15px',
                fontWeight: 700,
                fontFamily: '"DM Sans", sans-serif',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
                boxShadow: '0 4px 20px rgba(255, 38, 37, 0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #CC1E1D 0%, #e55d2a 100%)',
                  boxShadow: '0 6px 28px rgba(255, 38, 37, 0.5)',
                },
                '&:disabled': { opacity: 0.6 },
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>
        </Box>

        <Typography
          sx={{
            mt: '24px',
            textAlign: 'center',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '13px',
            color: 'text.secondary',
          }}
        >
          Don&apos;t have an account?{' '}
          <Box
            component={Link}
            to="/register"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Register
          </Box>
        </Typography>
      </motion.div>
    </Box>
  );
}
