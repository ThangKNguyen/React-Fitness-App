import { useEffect, useState } from "react"
import { useParams } from 'react-router-dom';
//used to determine id of exercises we currently on so we fetch data about that 
import { Box } from "@mui/material"
import { exerciseOptions, fetchData, youtubeOptions } from "../utils/fetchData"
import Detail from '../components/Detail';
import ExerciseVideos from '../components/ExerciseVideos';
import SimilarExercises from '../components/SimilarExercises'

export default function ExerciseDetail(){

    const [exerciseDetail, setExerciseDetail] = useState({})
    const [exerciseVideos, setExerciseVideos] = useState([]);
    const {id } = useParams()

    const [targetMuscleExercises, setTargetMuscleExercises] = useState([]);
    const [equipmentExercises, setEquipmentExercises] = useState([]);

    // useEffect(()=>{

    //   const fetchExercisesData = async () => {

    //     const exerciseDbUrl = 'https://exercisedb.p.rapidapi.com';
    //     const youtubeSearchUrl = 'https://youtube-search-and-download.p.rapidapi.com';

    //     const exerciseDetailData = await fetchData(`${exerciseDbUrl}/exercises/exercise/${id}`, exerciseOptions); //info about uniqe id, check api Id endpoints for url format
    //     console.log(exerciseDetailData)
    //     console.log("hi")
    //     setExerciseDetail(exerciseDetailData);
      
    //     }
    //     fetchExercisesData();

    // }, [id]) // function should be called every time id changes
    
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  
      const fetchExercisesData = async () => {
        const exerciseDbUrl = 'https://exercisedb.p.rapidapi.com'; 
        const youtubeSearchUrl = 'https://youtube-search-and-download.p.rapidapi.com';
  
        const exerciseDetailData = await fetchData(`${exerciseDbUrl}/exercises/exercise/${id}`, exerciseOptions);
        setExerciseDetail(exerciseDetailData);

        const exerciseVideosData = await fetchData(`${youtubeSearchUrl}/search?query=${exerciseDetailData.name} exercise`, youtubeOptions)
        setExerciseVideos(exerciseVideosData.contents) //fetch search video from youtube api

        const targetMuscleExercisesData = await fetchData(`${exerciseDbUrl}/exercises/target/${exerciseDetailData.target}`, exerciseOptions);
        setTargetMuscleExercises(targetMuscleExercisesData); //fetch the target muscles from api

        const equimentExercisesData = await fetchData(`${exerciseDbUrl}/exercises/equipment/${exerciseDetailData.equipment}`, exerciseOptions);
        setEquipmentExercises(equimentExercisesData); //fetch target equipment
      };
  
      fetchExercisesData();
    }, [id]);

    return(
       <Box>

            <Detail exerciseDetail={exerciseDetail} />
            <ExerciseVideos exerciseVideos={exerciseVideos} name={exerciseDetail.name}/>
            <SimilarExercises targetMuscleExercises={targetMuscleExercises} equipmentExercises={equipmentExercises}/>

       </Box>
    )
    

}