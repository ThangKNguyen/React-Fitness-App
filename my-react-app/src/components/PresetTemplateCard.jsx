import { Box, Stack, Typography, Button, Chip, CircularProgress } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

export default function PresetTemplateCard({ preset, onPreview, onAdd, importing }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: '14px',
        border: `1px solid ${theme.palette.divider}`,
        p: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        transition: 'all 0.25s ease',
        '&:hover': {
          borderColor: 'rgba(255,38,37,0.3)',
          transform: 'translateY(-3px)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 12px 40px rgba(0,0,0,0.4)'
            : '0 12px 40px rgba(0,0,0,0.1)',
        },
      }}
    >
      {/* PRESET badge */}
      <Box sx={{ position: 'absolute', top: '16px', right: '16px' }}>
        <Chip
          label="PRESET"
          size="small"
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 700,
            fontSize: '10px',
            letterSpacing: '0.06em',
            height: '20px',
            background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
            color: '#fff',
            '& .MuiChip-label': { px: '8px' },
          }}
        />
      </Box>

      {/* Name */}
      <Typography
        sx={{
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: '22px',
          letterSpacing: '0.03em',
          color: 'text.primary',
          lineHeight: 1.1,
          pr: '60px',
        }}
      >
        {preset.name}
      </Typography>

      {/* Description */}
      <Typography
        sx={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '13px',
          color: 'text.secondary',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}
      >
        {preset.description}
      </Typography>

      {/* Day count */}
      <Stack direction="row" alignItems="center" gap="6px">
        <CalendarMonth sx={{ fontSize: '15px', color: 'primary.main' }} />
        <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', fontWeight: 600, color: 'text.secondary' }}>
          {preset.days.length} {preset.days.length === 1 ? 'day' : 'days'}/week
        </Typography>
      </Stack>

      {/* Actions */}
      <Stack direction="row" gap="8px" mt="4px">
        <Button
          variant="outlined"
          size="small"
          onClick={onPreview}
          disabled={importing}
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 600,
            fontSize: '12px',
            flex: 1,
            borderColor: theme.palette.divider,
            color: 'text.secondary',
            '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
          }}
        >
          Preview
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={onAdd}
          disabled={importing}
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 700,
            fontSize: '12px',
            flex: 1,
            background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
            '&:hover': { background: 'linear-gradient(135deg, #e01f1e 0%, #e85e2d 100%)' },
            '&:disabled': { background: 'rgba(255,38,37,0.3)' },
            minWidth: 0,
          }}
        >
          {importing ? (
            <CircularProgress size={14} sx={{ color: '#fff' }} />
          ) : (
            'Add to My Plans'
          )}
        </Button>
      </Stack>
    </Box>
  );
}
