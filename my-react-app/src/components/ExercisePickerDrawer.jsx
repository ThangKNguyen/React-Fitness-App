import { useState, useEffect, useRef } from 'react';
import {
  Drawer, Box, Stack, Typography, TextField, IconButton,
  InputAdornment, Button, Chip,
} from '@mui/material';
import { Search, Close, FitnessCenter, Add } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '../utils/api';
import { useCustomExercises } from '../utils/useCustomExercises';
import { useFavorites } from '../utils/useFavorites';

// Each filter checks bodyPart OR target on the exercise object
const MUSCLE_FILTERS = [
  { label: 'Chest',      match: (e) => e.bodyPart === 'chest' },
  { label: 'Back',       match: (e) => e.bodyPart === 'back' },
  { label: 'Quads',      match: (e) => e.target === 'quads' },
  { label: 'Hamstrings', match: (e) => e.target === 'hamstrings' },
  { label: 'Calves',     match: (e) => e.target === 'calves' || e.bodyPart === 'lower legs' },
  { label: 'Shoulders',  match: (e) => e.bodyPart === 'shoulders' },
  { label: 'Biceps',     match: (e) => e.target === 'biceps' },
  { label: 'Triceps',    match: (e) => e.target === 'triceps' },
  { label: 'Forearms',   match: (e) => e.bodyPart === 'lower arms' },
  { label: 'Abs',        match: (e) => e.target === 'abs' },
];

