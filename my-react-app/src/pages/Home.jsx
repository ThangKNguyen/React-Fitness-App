import { useState } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import HeroBanner from '../components/HeroBanner';
import SearchExercises from '../components/SearchExercises';
import Exercises from '../components/Exercises';

export default function Home() {
  const [bodyPart, setBodyPart] = useState('all');
  const [exercises, setExercises] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSetExercises = (data) => {
    setExercises(data);
    setSearched(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box>
        <HeroBanner />
        <SearchExercises
          setExercises={handleSetExercises}
          bodyPart={bodyPart}
          setBodyPart={(bp) => { setBodyPart(bp); setSearched(false); }}
        />
        <Exercises
          exercises={exercises}
          setExercises={setExercises}
          bodyPart={bodyPart}
          searched={searched}
        />
      </Box>
    </motion.div>
  );
}
