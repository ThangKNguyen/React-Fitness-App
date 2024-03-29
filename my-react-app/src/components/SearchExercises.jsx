import { useState, useEffect } from 'react';
import {Box, Button, Stack, TextField, Typography} from '@mui/material'
import HorizontalScrollbar from './HorizontalScrollbar';
import { exerciseOptions, fetchData } from '../utils/fetchData';

export default function SearchExercises({setExercises, bodyPart, setBodyPart}){


    const [search, setSearch] = useState("")
    
    const [bodyParts, setBodyParts] = useState([]); //body parts contain array of body parts, Strings, ex: all, back, cardio...
   

    useEffect(() => { // data from this function will be passed into the card right below search bar
        const fetchExercisesData = async () => {
          const bodyPartsData = await fetchData('https://exercisedb.p.rapidapi.com/exercises/bodyPartList', exerciseOptions);
    
          setBodyParts(['all', ...bodyPartsData]); //why all? because the first one is named 'all'
        };
    
        fetchExercisesData(); //call when the app loads
      }, []); //only displayed once at the start
    

    const handleSearch = async () =>{
        if(search){ //if search exists
            const exercisesData = await fetchData(
                'https://exercisedb.p.rapidapi.com/exercises?limit=900',
                exerciseOptions
            ); //called from fetchData ultils

            

            

            const searchedExercises = exercisesData.filter(//filter by catergory
            (item) => item.name.toLowerCase().includes(search) // search by category, check if it includes the search term we looking for
            || item.target.toLowerCase().includes(search)
                   || item.target.toLowerCase().includes(search)
                   || item.equipment.toLowerCase().includes(search)
                   || item.bodyPart.toLowerCase().includes(search),
            );

            
            
            setSearch("") //clear the search after finishing
            setExercises(searchedExercises)
          
            
        }
       
    }


    return(
       <Stack
            alignItems='center'
            mt='37px'
            justifyContent='center'
            p='20px'
       >
            <Typography
                fontWeight={700}
                sx={
                    {
                        fontSize: {lg:'44px',xs:'30px'}
                    }
                }
                mb='50px'
                textAlign='center'
            >Awesome Exercises <br/> You Should Know
            </Typography>
            <Box position='relative' mb='72px'>
                <TextField
                    height='76px'
                    value={search}
                    onChange={(e)=> setSearch(e.target.value.toLowerCase())}
                    placeholder='Search Exercises'
                    type="text"
                    sx={
                        {
                            input:{
                                fontWeight:'700',
                                border:'none',
                                borderRadius:'4px'

                            },
                            width:{
                                lg:'800px',
                                xs: '350px'
                            },
                            backgroundColor: '#fff',
                            borderRadius:'40px'
                        }
                    }

                />
                <Button className="search-btn"
                    sx={
                        {
                            bgcolor:'#FF2625',
                            color: '#FFF',
                            textTransform: 'none',
                            width: { lg:'175px', xs:'80px'},
                            fontSize: { lg:'20px', xs:'14px'},
                            height:'56px',
                            position: 'absolute',
                            right:'0',
                            ml: '5px' //needs fix
                        }
                    }
                    onClick={handleSearch}
                >
                    Search
                </Button>
            </Box>
            <Box sx={
                        {
                            position:'relative',
                            width:"100%",
                            p: "20px"
                        }
                }>
                    <HorizontalScrollbar 
                        data={bodyParts}
                        bodyPart={bodyPart}
                        setBodyPart={setBodyPart}
                        isBodyParts //to let horizontal scroll bar know where the data is from, if from search exercises, then display bodyparts
                    /> {/*props*/}
                
            </Box>
       </Stack>
    )
    
}

//stopped at 1:33:41