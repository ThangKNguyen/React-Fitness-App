import { useState } from 'react';
import { Box } from '@mui/material';
import HeroBanner from '../components/HeroBanner';
import SearchExercises from '../components/SearchExercises';
import Exercises from '../components/Exercises';


export default function Home(){
    return(
        <Box>
            <HeroBanner/>
            <SearchExercises/>
            <Exercises/>
            
        </Box>
    )
    
}