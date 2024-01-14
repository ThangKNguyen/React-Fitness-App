import { useState, useEffect } from 'react';
import {Box, Button, Stack, TextField, Typography} from '@mui/material'

export default function SearchExercises(){
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
                    value=""
                    onChange={(e)=> {}}
                    placeholder='Search Exercises'
                    type="text"
                    sx={
                        {
                            input:{
                                fontWeight:'700',
                                border:'none',
                                borderRadius:'4px'

                            }
                        }
                    }

                />
            </Box>
       </Stack>
    )
    
}

//stopped at 40:38