import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, MenuItem, Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const BODY_PART_OPTIONS = [
  'back', 'cardio', 'chest', 'lower arms', 'lower legs',
  'neck', 'shoulders', 'upper arms', 'upper legs', 'waist',
];

const TARGET_OPTIONS = [
  'abs', 'adductors', 'abductors', 'biceps', 'calves',
  'cardiovascular system', 'delts', 'forearms', 'glutes',
  'hamstrings', 'lats', 'pectorals', 'quads', 'serratus anterior',
  'spine', 'traps', 'triceps', 'upper back',
];

const EQUIPMENT_OPTIONS = [
  'assisted', 'band', 'barbell', 'body weight', 'bosu ball', 'cable',
  'dumbbell', 'ez barbell', 'kettlebell', 'leverage machine',
  'medicine ball', 'olympic barbell', 'resistance band',
  'smith machine', 'stability ball', 'weighted',
];

export default function CreateCustomExerciseDialog({ open, onClose, onCreate }) {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: '', bodyPart: '', target: '', equipment: '',
    instructions: '', description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.bodyPart || !form.target || !form.equipment) return;
    setLoading(true);
    try {
      await onCreate({
        name: form.name,
        bodyPart: form.bodyPart,
        target: form.target,
        equipment: form.equipment,
        instructions: form.instructions || null,
        description: form.description || null,
      });
      setForm({ name: '', bodyPart: '', target: '', equipment: '', instructions: '', description: '' });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      fontFamily: '"DM Sans", sans-serif',
      fontSize: '14px',
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundColor: 'background.paper',
          backgroundImage: 'none',
          border: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <DialogTitle sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '28px', letterSpacing: '0.03em', pb: '8px' }}>
        Create Custom{' '}
        <Box component="span" sx={{ background: 'linear-gradient(135deg, #FF2625, #FF6B35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Exercise
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack gap="16px" mt="8px">
          <TextField label="Exercise Name" value={form.name} onChange={handleChange('name')} required fullWidth sx={inputSx} />
          <TextField label="Body Part" value={form.bodyPart} onChange={handleChange('bodyPart')} required select fullWidth sx={inputSx}>
            {BODY_PART_OPTIONS.map((bp) => (
              <MenuItem key={bp} value={bp} sx={{ textTransform: 'capitalize', fontFamily: '"DM Sans", sans-serif' }}>
                {bp}
              </MenuItem>
            ))}
          </TextField>
          <TextField label="Target Muscle" value={form.target} onChange={handleChange('target')} required select fullWidth sx={inputSx}>
            {TARGET_OPTIONS.map((t) => (
              <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize', fontFamily: '"DM Sans", sans-serif' }}>{t}</MenuItem>
            ))}
          </TextField>
          <TextField label="Equipment" value={form.equipment} onChange={handleChange('equipment')} required select fullWidth sx={inputSx}>
            {EQUIPMENT_OPTIONS.map((eq) => (
              <MenuItem key={eq} value={eq} sx={{ textTransform: 'capitalize', fontFamily: '"DM Sans", sans-serif' }}>{eq}</MenuItem>
            ))}
          </TextField>
          <TextField label="Instructions (optional)" value={form.instructions} onChange={handleChange('instructions')} multiline rows={3} fullWidth sx={inputSx} />
          <TextField label="Description (optional)" value={form.description} onChange={handleChange('description')} multiline rows={2} fullWidth sx={inputSx} />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: '24px', pb: '20px' }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !form.name || !form.bodyPart || !form.target || !form.equipment}
          sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, px: '24px' }}
        >
          {loading ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
