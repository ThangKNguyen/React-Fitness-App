import { Link } from 'react-router-dom';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

export default function ExerciseCard({ exercise, index = 0 }) {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        delay: (index % 6) * 0.07,
      }}
    >
      <Box
        component={Link}
        to={`/exercise/${exercise.id}`}
        className="exercise-card"
        sx={{
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 2px 16px rgba(0,0,0,0.4)'
              : '0 2px 16px rgba(0,0,0,0.08)',
        }}
      >
        <img src={exercise.gifUrl} alt={exercise.name} loading="lazy" />

        <Stack direction="row" gap="8px" px="16px" mt="14px">
          <Chip
            label={exercise.bodyPart}
            size="small"
            sx={{
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 38, 37, 0.15)'
                  : 'rgba(255, 38, 37, 0.10)',
              color: 'primary.main',
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: '11px',
              textTransform: 'capitalize',
              letterSpacing: '0.3px',
              border: '1px solid rgba(255, 38, 37, 0.25)',
              '& .MuiChip-label': { px: '10px' },
            }}
          />
          <Chip
            label={exercise.target}
            size="small"
            sx={{
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 107, 53, 0.15)'
                  : 'rgba(255, 107, 53, 0.10)',
              color: theme.palette.mode === 'dark' ? '#FF8C5A' : '#CC4A1A',
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: '11px',
              textTransform: 'capitalize',
              letterSpacing: '0.3px',
              border: '1px solid rgba(255, 107, 53, 0.25)',
              '& .MuiChip-label': { px: '10px' },
            }}
          />
        </Stack>

        <Typography
          sx={{
            px: '16px',
            color: 'text.primary',
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 700,
            fontSize: { lg: '18px', xs: '16px' },
            mt: '10px',
            textTransform: 'capitalize',
            lineHeight: 1.3,
            letterSpacing: '-0.2px',
          }}
        >
          {exercise.name}
        </Typography>
      </Box>
    </motion.div>
  );
}
