import { useState } from 'react';
import { Box, Button, Stack, TextField, Typography, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import HorizontalScrollbar from './HorizontalScrollbar';
import { apiFetch } from '../utils/api';

// Custom ordered list — id is the API value (prefix 'target:' for target-based endpoints)
const BODY_PARTS = [
  { id: 'all',               label: 'All'         },
  { id: 'chest',             label: 'Chest'       },
  { id: 'back',              label: 'Back'        },
  { id: 'target:quads',      label: 'Quads'       },
  { id: 'target:hamstrings', label: 'Hamstrings'  },
  { id: 'target:calves',     label: 'Calves'      },
  { id: 'shoulders',         label: 'Shoulders'   },
  { id: 'target:biceps',     label: 'Biceps'      },
  { id: 'target:triceps',    label: 'Triceps'     },
  { id: 'lower arms',        label: 'Forearms'    },
  { id: 'target:abs',        label: 'Abs'         },
  { id: 'cardio',            label: 'Cardio'      },
  { id: 'neck',              label: 'Neck'        },
];

export default function SearchExercises({ setExercises, bodyPart, setBodyPart }) {
  const [search, setSearch] = useState('');
  const theme = useTheme();

  const handleSearch = async () => {
    if (search) {
      const searchedExercises = await apiFetch(`/api/exercises/search?q=${encodeURIComponent(search)}`);
      setSearch('');
      if (Array.isArray(searchedExercises)) setExercises(searchedExercises);
    }
  };

  return (
    <Stack alignItems="center" mt="60px" justifyContent="center" p="20px">
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        style={{ textAlign: 'center', marginBottom: '52px' }}
      >
        <Typography
          sx={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: { lg: '56px', xs: '38px' },
            letterSpacing: '0.04em',
            color: 'text.primary',
            lineHeight: 1.05,
            textAlign: 'center',
          }}
        >
          Awesome Exercises
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
            You Should Know
          </Box>
        </Typography>
      </motion.div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
        style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '64px' }}
      >
        <Box position="relative" sx={{ width: { lg: '800px', xs: '100%' } }}>
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search exercises, muscles, equipment..."
            type="text"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary', fontSize: '20px' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '50px',
                backgroundColor: 'background.paper',
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 500,
                fontSize: '15px',
                pr: '6px',
                '& fieldset': {
                  borderColor: theme.palette.divider,
                  borderWidth: '1.5px',
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: '2px',
                },
              },
              '& .MuiOutlinedInput-input': {
                py: '15px',
                color: 'text.primary',
                '&::placeholder': {
                  color: 'text.secondary',
                  opacity: 0.8,
                },
              },
            }}
          />
          <Button
            className="search-btn"
            onClick={handleSearch}
            variant="contained"
            sx={{
              position: 'absolute',
              right: '6px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 700,
              fontFamily: '"DM Sans", sans-serif',
              fontSize: { lg: '15px', xs: '13px' },
              px: { lg: '28px', xs: '18px' },
              py: '10px',
              borderRadius: '50px',
              boxShadow: '0 4px 16px rgba(255, 38, 37, 0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, #CC1E1D 0%, #e55d2a 100%)',
                boxShadow: '0 6px 24px rgba(255, 38, 37, 0.5)',
              },
              transition: 'all 0.25s ease',
            }}
          >
            Search
          </Button>
        </Box>
      </motion.div>

      {/* Body parts scrollbar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{ position: 'relative', width: '100%', padding: '20px' }}
      >
        <HorizontalScrollbar
          data={BODY_PARTS}
          bodyPart={bodyPart}
          setBodyPart={setBodyPart}
          isBodyParts
        />
      </motion.div>
    </Stack>
  );
}
