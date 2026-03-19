import { Pagination } from '@mui/material/';
import { Box, Stack, Typography, Select, MenuItem, ToggleButtonGroup, ToggleButton, FormControl, InputLabel } from '@mui/material';
import { useEffect, useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { apiFetch } from '../utils/api';
import ExerciseCard from './ExerciseCard';
import Loader from './Loader';

const scrollToExercises = () => {
  const el = document.getElementById('exercises');
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top: y, behavior: 'smooth' });
};

export default function Exercises({ exercises, setExercises, bodyPart, searched }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [exercisesPerPage] = useState(6);
  const [sortBy, setSortBy] = useState('default');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [showNotFound, setShowNotFound] = useState(false);
  const notFoundTimerRef = useRef(null);

  // 2-second delay before showing "not found"
  useEffect(() => {
    clearTimeout(notFoundTimerRef.current);
    if (searched && exercises.length === 0) {
      setShowNotFound(false);
      notFoundTimerRef.current = setTimeout(() => setShowNotFound(true), 2000);
    } else {
      setShowNotFound(false);
    }
    return () => clearTimeout(notFoundTimerRef.current);
  }, [searched, exercises]);

  const paginate = (event, value) => {
    setCurrentPage(value);
    setTimeout(scrollToExercises, 50);
  };

  // Reset page when filter/sort/bodyPart changes
  useEffect(() => {
    setCurrentPage(1);
  }, [equipmentFilter, sortBy, bodyPart]);

  // Reset filters when body part changes
  useEffect(() => {
    setEquipmentFilter('all');
    setSortBy('default');
  }, [bodyPart]);

  useEffect(() => {
    const fetchExercisesData = async () => {
      let exercisesData = [];

      if (bodyPart === 'all') {
        exercisesData = await apiFetch('/api/exercises?limit=100');
      } else if (bodyPart.startsWith('target:')) {
        const target = bodyPart.replace('target:', '');
        exercisesData = await apiFetch(`/api/exercises/target/${target}`);
      } else {
        exercisesData = await apiFetch(`/api/exercises/body-part/${bodyPart}`);
      }

      if (Array.isArray(exercisesData)) {
        setExercises(exercisesData);
      }
    };

    fetchExercisesData();
  }, [bodyPart]);

  // Unique equipment options from current exercises
  const equipmentOptions = useMemo(() => {
    const unique = [...new Set(exercises.map((e) => e.equipment))].sort();
    return unique;
  }, [exercises]);

  // Apply filter + sort
  const processedExercises = useMemo(() => {
    let result = [...exercises];
    if (equipmentFilter !== 'all') {
      result = result.filter((e) => e.equipment === equipmentFilter);
    }
    if (sortBy === 'az') result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'za') result.sort((a, b) => b.name.localeCompare(a.name));
    return result;
  }, [exercises, equipmentFilter, sortBy]);

  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = processedExercises.slice(indexOfFirstExercise, indexOfLastExercise);

  if (!exercises.length && !searched) return <Loader />;

  if (!exercises.length && searched) return (
    <Box id="exercises" sx={{ mt: { lg: '110px' } }} mt="50px" p="20px">
      {!showNotFound ? (
        <Loader />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Box
            sx={{
              textAlign: 'center',
              py: '80px',
              color: 'text.secondary',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '15px',
            }}
          >
            No exercises found. Try a different search term.
          </Box>
        </motion.div>
      )}
    </Box>
  );

  return (
    <Box id="exercises" sx={{ mt: { lg: '110px' } }} mt="50px" p="20px">
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      >
        <Stack direction="row" alignItems="center" gap="12px" mb="28px">
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
            }}
          >
            Showing Results
          </Typography>
          {processedExercises.length !== exercises.length && (
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '13px',
                color: 'text.secondary',
                mt: { lg: '4px', xs: '2px' },
              }}
            >
              {processedExercises.length} of {exercises.length}
            </Typography>
          )}
        </Stack>
      </motion.div>

      {/* Filter + Sort bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          gap="12px"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          mb="36px"
          flexWrap="wrap"
        >
          {/* Equipment filter */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '13px',
                color: 'text.secondary',
              }}
            >
              Equipment
            </InputLabel>
            <Select
              value={equipmentFilter}
              label="Equipment"
              onChange={(e) => setEquipmentFilter(e.target.value)}
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '10px',
                '& .MuiOutlinedInput-notchedOutline': { borderRadius: '10px' },
              }}
            >
              <MenuItem value="all" sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px' }}>
                All Equipment
              </MenuItem>
              {equipmentOptions.map((eq) => (
                <MenuItem
                  key={eq}
                  value={eq}
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: '13px',
                    textTransform: 'capitalize',
                  }}
                >
                  {eq}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Sort */}
          <ToggleButtonGroup
            value={sortBy}
            exclusive
            onChange={(_, val) => { if (val !== null) setSortBy(val); }}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'none',
                px: '14px',
                py: '6px',
                borderRadius: '8px !important',
                border: '1px solid',
                borderColor: 'divider',
                color: 'text.secondary',
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
                  color: '#fff',
                  borderColor: 'transparent',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #CC1E1D 0%, #e55d2a 100%)',
                  },
                },
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  backgroundColor: 'rgba(255,38,37,0.06)',
                },
              },
              gap: '6px',
              '& .MuiToggleButtonGroup-grouped': {
                marginLeft: '0 !important',
                borderLeft: '1px solid !important',
                borderLeftColor: 'divider !important',
                '&.Mui-selected': { borderLeftColor: 'transparent !important' },
              },
            }}
          >
            <ToggleButton value="default">Default</ToggleButton>
            <ToggleButton value="az">A → Z</ToggleButton>
            <ToggleButton value="za">Z → A</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </motion.div>

      {/* Cards grid */}
      {currentExercises.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            sx={{
              textAlign: 'center',
              py: '80px',
              color: 'text.secondary',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '15px',
            }}
          >
            No exercises match this filter. Try a different equipment type.
          </Box>
        </motion.div>
      ) : (
        <Stack
          direction="row"
          sx={{ gap: { lg: '32px', xs: '24px' } }}
          flexWrap="wrap"
          justifyContent="center"
        >
          {currentExercises.map((exercise, index) => (
            <ExerciseCard key={exercise.id || index} exercise={exercise} index={index} />
          ))}
        </Stack>
      )}

      {/* Pagination */}
      <Stack sx={{ mt: { lg: '80px', xs: '48px' } }} alignItems="center">
        {processedExercises.length > exercisesPerPage && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Pagination
              color="primary"
              shape="rounded"
              defaultPage={1}
              count={Math.ceil(processedExercises.length / exercisesPerPage)}
              page={currentPage}
              onChange={paginate}
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 600,
                },
              }}
            />
          </motion.div>
        )}
      </Stack>
    </Box>
  );
}
