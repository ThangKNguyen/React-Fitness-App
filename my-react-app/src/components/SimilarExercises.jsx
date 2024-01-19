import { Box, Stack, Typography } from "@mui/material"
import HorizontalScrollbar from './HorizontalScrollbar';
import Loader from "./Loader";

export default function SimilarExercises({targetMuscleExercises,equipmentExercises}){
    return(
       <Box
        sx={{ mt: { lg: '100px', xs: '0px' } }}
       >
         <Typography variant="h3">
            Exercises that target the same muscle group
         </Typography>

        <Stack 
            direction="row" sx={{ p: 2, position: 'relative' }}
        >
            {targetMuscleExercises.length ? <HorizontalScrollbar data={targetMuscleExercises} /> :<Loader/>}
        </Stack>

        <Typography variant="h3" mb='30px' mt='30px'>
            Exercises that uses the same equipments
         </Typography>
        <Stack 
            direction="row" sx={{ p: 2, position: 'relative' }}
        >
            {targetMuscleExercises.length ? <HorizontalScrollbar data={equipmentExercises} /> :<Loader/>}
        </Stack>

       </Box>
    )
}