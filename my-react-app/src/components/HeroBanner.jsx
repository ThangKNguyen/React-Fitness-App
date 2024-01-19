import {Box, Stack, Typography, Button} from "@mui/material";
import HeroBannerImage from "../assets/images/davidlaid.jpg"

export default function HeroBanner(){
    return(
       <Box 
        sx={
            {
                mt: {lg: "212px", xs: "70px"},
                ml: { sm: "50px"}
            }
        } 
        position="relative"
        p="20px"
       >
            <Typography 
                color = "#FF2625"
                fontWeight="600"
                fontSize="26px"
            >
                Fitness Club
            </Typography>

            <Typography
                fontWeight={700}
                sx={
                    {
                        fontSize:{lg: "44px",xs:"24px"}
                    }
                }
                mb="25px"
                mt="30px"
            >
                No Pain <br/> No Gain
            </Typography>

            <Typography
                fontSize="22px"
                lineHeight="35px"
                mb ={4}
            >
                Browse through the most optimal exercises below
            </Typography>
            <Button
                variant="contained"
                color="error"
                href="#exercises"
                sx={
                    {
                        backgroundColor:'#ff2625',
                        padding: "10px"
                    }
                }
            >
                Explore Exercises
            </Button>
            <Typography
                fontWeight={600}
                color="#ff2625"
                sx={
                    {
                        opacity:0.1,
                        display: {lg:'block',xs:'none'}
                    }
                }
                fontSize="200px"
            >
                Exercise
            </Typography>
            <img src={HeroBannerImage} alt="Banner Image" className="hero-banner-img"/>
       </Box>
    )
    
}