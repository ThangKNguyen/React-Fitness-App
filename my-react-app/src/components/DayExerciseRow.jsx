import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Stack, Typography, Chip, IconButton, Tooltip, TextField, Button,
} from '@mui/material';
import { Delete, Edit, Close, FitnessCenter, OpenInNew } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

export default function DayExerciseRow({ exercise, index, onUpdate, onRemove }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    sets: exercise.sets,
    reps: exercise.reps,
    rpe: exercise.rpe ?? '',
  });

  const detail = exercise.exerciseDetail;
  const name = detail?.name ?? 'Unknown Exercise';
  const bodyPart = detail?.bodyPart;
  const gifUrl = detail?.gifUrl;

  const handleSave = () => {
    onUpdate(exercise.id, {
      sets: Number(form.sets) || exercise.sets,
      reps: Number(form.reps) || exercise.reps,
      rpe: form.rpe ? Number(form.rpe) : null,
    });
    setEditing(false);
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      fontFamily: '"DM Sans", sans-serif',
      fontSize: '13px',
    },
    '& .MuiInputLabel-root': { fontSize: '12px' },
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16, height: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
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
          mb: '8px',
        }}
      >
        {/* Position number */}
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
            {index + 1}
          </Typography>
        </Box>

        {/* Thumbnail */}
        {gifUrl ? (
          <Box sx={{ width: '44px', height: '44px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
            <img src={gifUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
        ) : (
          <Box
            sx={{
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,38,37,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FitnessCenter sx={{ fontSize: '18px', color: 'primary.main', opacity: 0.3 }} />
          </Box>
        )}

        {/* Info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: '13px',
              textTransform: 'capitalize',
              color: 'text.primary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {name}
          </Typography>
          <Stack direction="row" gap="6px" mt="3px" alignItems="center" flexWrap="wrap">
            {bodyPart && (
              <Chip
                label={bodyPart}
                size="small"
                sx={{
                  height: '18px',
                  fontSize: '10px',
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 700,
                  textTransform: 'capitalize',
                  backgroundColor: 'rgba(255,38,37,0.1)',
                  color: 'primary.main',
                  '& .MuiChip-label': { px: '6px' },
                }}
              />
            )}
            {!editing && (
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', fontWeight: 600, color: 'text.secondary' }}>
                {exercise.sets}×{exercise.reps}
                {exercise.rpe != null && ` @ RPE ${exercise.rpe}`}
              </Typography>
            )}
          </Stack>
        </Box>

        {/* Actions */}
        {!editing && (
          <Stack direction="row" gap="2px" flexShrink={0}>
            <Tooltip title="View exercise">
              <IconButton size="small" onClick={() => navigate(`/exercise/${exercise.exerciseId}`)} sx={{ color: 'text.secondary', width: '28px', height: '28px', '&:hover': { color: 'primary.main' } }}>
                <OpenInNew sx={{ fontSize: '15px' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => setEditing(true)} sx={{ color: 'text.secondary', width: '28px', height: '28px', '&:hover': { color: 'primary.main' } }}>
                <Edit sx={{ fontSize: '15px' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remove">
              <IconButton size="small" onClick={() => onRemove(exercise.id)} sx={{ color: 'text.secondary', width: '28px', height: '28px', '&:hover': { color: 'error.main' } }}>
                <Delete sx={{ fontSize: '15px' }} />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Box>

      {/* Edit form */}
      {editing && (
        <Box sx={{ px: '12px', pb: '8px' }}>
          <Stack direction="row" gap="8px" alignItems="flex-end">
            <TextField label="Sets" type="number" value={form.sets} onChange={(e) => setForm((p) => ({ ...p, sets: e.target.value }))} size="small" sx={{ width: '70px', ...inputSx }} inputProps={{ min: 1 }} />
            <TextField label="Reps" type="number" value={form.reps} onChange={(e) => setForm((p) => ({ ...p, reps: e.target.value }))} size="small" sx={{ width: '70px', ...inputSx }} inputProps={{ min: 1 }} />
            <TextField label="RPE" type="number" value={form.rpe} onChange={(e) => setForm((p) => ({ ...p, rpe: e.target.value }))} size="small" sx={{ width: '70px', ...inputSx }} placeholder="—" inputProps={{ min: 1, max: 10, step: 0.5 }} />
            <Button variant="contained" size="small" onClick={handleSave} sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '12px', minWidth: '50px', borderRadius: '8px', py: '6px' }}>
              Save
            </Button>
            <IconButton size="small" onClick={() => setEditing(false)} sx={{ color: 'text.secondary' }}>
              <Close sx={{ fontSize: '16px' }} />
            </IconButton>
          </Stack>
        </Box>
      )}
    </motion.div>
  );
}
