import { useContext } from 'react';
import {Box, Typography} from '@mui/material'
import BodyPart from './BodyPart'
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu'
import RightArrowIcon from '../assets/icons/right-arrow.png';
import LeftArrowIcon from '../assets/icons/left-arrow.png';
import ExerciseCard from './ExerciseCard';

const LeftArrow = () => {
    const { scrollPrev } = useContext(VisibilityContext);

    
    return (
      <Typography onClick={() => scrollPrev()} className="right-arrow">
        <img src={LeftArrowIcon} alt="right-arrow" />
      </Typography>
    );
  };
  
  const RightArrow = () => {
    const { scrollNext } = useContext(VisibilityContext);
  
    return (
      <Typography onClick={() => scrollNext()} className="left-arrow">
        <img src={RightArrowIcon} alt="right-arrow" />
      </Typography>
    );
  };


export default function HorizontalScrollbar({data, bodyPart, setBodyPart, isBodyParts}){ //taking the body parts data from api
  

    return(
        <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow} >
            {data.map((item) => //map it over to a box, this is for the bodypart scrollbar from homepage, data is bodyparts prop from SearchExercises

            (<Box
                key ={item.id || item} //what is item.id?
                itemId ={item.id || item} //without this line the scroll in detail doesn't display more
                title ={item.id || item}
                m="0 40px"
                
            >
                
                {isBodyParts ? <BodyPart //if sending props from search exercise, then display the home page scrollbar
                    item={item} //each item is mapped into a box and bodyPart component
                    bodyPart={bodyPart}
                    setBodyPart={setBodyPart}
                /> 
                : <ExerciseCard exercise={item}/> //exerciseCard will decide what to do with props and send it up, then it will send back to 
                                                  //similar exercise
              
                }

                
            </Box>)

            )}
                
        </ScrollMenu>
    )
}