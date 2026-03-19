import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Stack, Typography, Button, Chip, Tabs, Tab, IconButton, CircularProgress,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

export default function PresetPreviewDialog({ preset, open, onClose, onAdd, importing }) {
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  if (!preset) return null;

  const day = preset.days[tab];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundColor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ pb: 0 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap="12px">
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" gap="10px" mb="6px">
              <Typography
                sx={{
                  fontFamily: '"Bebas Neue", sans-serif',
                  fontSize: { xs: '28px', sm: '36px' },
                  letterSpacing: '0.03em',
                  color: 'text.primary',
                  lineHeight: 1,
                }}
              >
                {preset.name}
              </Typography>
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
            </Stack>
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '14px',
                color: 'text.secondary',
                lineHeight: 1.5,
              }}
            >
              {preset.description}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary', mt: '-4px' }}>
            <Close sx={{ fontSize: '20px' }} />
          </IconButton>
        </Stack>
      </DialogTitle>

      {/* Day tabs */}
      <Box sx={{ px: '24px', pt: '16px' }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            '& .MuiTab-root': {
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              textTransform: 'none',
              minHeight: '40px',
              py: '8px',
            },
            '& .Mui-selected': { color: 'primary.main' },
            '& .MuiTabs-indicator': { backgroundColor: 'primary.main' },
          }}
        >
          {preset.days.map((d, i) => (
            <Tab key={i} label={d.label} />
          ))}
        </Tabs>
      </Box>

      {/* Exercise list */}
      <DialogContent sx={{ pt: '20px' }}>
        <Stack gap="8px">
          {day.exercises.map((ex, i) => (
            <Stack
              key={i}
              direction="row"
              alignItems="center"
              gap="12px"
              sx={{
                p: '12px 16px',
                borderRadius: '10px',
                backgroundColor: theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(0,0,0,0.02)',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              {/* Position badge */}
              <Box
                sx={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '12px', color: '#fff' }}>
                  {i + 1}
                </Typography>
              </Box>

              {/* Exercise name */}
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: 'text.primary',
                  flex: 1,
                }}
              >
                {ex.name}
              </Typography>

              {/* Sets × Reps chip */}
              <Chip
                label={`${ex.sets} × ${ex.reps}`}
                size="small"
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: '12px',
                  height: '24px',
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255,38,37,0.12)'
                    : 'rgba(255,38,37,0.08)',
                  color: 'primary.main',
                  border: '1px solid rgba(255,38,37,0.2)',
                  '& .MuiChip-label': { px: '8px' },
                }}
              />
            </Stack>
          ))}
        </Stack>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: '24px', pb: '20px', gap: '8px' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 600,
            borderColor: 'divider',
            color: 'text.secondary',
          }}
        >
          Close
        </Button>
        <Button
          onClick={onAdd}
          variant="contained"
          disabled={importing}
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
            '&:hover': { background: 'linear-gradient(135deg, #e01f1e 0%, #e85e2d 100%)' },
            '&:disabled': { background: 'rgba(255,38,37,0.3)' },
            minWidth: '160px',
          }}
        >
          {importing ? (
            <Stack direction="row" alignItems="center" gap="8px">
              <CircularProgress size={14} sx={{ color: '#fff' }} />
              <span>Importing…</span>
            </Stack>
          ) : (
            'Add to My Plans'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
