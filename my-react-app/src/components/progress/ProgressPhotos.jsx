import { useState, useRef, useMemo, useCallback } from 'react';
import {
  Box, Stack, Typography, Button, TextField, IconButton, Collapse,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip,
} from '@mui/material';
import {
  AddAPhoto, Close, DeleteOutline, Scale, CalendarMonth,
  ChevronLeft, ChevronRight, Collections, ExpandMore, ExpandLess,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressPhotos } from '../../utils/useProgressPhotos';
import { useBodyweight } from '../../utils/useBodyweight';

// Get URL from a photo item (supports both string and { id, url } shapes)
const photoUrl = (p) => (typeof p === 'string' ? p : p?.url ?? '');
const photoId = (p) => (typeof p === 'string' ? null : p?.id);

// Find the best weight entry for a photo date:
// 1. Exact match on the same date
// 2. Otherwise, the most recent weight entry on or before that date
// 3. If none before, use the earliest entry after that date
function findWeightForDate(entries, dateStr) {
  if (!entries.length) return null;
  const target = new Date(dateStr).getTime();
  let best = null;
  let bestDiff = Infinity;
  for (const e of entries) {
    const d = new Date(e.date).getTime();
    if (d === target) return e; // exact match
    if (d <= target) {
      const diff = target - d;
      if (!best || diff < bestDiff) { best = e; bestDiff = diff; }
    }
  }
  // If no entry on or before, fall back to the closest entry after
  if (!best) {
    for (const e of entries) {
      const diff = new Date(e.date).getTime() - target;
      if (diff > 0 && diff < bestDiff) { best = e; bestDiff = diff; }
    }
  }
  return best;
}

// ─── Upload Dialog ───────────────────────────────────────────────────────────

