import { useState, useEffect } from 'react';
import { Box, Button, Stack, TextField, Typography, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import HorizontalScrollbar from './HorizontalScrollbar';
import { exerciseOptions, fetchData } from '../utils/fetchData';

export default function SearchExercises({ setExercises, bodyPart, setBodyPart }) {
  const [search, setSearch] = useState('');
  const [bodyParts, setBodyParts] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchExercisesData = async () => {
      const bodyPartsData = await fetchData(
        'https://exercisedb.p.rapidapi.com/exercises/bodyPartList',
        exerciseOptions
      );
      setBodyParts(['all', ...bodyPartsData]);
    };
    fetchExercisesData();
  }, []);

  const handleSearch = async () => {
    if (search) {
      const exercisesData = await fetchData(
        'https://exercisedb.p.rapidapi.com/exercises?limit=900',
        exerciseOptions
      );

      const searchedExercises = exercisesData.filter(
        (item) =>
          item.name.toLowerCase().includes(search) ||
          item.target.toLowerCase().includes(search) ||
          item.equipment.toLowerCase().includes(search) ||
          item.bodyPart.toLowerCase().includes(search)
      );

      setSearch('');
      setExercises(searchedExercises);
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
          data={bodyParts}
          bodyPart={bodyPart}
          setBodyPart={setBodyPart}
          isBodyParts
        />
      </motion.div>
    </Stack>
  );
}
