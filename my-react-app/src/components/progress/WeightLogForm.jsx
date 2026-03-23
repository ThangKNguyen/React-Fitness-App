import { useState } from 'react';
import { Box, Stack, TextField, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function WeightLogForm({ onAdd, unit = 'lbs', convert = (v) => v }) {
  const today = new Date().toISOString().slice(0, 10);
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(today);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const w = parseFloat(weight);
    if (!w || !date) return;
    // Convert kg input to lbs for storage
    const lbs = unit === 'kg' ? +(w / 0.453592).toFixed(1) : w;
    if (lbs < 50 || lbs > 1000) return;
    try {
      await onAdd(lbs, date);
      setWeight('');
      setDate(today);
    } catch { /* ignore */ }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: '40px' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap="12px" alignItems={{ sm: 'center' }}>
          <TextField
            label={`Weight (${unit})`}
            type="number"
            size="small"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            inputProps={{ min: unit === 'kg' ? 23 : 50, max: unit === 'kg' ? 454 : 1000, step: 0.1 }}
            sx={{
              flex: { sm: '0 0 160px' },
              '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: '"DM Sans", sans-serif', fontSize: '14px' },
              '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif', fontSize: '14px' },
            }}
          />
          <TextField
            label="Date"
            type="date"
            size="small"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              flex: { sm: '0 0 170px' },
              '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: '"DM Sans", sans-serif', fontSize: '14px' },
              '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif', fontSize: '14px' },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={<Add />}
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              px: '24px',
              py: '9px',
              borderRadius: '10px',
              whiteSpace: 'nowrap',
              alignSelf: { xs: 'flex-start', sm: 'center' },
            }}
          >
            Log Weight
          </Button>
        </Stack>
      </Box>
    </motion.div>
  );
}
