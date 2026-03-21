import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { apiFetch } from '../utils/api';
import Detail from '../components/Detail';
import ExerciseVideos from '../components/ExerciseVideos';
import SimilarExercises from '../components/SimilarExercises';
import { useRecentlyViewed } from '../utils/useRecentlyViewed';

export default function ExerciseDetail() {
  const [exerciseDetail, setExerciseDetail] = useState({});
  const [exerciseVideos, setExerciseVideos] = useState([]);
  const { id } = useParams();

  const [targetMuscleExercises, setTargetMuscleExercises] = useState([]);
  const [equipmentExercises, setEquipmentExercises] = useState([]);
  const { addRecent } = useRecentlyViewed();

  const isCustom = id.startsWith('custom_');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchExercisesData = async () => {
      const exerciseDetailData = await apiFetch(`/api/exercises/${id}`);
      setExerciseDetail(exerciseDetailData);
      addRecent(exerciseDetailData);

      if (!id.startsWith('custom_')) {
        const [videosData, targetData, equipmentData] = await Promise.all([
          apiFetch(`/api/videos?exercise=${encodeURIComponent(exerciseDetailData.name)}`),
          apiFetch(`/api/exercises/target/${exerciseDetailData.target}`),
          apiFetch(`/api/exercises/equipment/${exerciseDetailData.equipment}`),
        ]);

        setExerciseVideos(videosData?.contents ?? []);
        setTargetMuscleExercises(targetData ?? []);
        setEquipmentExercises(equipmentData ?? []);
      }
    };

    fetchExercisesData();
  }, [id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <Box>
        <Detail exerciseDetail={exerciseDetail} />
        {!isCustom && (
          <>
            <ExerciseVideos exerciseVideos={exerciseVideos} name={exerciseDetail.name} />
            <SimilarExercises targetMuscleExercises={targetMuscleExercises} equipmentExercises={equipmentExercises} />
          </>
        )}
      </Box>
    </motion.div>
  );
}
