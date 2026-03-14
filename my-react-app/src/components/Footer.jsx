import { Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Logo from '../assets/images/trident.png';

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      mt="80px"
      sx={{
        borderTop: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Red gradient accent line */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #FF2625 0%, #FF6B35 60%, transparent 100%)',
        }}
      />

      <Stack
        alignItems="center"
        gap="20px"
        px="40px"
        pt="48px"
        pb="48px"
      >
        <img
          src={Logo}
          alt="logo"
          style={{
            height: '72px',
            opacity: 0.9,
            filter: theme.palette.mode === 'dark' ? 'invert(1) brightness(0.85)' : 'none',
          }}
        />

        <Typography
          sx={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: { lg: '28px', xs: '20px' },
            letterSpacing: '0.08em',
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          We are all going to make it brahs.
        </Typography>

        <Typography
          sx={{
            fontSize: '12px',
            color: 'text.secondary',
            opacity: 0.5,
            fontFamily: '"DM Sans", sans-serif',
            letterSpacing: '0.5px',
          }}
        >
          © {new Date().getFullYear()} Muscle Forger. All rights reserved.
        </Typography>
      </Stack>
    </Box>
  );
}
