import { Box, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import HorizontalScrollbar from './HorizontalScrollbar';
import Loader from './Loader';

const SectionHeading = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: -24 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
  >
    <Stack direction="row" alignItems="center" gap="12px" mb="24px" mt="16px">
      <Box
        sx={{
          width: '4px',
          height: '32px',
          background: 'linear-gradient(180deg, #FF2625, #FF6B35)',
          borderRadius: '4px',
          flexShrink: 0,
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
        {children}
      </Typography>
    </Stack>
  </motion.div>
);

export default function SimilarExercises({ targetMuscleExercises, equipmentExercises }) {
  return (
    <Box sx={{ mt: { lg: '100px', xs: '40px' }, p: '20px' }}>
      <SectionHeading>Same Muscle Group</SectionHeading>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
      >
        <Stack direction="row" sx={{ p: '0 0 40px', position: 'relative' }}>
          {targetMuscleExercises.length ? (
            <HorizontalScrollbar data={targetMuscleExercises} />
          ) : (
            <Loader />
          )}
        </Stack>
      </motion.div>

      <SectionHeading>Same Equipment</SectionHeading>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Stack direction="row" sx={{ p: '0 0 40px', position: 'relative' }}>
          {targetMuscleExercises.length ? (
            <HorizontalScrollbar data={equipmentExercises} />
          ) : (
            <Loader />
          )}
        </Stack>
      </motion.div>
    </Box>
  );
}
