import { Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Icon from '../assets/icons/gym.png';

export default function BodyPart({ item, bodyPart, setBodyPart }) {
  const theme = useTheme();
  const isSelected = bodyPart === item.id;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <Stack
        type="button"
        alignItems="center"
        justifyContent="center"
        className="bodyPart-card"
        onClick={() => {
          setBodyPart(item.id);
          window.scrollTo({ top: 1800, left: 100, behavior: 'smooth' });
        }}
        sx={{
          backgroundColor: isSelected
            ? theme.palette.mode === 'dark'
              ? 'rgba(255, 38, 37, 0.12)'
              : 'rgba(255, 38, 37, 0.06)'
            : theme.palette.background.paper,
          border: isSelected
            ? `1.5px solid ${theme.palette.primary.main}`
            : `1.5px solid ${theme.palette.divider}`,
          borderTop: isSelected
            ? `3px solid ${theme.palette.primary.main}`
            : `3px solid ${theme.palette.divider}`,
          borderRadius: '14px',
          width: '200px',
          height: '200px',
          cursor: 'pointer',
          gap: '20px',
          boxShadow: isSelected
            ? '0 8px 32px rgba(255, 38, 37, 0.2)'
            : theme.palette.mode === 'dark'
            ? '0 2px 12px rgba(0,0,0,0.3)'
            : '0 2px 12px rgba(0,0,0,0.07)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          // override CSS class transforms since motion handles it
          transform: 'none !important',
        }}
      >
        <Box
          sx={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isSelected
              ? 'rgba(255, 38, 37, 0.15)'
              : theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(0,0,0,0.04)',
            transition: 'background-color 0.3s ease',
          }}
        >
          <img
            src={Icon}
            alt="gym"
            style={{
              width: '28px',
              height: '28px',
              opacity: isSelected ? 1 : 0.6,
              filter: isSelected
                ? 'invert(20%) sepia(100%) saturate(6000%) hue-rotate(0deg) brightness(95%) contrast(115%)'
                : theme.palette.mode === 'dark'
                ? 'invert(1)'
                : 'none',
              transition: 'all 0.3s ease',
            }}
          />
        </Box>

        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'capitalize',
            fontFamily: '"DM Sans", sans-serif',
            color: isSelected ? 'primary.main' : 'text.primary',
            letterSpacing: '0.3px',
            transition: 'color 0.3s ease',
          }}
        >
          {item.label}
        </Typography>
      </Stack>
    </motion.div>
  );
}
