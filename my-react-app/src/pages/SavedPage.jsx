import { Box, Stack, Typography, Chip } from '@mui/material';
import { Favorite, History } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useFavorites } from '../utils/useFavorites';
import { useRecentlyViewed } from '../utils/useRecentlyViewed';
import ExerciseCard from '../components/ExerciseCard';

const SectionHeader = ({ icon, title, count }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
  >
    <Stack direction="row" alignItems="center" gap="12px" mb="32px">
      <Box
        sx={{
          width: '4px',
          height: '32px',
          background: 'linear-gradient(180deg, #FF2625, #FF6B35)',
          borderRadius: '4px',
        }}
      />
      <Typography
        sx={{
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: { lg: '36px', xs: '26px' },
          letterSpacing: '0.03em',
          color: 'text.primary',
          lineHeight: 1,
        }}
      >
        {title}
      </Typography>
      {count > 0 && (
        <Chip
          label={count}
          size="small"
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 700,
            fontSize: '12px',
            background: 'linear-gradient(135deg, #FF2625, #FF6B35)',
            color: '#fff',
            height: '22px',
            '& .MuiChip-label': { px: '8px' },
          }}
        />
      )}
    </Stack>
  </motion.div>
);

const EmptyState = ({ icon: Icon, title, subtitle }) => {
  const theme = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          py: '64px',
          border: `1.5px dashed ${theme.palette.divider}`,
          borderRadius: '16px',
          gap: '16px',
        }}
      >
        <Box
          sx={{
            width: '72px',
            height: '72px',
            borderRadius: '18px',
            background:
              theme.palette.mode === 'dark'
                ? 'rgba(255,38,37,0.08)'
                : 'rgba(255,38,37,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon sx={{ fontSize: '32px', color: 'primary.main', opacity: 0.5 }} />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: '18px',
              color: 'text.primary',
              mb: '8px',
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px',
              color: 'text.secondary',
              maxWidth: '280px',
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Stack>
    </motion.div>
  );
};

export default function SavedPage() {
  const { favorites } = useFavorites();
  const { recentlyViewed } = useRecentlyViewed();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <Box sx={{ px: { xs: '16px', sm: '32px', lg: '48px' }, py: { xs: '40px', lg: '60px' } }}>
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <Typography
            sx={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: { lg: '64px', xs: '42px' },
              letterSpacing: '0.04em',
              color: 'text.primary',
              lineHeight: 1,
              mb: '8px',
            }}
          >
            Your{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Library
            </Box>
          </Typography>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '15px',
              color: 'text.secondary',
              mb: { xs: '48px', lg: '64px' },
            }}
          >
            Saved exercises and your browsing history — all in one place.
          </Typography>
        </motion.div>

        {/* Favorites section */}
        <Box mb={{ xs: '64px', lg: '80px' }}>
          <SectionHeader icon={Favorite} title="Saved Exercises" count={favorites.length} />
          {favorites.length === 0 ? (
            <EmptyState
              icon={Favorite}
              title="Nothing saved yet"
              subtitle="Tap the heart icon on any exercise card to save it here."
            />
          ) : (
            <Stack
              direction="row"
              sx={{ gap: { lg: '32px', xs: '24px' } }}
              flexWrap="wrap"
              justifyContent="flex-start"
            >
              {favorites.map((exercise, index) => (
                <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
              ))}
            </Stack>
          )}
        </Box>

        {/* Recently Viewed section */}
        <Box>
          <SectionHeader icon={History} title="Recently Viewed" count={recentlyViewed.length} />
          {recentlyViewed.length === 0 ? (
            <EmptyState
              icon={History}
              title="No history yet"
              subtitle="Exercises you visit will appear here so you can jump back quickly."
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: { lg: '32px', xs: '20px' },
                overflowX: 'auto',
                pb: '16px',
                '&::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
              }}
            >
              {recentlyViewed.map((exercise, index) => (
                <Box key={exercise.id} sx={{ flexShrink: 0 }}>
                  <ExerciseCard exercise={exercise} index={index} />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}
