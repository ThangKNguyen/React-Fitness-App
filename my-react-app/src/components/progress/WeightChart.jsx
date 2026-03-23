import { useMemo, useState, useEffect } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import TimeRangeToggle from './TimeRangeToggle';

function CustomTooltip({ active, payload, label, unit }) {
  const theme = useTheme();
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1A' : '#fff',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '10px',
        p: '10px 14px',
        boxShadow: theme.palette.mode === 'dark'
          ? '0 8px 32px rgba(0,0,0,0.5)'
          : '0 8px 32px rgba(0,0,0,0.12)',
      }}
    >
      <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: 'text.secondary', mb: '4px' }}>
        {label}
      </Typography>
      <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '16px', fontWeight: 700, color: '#FF2625' }}>
        {payload[0].value} {unit || 'lbs'}
      </Typography>
    </Box>
  );
}

export default function WeightChart({ entries, range, onRangeChange, customMonths, onCustomChange, unit = 'lbs', convert = (v) => v }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Delay chart render so the container has measured dimensions after animation
  // (prevents Recharts -1 width/height warning during AnimatePresence transitions)
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(false);
    const id = setTimeout(() => setReady(true), 350);
    return () => clearTimeout(id);
  }, [entries]);

  const chartData = useMemo(() =>
    entries.map((e) => ({
      date: new Date(e.date).toLocaleDateString('en-US', isMobile
        ? { month: 'short', day: 'numeric' }
        : { month: 'short', day: 'numeric', year: '2-digit' }),
      weight: convert(e.weight),
      rawDate: e.date,
    })),
  [entries, isMobile, convert]);

  // Compute Y domain with padding
  const [yMin, yMax] = useMemo(() => {
    if (!chartData.length) return [150, 200];
    const weights = chartData.map((d) => d.weight);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const pad = Math.max(2, (max - min) * 0.15);
    return [Math.floor(min - pad), Math.ceil(max + pad)];
  }, [chartData]);

  const gridColor = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const axisColor = theme.palette.text.secondary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      <Box
        sx={{
          borderRadius: '16px',
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: 'background.paper',
          p: { xs: '16px', sm: '28px' },
          mb: '40px',
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', mb: '20px' }}>
          <Box sx={{ width: '4px', height: '24px', borderRadius: '2px', background: 'linear-gradient(180deg, #FF2625 0%, #FF6B35 100%)', flexShrink: 0 }} />
          <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: '22px', sm: '26px' }, letterSpacing: '0.04em', color: 'text.primary', lineHeight: 1 }}>
            Weight Trend
          </Typography>
        </Box>

        <TimeRangeToggle
          range={range}
          onRangeChange={onRangeChange}
          customMonths={customMonths}
          onCustomChange={onCustomChange}
        />

        {chartData.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: '60px', color: 'text.secondary', fontFamily: '"DM Sans", sans-serif', fontSize: '14px' }}>
            No entries in this time range.
          </Box>
        ) : (
          <Box sx={{ width: '100%', height: isMobile ? 260 : 360, minWidth: 0 }}>
            {ready && <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: isMobile ? -20 : 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF2625" stopOpacity={0.35} />
                    <stop offset="60%" stopColor="#FF6B35" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#FF6B35" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fill: axisColor }}
                  tickLine={false}
                  axisLine={{ stroke: gridColor }}
                  interval={Math.max(0, Math.floor(chartData.length / (isMobile ? 4 : 7)))}
                  angle={isMobile ? -35 : 0}
                  textAnchor={isMobile ? 'end' : 'middle'}
                  height={isMobile ? 50 : 30}
                />
                <YAxis
                  domain={[yMin, yMax]}
                  tick={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fill: axisColor }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}`}
                />
                <Tooltip content={<CustomTooltip unit={unit} />} cursor={{ stroke: '#FF2625', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#FF2625"
                  strokeWidth={2.5}
                  fill="url(#weightGradient)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    stroke: '#FF2625',
                    strokeWidth: 2,
                    fill: theme.palette.mode === 'dark' ? '#0A0A0A' : '#fff',
                  }}
                  animationDuration={800}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            </ResponsiveContainer>}
          </Box>
        )}
      </Box>
    </motion.div>
  );
}
