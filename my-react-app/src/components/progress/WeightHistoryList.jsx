import { useMemo, useState } from 'react';
import {
  Box, Stack, Typography, IconButton, Collapse,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ExpandMore, ExpandLess, DeleteOutline, TrendingUp, TrendingDown } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

function WeightHistoryEntry({ entry, prevEntry, onDelete, unit, convert }) {
  const theme = useTheme();
  const formatted = new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  let delta = null;
  if (prevEntry) {
    const diff = entry.weight - prevEntry.weight;
    delta = (convert(Math.abs(diff)) * Math.sign(diff)).toFixed(1);
  }
  const deltaNum = parseFloat(delta);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.25 }}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          py: '10px',
          px: '4px',
          borderBottom: `1px solid ${theme.palette.divider}`,
          '&:last-child': { borderBottom: 'none' },
          '&:hover .delete-btn': { opacity: 1 },
        }}
      >
        <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: { xs: '12px', sm: '13px' }, color: 'text.secondary', minWidth: { xs: '85px', sm: '140px' } }}>
          {formatted}
        </Typography>
        <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: { xs: '13px', sm: '14px' }, fontWeight: 700, color: 'text.primary', minWidth: { xs: '65px', sm: '80px' } }}>
          {convert(entry.weight)} {unit}
        </Typography>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
          {delta !== null && deltaNum !== 0 && (
            <>
              {deltaNum > 0
                ? <TrendingUp sx={{ fontSize: '14px', color: '#4caf50' }} />
                : <TrendingDown sx={{ fontSize: '14px', color: '#FF2625' }} />
              }
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', fontWeight: 600, color: deltaNum > 0 ? '#4caf50' : '#FF2625' }}>
                {deltaNum > 0 ? '+' : ''}{delta}
              </Typography>
            </>
          )}
        </Box>
        <IconButton
          className="delete-btn"
          onClick={() => onDelete(entry)}
          size="small"
          sx={{
            opacity: { xs: 0.5, sm: 0 },
            transition: 'opacity 0.2s',
            color: 'text.secondary',
            '&:hover': { color: 'error.main' },
          }}
        >
          <DeleteOutline sx={{ fontSize: '16px' }} />
        </IconButton>
      </Stack>
    </motion.div>
  );
}

function MonthGroup({ monthLabel, entries, allEntries, defaultOpen, onDelete, unit, convert }) {
  const theme = useTheme();
  const [open, setOpen] = useState(defaultOpen);

  const avg = convert(entries.reduce((s, e) => s + e.weight, 0) / entries.length).toFixed(1);

  return (
    <Box sx={{ mb: '4px' }}>
      <Stack
        direction="row"
        alignItems="center"
        onClick={() => setOpen((o) => !o)}
        sx={{
          cursor: 'pointer',
          py: '8px',
          px: '12px',
          borderRadius: '8px',
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
          },
        }}
      >
        <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '18px', letterSpacing: '0.04em', color: 'text.primary', lineHeight: 1, flex: 1 }}>
          {monthLabel}
        </Typography>
        <Stack direction="row" alignItems="center" gap="12px">
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: 'text.secondary' }}>
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', fontWeight: 600, color: 'primary.main' }}>
            avg {avg}
          </Typography>
          {open ? <ExpandLess sx={{ fontSize: '16px', color: 'text.secondary' }} /> : <ExpandMore sx={{ fontSize: '16px', color: 'text.secondary' }} />}
        </Stack>
      </Stack>

      <Collapse in={open}>
        <Box sx={{ pl: { xs: '8px', sm: '16px' } }}>
          <AnimatePresence>
            {entries.map((entry) => {
              const globalIdx = allEntries.findIndex((e) => e.id === entry.id);
              const prev = globalIdx > 0 ? allEntries[globalIdx - 1] : null;
              return (
                <WeightHistoryEntry
                  key={entry.id}
                  entry={entry}
                  prevEntry={prev}
                  onDelete={onDelete}
                  unit={unit}
                  convert={convert}
                />
              );
            })}
          </AnimatePresence>
        </Box>
      </Collapse>
    </Box>
  );
}

