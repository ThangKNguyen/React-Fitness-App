import { useContext, useRef } from 'react';
import { Box, IconButton, Stack, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BodyPart from './BodyPart';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import RightArrowIcon from '../assets/icons/right-arrow.png';
import LeftArrowIcon from '../assets/icons/left-arrow.png';
import ExerciseCard from './ExerciseCard';

// Desktop arrows (rendered inside ScrollMenu)
const LeftArrow = () => {
  const { scrollPrev } = useContext(VisibilityContext);
  return (
    <span onClick={() => scrollPrev()} className="right-arrow">
      <img src={LeftArrowIcon} alt="scroll left" />
    </span>
  );
};

const RightArrow = () => {
  const { scrollNext } = useContext(VisibilityContext);
  return (
    <span onClick={() => scrollNext()} className="left-arrow">
      <img src={RightArrowIcon} alt="scroll right" />
    </span>
  );
};

// Shared arrow button style for mobile
const MobileArrowBtn = ({ onClick, src, alt }) => {
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
          filter: 'invert(20%) sepia(100%) saturate(6000%) hue-rotate(0deg) brightness(95%) contrast(115%)',
        }}
      />
    </IconButton>
  );
};

export default function HorizontalScrollbar({ data, bodyPart, setBodyPart, isBodyParts }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const apiRef = useRef({});

  return (
    <Box sx={{ width: '100%' }}>
      {/* Mobile-only arrows row — above the carousel */}
      {isMobile && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb="12px"
          px="4px"
        >
          <MobileArrowBtn
            onClick={() => apiRef.current.scrollPrev?.()}
            src={LeftArrowIcon}
            alt="scroll left"
          />
          <MobileArrowBtn
            onClick={() => apiRef.current.scrollNext?.()}
            src={RightArrowIcon}
            alt="scroll right"
          />
        </Stack>
      )}

      <ScrollMenu
        apiRef={apiRef}
        LeftArrow={isMobile ? undefined : LeftArrow}
        RightArrow={isMobile ? undefined : RightArrow}
      >
        {data.map((item) => (
          <Box
            key={item.id || item}
            itemId={item.id || item}
            title={item.id || item}
            m="0 40px"
          >
            {isBodyParts ? (
              <BodyPart item={item} bodyPart={bodyPart} setBodyPart={setBodyPart} />
            ) : (
              <ExerciseCard exercise={item} />
            )}
          </Box>
        ))}
      </ScrollMenu>
    </Box>
  );
}
