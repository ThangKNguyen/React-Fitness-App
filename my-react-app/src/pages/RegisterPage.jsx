import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useAuth } from '../utils/useAuth';
import Logo from '../assets/images/trident.png';

export default function RegisterPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, username, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
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
            Create Account
          </Typography>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px',
              color: 'text.secondary',
              mb: '32px',
            }}
          >
            Start building your workout plans today
          </Typography>

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
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
              autoComplete="username"
              inputProps={{ minLength: 3, maxLength: 50 }}
              sx={inputSx}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="new-password"
              inputProps={{ minLength: 8 }}
              helperText="Minimum 8 characters"
              FormHelperTextProps={{ sx: { fontFamily: '"DM Sans", sans-serif', fontSize: '12px' } }}
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
              {loading ? 'Creating account...' : 'Create Account'}
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
          Already have an account?{' '}
          <Box
            component={Link}
            to="/login"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Sign In
          </Box>
        </Typography>
      </motion.div>
    </Box>
  );
}