function UploadDialog({ open, onClose }) {
  const theme = useTheme();
  const { addEntry } = useProgressPhotos();
  const fileRef = useRef(null);
  const [files, setFiles] = useState([]);       // actual File objects
  const [previews, setPreviews] = useState([]);  // data URLs for display
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files || []);
    if (!newFiles.length) return;
    setFiles((prev) => [...prev, ...newFiles]);
    const readers = newFiles.map((file) => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    }));
    Promise.all(readers).then((results) => setPreviews((prev) => [...prev, ...results]));
  };

  const removePreview = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!files.length || !date) return;
    setUploading(true);
    try {
      await addEntry(files, date, caption.trim());
      setFiles([]);
      setPreviews([]);
      setCaption('');
      setDate(new Date().toISOString().slice(0, 10));
      onClose();
    } catch { /* ignore */ }
    setUploading(false);
  };

  const handleClose = () => {
    setFiles([]);
    setPreviews([]);
    setCaption('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundColor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <DialogTitle sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '26px', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        New Progress Entry
        <IconButton onClick={handleClose} size="small" sx={{ color: 'text.secondary' }}>
          <Close sx={{ fontSize: '20px' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: '8px !important' }}>
        <Stack gap="20px">
          {/* Photo previews */}
          <input ref={fileRef} type="file" accept="image/*" multiple capture="environment" hidden onChange={handleFiles} />

          {previews.length > 0 && (
            <Box sx={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {previews.map((src, i) => (
                <Box key={i} sx={{ position: 'relative', width: { xs: '64px', sm: '80px' }, height: { xs: '64px', sm: '80px' }, borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                  <Box component="img" src={src} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <IconButton
                    onClick={() => removePreview(i)}
                    size="small"
                    sx={{
                      position: 'absolute', top: 2, right: 2, p: '2px',
                      backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff',
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' },
                    }}
                  >
                    <Close sx={{ fontSize: '12px' }} />
                  </IconButton>
                </Box>
              ))}
              {/* Add more button */}
              <Box
                onClick={() => fileRef.current?.click()}
                sx={{
                  width: { xs: '64px', sm: '80px' }, height: { xs: '64px', sm: '80px' }, borderRadius: '10px',
                  border: `2px dashed ${theme.palette.divider}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                  transition: 'border-color 0.2s',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                <AddAPhoto sx={{ fontSize: '20px', color: 'text.secondary' }} />
              </Box>
            </Box>
          )}

          {previews.length === 0 && (
            <Box
              onClick={() => fileRef.current?.click()}
              sx={{
                border: `2px dashed ${theme.palette.divider}`,
                borderRadius: '12px',
                py: '48px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              <AddAPhoto sx={{ fontSize: '36px', color: 'text.secondary', mb: '8px' }} />
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: 'text.secondary' }}>
                Tap to select one or more photos
              </Typography>
            </Box>
          )}

          {/* Date */}
          <TextField
            label="Date"
            type="date"
            size="small"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: '"DM Sans", sans-serif', fontSize: '14px' },
              '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif', fontSize: '14px' },
            }}
          />

          {/* Caption */}
          <TextField
            label="Caption (optional)"
            size="small"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            multiline
            maxRows={3}
            placeholder="e.g. Feeling strong after leg day"
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: '"DM Sans", sans-serif', fontSize: '14px' },
              '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif', fontSize: '14px' },
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: '24px', pb: '20px', gap: '8px' }}>
        <Button
          onClick={handleClose}
          sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '13px', color: 'text.secondary', borderRadius: '8px' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!files.length || !date || uploading}
          sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '13px', borderRadius: '8px', px: '24px' }}
        >
          {uploading ? 'Uploading...' : 'Save Entry'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Entry View Dialog (Instagram-style carousel) ────────────────────────────

function EntryViewDialog({ entry, open, onClose, onDelete, onRemovePhoto, weightEntry, unit, convert, demoMode = false }) {
  const theme = useTheme();
  const [photoIdx, setPhotoIdx] = useState(0);
  const [showWeight, setShowWeight] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Touch swipe support
  const touchStartX = useRef(null);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || !entry) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setPhotoIdx((i) => Math.min(entry.photos.length - 1, i + 1));
      else setPhotoIdx((i) => Math.max(0, i - 1));
    }
    touchStartX.current = null;
  };

  // Reset index when entry changes
  const entryId = entry?.id;
  const safeIdx = entry ? Math.min(photoIdx, entry.photos.length - 1) : 0;

  const goLeft = useCallback((e) => {
    e.stopPropagation();
    setPhotoIdx((i) => Math.max(0, i - 1));
  }, []);
  const goRight = useCallback((e) => {
    e.stopPropagation();
    if (entry) setPhotoIdx((i) => Math.min(entry.photos.length - 1, i + 1));
  }, [entry]);

  if (!entry) return null;

  const formatted = new Date(entry.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const total = entry.photos.length;

  return (
    <Dialog
      open={open}
      onClose={() => { onClose(); setPhotoIdx(0); setShowWeight(false); }}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: '12px', sm: '16px' },
          backgroundColor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
          m: { xs: '12px', sm: '32px' },
          maxHeight: { xs: 'calc(100vh - 24px)', sm: 'calc(100vh - 64px)' },
        },
      }}
    >
      {/* Carousel */}
      <Box
        sx={{ position: 'relative', backgroundColor: '#000' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={`${entryId}-${safeIdx}`}
            src={photoUrl(entry.photos[safeIdx])}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', maxHeight: '55vh', objectFit: 'contain', display: 'block' }}
          />
        </AnimatePresence>

        {/* Close */}
        <IconButton
          onClick={() => { onClose(); setPhotoIdx(0); setShowWeight(false); }}
          size="small"
          sx={{
            position: 'absolute', top: 8, right: 8,
            backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' },
          }}
        >
          <Close sx={{ fontSize: '18px' }} />
        </IconButton>

        {/* Nav arrows — hidden on mobile (use swipe) */}
        {total > 1 && safeIdx > 0 && (
          <IconButton
            onClick={goLeft}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
              width: 36, height: 36,
            }}
          >
            <ChevronLeft sx={{ fontSize: '22px' }} />
          </IconButton>
        )}
        {total > 1 && safeIdx < total - 1 && (
          <IconButton
            onClick={goRight}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
              width: 36, height: 36,
            }}
          >
            <ChevronRight sx={{ fontSize: '22px' }} />
          </IconButton>
        )}

        {/* Dot indicators */}
        {total > 1 && (
          <Stack
            direction="row"
            gap="5px"
            sx={{
              position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: '12px', px: '8px', py: '4px',
              maxWidth: '80%', flexWrap: 'wrap', justifyContent: 'center',
            }}
          >
            {entry.photos.map((_, i) => (
              <Box
                key={i}
                onClick={(e) => { e.stopPropagation(); setPhotoIdx(i); }}
                sx={{
                  width: i === safeIdx ? '16px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: i === safeIdx ? '#fff' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              />
            ))}
          </Stack>
        )}

        {/* Photo counter */}
        {total > 1 && (
          <Chip
            size="small"
            label={`${safeIdx + 1} / ${total}`}
            sx={{
              position: 'absolute', top: 8, left: 8,
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 600,
              fontSize: '11px',
              height: '24px',
            }}
          />
        )}

        {/* Weight badge overlay */}
        <AnimatePresence>
          {showWeight && weightEntry && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              style={{ position: 'absolute', bottom: total > 1 ? 40 : 10, left: 10 }}
            >
              <Chip
                icon={<Scale sx={{ fontSize: '14px' }} />}
                label={`${convert(weightEntry.weight)} ${unit}`}
                sx={{
                  background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
                  color: '#fff',
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: '13px',
                  height: '32px',
                  '& .MuiChip-icon': { color: '#fff' },
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Info */}
      <Box sx={{ p: { xs: '14px 16px', sm: '20px 24px' } }}>
        <Stack direction="row" alignItems="center" gap="6px" flexWrap="wrap" mb={entry.caption ? '8px' : '0'}>
          <CalendarMonth sx={{ fontSize: '14px', color: 'primary.main' }} />
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: { xs: '13px', sm: '14px' }, fontWeight: 600, color: 'text.primary' }}>
            {formatted}
          </Typography>
          {total > 1 && (
            <Chip
              size="small"
              icon={<Collections sx={{ fontSize: '12px' }} />}
              label={`${total} photos`}
              sx={{
                height: '20px', fontFamily: '"DM Sans", sans-serif', fontSize: '10px', fontWeight: 600,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                '& .MuiChip-icon': { color: 'text.secondary' },
              }}
            />
          )}
        </Stack>

        {entry.caption && (
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: { xs: '13px', sm: '14px' }, color: 'text.secondary', fontStyle: 'italic', mb: '12px' }}>
            &ldquo;{entry.caption}&rdquo;
          </Typography>
        )}

        <Stack direction="row" gap="6px" flexWrap="wrap">
          {weightEntry && (
            <Button
              onClick={() => setShowWeight((o) => !o)}
              variant={showWeight ? 'contained' : 'outlined'}
              size="small"
              startIcon={<Scale sx={{ fontSize: '13px' }} />}
              sx={{
                fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: { xs: '11px', sm: '12px' },
                borderRadius: '8px', textTransform: 'none', px: { xs: '10px', sm: '12px' },
                ...(showWeight ? {} : {
                  borderColor: theme.palette.divider,
                  color: 'text.secondary',
                  '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                }),
              }}
            >
              {showWeight ? `${convert(weightEntry.weight)} ${unit}` : 'Show Weight'}
            </Button>
          )}

          {/* Delete single photo */}
          {!demoMode && total > 1 && (
            <Button
              onClick={() => { const pid = photoId(entry.photos[safeIdx]); if (pid) onRemovePhoto(entry.id, pid); if (safeIdx >= total - 1) setPhotoIdx(Math.max(0, safeIdx - 1)); }}
              variant="outlined"
              size="small"
              sx={{
                fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: { xs: '11px', sm: '12px' },
                borderRadius: '8px', textTransform: 'none', px: { xs: '10px', sm: '12px' },
                borderColor: theme.palette.divider, color: 'text.secondary',
                '&:hover': { borderColor: 'error.main', color: 'error.main' },
              }}
            >
              Remove Photo
            </Button>
          )}

          {!demoMode && (
            <Button
              onClick={() => setConfirmDelete(true)}
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteOutline sx={{ fontSize: { xs: '13px', sm: '14px' } }} />}
              sx={{
                fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: { xs: '11px', sm: '12px' },
                borderRadius: '8px', textTransform: 'none', ml: 'auto', px: { xs: '10px', sm: '12px' },
              }}
            >
              Delete
            </Button>
          )}
        </Stack>
      </Box>

      {/* Delete confirmation */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        PaperProps={{ sx: { borderRadius: '14px', backgroundColor: 'background.paper', border: `1px solid ${theme.palette.divider}`, maxWidth: '340px', m: '16px' } }}
      >
        <DialogTitle sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '22px', letterSpacing: '0.04em', pb: '4px' }}>
          Delete Entry?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: 'text.secondary' }}>
            This will permanently remove all {total} photo{total > 1 ? 's' : ''} from this entry.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: '20px', pb: '16px', gap: '8px' }}>
          <Button onClick={() => setConfirmDelete(false)} sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '13px', color: 'text.secondary', borderRadius: '8px' }}>
            Cancel
          </Button>
          <Button
            onClick={() => { onDelete(entry.id); setConfirmDelete(false); onClose(); setPhotoIdx(0); }}
            variant="contained"
            color="error"
            sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '13px', borderRadius: '8px', px: '20px', backgroundColor: '#d32f2f', '&:hover': { backgroundColor: '#b71c1c' } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}

// ─── Entry Card (thumbnail with multi-photo indicator) ───────────────────────

function EntryCard({ entry, weightEntry, onClick, unit, convert }) {
  const theme = useTheme();
  const formatted = new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const total = entry.photos.length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        onClick={onClick}
        sx={{
          borderRadius: { xs: '10px', sm: '12px' },
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
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
        {/* Thumbnail */}
        <Box sx={{ position: 'relative', paddingTop: '120%', overflow: 'hidden' }}>
          <Box
            component="img"
            src={photoUrl(entry.photos[0])}
            sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Multi-photo badge */}
          {total > 1 && (
            <Chip
              size="small"
              icon={<Collections sx={{ fontSize: { xs: '11px', sm: '13px' } }} />}
              label={total}
              sx={{
                position: 'absolute', top: { xs: 6, sm: 8 }, left: { xs: 6, sm: 8 },
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(4px)',
                color: '#fff',
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 700,
                fontSize: { xs: '10px', sm: '11px' },
                height: { xs: '20px', sm: '24px' },
                '& .MuiChip-icon': { color: '#fff' },
              }}
            />
          )}

          {/* Weight chip */}
          {weightEntry && (
            <Chip
              size="small"
              label={`${convert(weightEntry.weight)} ${unit}`}
              sx={{
                position: 'absolute', top: { xs: 6, sm: 8 }, right: { xs: 6, sm: 8 },
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(4px)',
                color: '#fff',
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 600,
                fontSize: { xs: '10px', sm: '11px' },
                height: { xs: '20px', sm: '24px' },
              }}
            />
          )}
        </Box>

        {/* Info */}
        <Box sx={{ p: { xs: '8px 10px', sm: '10px 12px' }, backgroundColor: 'background.paper' }}>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: { xs: '11px', sm: '12px' }, fontWeight: 600, color: 'text.primary' }}>
            {formatted}
          </Typography>
          {entry.caption && (
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: { xs: '10px', sm: '11px' },
                color: 'text.secondary',
                fontStyle: 'italic',
                mt: '2px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {entry.caption}
            </Typography>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}

// ─── Collapsible Month Group ─────────────────────────────────────────────────

function MonthGroup({ monthKey, monthLabel, monthEntries, currentMonthKey, weightEntries, onView, unit, convert }) {
  const theme = useTheme();
  const [open, setOpen] = useState(monthKey === currentMonthKey);
  const photoCount = monthEntries.reduce((s, e) => s + e.photos.length, 0);

  return (
    <Box sx={{ mb: '4px' }}>
      <Stack
        direction="row"
        alignItems="center"
        onClick={() => setOpen((o) => !o)}
        sx={{
          cursor: 'pointer',
          py: '8px',
          px: { xs: '6px', sm: '12px' },
          borderRadius: '8px',
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
          },
        }}
      >
        <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: '16px', sm: '18px' }, letterSpacing: '0.04em', color: 'text.primary', lineHeight: 1, flex: 1 }}>
          {monthLabel}
        </Typography>
        <Stack direction="row" alignItems="center" gap={{ xs: '8px', sm: '12px' }}>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: { xs: '10px', sm: '11px' }, color: 'text.secondary' }}>
            {monthEntries.length} {monthEntries.length === 1 ? 'entry' : 'entries'}
          </Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: { xs: '11px', sm: '12px' }, fontWeight: 600, color: 'primary.main' }}>
            {photoCount} photos
          </Typography>
          {open ? <ExpandLess sx={{ fontSize: '16px', color: 'text.secondary' }} /> : <ExpandMore sx={{ fontSize: '16px', color: 'text.secondary' }} />}
        </Stack>
      </Stack>

      <Collapse in={open}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
            gap: { xs: '8px', sm: '14px' },
            pl: { xs: '4px', sm: '16px' },
            pt: '8px',
            pb: '12px',
          }}
        >
          <AnimatePresence>
            {monthEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                weightEntry={findWeightForDate(weightEntries, entry.date)}
                onClick={() => onView(entry)}
                unit={unit}
                convert={convert}
              />
            ))}
          </AnimatePresence>
        </Box>
      </Collapse>
    </Box>
  );
}

// ─── Collapsible Year Group ──────────────────────────────────────────────────

function YearGroup({ year, months, defaultOpen, currentMonthKey, weightEntries, onView, unit, convert }) {
  const theme = useTheme();
  const [open, setOpen] = useState(defaultOpen);
  const totalEntries = months.reduce((s, m) => s + m.entries.length, 0);

  return (
    <Box sx={{ mb: '8px' }}>
      <Stack
        direction="row"
        alignItems="center"
        onClick={() => setOpen((o) => !o)}
        sx={{
          cursor: 'pointer',
          py: { xs: '10px', sm: '12px' },
          px: { xs: '4px', sm: '8px' },
          borderRadius: '10px',
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
          },
        }}
      >
        <Stack direction="row" alignItems="center" gap={{ xs: '8px', sm: '10px' }} flex={1}>
          <Box sx={{ width: '3px', height: '20px', borderRadius: '2px', background: 'linear-gradient(180deg, #FF2625 0%, #FF6B35 100%)' }} />
          <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: '22px', sm: '24px' }, letterSpacing: '0.04em', color: 'text.primary', lineHeight: 1 }}>
            {year}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" gap={{ xs: '8px', sm: '12px' }}>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: { xs: '11px', sm: '12px' }, color: 'text.secondary' }}>
            {totalEntries} {totalEntries === 1 ? 'entry' : 'entries'}
          </Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: { xs: '11px', sm: '12px' }, color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
            {months.length} {months.length === 1 ? 'month' : 'months'}
          </Typography>
          {open
            ? <ExpandLess sx={{ fontSize: '20px', color: 'text.secondary' }} />
            : <ExpandMore sx={{ fontSize: '20px', color: 'text.secondary' }} />
          }
        </Stack>
      </Stack>

      <Collapse in={open}>
        <Box sx={{ pl: { xs: '8px', sm: '16px' } }}>
          {months.map((group) => (
            <MonthGroup
              key={group.key}
              monthKey={group.key}
              monthLabel={group.monthName}
              monthEntries={group.entries}
              currentMonthKey={currentMonthKey}
              weightEntries={weightEntries}
              onView={onView}
              unit={unit}
              convert={convert}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}

// ─── Main Section ────────────────────────────────────────────────────────────

export default function ProgressPhotos({ unit = 'lbs', convert = (v) => v, demoMode = false, demoEntries, demoWeightEntries }) {
  const theme = useTheme();
  const store = useProgressPhotos();
  const weightStore = useBodyweight();
  const entries = demoMode ? (demoEntries || []) : store.entries;
  const deleteEntry = demoMode ? () => {} : store.deleteEntry;
  const removePhoto = demoMode ? () => {} : store.removePhoto;
  const weightEntries = demoMode ? (demoWeightEntries || []) : weightStore.entries;
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewEntry, setViewEntry] = useState(null);

  // Current year-month key for auto-expanding
  const now = new Date();
  const currentYearStr = String(now.getFullYear());
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Group entries by year → month (descending)
  const yearGroups = useMemo(() => {
    const years = {};
    for (const entry of entries) {
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
        months: Object.values(years[year]).sort((a, b) => b.key.localeCompare(a.key)),
      }));
  }, [entries]);

  const totalPhotos = entries.reduce((s, e) => s + e.photos.length, 0);
  const viewWeightEntry = viewEntry ? findWeightForDate(weightEntries, viewEntry.date) : null;

  // Keep viewEntry in sync with store (e.g. after removing a photo)
  const syncedViewEntry = viewEntry ? entries.find((e) => e.id === viewEntry.id) || null : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
    >
      <Box
        sx={{
          borderRadius: { xs: '12px', sm: '16px' },
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: 'background.paper',
          p: { xs: '14px', sm: '28px' },
          mb: '40px',
        }}
      >
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap="8px" mb="20px">
          <Stack direction="row" alignItems="center" gap={{ xs: '8px', sm: '12px' }} sx={{ minWidth: 0, flex: 1 }}>
            <Box sx={{ width: '4px', height: '24px', borderRadius: '2px', background: 'linear-gradient(180deg, #FF2625 0%, #FF6B35 100%)', flexShrink: 0 }} />
            <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: '20px', sm: '26px' }, letterSpacing: '0.04em', color: 'text.primary', lineHeight: 1, whiteSpace: 'nowrap' }}>
              Progress Photos
            </Typography>
            {entries.length > 0 && (
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: { xs: '10px', sm: '12px' }, color: 'text.secondary', whiteSpace: 'nowrap', display: { xs: 'none', sm: 'block' } }}>
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'} &middot; {totalPhotos} photos
              </Typography>
            )}
          </Stack>
          {!demoMode && (
            <Button
              variant="contained"
              startIcon={<AddAPhoto sx={{ fontSize: '16px' }} />}
              onClick={() => setUploadOpen(true)}
              sx={{
                fontFamily: '"DM Sans", sans-serif', fontWeight: 700,
                fontSize: { xs: '12px', sm: '13px' },
                px: { xs: '14px', sm: '20px' }, py: '8px', borderRadius: '10px',
                flexShrink: 0,
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>New Entry</Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Add</Box>
            </Button>
          )}
        </Stack>

        {/* Gallery */}
        {entries.length === 0 ? (
          <Box
            onClick={() => setUploadOpen(true)}
            sx={{
              border: `2px dashed ${theme.palette.divider}`,
              borderRadius: '12px',
              py: '52px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
              '&:hover': { borderColor: 'primary.main' },
            }}
          >
            <AddAPhoto sx={{ fontSize: '32px', color: 'text.secondary', opacity: 0.4, mb: '8px' }} />
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: 'text.secondary' }}>
              Upload your first progress photos
            </Typography>
          </Box>
        ) : (
          yearGroups.map((yg, i) => (
            <YearGroup
              key={yg.year}
              year={yg.year}
              months={yg.months}
              defaultOpen={yg.year === currentYearStr}
              currentMonthKey={currentMonthKey}
              weightEntries={weightEntries}
              onView={setViewEntry}
              unit={unit}
              convert={convert}
            />
          ))
        )}
      </Box>

      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />

      <EntryViewDialog
        entry={syncedViewEntry}
        open={Boolean(syncedViewEntry)}
        onClose={() => setViewEntry(null)}
        onDelete={deleteEntry}
        onRemovePhoto={removePhoto}
        weightEntry={viewWeightEntry}
        unit={unit}
        convert={convert}
        demoMode={demoMode}
      />
    </motion.div>
  );
}
