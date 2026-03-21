import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Stack, Typography, Button, Tabs, Tab, IconButton, TextField, Tooltip,
} from '@mui/material';
import { Add, ArrowBack, Edit, Check } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { authFetch } from '../utils/api';
import DayExerciseRow from '../components/DayExerciseRow';
import ExercisePickerDrawer from '../components/ExercisePickerDrawer';
import Loader from '../components/Loader';

export default function TemplatePage() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const fetchTemplate = async () => {
    try {
      const data = await authFetch(`/api/user/templates/${templateId}`);
      setTemplate(data);
      setNameValue(data.name);
    } catch {
      navigate('/plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplate();
  }, [templateId]);

  const currentDay = template?.days?.[activeDay];

  const handleRenameSave = async () => {
    if (nameValue.trim() && nameValue !== template.name) {
      await authFetch(`/api/user/templates/${templateId}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: nameValue.trim() }),
      });
      setTemplate((prev) => ({ ...prev, name: nameValue.trim() }));
    }
    setEditingName(false);
  };

  const handleLabelSave = async () => {
    if (!currentDay) return;
    await authFetch(`/api/user/templates/${templateId}/days/${currentDay.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ label: labelValue.trim() || null }),
    });
    setTemplate((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.id === currentDay.id ? { ...d, label: labelValue.trim() || null } : d
      ),
    }));
    setEditingLabel(false);
  };

  const handleAddExercise = async (exerciseId, config) => {
    if (!currentDay) return;
    const added = await authFetch(
      `/api/user/templates/${templateId}/days/${currentDay.id}/exercises`,
      {
        method: 'POST',
        body: JSON.stringify({
          exerciseId,
          sets: config.sets,
          reps: config.reps,
          rpe: config.rpe,
          notes: config.notes,
        }),
      }
    );
    setTemplate((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.id === currentDay.id
          ? { ...d, exercises: [...d.exercises, added] }
          : d
      ),
    }));
  };

  const handleReorder = async (exerciseId1, exerciseId2) => {
    if (!currentDay) return;
    const updatedDay = await authFetch(
      `/api/user/templates/${templateId}/days/${currentDay.id}/exercises/reorder`,
      {
        method: 'POST',
        body: JSON.stringify({ exerciseId1, exerciseId2 }),
      }
    );
    setTemplate((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.id === currentDay.id ? updatedDay : d
      ),
    }));
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !currentDay) return;

    const exercises = currentDay.exercises;
    const oldIndex = exercises.findIndex((ex) => ex.id === active.id);
    const newIndex = exercises.findIndex((ex) => ex.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    // Optimistic update
    const reordered = arrayMove(exercises, oldIndex, newIndex);
    setTemplate((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.id === currentDay.id ? { ...d, exercises: reordered } : d
      ),
    }));

    // Sequential adjacent swaps to satisfy backend's swap endpoint
    const ids = exercises.map((ex) => ex.id);
    if (oldIndex < newIndex) {
      for (let i = oldIndex; i < newIndex; i++) {
        await authFetch(
          `/api/user/templates/${templateId}/days/${currentDay.id}/exercises/reorder`,
          { method: 'POST', body: JSON.stringify({ exerciseId1: ids[i], exerciseId2: ids[i + 1] }) }
        );
        [ids[i], ids[i + 1]] = [ids[i + 1], ids[i]];
      }
    } else {
      for (let i = oldIndex; i > newIndex; i--) {
        await authFetch(
          `/api/user/templates/${templateId}/days/${currentDay.id}/exercises/reorder`,
          { method: 'POST', body: JSON.stringify({ exerciseId1: ids[i], exerciseId2: ids[i - 1] }) }
        );
        [ids[i], ids[i - 1]] = [ids[i - 1], ids[i]];
      }
    }
  };

  const handleUpdateExercise = async (exerciseRowId, config) => {
    if (!currentDay) return;
    await authFetch(
      `/api/user/templates/${templateId}/days/${currentDay.id}/exercises/${exerciseRowId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(config),
      }
    );
    setTemplate((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.id === currentDay.id
          ? {
              ...d,
              exercises: d.exercises.map((ex) =>
                ex.id === exerciseRowId ? { ...ex, ...config } : ex
              ),
            }
          : d
      ),
    }));
  };

  const handleRemoveExercise = async (exerciseRowId) => {
    if (!currentDay) return;
    await authFetch(
      `/api/user/templates/${templateId}/days/${currentDay.id}/exercises/${exerciseRowId}`,
      { method: 'DELETE' }
    );
    setTemplate((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.id === currentDay.id
          ? { ...d, exercises: d.exercises.filter((ex) => ex.id !== exerciseRowId) }
          : d
      ),
    }));
  };

  if (loading) return <Loader />;
  if (!template) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <Box sx={{ px: { xs: '16px', sm: '32px', lg: '48px' }, py: { xs: '30px', lg: '48px' }, minHeight: 'calc(100vh - 160px)' }}>
        {/* Back + Title */}
        <Stack direction="row" alignItems="center" gap="12px" mb="24px">
          <IconButton
            onClick={() => navigate('/plans')}
            sx={{
              color: 'text.secondary',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '10px',
              width: '36px',
              height: '36px',
              '&:hover': { color: 'primary.main', borderColor: 'primary.main' },
            }}
          >
            <ArrowBack sx={{ fontSize: '18px' }} />
          </IconButton>

          {editingName ? (
            <Stack direction="row" alignItems="center" gap="8px" flex={1}>
              <TextField
                autoFocus
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenameSave();
                  if (e.key === 'Escape') { setEditingName(false); setNameValue(template.name); }
                }}
                size="small"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    fontFamily: '"Bebas Neue", sans-serif',
                    fontSize: '32px',
                    letterSpacing: '0.03em',
                    borderRadius: '10px',
                  },
                }}
              />
              <IconButton onClick={handleRenameSave} sx={{ color: 'primary.main' }}>
                <Check />
              </IconButton>
            </Stack>
          ) : (
            <Stack direction="row" alignItems="center" gap="8px" flex={1}>
              <Typography
                sx={{
                  fontFamily: '"Bebas Neue", sans-serif',
                  fontSize: { lg: '42px', xs: '32px' },
                  letterSpacing: '0.03em',
                  color: 'text.primary',
                  lineHeight: 1,
                }}
              >
                {template.name}
              </Typography>
              <Tooltip title="Rename">
                <IconButton
                  size="small"
                  onClick={() => setEditingName(true)}
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  <Edit sx={{ fontSize: '16px' }} />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Stack>

        {/* Day tabs */}
        <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}`, mb: '24px' }}>
          <Tabs
            value={activeDay}
            onChange={(_, v) => { setActiveDay(v); setEditingLabel(false); }}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{
              sx: { background: 'linear-gradient(90deg, #FF2625, #FF6B35)', height: '3px', borderRadius: '3px' },
            }}
          >
            {template.days.map((day) => (
              <Tab
                key={day.id}
                label={day.label || `Day ${day.dayNumber}`}
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: '13px',
                  textTransform: 'none',
                  minWidth: '80px',
                  color: 'text.secondary',
                  '&.Mui-selected': { color: 'primary.main' },
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Day content */}
        {currentDay && (
          <Box>
            {/* Day label edit */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb="20px">
              {editingLabel ? (
                <Stack direction="row" alignItems="center" gap="8px">
                  <TextField
                    autoFocus
                    value={labelValue}
                    onChange={(e) => setLabelValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleLabelSave();
                      if (e.key === 'Escape') setEditingLabel(false);
                    }}
                    placeholder="e.g. Push, Legs, Upper..."
                    size="small"
                    sx={{
                      width: '220px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '14px',
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleLabelSave}
                    sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '12px', borderRadius: '8px' }}
                  >
                    Save
                  </Button>
                </Stack>
              ) : (
                <Stack direction="row" alignItems="center" gap="8px">
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 700,
                      fontSize: '16px',
                      color: 'text.primary',
                    }}
                  >
                    {currentDay.label || `Day ${currentDay.dayNumber}`}
                  </Typography>
                  <Tooltip title="Rename day">
                    <IconButton
                      size="small"
                      onClick={() => { setEditingLabel(true); setLabelValue(currentDay.label || ''); }}
                      sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                    >
                      <Edit sx={{ fontSize: '14px' }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              )}

              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setDrawerOpen(true)}
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: '13px',
                  borderRadius: '10px',
                  borderColor: 'divider',
                  color: 'text.secondary',
                  textTransform: 'none',
                  px: '16px',
                  '&:hover': {
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    backgroundColor: 'rgba(255,38,37,0.06)',
                  },
                }}
              >
                Add Exercise
              </Button>
            </Stack>

            {/* Exercise list */}
            {currentDay.exercises.length === 0 ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  py: '60px',
                  border: `1.5px dashed ${theme.palette.divider}`,
                  borderRadius: '16px',
                  gap: '12px',
                }}
              >
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '16px', color: 'text.primary' }}>
                  No exercises yet
                </Typography>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: 'text.secondary' }}>
                  Add exercises to build this day's routine.
                </Typography>
              </Stack>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={currentDay.exercises.map((ex) => ex.id)} strategy={verticalListSortingStrategy}>
                  <AnimatePresence>
                    {currentDay.exercises.map((ex, i) => (
                      <DayExerciseRow
                        key={ex.id}
                        exercise={ex}
                        index={i}
                        totalCount={currentDay.exercises.length}
                        onUpdate={handleUpdateExercise}
                        onRemove={handleRemoveExercise}
                        onMoveUp={() => handleReorder(ex.id, currentDay.exercises[i - 1].id)}
                        onMoveDown={() => handleReorder(ex.id, currentDay.exercises[i + 1].id)}
                      />
                    ))}
                  </AnimatePresence>
                </SortableContext>
              </DndContext>
            )}
          </Box>
        )}
      </Box>

      <ExercisePickerDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAdd={handleAddExercise}
      />
    </motion.div>
  );
}
