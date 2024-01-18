// to display each box of body part on horizontal scroll bar
import {Stack, Typography} from '@mui/material'
import Icon from '../assets/icons/gym.png'

export default function BodyPart({item, bodyPart, setBodyPart}){
    return(
        <Stack
            type="button"
            alignItems="center"
            justifyContent="center"
            className='bodyPart-card'
            sx={
                {
                    borderTop: bodyPart === item ? '4px solid #FF2625': '', //item is the item that we're clicking on or the first item
                    background: '#fff', 
                    borderBottomLeftRadius: '20px', 
                    width: '270px', 
                    height: '282px', 
                    cursor: 'pointer', 
                    gap: '47px'

                }
            }

            onClick={()=>{
                setBodyPart(item) // the body part is now the selected item with selected styling
                window.scrollTo({top: 1800, left: 100, behavior:'smooth'})
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