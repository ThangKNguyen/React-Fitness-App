import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Stack, Typography, Button, IconButton,
  Menu, MenuItem, ListItemIcon, ListItemText, Divider, Alert,
} from '@mui/material';
import { Add, FitnessCenter, Delete, Edit, MoreVert, CalendarMonth } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useTemplates } from '../utils/useTemplates';
import { apiFetch, authFetch } from '../utils/api';
import CreateTemplateDialog from '../components/CreateTemplateDialog';
import PresetTemplateCard from '../components/PresetTemplateCard';
import PresetPreviewDialog from '../components/PresetPreviewDialog';
import { PRESET_TEMPLATES } from '../data/presetTemplates';

export default function PlansPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { templates, createTemplate, deleteTemplate, renameTemplate } = useTemplates();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuTemplate, setMenuTemplate] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [previewPreset, setPreviewPreset] = useState(null);
  const [importingId, setImportingId] = useState(null);
  const [importError, setImportError] = useState('');

  const handleMenuOpen = (e, template) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setMenuTemplate(template);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuTemplate(null);
  };

  const handleDelete = async () => {
    if (menuTemplate) await deleteTemplate(menuTemplate.id);
    handleMenuClose();
  };

  const handleRenameStart = () => {
    setEditingId(menuTemplate.id);
    setEditName(menuTemplate.name);
    handleMenuClose();
  };

  const handleRenameSubmit = async (id) => {
    if (editName.trim()) await renameTemplate(id, editName.trim());
    setEditingId(null);
  };

  const handleDialogClose = (result) => {
    setDialogOpen(false);
    if (result?.id) navigate(`/plans/${result.id}`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleImportPreset = async (preset) => {
    setImportingId(preset.id);
    setImportError('');
    setPreviewPreset(null);
    try {
      // 1. Resolve all exercise IDs in parallel
      const resolvedDays = await Promise.all(
        preset.days.map(async (day) => ({
          ...day,
          exercises: (await Promise.all(
            day.exercises.map(async (ex) => {
              try {
                const results = await apiFetch(`/api/exercises/search?q=${encodeURIComponent(ex.searchQuery)}`);
                return Array.isArray(results) && results.length > 0
                  ? { ...ex, exerciseId: results[0].id }
                  : null;
              } catch {
                return null;
              }
            })
          )).filter(Boolean),
        }))
      );

      // 2. Create the template
      const created = await createTemplate(preset.name, preset.days.length);
      if (!created) return;

      // 3. Fetch full detail to get day IDs
      const detail = await authFetch(`/api/user/templates/${created.id}`);

      // 4. Populate exercises per day sequentially
      for (let i = 0; i < resolvedDays.length; i++) {
        const dayId = detail.days[i].id;
        for (const ex of resolvedDays[i].exercises) {
          await authFetch(`/api/user/templates/${created.id}/days/${dayId}/exercises`, {
            method: 'POST',
            body: JSON.stringify({ exerciseId: ex.exerciseId, sets: ex.sets, reps: ex.reps }),
          });
        }
      }

      navigate(`/plans/${created.id}`);
    } catch {
      setImportError('Failed to import template. Please try again.');
    } finally {
      setImportingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <Box sx={{ px: { xs: '16px', sm: '32px', lg: '48px' }, py: { xs: '40px', lg: '60px' }, minHeight: 'calc(100vh - 160px)' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <Stack direction="row" alignItems="flex-end" justifyContent="space-between" mb="8px">
            <Typography
              sx={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: { lg: '64px', xs: '42px' },
                letterSpacing: '0.04em',
                color: 'text.primary',
                lineHeight: 1,
              }}
            >
              Workout{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Plans
              </Box>
            </Typography>
            {/* Full button on sm+, icon-only on mobile */}
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setDialogOpen(true)}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 700,
                fontSize: '14px',
                px: '24px',
                py: '10px',
                mb: '6px',
              }}
            >
              New Plan
            </Button>
            <IconButton
              onClick={() => setDialogOpen(true)}
              sx={{
                display: { xs: 'flex', sm: 'none' },
                mb: '6px',
                background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
                color: '#fff',
                width: 40,
                height: 40,
                '&:hover': {
                  background: 'linear-gradient(135deg, #CC1E1D 0%, #e55d2a 100%)',
                },
              }}
            >
              <Add sx={{ fontSize: '22px' }} />
            </IconButton>
          </Stack>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '15px',
              color: 'text.secondary',
              mb: { xs: '48px', lg: '64px' },
            }}
          >
            Design your weekly training programs with structured days and exercises.
          </Typography>
        </motion.div>

        {/* Starter Templates section */}
        <Box mb={{ xs: '64px', lg: '80px' }}>
          {importError && (
            <Alert severity="error" onClose={() => setImportError('')} sx={{ mb: '20px', borderRadius: '10px', fontFamily: '"DM Sans", sans-serif', fontSize: '13px' }}>
              {importError}
            </Alert>
          )}
          <Stack direction="row" alignItems="center" gap="12px" mb="8px">
            <Box sx={{ width: '4px', height: '28px', borderRadius: '2px', background: 'linear-gradient(180deg, #FF2625 0%, #FF6B35 100%)' }} />
            <Typography
              sx={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: { xs: '28px', lg: '36px' },
                letterSpacing: '0.04em',
                color: 'text.primary',
                lineHeight: 1,
              }}
            >
              Starter Templates
            </Typography>
          </Stack>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px',
              color: 'text.secondary',
              mb: '32px',
            }}
          >
            Pick a proven split and add it to your plans in one click.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { lg: 'repeat(4, 1fr)', sm: 'repeat(2, 1fr)', xs: '1fr' },
              gap: '20px',
            }}
          >
            {PRESET_TEMPLATES.map((preset) => (
              <PresetTemplateCard
                key={preset.id}
                preset={preset}
                onPreview={() => setPreviewPreset(preset)}
                onAdd={() => handleImportPreset(preset)}
                importing={importingId === preset.id}
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ mb: { xs: '48px', lg: '64px' } }} />

        {/* Your Plans section */}
        <Stack direction="row" alignItems="center" gap="12px" mb="8px">
          <Box sx={{ width: '4px', height: '28px', borderRadius: '2px', background: 'linear-gradient(180deg, #FF2625 0%, #FF6B35 100%)' }} />
          <Typography
            sx={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: { xs: '28px', lg: '36px' },
              letterSpacing: '0.04em',
              color: 'text.primary',
              lineHeight: 1,
            }}
          >
            Your Plans
          </Typography>
        </Stack>

        {/* Template cards */}
        {templates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                py: '80px',
                border: `1.5px dashed ${theme.palette.divider}`,
                borderRadius: '16px',
                gap: '16px',
                mt: '24px',
              }}
            >
              <Box
                sx={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '18px',
                  background: theme.palette.mode === 'dark' ? 'rgba(255,38,37,0.08)' : 'rgba(255,38,37,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FitnessCenter sx={{ fontSize: '32px', color: 'primary.main', opacity: 0.5 }} />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '18px', color: 'text.primary', mb: '8px' }}>
                  No plans yet
                </Typography>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: 'text.secondary', maxWidth: '280px' }}>
                  Create your first workout plan or use a starter template above.
                </Typography>
              </Box>
            </Stack>
          </motion.div>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { lg: 'repeat(3, 1fr)', sm: 'repeat(2, 1fr)', xs: '1fr' },
              gap: '20px',
              mt: '24px',
            }}
          >
            <AnimatePresence>
              {templates.map((template, i) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  <Box
                    onClick={() => navigate(`/plans/${template.id}`)}
                    sx={{
                      backgroundColor: 'background.paper',
                      borderRadius: '14px',
                      border: `1px solid ${theme.palette.divider}`,
                      p: '24px',
                      cursor: 'pointer',
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
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        {editingId === template.id ? (
                          <input
                            autoFocus
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onBlur={() => handleRenameSubmit(template.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRenameSubmit(template.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              border: 'none',
                              outline: 'none',
                              background: 'transparent',
                              fontFamily: '"Bebas Neue", sans-serif',
                              fontSize: '24px',
                              letterSpacing: '0.03em',
                              color: theme.palette.text.primary,
                              width: '100%',
                              borderBottom: `2px solid ${theme.palette.primary.main}`,
                              paddingBottom: '2px',
                            }}
                          />
                        ) : (
                          <Typography
                            sx={{
                              fontFamily: '"Bebas Neue", sans-serif',
                              fontSize: '24px',
                              letterSpacing: '0.03em',
                              color: 'text.primary',
                              lineHeight: 1.1,
                              mb: '12px',
                            }}
                          >
                            {template.name}
                          </Typography>
                        )}

                        <Stack direction="row" alignItems="center" gap="16px">
                          <Stack direction="row" alignItems="center" gap="6px">
                            <CalendarMonth sx={{ fontSize: '15px', color: 'primary.main' }} />
                            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', fontWeight: 600, color: 'text.secondary' }}>
                              {template.dayCount} {template.dayCount === 1 ? 'day' : 'days'}/week
                            </Typography>
                          </Stack>
                          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: 'text.secondary', opacity: 0.7 }}>
                            Updated {formatDate(template.updatedAt)}
                          </Typography>
                        </Stack>
                      </Box>

                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, template)}
                        sx={{ color: 'text.secondary', ml: '8px', '&:hover': { color: 'primary.main' } }}
                      >
                        <MoreVert sx={{ fontSize: '18px' }} />
                      </IconButton>
                    </Stack>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        )}
      </Box>

      {/* Context menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: '10px',
            backgroundColor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            minWidth: '160px',
          },
        }}
      >
        <MenuItem onClick={handleRenameStart} sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px' }}>
          <ListItemIcon><Edit sx={{ fontSize: '16px' }} /></ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: 'error.main' }}>
          <ListItemIcon><Delete sx={{ fontSize: '16px', color: 'error.main' }} /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <CreateTemplateDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onCreate={createTemplate}
      />

      <PresetPreviewDialog
        preset={previewPreset}
        open={Boolean(previewPreset)}
        onClose={() => setPreviewPreset(null)}
        onAdd={() => previewPreset && handleImportPreset(previewPreset)}
        importing={importingId === previewPreset?.id}
      />
    </motion.div>
  );
}
