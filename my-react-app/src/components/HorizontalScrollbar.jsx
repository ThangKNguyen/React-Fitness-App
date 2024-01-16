import { useContext } from 'react';
import {Box, Typography} from '@mui/material'
import BodyPart from './BodyPart'
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu'
import RightArrowIcon from '../assets/icons/right-arrow.png';
import LeftArrowIcon from '../assets/icons/left-arrow.png';

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


export default function HorizontalScrollbar({data, bodyPart, setBodyPart}){ //taking the body parts data from api
    return(
        <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow} >
            {data.map((item) => //map it over to a box
            (<Box
                key ={item.id || item} //what is item.id?
                itemId ={item.id || item}
                title ={item.id || item}
                m="0 40px"
            >
                <BodyPart
                    item={item} 
                    bodyPart={bodyPart}
                    setBodyPart={setBodyPart}
                />

                
            </Box>)
            )}
                
        </ScrollMenu>
    )
}