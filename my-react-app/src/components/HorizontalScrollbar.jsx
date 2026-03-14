import { useRef } from 'react';
import { Box, IconButton, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BodyPart from './BodyPart';
import ExerciseCard from './ExerciseCard';
import RightArrowIcon from '../assets/icons/right-arrow.png';
import LeftArrowIcon from '../assets/icons/left-arrow.png';

const ArrowBtn = ({ onClick, src, alt }) => {
  const theme = useTheme();
  return (
    <IconButton
      onClick={onClick}
      size="small"
      sx={{
        border: `1.5px solid ${theme.palette.divider}`,
        borderRadius: '8px',
        width: '36px',
        height: '36px',
        p: '6px',
        flexShrink: 0,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'rgba(255,38,37,0.08)',
        },
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '16px',
          height: '16px',
          filter:
            'invert(20%) sepia(100%) saturate(6000%) hue-rotate(0deg) brightness(95%) contrast(115%)',
        }}
      />
    </IconButton>
  );
};

export default function HorizontalScrollbar({ data, bodyPart, setBodyPart, isBodyParts }) {
  const scrollRef = useRef(null);
  const SCROLL_AMOUNT = 320;

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Arrow row */}
      <Stack direction="row" justifyContent="space-between" mb="12px" px="4px">
        <ArrowBtn onClick={scrollLeft} src={LeftArrowIcon} alt="scroll left" />
        <ArrowBtn onClick={scrollRight} src={RightArrowIcon} alt="scroll right" />
      </Stack>

      {/* Scrollable container */}
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'auto',
          gap: { lg: '24px', xs: '16px' },
          pb: '8px',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {data.map((item) => (
          <Box key={item.id || item} sx={{ flexShrink: 0 }}>
            {isBodyParts ? (
              <BodyPart item={item} bodyPart={bodyPart} setBodyPart={setBodyPart} />
            ) : (
              <ExerciseCard exercise={item} />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
