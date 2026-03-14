import { Pagination } from '@mui/material/';
import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { exerciseOptions, fetchData } from '../utils/fetchData';
import ExerciseCard from './ExerciseCard';
import Loader from './Loader';

export default function Exercises({ exercises, setExercises, bodyPart }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [exercisesPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(true);
  const [showNoExercisesMessage, setShowNoExercisesMessage] = useState(false);

  const paginate = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 1800, behavior: 'smooth' });
  };

  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = exercises.slice(indexOfFirstExercise, indexOfLastExercise);

  useEffect(() => {
    const fetchExercisesData = async () => {
      let exercisesData = [];

      if (bodyPart === 'all') {
        exercisesData = await fetchData(
          'https://exercisedb.p.rapidapi.com/exercises?limit=100',
          exerciseOptions
        );
      } else {
        exercisesData = await fetchData(
          `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}?limit=100`,
          exerciseOptions
        );
      }

      if (Array.isArray(exercisesData)) {
        setExercises(exercisesData);
      }
    };

    fetchExercisesData();
  }, [bodyPart]);

  if (!currentExercises.length) return <Loader />;

  return (
    <Box id="exercises" sx={{ mt: { lg: '110px' } }} mt="50px" p="20px">
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      >
        <Stack direction="row" alignItems="center" gap="12px" mb="40px">
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
        </Stack>
      </motion.div>

      {/* Cards grid */}
      <Stack
        direction="row"
        sx={{ gap: { lg: '32px', xs: '24px' } }}
        flexWrap="wrap"
        justifyContent="center"
      >
        {currentExercises.map((exercise, index) => (
          <ExerciseCard key={index} exercise={exercise} index={index} />
        ))}
      </Stack>

      {/* Pagination */}
      <Stack sx={{ mt: { lg: '80px', xs: '48px' } }} alignItems="center">
        {exercises.length > 9 && (
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
              count={Math.ceil(exercises.length / exercisesPerPage)}
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
