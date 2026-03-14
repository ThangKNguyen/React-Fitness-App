import { Box, Stack, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import HeroBannerImage from '../assets/images/davidlaid.jpg';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay },
});

export default function HeroBanner() {
  return (
    <Box
      sx={{
        mt: { lg: '60px', xs: '48px' },
        ml: { sm: '50px' },
        minHeight: { lg: '640px', xs: 'auto' },
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: { xs: 'center', lg: 'flex-start' },
      }}
      position="relative"
      p="20px"
    >
      {/* Eyebrow label */}
      <motion.div {...fadeUp(0.1)}>
        <Stack
          direction="row"
          alignItems="center"
          gap="10px"
          mb="20px"
          justifyContent={{ xs: 'center', lg: 'flex-start' }}
        >
          <Box
            sx={{
              width: '32px',
              height: '3px',
              background: 'linear-gradient(90deg, #FF2625, #FF6B35)',
              borderRadius: '2px',
            }}
          />
          <Typography
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              fontFamily: '"DM Sans", sans-serif',
            }}
          >
            Muscle Forger
          </Typography>
        </Stack>
      </motion.div>

      {/* Main headline */}
      <motion.div {...fadeUp(0.22)}>
        <Typography
          sx={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: { lg: '96px', sm: '72px', xs: '56px' },
            lineHeight: 0.92,
            letterSpacing: '0.03em',
            color: 'text.primary',
            mb: '28px',
            textAlign: { xs: 'center', lg: 'left' },
          }}
        >
          No Pain
          <br />
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            No Gain.
          </Box>
        </Typography>
      </motion.div>

      {/* Subtext */}
      <motion.div {...fadeUp(0.34)}>
        <Typography
          sx={{
            fontSize: { lg: '18px', xs: '16px' },
            lineHeight: '1.7',
            mb: '36px',
            color: 'text.secondary',
            maxWidth: { xs: '320px', lg: '420px' },
            fontFamily: '"DM Sans", sans-serif',
            textAlign: { xs: 'center', lg: 'left' },
          }}
        >
          Browse through the most optimal exercises below and build the physique you have always wanted.
        </Typography>
      </motion.div>

      {/* CTA */}
      <motion.div {...fadeUp(0.46)}>
        <Button
          variant="contained"
          href="#exercises"
          component={motion.a}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          sx={{
            px: '32px',
            py: '14px',
            fontSize: '15px',
            fontWeight: 700,
            borderRadius: '50px',
            background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
            boxShadow: '0 6px 24px rgba(255, 38, 37, 0.4)',
            letterSpacing: '0.3px',
            '&:hover': {
              background: 'linear-gradient(135deg, #CC1E1D 0%, #e55d2a 100%)',
              boxShadow: '0 8px 32px rgba(255, 38, 37, 0.55)',
            },
            transition: 'background 0.25s ease, box-shadow 0.25s ease',
          }}
        >
          Explore Exercises
        </Button>
      </motion.div>

      {/* Background watermark */}
      <Typography
        sx={{
          fontFamily: '"Bebas Neue", sans-serif',
          fontWeight: 600,
          color: 'primary.main',
          opacity: 0.04,
          display: { lg: 'block', xs: 'none' },
          fontSize: '260px',
          lineHeight: 1,
          position: 'absolute',
          bottom: '-20px',
          left: '0px',
          userSelect: 'none',
          pointerEvents: 'none',
          letterSpacing: '0.02em',
        }}
      >
        FORGE
      </Typography>

      <img src={HeroBannerImage} alt="Banner Image" className="hero-banner-img" />
    </Box>
  );
}
