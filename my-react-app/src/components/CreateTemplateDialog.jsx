import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, MenuItem, Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function CreateTemplateDialog({ open, onClose, onCreate }) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const result = await onCreate(name.trim(), days);
      setName('');
      setDays(3);
      onClose(result);
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
      onClose={() => onClose(null)}
      maxWidth="xs"
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
        New{' '}
        <Box component="span" sx={{ background: 'linear-gradient(135deg, #FF2625, #FF6B35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Plan
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack gap="16px" mt="8px">
          <TextField
            label="Plan Name"
            placeholder="e.g. Push/Pull/Legs"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            sx={inputSx}
          />
          <TextField
            label="Days Per Week"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            select
            fullWidth
            sx={inputSx}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <MenuItem key={n} value={n} sx={{ fontFamily: '"DM Sans", sans-serif' }}>
                {n} {n === 1 ? 'day' : 'days'}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: '24px', pb: '20px' }}>
        <Button onClick={() => onClose(null)} sx={{ color: 'text.secondary', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !name.trim()}
          sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, px: '24px' }}
        >
          {loading ? 'Creating...' : 'Create Plan'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
