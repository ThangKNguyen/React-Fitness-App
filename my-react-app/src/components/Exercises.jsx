//exercises component below the scroll bar, with the gifs, this is wrapper of gifs
import { Pagination } from '@mui/material/'
import {Box, Stack, Typography} from "@mui/material"
import { useEffect, useState } from "react"
import { exerciseOptions, fetchData } from "../utils/fetchData"
import ExerciseCard from './ExerciseCard'
import Loader from './Loader'

export default function Exercises({exercises, setExercises, bodyPart}){

    const [currentPage, setCurrentPage] = useState(1);
    const [exercisesPerPage] = useState(6);

    const [isLoading, setIsLoading] = useState(true);
    const [showNoExercisesMessage, setShowNoExercisesMessage] = useState(false);

    const paginate = (event, value) => {
        setCurrentPage(value);

        window.scrollTo({ top: 1800, behavior: 'smooth' });
        
    };

       // Pagination
       const indexOfLastExercise = currentPage * exercisesPerPage;
       const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
       const currentExercises = exercises.slice(indexOfFirstExercise, indexOfLastExercise); //slice array of objects
       
       

    useEffect(() => {
        const fetchExercisesData = async () => {
          let exercisesData = [];
    
          if (bodyPart === 'all') { //if we click on all, fetch data and display all exercises
            exercisesData = await fetchData('https://exercisedb.p.rapidapi.com/exercises?limit=100', exerciseOptions); 
          } else { //if we click on each exercise, we display info about that individual exercise in the gifs, fetch data and display all exercises
            exercisesData = await fetchData(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}?limit=100`, exerciseOptions);
          }
    
          setExercises(exercisesData);
        };
    
        fetchExercisesData();
      }, [bodyPart]); //called every time the bodypart changes

      
    
      if (!currentExercises.length) return <Loader/>;
    return(
       <Box id ="exercises"
            sx={
                {
                    mt:{lg:'110px'}
                }
            }
            mt='50px'
            p='20px'

       
       >

            <Typography 
                variant='h4'
                mb="46px"
            >
                Showing results
            </Typography>
            <Stack
                direction='row'
                sx={
                    {
                        gap: {lg: '110px', xs:'50px'}
                    }
                }
                flexWrap='wrap'
                justifyContent='center'
            >
                
                {currentExercises.map((exercise,index) =>(
                        <ExerciseCard key={index} exercise={exercise}/>
                        
                    )
                )}

            </Stack>

            <Stack
                sx={
                        { 
                            mt: { lg: '114px', xs: '70px' } 
                        }
                   }
                   alignItems="center"
            >       
                {exercises.length > 9 && (
                    <Pagination
                        color="standard"
                        shape="rounded"
                        defaultPage={1}
                        count={Math.ceil(exercises.length / exercisesPerPage)}
                        page={currentPage}
                        onChange={paginate}
                        size="large"
                        
                    />
                )}
                    
            </Stack>
       </Box>
    )
    
}