export default function ExercisePickerDrawer({ open, onClose, onAdd }) {
  const theme = useTheme();
  const { customExercises } = useCustomExercises();
  const { favorites } = useFavorites();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [form, setForm] = useState({ sets: 3, reps: 10, rpe: '' });
  const [showSaved, setShowSaved] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [muscleFilter, setMuscleFilter] = useState(null); // null = all
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
      setAddingId(null);
      setShowSaved(false);
      setShowCustom(false);
      setMuscleFilter(null);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await apiFetch(`/api/exercises/search?q=${encodeURIComponent(query)}`);
        setResults(Array.isArray(data) ? data.slice(0, 40) : []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const applyFilter = (list) => {
    if (!muscleFilter) return list;
    const filter = MUSCLE_FILTERS.find((f) => f.label === muscleFilter);
    return filter ? list.filter(filter.match) : list;
  };

  const handleStartAdd = (exercise) => {
    setAddingId(exercise.id);
    setForm({ sets: 3, reps: 10, rpe: '', notes: '' });
  };

  const handleConfirmAdd = (exercise) => {
    onAdd(exercise.id, {
      sets: Number(form.sets) || 1,
      reps: Number(form.reps) || 1,
      rpe: form.rpe ? Number(form.rpe) : null,
      notes: form.notes.trim() || null,
    });
    setAddingId(null);
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      fontFamily: '"DM Sans", sans-serif',
      fontSize: '13px',
    },
    '& .MuiInputLabel-root': { fontSize: '12px' },
  };

  const renderExerciseRow = (exercise, i) => (
    <motion.div
      key={exercise.id}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: i * 0.02 }}
    >
      <Box
        sx={{
          p: '10px 12px',
          borderRadius: '10px',
          border: `1px solid ${theme.palette.divider}`,
          mb: '8px',
          backgroundColor: 'background.paper',
          transition: 'border-color 0.2s',
          '&:hover': { borderColor: 'rgba(255,38,37,0.3)' },
        }}
      >
        <Stack direction="row" alignItems="center" gap="10px">
          {exercise.gifUrl ? (
            <Box sx={{ width: '44px', height: '44px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
              <img src={exercise.gifUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
          ) : (
            <Box
              sx={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,38,37,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FitnessCenter sx={{ fontSize: '18px', color: 'primary.main', opacity: 0.3 }} />
            </Box>
          )}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 700,
                fontSize: '13px',
                color: 'text.primary',
                textTransform: 'capitalize',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {exercise.name}
            </Typography>
            <Stack direction="row" gap="4px" mt="3px">
              <Chip
                label={exercise.bodyPart}
                size="small"
                sx={{
                  height: '18px',
                  fontSize: '10px',
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 700,
                  textTransform: 'capitalize',
                  backgroundColor: 'rgba(255,38,37,0.1)',
                  color: 'primary.main',
                  '& .MuiChip-label': { px: '6px' },
                }}
              />
              {exercise.custom && (
                <Chip
                  label="Custom"
                  size="small"
                  sx={{
                    height: '18px',
                    fontSize: '10px',
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #FF2625, #FF6B35)',
                    color: '#fff',
                    '& .MuiChip-label': { px: '6px' },
                  }}
                />
              )}
            </Stack>
          </Box>

          {addingId !== exercise.id && (
            <IconButton
              size="small"
              onClick={() => handleStartAdd(exercise)}
              sx={{ color: 'text.secondary', width: '30px', height: '30px', '&:hover': { color: 'primary.main' } }}
            >
              <Add sx={{ fontSize: '18px' }} />
            </IconButton>
          )}
        </Stack>

        <AnimatePresence>
          {addingId === exercise.id && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden' }}
            >
              <Stack direction="row" gap="8px" mt="10px" alignItems="flex-end">
                <TextField label="Sets" type="number" value={form.sets} onChange={(e) => setForm((p) => ({ ...p, sets: e.target.value }))} size="small" sx={{ width: '70px', ...inputSx }} inputProps={{ min: 1 }} />
                <TextField label="Reps" type="number" value={form.reps} onChange={(e) => setForm((p) => ({ ...p, reps: e.target.value }))} size="small" sx={{ width: '70px', ...inputSx }} inputProps={{ min: 1 }} />
                <TextField label="RPE" type="number" value={form.rpe} onChange={(e) => setForm((p) => ({ ...p, rpe: e.target.value }))} size="small" sx={{ width: '70px', ...inputSx }} placeholder="—" inputProps={{ min: 1, max: 10, step: 0.5 }} />
                <Button variant="contained" size="small" onClick={() => handleConfirmAdd(exercise)} sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '12px', minWidth: '60px', borderRadius: '8px', py: '6px' }}>
                  Add
                </Button>
                <IconButton size="small" onClick={() => setAddingId(null)} sx={{ color: 'text.secondary' }}>
                  <Close sx={{ fontSize: '16px' }} />
                </IconButton>
              </Stack>
              <TextField
                label="Notes"
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                size="small"
                fullWidth
                placeholder="Optional notes..."
                sx={{ mt: '8px', ...inputSx }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </motion.div>
  );

  const filteredResults = applyFilter(results);
  const filteredCustom = applyFilter(customExercises);
  const filteredFavorites = applyFilter(favorites);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: '420px' },
          backgroundColor: 'background.default',
          backgroundImage: 'none',
          borderLeft: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ px: '20px', pt: '18px', pb: '14px', borderBottom: `1px solid ${theme.palette.divider}`, flexShrink: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb="14px">
          <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '22px', letterSpacing: '0.05em', color: 'text.primary' }}>
            Add Exercise
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
            <Close sx={{ fontSize: '20px' }} />
          </IconButton>
        </Stack>

        {/* Search */}
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search exercises..."
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: '18px', color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: '12px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px',
              backgroundColor: 'background.paper',
            },
          }}
        />

        {/* Muscle group filter chips */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
          }}
        >
          <Chip
            label="All"
            size="small"
            onClick={() => setMuscleFilter(null)}
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: '11px',
              height: '26px',
              flexShrink: 0,
              cursor: 'pointer',
              ...(muscleFilter === null
                ? { background: 'linear-gradient(135deg, #FF2625, #FF6B35)', color: '#fff' }
                : { backgroundColor: 'background.paper', color: 'text.secondary', border: `1px solid ${theme.palette.divider}` }),
            }}
          />
          {MUSCLE_FILTERS.map((f) => (
            <Chip
              key={f.label}
              label={f.label}
              size="small"
              onClick={() => setMuscleFilter(muscleFilter === f.label ? null : f.label)}
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 700,
                fontSize: '11px',
                height: '26px',
                flexShrink: 0,
                cursor: 'pointer',
                ...(muscleFilter === f.label
                  ? { background: 'linear-gradient(135deg, #FF2625, #FF6B35)', color: '#fff' }
                  : { backgroundColor: 'background.paper', color: 'text.secondary', border: `1px solid ${theme.palette.divider}` }),
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Results */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: '16px', py: '12px' }}>
        {/* Custom exercises toggle */}
        {!query.trim() && customExercises.length > 0 && (
          <Box mb="16px">
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setShowCustom((v) => !v)}
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 700,
                fontSize: '13px',
                borderRadius: '10px',
                borderColor: 'divider',
                color: 'text.secondary',
                textTransform: 'none',
                py: '8px',
                mb: showCustom ? '12px' : 0,
                justifyContent: 'space-between',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  backgroundColor: 'rgba(255,38,37,0.06)',
                },
              }}
            >
              <span>My Custom Exercises</span>
              <span style={{ fontSize: '11px', opacity: 0.7 }}>
                {showCustom ? '▲ Hide' : `▼ Show ${filteredCustom.length}`}
              </span>
            </Button>
            <AnimatePresence>
              {showCustom && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  {filteredCustom.length === 0 ? (
                    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: 'text.secondary', textAlign: 'center', py: '20px' }}>
                      No custom exercises match this filter
                    </Typography>
                  ) : (
                    filteredCustom.map((ex, i) => renderExerciseRow(ex, i))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        )}

        {/* Saved exercises toggle */}
        {!query.trim() && favorites.length > 0 && (
          <Box mb="16px">
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setShowSaved((v) => !v)}
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 700,
                fontSize: '13px',
                borderRadius: '10px',
                borderColor: 'divider',
                color: 'text.secondary',
                textTransform: 'none',
                py: '8px',
                mb: showSaved ? '12px' : 0,
                justifyContent: 'space-between',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  backgroundColor: 'rgba(255,38,37,0.06)',
                },
              }}
            >
              <span>Saved Exercises</span>
              <span style={{ fontSize: '11px', opacity: 0.7 }}>
                {showSaved ? '▲ Hide' : `▼ Show ${filteredFavorites.length}`}
              </span>
            </Button>
            <AnimatePresence>
              {showSaved && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  {filteredFavorites.length === 0 ? (
                    <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: 'text.secondary', textAlign: 'center', py: '20px' }}>
                      No saved exercises match this filter
                    </Typography>
                  ) : (
                    filteredFavorites.map((ex, i) => renderExerciseRow(ex, i))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        )}

        {/* Search results */}
        {query.trim() && (
          <>
            {searching ? (
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: 'text.secondary', textAlign: 'center', py: '40px' }}>
                Searching...
              </Typography>
            ) : filteredResults.length === 0 ? (
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: 'text.secondary', textAlign: 'center', py: '40px' }}>
                No exercises found
              </Typography>
            ) : (
              filteredResults.map((ex, i) => renderExerciseRow(ex, i))
            )}
          </>
        )}

        {!query.trim() && filteredCustom.length === 0 && favorites.length === 0 && (
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: 'text.secondary', textAlign: 'center', py: '40px' }}>
            Search for an exercise to add
          </Typography>
        )}
      </Box>
    </Drawer>
  );
}
