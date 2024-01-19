import { useState } from 'react';
import { Box } from '@mui/material';
import HeroBanner from '../components/HeroBanner';
import SearchExercises from '../components/SearchExercises';
import Exercises from '../components/Exercises';


export default function Home(){
    const [bodyPart, setBodyPart] = useState('all') //state in the home because home is the parent,
                                                    //their changes will reflect across the application
                                                    //display the current bodypart being clicked on
    const [exercises, setExercises] = useState([])

    
    
    
    return(
        <Box>
            <HeroBanner/>
            <SearchExercises 
                setExercises={setExercises}
                bodyPart={bodyPart}
                setBodyPart={setBodyPart}
            />
            <Exercises
                
                exercises={exercises}
                setExercises={setExercises}
                bodyPart={bodyPart}
                
            />
            
        </Box>
    )
    
}