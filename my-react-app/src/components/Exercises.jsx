//exercises component below the scroll bar
import { Pagination } from '@mui/material/'
import {Box, Stack, Typography} from "@mui/material"
import { useEffect, useState } from "react"
import { exerciseOptions, fetchData } from "../utils/fetchData"
import ExerciseCard from './ExerciseCard'

export default function Exercises({exercises, setExercises, bodyPart}){
    console.log(exercises)

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