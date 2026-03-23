import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <Box
        sx={{
          minHeight: 'calc(100vh - 160px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: '24px',
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: { xs: '120px', sm: '180px' },
            lineHeight: 1,
            background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: '8px',
            userSelect: 'none',
          }}
        >
          404
        </Typography>

        <Typography
          sx={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: { xs: '28px', sm: '36px' },
            letterSpacing: '0.04em',
            color: 'text.primary',
            mb: '12px',
          }}
        >
          Page Not Found
        </Typography>

        <Typography
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '15px',
            color: 'text.secondary',
            maxWidth: '360px',
            mb: '40px',
            lineHeight: 1.6,
          }}
        >
          Looks like this page skipped leg day — it doesn't exist.
        </Typography>

        <Button
          onClick={() => navigate('/')}
          variant="contained"
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 700,
            fontSize: '14px',
            borderRadius: '10px',
            px: '32px',
            py: '12px',
            background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
            boxShadow: '0 4px 20px rgba(255, 38, 37, 0.35)',
            '&:hover': {
              background: 'linear-gradient(135deg, #CC1E1D 0%, #e55d2a 100%)',
              boxShadow: '0 6px 28px rgba(255, 38, 37, 0.5)',
            },
          }}
        >
          Back to Home
        </Button>
      </Box>
    </motion.div>
  );
}
