import { Link } from 'react-router-dom';
import { Box, Chip, Stack, Typography, IconButton, Tooltip } from '@mui/material';
import { Favorite, FavoriteBorder, FitnessCenter } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useFavorites } from '../utils/useFavorites';

export default function ExerciseCard({ exercise, index = 0 }) {
  const theme = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();

  const favorited = isFavorite(exercise.id);

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
        {/* Action buttons — revealed on card hover via CSS */}
        <Box className="card-actions">
          <Tooltip title={favorited ? 'Remove from saved' : 'Save exercise'} placement="left">
            <IconButton
              size="small"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(exercise);
              }}
              sx={{
                backgroundColor: 'rgba(0,0,0,0.60)',
                backdropFilter: 'blur(8px)',
                color: favorited ? '#FF2625' : '#fff',
                width: '32px',
                height: '32px',
                transition: 'background-color 0.2s, color 0.2s',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.80)' },
              }}
            >
              {favorited
                ? <Favorite sx={{ fontSize: '15px' }} />
                : <FavoriteBorder sx={{ fontSize: '15px' }} />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Custom badge */}
        {exercise.custom && (
          <Chip
            label="Custom"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 2,
              fontSize: '10px',
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              height: '22px',
              background: 'linear-gradient(135deg, #FF2625, #FF6B35)',
              color: '#fff',
              '& .MuiChip-label': { px: '8px' },
            }}
          />
        )}

        {exercise.gifUrl ? (
          <img src={exercise.gifUrl} alt={exercise.name} loading="lazy" />
        ) : (
          <Box
            sx={{
              height: '326px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255,38,37,0.08)'
                  : 'rgba(255,38,37,0.05)',
              flexShrink: 0,
            }}
          >
            <FitnessCenter sx={{ fontSize: '64px', color: 'primary.main', opacity: 0.2 }} />
          </Box>
        )}

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
