import { useState, useMemo } from 'react';
import { Box, Stack, Typography, Button, Collapse } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { TrendingUp, TrendingDown, TrendingFlat, ExpandMore, ExpandLess } from '@mui/icons-material';
import { motion } from 'framer-motion';

function getRangeLabel(range) {
  if (range === null) return 'All-Time';
  if (range >= 24 && range % 12 === 0) return `${range / 12}-Year`;
  if (range === 12) return '1-Year';
  return `${range}-Month`;
}

export default function WeightHero({ entries, filtered, range, unit = 'lbs', convert = (v) => v }) {
  const theme = useTheme();

  const stats = useMemo(() => {
    if (!entries.length) return null;

    const latest = entries[entries.length - 1];
    const first = entries[0];
    const highest = entries.reduce((max, e) => e.weight > max.weight ? e : max, entries[0]);
    const lowest = entries.reduce((min, e) => e.weight < min.weight ? e : min, entries[0]);

    // Change and avg based on the filtered (graph) range
    const rangeEntries = filtered && filtered.length > 0 ? filtered : entries;
    const avg = (rangeEntries.reduce((s, e) => s + e.weight, 0) / rangeEntries.length);

    let change = null;
    if (rangeEntries.length > 1) {
      change = rangeEntries[rangeEntries.length - 1].weight - rangeEntries[0].weight;
    }

    return { latest, first, highest, lowest, avg, change, total: entries.length };
  }, [entries, filtered]);

  const [showDetails, setShowDetails] = useState(false);

  if (!stats) return null;

  const rangeLabel = getRangeLabel(range);
  const convertedChange = stats.change !== null ? convert(Math.abs(stats.change)) * Math.sign(stats.change) : null;
  const changeNum = convertedChange !== null ? +convertedChange.toFixed(1) : 0;
  const changeColor = changeNum > 0 ? '#4caf50' : changeNum < 0 ? '#FF2625' : theme.palette.text.secondary;
  const ChangeIcon = changeNum > 0 ? TrendingUp : changeNum < 0 ? TrendingDown : TrendingFlat;

  const primaryStats = [
    {
      label: `${rangeLabel} Change`,
      value: convertedChange !== null ? `${changeNum > 0 ? '+' : ''}${changeNum} ${unit}` : '—',
      color: changeColor,
      icon: <ChangeIcon sx={{ fontSize: '16px', color: changeColor }} />,
    },
    { label: `${rangeLabel} Avg`, value: `${convert(stats.avg).toFixed(1)} ${unit}`, color: theme.palette.text.primary },
  ];

  const detailStats = [
    { label: 'First Log', value: `${convert(stats.first.weight)} ${unit}`, sub: new Date(stats.first.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), color: theme.palette.text.primary },
    { label: 'Most Recent', value: `${convert(stats.latest.weight)} ${unit}`, sub: new Date(stats.latest.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), color: theme.palette.text.primary },
    { label: 'Highest', value: `${convert(stats.highest.weight)} ${unit}`, sub: new Date(stats.highest.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), color: '#4caf50' },
    { label: 'Lowest', value: `${convert(stats.lowest.weight)} ${unit}`, sub: new Date(stats.lowest.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), color: '#FF6B35' },
    { label: 'Total Logs', value: stats.total, color: theme.palette.text.primary },
  ];

  const StatCard = ({ label, value, color, icon, sub }) => (
    <Box
      sx={{
        borderRadius: '12px',
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
        p: { xs: '12px 14px', sm: '16px 20px' },
        minWidth: 0,
        flex: { xs: '1 1 calc(50% - 6px)', sm: '0 1 auto' },
        minHeight: 0,
      }}
    >
      <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: { xs: '10px', sm: '11px' }, color: 'text.secondary', mb: '6px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
        {label}
      </Typography>
      <Stack direction="row" alignItems="center" gap="6px">
        {icon}
        <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: { xs: '15px', sm: '18px' }, fontWeight: 700, color }}>
          {value}
        </Typography>
      </Stack>
      {sub && (
        <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '10px', color: 'text.secondary', mt: '4px' }}>
          {sub}
        </Typography>
      )}
    </Box>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
    >
      <Box
        sx={{
          borderRadius: '16px',
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: 'background.paper',
          p: { xs: '24px', sm: '32px' },
          mb: '32px',
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} gap={{ xs: '20px', sm: '40px' }}>
          {/* Current weight */}
          <Box>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: 'text.secondary', mb: '4px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
              Current Weight
            </Typography>
            <Stack direction="row" alignItems="baseline" gap="8px">
              <Typography
                sx={{
                  fontFamily: '"Bebas Neue", sans-serif',
                  fontSize: { xs: '56px', sm: '72px' },
                  lineHeight: 1,
                  background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {convert(stats.latest.weight)}
              </Typography>
              <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '24px', color: 'text.secondary', lineHeight: 1 }}>
                {unit}
              </Typography>
            </Stack>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: 'text.secondary', mt: '4px' }}>
              Logged {new Date(stats.latest.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Typography>
          </Box>

          {/* Primary stats */}
          <Stack direction="row" gap={{ xs: '10px', sm: '16px' }} flexWrap="wrap" sx={{ flex: 1, width: { xs: '100%', sm: 'auto' } }}>
            {primaryStats.map((s) => <StatCard key={s.label} {...s} />)}
          </Stack>
        </Stack>

        {/* More details toggle */}
        <Box sx={{ mt: '16px' }}>
          <Button
            onClick={() => setShowDetails((o) => !o)}
            endIcon={showDetails ? <ExpandLess sx={{ fontSize: '16px' }} /> : <ExpandMore sx={{ fontSize: '16px' }} />}
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              color: 'text.secondary',
              textTransform: 'none',
              px: '8px',
              '&:hover': { color: 'primary.main', backgroundColor: 'transparent' },
            }}
          >
            {showDetails ? 'Hide details' : 'More details'}
          </Button>
          <Collapse in={showDetails}>
            <Stack direction="row" gap={{ xs: '10px', sm: '16px' }} flexWrap="wrap" sx={{ mt: '12px' }}>
              {detailStats.map((s) => <StatCard key={s.label} {...s} />)}
            </Stack>
          </Collapse>
        </Box>
      </Box>
    </motion.div>
  );
}
