// to display each box of body part on horizontal scroll bar
import {Stack, Typography} from '@mui/material'
import Icon from '../assets/icons/gym.png'
export default function BodyPart({item, setBodyPart, bodyPart}){
    return(
        <Stack
            type="button"
            alignItems="center"
            justifyContent="center"
            className='bodyPart-card'
            sx={
                {
                    borderTop: bodyPart === item ? '4px solid #FF2625': '',
                    background: '#fff', 
                    borderBottomLeftRadius: '20px', 
                    width: '270px', 
                    height: '282px', 
                    cursor: 'pointer', 
                    gap: '47px'

                }
            }
        >
            <img src ={Icon}
                alt='dumbbell'
                style={
                    {
                        width:"40px",
                        height:"40px"
                    }
                }
            />
            <Typography fontSize="24px" fontWeight="bold" textTransform="capitalize">{item}</Typography>
        </Stack>
    )
}