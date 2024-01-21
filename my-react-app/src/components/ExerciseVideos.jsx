import { Typography, Box, Stack } from '@mui/material';

export default function ExerciseVideos({exerciseVideos,name}){
    
    return(
        <Box
            sx={
                {
                    marginTop: {lg:'200ox', sx:'20px'}
                }
            }
            p='20px'
            mt='75px'
            textAlign='center'
            
        >
            <Typography justifyContent='center' variant='h4' mb='33px'> Here are some videos about  
                <span style={{ color: '#FF2625', textTransform: 'capitalize' }}> {name}!</span> 
            </Typography>

            <Stack sx={{ flexDirection: { lg: 'row' }, gap: { lg: '110px', xs: '0px' } }} 
                   justifyContent="flex-start" 
                   flexWrap="wrap" 
                   alignItems="center"
            >
                {exerciseVideos?.slice(0, 3)?.map((item, index) => (
                        <a
                            key={index}
                            className="exercise-video"
                            href={`https://www.youtube.com/watch?v=${item.video.videoId}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img style={{ borderTopLeftRadius: '20px' }} src={item.video.thumbnails[0].url} alt={item.video.title} />
                            <Box>
                            <Typography sx={{ fontSize: { lg: '28px', xs: '18px' } }} fontWeight={600} color="#000">
                                {item.video.title}
                                
                            </Typography>
                            <Typography fontSize="14px" color="#000">
                                {item.video.channelName}
                            </Typography>
                            </Box>
                        </a>
                        
                       
                ))}
                        
            </Stack>
        </Box>
    )
}