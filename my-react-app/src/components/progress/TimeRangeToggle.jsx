import { Box, Stack, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const PRESETS = [
  { label: '1M',  value: 1 },
  { label: '3M',  value: 3 },
  { label: '6M',  value: 6 },
  { label: '1Y',  value: 12 },
  { label: '2Y',  value: 24 },
  { label: 'All', value: null },
];

export default function TimeRangeToggle({ range, onRangeChange, customMonths, onCustomChange }) {
  const theme = useTheme();

  const isPreset = PRESETS.some((p) => p.value === range);

  const chipSx = (active) => ({
    fontFamily: '"DM Sans", sans-serif',
    fontSize: { xs: '11px', sm: '12px' },
    fontWeight: 700,
    px: { xs: '10px', sm: '14px' },
    py: { xs: '6px', sm: '7px' },
    borderRadius: '8px',
    cursor: 'pointer',
    border: `1.5px solid ${active ? 'transparent' : theme.palette.divider}`,
    background: active ? 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)' : 'transparent',
    color: active ? '#fff' : theme.palette.text.secondary,
    transition: 'all 0.2s ease',
    userSelect: 'none',
    '&:hover': active
      ? { background: 'linear-gradient(135deg, #CC1E1D 0%, #e55d2a 100%)' }
      : { borderColor: 'rgba(255,38,37,0.4)', color: theme.palette.text.primary, backgroundColor: 'rgba(255,38,37,0.05)' },
  });

  return (
    <Stack direction="row" alignItems="center" gap={{ xs: '5px', sm: '6px' }} flexWrap="wrap" mb="16px">
      {PRESETS.map(({ label, value }) => (
        <Box key={label} onClick={() => onRangeChange(value)} sx={chipSx(range === value && isPreset)}>
          {label}
        </Box>
      ))}

      {/* Custom months input */}
      <Stack direction="row" alignItems="center" gap="6px" sx={{ ml: '4px' }}>
        <TextField
          size="small"
          type="number"
          placeholder="Custom"
          value={customMonths}
          onChange={(e) => onCustomChange(e.target.value)}
          inputProps={{ min: 1, max: 120, step: 1 }}
          sx={{
            width: '80px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              height: '34px',
            },
            '& .MuiOutlinedInput-input': {
              px: '10px',
              py: '6px',
            },
          }}
        />
        <Box
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '11px',
            color: 'text.secondary',
          }}
        >
          months
        </Box>
      </Stack>
    </Stack>
  );
}
