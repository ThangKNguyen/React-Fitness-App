import { useState } from 'react';
import { Box, Stack, Typography, Chip, Button, IconButton } from '@mui/material';
import { Favorite, History, FitnessCenter, Add, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useFavorites } from '../utils/useFavorites';
import { useRecentlyViewed } from '../utils/useRecentlyViewed';
import { useCustomExercises } from '../utils/useCustomExercises';
import ExerciseCard from '../components/ExerciseCard';
import CreateCustomExerciseDialog from '../components/CreateCustomExerciseDialog';

const PAGE_SIZE = 5;

const scrollbarSx = {
  '&::-webkit-scrollbar': { height: '8px' },
  '&::-webkit-scrollbar-track': { background: 'transparent' },
  '&::-webkit-scrollbar-thumb': { background: 'rgba(255,38,37,0.3)', borderRadius: '2px' },
};

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

const navBtnSx = {
  width: '34px',
  height: '34px',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: '8px',
  color: 'text.secondary',
  '&:hover': {
    borderColor: 'primary.main',
    color: 'primary.main',
    backgroundColor: 'rgba(255,38,37,0.06)',
  },
  '&.Mui-disabled': { opacity: 0.3 },
};

const PaginatedCarousel = ({ items }) => {
  const [page, setPage] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const slice = items.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const goToPage = (p) => {
    const clamped = Math.max(0, Math.min(totalPages - 1, p));
    setPage(clamped);
    setInputVal('');
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      const num = parseInt(inputVal, 10);
      if (!isNaN(num)) goToPage(num - 1);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: { lg: '32px', xs: '20px' },
          overflowX: 'auto',
          pb: '16px',
          ...scrollbarSx,
        }}
      >
        {slice.map((exercise, index) => (
          <Box key={exercise.id} sx={{ flexShrink: 0 }}>
            <ExerciseCard exercise={exercise} index={index} />
          </Box>
        ))}
      </Box>

      {totalPages > 1 && (
        <Stack direction="row" alignItems="center" gap="10px" mt="16px">
          <IconButton
            size="small"
            disabled={page === 0}
            onClick={() => goToPage(page - 1)}
            sx={navBtnSx}
          >
            <ChevronLeft sx={{ fontSize: '20px' }} />
          </IconButton>

          {/* Page input */}
          <Stack direction="row" alignItems="center" gap="6px">
            <Box
              component="input"
              type="number"
              min={1}
              max={totalPages}
              value={inputVal}
              placeholder={String(page + 1)}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleInputKeyDown}
              sx={{
                width: '48px',
                height: '34px',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '8px',
                backgroundColor: 'background.paper',
                color: 'text.primary',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                textAlign: 'center',
                outline: 'none',
                '&:focus': { borderColor: 'primary.main' },
                '&::-webkit-inner-spin-button': { display: 'none' },
                '&::-webkit-outer-spin-button': { display: 'none' },
                MozAppearance: 'textfield',
              }}
            />
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: 'text.secondary',
              }}
            >
              / {totalPages}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              disabled={!inputVal}
              onClick={() => {
                const num = parseInt(inputVal, 10);
                if (!isNaN(num)) goToPage(num - 1);
              }}
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 700,
                fontSize: '12px',
                textTransform: 'none',
                borderRadius: '8px',
                borderColor: 'divider',
                color: 'text.secondary',
                px: '10px',
                height: '34px',
                whiteSpace: 'nowrap',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  backgroundColor: 'rgba(255,38,37,0.06)',
                },
                '&.Mui-disabled': { opacity: 0.3 },
              }}
            >
              Go
            </Button>
          </Stack>

          <IconButton
            size="small"
            disabled={page === totalPages - 1}
            onClick={() => goToPage(page + 1)}
            sx={navBtnSx}
          >
            <ChevronRight sx={{ fontSize: '20px' }} />
          </IconButton>
        </Stack>
      )}
    </Box>
  );
};

export default function SavedPage() {
  const { favorites } = useFavorites();
  const { recentlyViewed } = useRecentlyViewed();
  const { customExercises, createCustomExercise } = useCustomExercises();
  const [customDialogOpen, setCustomDialogOpen] = useState(false);

  const recentSlice = recentlyViewed.slice(0, 10);

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
            <PaginatedCarousel items={favorites} />
          )}
        </Box>

        {/* Custom Exercises section */}
        <Box mb={{ xs: '64px', lg: '80px' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb="32px">
            <SectionHeader icon={FitnessCenter} title="My Custom Exercises" count={customExercises.length} />
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setCustomDialogOpen(true)}
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 700,
                fontSize: '13px',
                borderRadius: '10px',
                borderColor: 'divider',
                color: 'text.secondary',
                textTransform: 'none',
                px: '16px',
                whiteSpace: 'nowrap',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  backgroundColor: 'rgba(255,38,37,0.06)',
                },
              }}
            >
              Create Exercise
            </Button>
          </Stack>
          {customExercises.length === 0 ? (
            <EmptyState
              icon={FitnessCenter}
              title="No custom exercises"
              subtitle="Create your own exercises for movements not in our database."
            />
          ) : (
            <PaginatedCarousel items={customExercises} />
          )}
        </Box>

        {/* Recently Viewed section */}
        <Box>
          <SectionHeader icon={History} title="Recently Viewed" count={recentSlice.length} />
          {recentSlice.length === 0 ? (
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
                ...scrollbarSx,
              }}
            >
              {recentSlice.map((exercise, index) => (
                <Box key={exercise.id} sx={{ flexShrink: 0 }}>
                  <ExerciseCard exercise={exercise} index={index} />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <CreateCustomExerciseDialog
        open={customDialogOpen}
        onClose={() => setCustomDialogOpen(false)}
        onCreate={createCustomExercise}
      />
    </motion.div>
  );
}
