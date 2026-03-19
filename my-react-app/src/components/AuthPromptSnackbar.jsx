import { Snackbar, Button, Box, Typography } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthPrompt } from '../utils/useAuthPrompt';

export default function AuthPromptSnackbar() {
  const { open, hide } = useAuthPrompt();
  const navigate = useNavigate();

  const handleSignIn = () => {
    hide();
    navigate('/login');
  };

  return (
    <Snackbar
      open={open}
      onClose={hide}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          backgroundColor: '#1a1a1a',
          borderRadius: '12px',
          border: '1px solid rgba(255,38,37,0.25)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          minWidth: '0',
          px: '4px',
        },
      }}
      message={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', py: '2px' }}>
          <LockOutlined sx={{ fontSize: '18px', color: '#FF2625', flexShrink: 0 }} />
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: '#F0F0F0',
            }}
          >
            Sign in to save your progress
          </Typography>
        </Box>
      }
      action={
        <Button
          size="small"
          onClick={handleSignIn}
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 700,
            fontSize: '13px',
            color: '#FF2625',
            mr: '4px',
            '&:hover': { backgroundColor: 'rgba(255,38,37,0.1)' },
          }}
        >
          Sign In
        </Button>
      }
    />
  );
}
