import { Typography, Stack, Button } from '@mui/material';
import BodyPartImage from '../assets/icons/body-part.png';
import TargetImage from '../assets/icons/target.png';
import EquipmentImage from '../assets/icons/equipment.png';

export default function Detail({exerciseDetail}){
    //exercise detail is an object, we destruct it, check the api
    const { bodyPart, gifUrl, name, target, equipment } = exerciseDetail; //destruct it for easier use

    return(
        <Stack
            gap="60px"
                sx={
                    {
                    flexDirection: {lg: 'row'}, p: '20px', alignItems:'center'   
                    }
                }

        >   
            <img src={gifUrl} alt={name} loading='lazy' className='detail-image'/>
        </Stack>
    )
}