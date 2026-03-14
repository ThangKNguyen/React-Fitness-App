import { Link } from 'react-router-dom';
import {
  Drawer, Box, Stack, Typography, IconButton, Chip, Divider, Button, Tooltip,
} from '@mui/material';
import { Close, Delete, FitnessCenter, DeleteSweep } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkout } from '../utils/useWorkout';

export default function WorkoutDrawer({ open, onClose }) {
  const theme = useTheme();
  const { workout, removeFromWorkout, clearWorkout } = useWorkout();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: '420px' },
          backgroundColor: 'background.default',
          backgroundImage: 'none',
          borderLeft: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: '24px',
          py: '20px',
          borderBottom: `1px solid ${theme.palette.divider}`,
          flexShrink: 0,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" gap="10px">
            <Box
              sx={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FitnessCenter sx={{ fontSize: '18px', color: '#fff' }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Bebas Neue", sans-serif',
                  fontSize: '22px',
                  letterSpacing: '0.05em',
                  color: 'text.primary',
                  lineHeight: 1,
                }}
              >
                My Workout
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '12px',
                  color: 'text.secondary',
                  mt: '2px',
                }}
              >
                {workout.length === 0
                  ? 'No exercises added yet'
                  : `${workout.length} exercise${workout.length !== 1 ? 's' : ''}`}
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
            <Close sx={{ fontSize: '20px' }} />
          </IconButton>
        </Stack>
      </Box>

      {/* Exercise list */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: '16px', py: '12px' }}>
        <AnimatePresence initial={false}>
          {workout.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{ minHeight: '300px', gap: '16px' }}
              >
                <Box
                  sx={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '20px',
                    background:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,38,37,0.08)'
                        : 'rgba(255,38,37,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px dashed rgba(255,38,37,0.25)',
                  }}
                >
                  <FitnessCenter sx={{ fontSize: '32px', color: 'primary.main', opacity: 0.5 }} />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 700,
                      fontSize: '16px',
                      color: 'text.primary',
                      mb: '6px',
                    }}
                  >
                    No exercises yet
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: '13px',
                      color: 'text.secondary',
                      maxWidth: '220px',
                    }}
                  >
                    Hit the dumbbell icon on any exercise card to build your routine.
                  </Typography>
                </Box>
              </Stack>
            </motion.div>
          ) : (
            workout.map((exercise, i) => (
              <motion.div
                key={exercise.id}
                layout
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1], delay: i * 0.03 }}
                style={{ marginBottom: '8px' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: 'background.paper',
                    borderRadius: '12px',
                    p: '10px 12px',
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'border-color 0.2s ease',
                    '&:hover': { borderColor: 'rgba(255,38,37,0.3)' },
                  }}
                >
                  {/* Number */}
                  <Box
                    sx={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: 'linear-gradient(135deg, #FF2625, #FF6B35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '11px',
                        fontWeight: 800,
                        color: '#fff',
                        lineHeight: 1,
                      }}
                    >
                      {i + 1}
                    </Typography>
                  </Box>

                  {/* GIF thumbnail */}
                  <Box
                    component={Link}
                    to={`/exercise/${exercise.id}`}
                    onClick={onClose}
                    sx={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      display: 'block',
                    }}
                  >
                    <img
                      src={exercise.gifUrl}
                      alt={exercise.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>

                  {/* Name + chips */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      component={Link}
                      to={`/exercise/${exercise.id}`}
                      onClick={onClose}
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontWeight: 700,
                        fontSize: '13px',
                        textTransform: 'capitalize',
                        color: 'text.primary',
                        textDecoration: 'none',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      {exercise.name}
                    </Typography>
                    <Stack direction="row" gap="4px" mt="4px" flexWrap="wrap">
                      <Chip
                        label={exercise.bodyPart}
                        size="small"
                        sx={{
                          height: '18px',
                          fontSize: '10px',
                          fontFamily: '"DM Sans", sans-serif',
                          fontWeight: 700,
                          textTransform: 'capitalize',
                          backgroundColor:
                            theme.palette.mode === 'dark'
                              ? 'rgba(255,38,37,0.15)'
                              : 'rgba(255,38,37,0.10)',
                          color: 'primary.main',
                          '& .MuiChip-label': { px: '6px' },
                        }}
                      />
                    </Stack>
                  </Box>

                  {/* Remove button */}
                  <Tooltip title="Remove">
                    <IconButton
                      size="small"
                      onClick={() => removeFromWorkout(exercise.id)}
                      sx={{
                        color: 'text.secondary',
                        width: '28px',
                        height: '28px',
                        flexShrink: 0,
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      <Delete sx={{ fontSize: '16px' }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </Box>

      {/* Footer */}
      {workout.length > 0 && (
        <Box
          sx={{
            px: '16px',
            py: '16px',
            borderTop: `1px solid ${theme.palette.divider}`,
            flexShrink: 0,
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            startIcon={<DeleteSweep />}
            onClick={clearWorkout}
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              borderColor: theme.palette.divider,
              color: 'text.secondary',
              borderRadius: '10px',
              py: '10px',
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main',
                backgroundColor: 'rgba(255,38,37,0.06)',
              },
            }}
          >
            Clear Workout
          </Button>
        </Box>
      )}
    </Drawer>
  );
}
