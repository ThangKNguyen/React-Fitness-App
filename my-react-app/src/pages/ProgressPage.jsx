import { useState, useMemo, useCallback, useRef } from 'react';
import { Box, Stack, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FitnessCenter, CameraAlt, Visibility, VisibilityOff } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useBodyweight, generateSeedData } from '../utils/useBodyweight';
import { useProgressPhotos, SEED_ENTRIES as PHOTO_SEED } from '../utils/useProgressPhotos';
import { authFetch } from '../utils/api';
import WeightHero from '../components/progress/WeightHero';
import WeightLogForm from '../components/progress/WeightLogForm';
import WeightChart from '../components/progress/WeightChart';
import WeightHistoryList from '../components/progress/WeightHistoryList';
import ProgressPhotos from '../components/progress/ProgressPhotos';

const TABS = [
  { key: 'weight', label: 'Weight', icon: FitnessCenter },
  { key: 'photos', label: 'Photos', icon: CameraAlt },
];

export default function ProgressPage() {
  const theme = useTheme();
  const { entries: realEntries, addEntry, deleteEntry, getFiltered } = useBodyweight();
  const { entries: realPhotoEntries } = useProgressPhotos();

  const [tab, setTab] = useState('weight');
  const [unit, setUnit] = useState(() => localStorage.getItem('mf_weight_unit') ?? 'lbs');
  const [demoMode, setDemoMode] = useState(false);

  // Generate demo data once and reuse (stable across re-renders)
  const demoWeightRef = useRef(null);
  if (!demoWeightRef.current) demoWeightRef.current = generateSeedData();
  const demoWeightEntries = demoWeightRef.current;
  const demoPhotoEntries = PHOTO_SEED;

  // Active data — real or demo
  const entries = demoMode ? demoWeightEntries : realEntries;
  const hasRealData = realEntries.length > 0 || realPhotoEntries.length > 0;
  const isEmpty = !demoMode && realEntries.length === 0 && realPhotoEntries.length === 0;

  const toggleUnit = () => {
    setUnit((prev) => {
      const next = prev === 'lbs' ? 'kg' : 'lbs';
      localStorage.setItem('mf_weight_unit', next);
      authFetch('/api/users/me/preferences', {
        method: 'PUT',
        body: JSON.stringify({ weightUnit: next }),
      }).catch(() => {});
      return next;
    });
  };

  // Convert lbs to display unit
  const convert = useCallback((lbs) => {
    if (unit === 'kg') return +(lbs * 0.453592).toFixed(1);
    return lbs;
  }, [unit]);

  // Time range state
  const [range, setRange] = useState(6);
  const [customMonths, setCustomMonths] = useState('');

  const handleRangeChange = (value) => {
    setRange(value);
    setCustomMonths('');
  };

  const handleCustomChange = (value) => {
    setCustomMonths(value);
    const num = parseInt(value, 10);
    if (num > 0) setRange(num);
  };

  const filtered = useMemo(() => {
    if (demoMode) {
      if (!range) return demoWeightEntries;
      const cutoff = new Date();
      cutoff.setMonth(cutoff.getMonth() - range);
      const cutoffStr = cutoff.toISOString().slice(0, 10);
      return demoWeightEntries.filter((e) => e.date >= cutoffStr);
    }
    return getFiltered(range);
  }, [entries, range, demoMode]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <Box sx={{ px: { xs: '16px', sm: '32px', lg: '48px' }, py: { xs: '40px', lg: '60px' }, minHeight: 'calc(100vh - 160px)' }}>
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <Typography
            sx={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: { lg: '64px', xs: '42px' },
              letterSpacing: '0.04em',
              color: 'text.primary',
              lineHeight: 1,
              mb: '8px',
            }}
          >
            Your{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Progress
            </Box>
          </Typography>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '15px',
              color: 'text.secondary',
              mb: { xs: '24px', lg: '32px' },
            }}
          >
            Track your bodyweight over time and visualize your journey.
          </Typography>
        </motion.div>

        {/* Demo Mode Banner */}
        <AnimatePresence>
          {demoMode && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <Box
                sx={{
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 107, 53, 0.3)',
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(255,38,37,0.08) 0%, rgba(255,107,53,0.08) 100%)'
                    : 'linear-gradient(135deg, rgba(255,38,37,0.06) 0%, rgba(255,107,53,0.06) 100%)',
                  p: { xs: '14px 16px', sm: '16px 24px' },
                  mb: { xs: '24px', lg: '32px' },
                }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" gap="12px">
                  <Stack direction="row" alignItems="center" gap="10px" sx={{ minWidth: 0 }}>
                    <Visibility sx={{ fontSize: '20px', color: '#FF6B35', flexShrink: 0 }} />
                    <Box>
                      <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: { xs: '13px', sm: '14px' }, fontWeight: 700, color: 'text.primary' }}>
                        Sample Data Preview
                      </Typography>
                      <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: { xs: '11px', sm: '12px' }, color: 'text.secondary' }}>
                        This is demo data to show you what your progress page could look like. Your real data is untouched.
                      </Typography>
                    </Box>
                  </Stack>
                  <Button
                    onClick={() => setDemoMode(false)}
                    startIcon={<VisibilityOff sx={{ fontSize: '16px' }} />}
                    variant="outlined"
                    size="small"
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 700,
                      fontSize: '12px',
                      borderRadius: '8px',
                      borderColor: 'rgba(255, 107, 53, 0.4)',
                      color: '#FF6B35',
                      px: '16px',
                      textTransform: 'none',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      '&:hover': {
                        borderColor: '#FF6B35',
                        backgroundColor: 'rgba(255, 107, 53, 0.08)',
                      },
                    }}
                  >
                    Remove Sample Data
                  </Button>
                </Stack>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* "Preview with Sample Data" suggestion — shown when user has no data */}
        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          >
            <Box
              sx={{
                borderRadius: '12px',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                p: { xs: '16px', sm: '20px 24px' },
                mb: { xs: '24px', lg: '32px' },
              }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" gap="12px">
                <Box>
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: { xs: '13px', sm: '14px' }, fontWeight: 600, color: 'text.primary' }}>
                    New here? See what your progress page could look like.
                  </Typography>
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: { xs: '11px', sm: '12px' }, color: 'text.secondary' }}>
                    Preview sample data without affecting your account. You can remove it anytime.
                  </Typography>
                </Box>
                <Button
                  onClick={() => setDemoMode(true)}
                  startIcon={<Visibility sx={{ fontSize: '16px' }} />}
                  variant="contained"
                  size="small"
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 700,
                    fontSize: '12px',
                    borderRadius: '8px',
                    px: '20px',
                    textTransform: 'none',
                    flexShrink: 0,
                    background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
                  }}
                >
                  Preview Sample Data
                </Button>
              </Stack>
            </Box>
          </motion.div>
        )}

        {/* Tab Toggle + Unit Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        >
            <Stack
              direction="row"
              alignItems="center"
              gap={{ xs: '12px', sm: '16px' }}
              sx={{ mb: { xs: '32px', lg: '48px' } }}
            >
              {/* Weight / Photos tabs */}
              <Stack
                direction="row"
                sx={{
                  borderRadius: '12px',
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  p: '4px',
                }}
              >
                {TABS.map(({ key, label, icon: Icon }) => {
                  const active = tab === key;
                  return (
                    <Box
                      key={key}
                      onClick={() => setTab(key)}
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        px: { xs: '20px', sm: '28px' },
                        py: { xs: '10px', sm: '11px' },
                        borderRadius: '9px',
                        cursor: 'pointer',
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: { xs: '13px', sm: '14px' },
                        fontWeight: active ? 700 : 500,
                        color: active ? '#fff' : 'text.secondary',
                        background: active
                          ? 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)'
                          : 'transparent',
                        boxShadow: active
                          ? '0 4px 16px rgba(255, 38, 37, 0.3)'
                          : 'none',
                        transition: 'all 0.25s ease',
                        userSelect: 'none',
                        '&:hover': active
                          ? {}
                          : {
                              color: 'text.primary',
                              backgroundColor: theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.05)'
                                : 'rgba(0,0,0,0.04)',
                            },
                      }}
                    >
                      <Icon sx={{ fontSize: '18px' }} />
                      {label}
                    </Box>
                  );
                })}
              </Stack>

              {/* lbs / kg toggle */}
              <Stack
                direction="row"
                onClick={toggleUnit}
                sx={{
                  borderRadius: '10px',
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  p: '3px',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                {['lbs', 'kg'].map((u) => (
                  <Box
                    key={u}
                    sx={{
                      px: { xs: '12px', sm: '14px' },
                      py: { xs: '7px', sm: '8px' },
                      borderRadius: '8px',
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: { xs: '12px', sm: '13px' },
                      fontWeight: unit === u ? 700 : 500,
                      color: unit === u ? '#fff' : 'text.secondary',
                      background: unit === u
                        ? 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)'
                        : 'transparent',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {u}
                  </Box>
                ))}
              </Stack>

              {/* "Preview with Sample Data" button — shown when user has real data but not in demo */}
              {hasRealData && !demoMode && (
                <Button
                  onClick={() => setDemoMode(true)}
                  startIcon={<Visibility sx={{ fontSize: '16px' }} />}
                  size="small"
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: 'text.secondary',
                    textTransform: 'none',
                    borderRadius: '8px',
                    ml: 'auto',
                    '&:hover': { color: '#FF6B35', backgroundColor: 'rgba(255, 107, 53, 0.06)' },
                  }}
                >
                  Preview Sample Data
                </Button>
              )}
            </Stack>
          </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
            {tab === 'weight' ? (
              <motion.div
                key="weight"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <WeightHero entries={entries} filtered={filtered} range={range} unit={unit} convert={convert} />
                {!demoMode && <WeightLogForm onAdd={addEntry} unit={unit} convert={convert} />}
                <WeightChart
                  entries={filtered}
                  range={range}
                  onRangeChange={handleRangeChange}
                  customMonths={customMonths}
                  onCustomChange={handleCustomChange}
                  unit={unit}
                  convert={convert}
                />
                <WeightHistoryList entries={entries} onDelete={demoMode ? () => {} : deleteEntry} unit={unit} convert={convert} />
              </motion.div>
            ) : (
              <motion.div
                key="photos"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <ProgressPhotos
                  unit={unit}
                  convert={convert}
                  demoMode={demoMode}
                  demoEntries={demoPhotoEntries}
                  demoWeightEntries={demoWeightEntries}
                />
              </motion.div>
            )}
        </AnimatePresence>
      </Box>
    </motion.div>
  );
}
