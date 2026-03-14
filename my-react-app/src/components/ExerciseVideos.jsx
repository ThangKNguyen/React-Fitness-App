import { useState } from 'react';
import { Typography, Box, Stack, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { PlayCircle, OpenInNew } from '@mui/icons-material';
import { motion } from 'framer-motion';

const formatViews = (raw) => {
  if (!raw) return null;
  const str = String(raw).replace(/[^0-9]/g, '');
  const n = parseInt(str, 10);
  if (isNaN(n)) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K views`;
  return `${n} views`;
};

export default function ExerciseVideos({ exerciseVideos, name }) {
  const theme = useTheme();
  const [playingId, setPlayingId] = useState(null);

  return (
    <Box sx={{ marginTop: { lg: '100px', xs: '40px' } }} p="20px" mt="60px">
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      >
        <Stack direction="row" alignItems="center" gap="12px" mb="40px">
          <Box
            sx={{
              width: '4px',
              height: '36px',
              background: 'linear-gradient(180deg, #FF2625, #FF6B35)',
              borderRadius: '4px',
            }}
          />
          <Typography
            sx={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: { lg: '40px', xs: '28px' },
              letterSpacing: '0.03em',
              color: 'text.primary',
            }}
          >
            Watch{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textTransform: 'capitalize',
              }}
            >
              {name}
            </Box>{' '}
            in action
          </Typography>
        </Stack>
      </motion.div>

      {/* 2×2 grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { lg: 'repeat(2, 1fr)', xs: '1fr' },
          gap: { lg: '28px', xs: '20px' },
        }}
      >
        {exerciseVideos?.slice(0, 4)?.map((item, index) => {
          const videoId = item.video.videoId;
          const isPlaying = playingId === videoId;
          const views = formatViews(
            item.video.viewCount ?? item.video.viewCountText ?? item.video.stats?.views
          );

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: index * 0.08 }}
            >
              <Box
                sx={{
                  borderRadius: '14px',
                  overflow: 'hidden',
                  backgroundColor: 'background.paper',
                  boxShadow:
                    theme.palette.mode === 'dark'
                      ? '0 2px 16px rgba(0,0,0,0.4)'
                      : '0 2px 16px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow:
                      theme.palette.mode === 'dark'
                        ? '0 20px 50px rgba(0,0,0,0.5)'
                        : '0 20px 50px rgba(0,0,0,0.15)',
                  },
                }}
              >
                {/* Video area: iframe when playing, thumbnail when not */}
                {isPlaying ? (
                  <Box sx={{ position: 'relative', lineHeight: 0 }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                      title={item.video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        width: '100%',
                        aspectRatio: '16/9',
                        display: 'block',
                        border: 'none',
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    onClick={() => setPlayingId(videoId)}
                    sx={{ position: 'relative', lineHeight: 0, cursor: 'pointer' }}
                  >
                    <img
                      src={item.video.thumbnails[0].url}
                      alt={item.video.title}
                      style={{
                        width: '100%',
                        aspectRatio: '16/9',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    {/* Play overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.2)',
                        transition: 'background 0.25s ease',
                        '&:hover': { background: 'rgba(0,0,0,0.45)' },
                        '&:hover .play-icon': { transform: 'scale(1.14)' },
                      }}
                    >
                      <PlayCircle
                        className="play-icon"
                        sx={{
                          fontSize: '64px',
                          color: '#fff',
                          transition: 'transform 0.25s ease',
                          filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.5))',
                        }}
                      />
                    </Box>
                  </Box>
                )}

                {/* Info row */}
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  justifyContent="space-between"
                  px="16px"
                  py="14px"
                  gap="8px"
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: { lg: '15px', xs: '14px' },
                        fontWeight: 700,
                        color: 'text.primary',
                        fontFamily: '"DM Sans", sans-serif',
                        lineHeight: 1.4,
                        mb: '5px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {item.video.title}
                    </Typography>

                    <Stack direction="row" alignItems="center" gap="10px" flexWrap="wrap">
                      <Typography
                        sx={{
                          fontSize: '12px',
                          color: 'primary.main',
                          fontFamily: '"DM Sans", sans-serif',
                          fontWeight: 600,
                        }}
                      >
                        {item.video.channelName}
                      </Typography>

                      {views && (
                        <Typography
                          sx={{
                            fontSize: '12px',
                            color: 'text.secondary',
                            fontFamily: '"DM Sans", sans-serif',
                          }}
                        >
                          · {views}
                        </Typography>
                      )}
                    </Stack>
                  </Box>

                  {/* External YouTube link */}
                  <IconButton
                    component="a"
                    href={`https://www.youtube.com/watch?v=${videoId}`}
                    target="_blank"
                    rel="noreferrer"
                    size="small"
                    title="Open on YouTube"
                    sx={{
                      color: 'text.secondary',
                      flexShrink: 0,
                      mt: '2px',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    <OpenInNew sx={{ fontSize: '16px' }} />
                  </IconButton>
                </Stack>
              </Box>
            </motion.div>
          );
        })}
      </Box>
    </Box>
  );
}
