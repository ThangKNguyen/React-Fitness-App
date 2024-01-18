//exercises component below the scroll bar, with the gifs, this is wrapper of gifs
import { Pagination } from '@mui/material/'
import {Box, Stack, Typography} from "@mui/material"
import { useEffect, useState } from "react"
import { exerciseOptions, fetchData } from "../utils/fetchData"
import ExerciseCard from './ExerciseCard'

export default function Exercises({exercises, setExercises, bodyPart}){

    

    useEffect(() => {
        const fetchExercisesData = async () => {
          let exercisesData = [];
    
          if (bodyPart === 'all') { //if we click on all, fetch data and display all exercises
            exercisesData = await fetchData('https://exercisedb.p.rapidapi.com/exercises', exerciseOptions); 
          } else { //if we click on each exercise, we display info about that individual exercise in the gifs, fetch data and display all exercises
            exercisesData = await fetchData(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`, exerciseOptions);
          }
    
          setExercises(exercisesData);
        };
    
        fetchExercisesData();
      }, [bodyPart]); //called every time the bodypart changes
    

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
                
                {exercises.map((exercise,index) =>(
                        <ExerciseCard key={index} exercise={exercise}/>
                        
                    )
                )}

            </Stack>

            
       </Box>
    )
    
}