function YearGroup({ year, months, allEntries, defaultOpen, onDelete, unit, convert }) {
  const theme = useTheme();
  const [open, setOpen] = useState(defaultOpen);

  const totalEntries = months.reduce((s, m) => s + m.entries.length, 0);

  return (
    <Box sx={{ mb: '8px' }}>
      {/* Year header */}
      <Stack
        direction="row"
        alignItems="center"
        onClick={() => setOpen((o) => !o)}
        sx={{
          cursor: 'pointer',
          py: '12px',
          px: '8px',
          borderRadius: '10px',
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
          },
        }}
      >
        <Stack direction="row" alignItems="center" gap="10px" flex={1}>
          <Box sx={{ width: '3px', height: '22px', borderRadius: '2px', background: 'linear-gradient(180deg, #FF2625 0%, #FF6B35 100%)' }} />
          <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '24px', letterSpacing: '0.04em', color: 'text.primary', lineHeight: 1 }}>
            {year}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" gap="12px">
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: 'text.secondary' }}>
            {totalEntries} {totalEntries === 1 ? 'entry' : 'entries'}
          </Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: 'text.secondary' }}>
            {months.length} {months.length === 1 ? 'month' : 'months'}
          </Typography>
          {open
            ? <ExpandLess sx={{ fontSize: '20px', color: 'text.secondary' }} />
            : <ExpandMore sx={{ fontSize: '20px', color: 'text.secondary' }} />
          }
        </Stack>
      </Stack>

      {/* Months inside */}
      <Collapse in={open}>
        <Box sx={{ pl: { xs: '8px', sm: '16px' } }}>
          {months.map((group, i) => (
            <MonthGroup
              key={group.key}
              monthLabel={group.monthName}
              entries={group.entries}
              allEntries={allEntries}
              defaultOpen={i === 0 && defaultOpen}
              onDelete={onDelete}
              unit={unit}
              convert={convert}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}

export default function WeightHistoryList({ entries, onDelete, unit = 'lbs', convert = (v) => v }) {
  const theme = useTheme();
  const [confirmEntry, setConfirmEntry] = useState(null);

  const handleDeleteClick = (entry) => {
    setConfirmEntry(entry);
  };

  const handleConfirmDelete = () => {
    if (confirmEntry) onDelete(confirmEntry.id);
    setConfirmEntry(null);
  };

  // Group by year → month (descending)
  const yearGroups = useMemo(() => {
    const years = {};
    const desc = [...entries].reverse();
    for (const entry of desc) {
      const d = new Date(entry.date);
      const year = d.getFullYear();
      const monthKey = `${year}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthName = d.toLocaleDateString('en-US', { month: 'long' });

      if (!years[year]) years[year] = {};
      if (!years[year][monthKey]) years[year][monthKey] = { key: monthKey, monthName, entries: [] };
      years[year][monthKey].entries.push(entry);
    }

    return Object.keys(years)
      .sort((a, b) => b - a)
      .map((year) => ({
        year,
        months: Object.values(years[year]),
      }));
  }, [entries]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <Box
        sx={{
          borderRadius: '16px',
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: 'background.paper',
          p: { xs: '20px', sm: '28px' },
        }}
      >
        {/* Header */}
        <Stack direction="row" alignItems="center" gap="12px" mb="16px">
          <Box sx={{ width: '4px', height: '24px', borderRadius: '2px', background: 'linear-gradient(180deg, #FF2625 0%, #FF6B35 100%)', flexShrink: 0 }} />
          <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: '22px', sm: '26px' }, letterSpacing: '0.04em', color: 'text.primary', lineHeight: 1 }}>
            Log History
          </Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: 'text.secondary', ml: '4px' }}>
            {entries.length} total
          </Typography>
        </Stack>

        {yearGroups.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: '40px', color: 'text.secondary', fontFamily: '"DM Sans", sans-serif', fontSize: '14px' }}>
            No entries yet. Log your first weight above!
          </Box>
        ) : (
          yearGroups.map((yg, i) => (
            <YearGroup
              key={yg.year}
              year={yg.year}
              months={yg.months}
              allEntries={entries}
              defaultOpen={i === 0}
              onDelete={handleDeleteClick}
              unit={unit}
              convert={convert}
            />
          ))
        )}
      </Box>

      {/* Confirm delete dialog */}
      <Dialog
        open={Boolean(confirmEntry)}
        onClose={() => setConfirmEntry(null)}
        PaperProps={{
          sx: {
            borderRadius: '14px',
            backgroundColor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            maxWidth: '380px',
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '24px', letterSpacing: '0.04em', pb: '4px' }}>
          Delete Entry?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: 'text.secondary' }}>
            Are you sure you want to delete the log for{' '}
            <strong style={{ color: theme.palette.text.primary }}>
              {confirmEntry && `${convert(confirmEntry.weight)} ${unit} on ${new Date(confirmEntry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
            </strong>
            ? This can't be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: '20px', pb: '16px', gap: '8px' }}>
          <Button
            onClick={() => setConfirmEntry(null)}
            sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '13px', color: 'text.secondary', borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{
              fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '13px',
              borderRadius: '8px', px: '20px',
              backgroundColor: '#d32f2f',
              '&:hover': { backgroundColor: '#b71c1c' },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}
