import { Box, Stack, Typography } from '@mui/material';
import Logo from '../assets/images/trident.png';

export default function Footer(){
    return(
        <Box mt="80px" >
            <Stack gap="40px" sx={{ alignItems: 'center' }} flexWrap="wrap" px="40px" pt="24px">
            <img src={Logo} alt="logo" style={{height: '100px' }} />
            </Stack>
            <Typography variant="h5" sx={{ fontSize: { lg: '28px', xs: '20px' } }} mt="41px" textAlign="center" pb="40px">We're all going to make it brahs!</Typography>
      </Box>
    )
}