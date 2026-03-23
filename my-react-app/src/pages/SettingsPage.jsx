import { useState, useRef } from 'react';
import {
  Box, Stack, Typography, TextField, Button, Avatar, IconButton,
  Select, MenuItem, FormControl, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Alert,
} from '@mui/material';
import {
  Person, Lock, WarningAmber, Palette, BarChart,
  CameraAlt, LightMode, DarkMode, Check,
  FavoriteOutlined, FitnessCenterOutlined, HistoryOutlined, CalendarMonthOutlined,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import { useThemeMode } from '../utils/useThemeMode';
import { useFavorites } from '../utils/useFavorites';
import { useRecentlyViewed } from '../utils/useRecentlyViewed';
import { useTemplates } from '../utils/useTemplates';
import { authFetch, authUpload } from '../utils/api';

// ─── Sidebar config ───────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 'overview',   label: 'Overview',    icon: BarChart },
  { id: 'profile',    label: 'Profile',     icon: Person },
  { id: 'appearance', label: 'Appearance',  icon: Palette },
  { id: 'security',   label: 'Security',    icon: Lock },
  { id: 'danger',     label: 'Danger Zone', icon: WarningAmber },
];

// ─── Shared ───────────────────────────────────────────────────────────────────

const SectionHeader = ({ label }) => (
  <Stack direction="row" alignItems="center" gap="12px" mb="28px">
    <Box sx={{ width: '4px', height: '28px', borderRadius: '2px', background: 'linear-gradient(180deg, #FF2625 0%, #FF6B35 100%)', flexShrink: 0 }} />
    <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: '24px', sm: '28px' }, letterSpacing: '0.04em', color: 'text.primary', lineHeight: 1 }}>
      {label}
    </Typography>
  </Stack>
);

const fieldSx = {
  '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: '"DM Sans", sans-serif', fontSize: '14px' },
  '& .MuiInputLabel-root': { fontFamily: '"DM Sans", sans-serif', fontSize: '14px' },
};

const SaveButton = ({ children = 'Save Changes', loading = false, ...props }) => (
  <Button
    variant="contained"
    disabled={loading}
    sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '14px', px: '28px', py: '9px', borderRadius: '10px' }}
    {...props}
  >
    {loading ? <CircularProgress size={20} color="inherit" /> : children}
  </Button>
);

// ─── Section: Overview ───────────────────────────────────────────────────────

function OverviewSection({ user }) {
  const theme = useTheme();
  const { favorites } = useFavorites();
  const { recentlyViewed } = useRecentlyViewed();
  const { templates } = useTemplates();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'N/A';

  const stats = [
    { icon: FavoriteOutlined,      label: 'Saved Exercises',  value: favorites.length,      color: '#FF2625' },
    { icon: FitnessCenterOutlined, label: 'Workout Plans',    value: templates.length,      color: '#FF6B35' },
    { icon: HistoryOutlined,       label: 'Recently Viewed',  value: recentlyViewed.length, color: '#e55d2a' },
  ];

  return (
    <Box>
      <SectionHeader label="Overview" />

      {/* Member since banner */}
      <Box
        sx={{
          borderRadius: '12px',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(255,38,37,0.1) 0%, rgba(255,107,53,0.06) 100%)'
            : 'linear-gradient(135deg, rgba(255,38,37,0.07) 0%, rgba(255,107,53,0.04) 100%)',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,38,37,0.15)' : 'rgba(255,38,37,0.12)'}`,
          p: { xs: '16px', sm: '20px 24px' },
          mb: '24px',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: 'linear-gradient(135deg, #FF2625, #FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <CalendarMonthOutlined sx={{ fontSize: '20px', color: '#fff' }} />
        </Box>
        <Box>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: 'text.secondary', mb: '2px' }}>
            Member since
          </Typography>
          <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '20px', letterSpacing: '0.04em', color: 'text.primary', lineHeight: 1 }}>
            {memberSince}
          </Typography>
        </Box>
        <Box sx={{ ml: { xs: 0, sm: 'auto' }, textAlign: { xs: 'left', sm: 'right' } }}>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: 'text.secondary', mb: '2px' }}>
            Username
          </Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', fontWeight: 700, color: 'primary.main' }}>
            @{user?.username ?? '—'}
          </Typography>
        </Box>
      </Box>

      {/* Stat cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(3, 1fr)' }, gap: { xs: '10px', sm: '16px' } }}>
        {stats.map(({ icon: Icon, label, value, color }) => (
          <Box
            key={label}
            sx={{
              borderRadius: '12px',
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
              p: { xs: '14px 8px', sm: '20px' },
              textAlign: 'center',
            }}
          >
            <Box sx={{ width: 36, height: 36, borderRadius: '8px', backgroundColor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: '12px' }}>
              <Icon sx={{ fontSize: '18px', color }} />
            </Box>
            <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: '28px', sm: '32px' }, letterSpacing: '0.02em', color: 'text.primary', lineHeight: 1, mb: '4px' }}>
              {value}
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: { xs: '11px', sm: '12px' }, color: 'text.secondary', lineHeight: 1.3 }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ─── Section: Profile ────────────────────────────────────────────────────────

function ProfileSection({ user, onUserUpdated }) {
  const theme = useTheme();
  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [avatarSrc, setAvatarSrc] = useState(user?.avatarUrl ?? null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const initials = (user?.username ?? 'U').slice(0, 2).toUpperCase();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarSrc(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      // Upload avatar if changed
      if (avatarFile) {
        const fd = new FormData();
        fd.append('file', avatarFile);
        await authUpload('/api/users/me/avatar', fd);
        setAvatarFile(null);
      }

      // Update profile fields
      const body = {};
      if (username !== user?.username) body.username = username;
      if (email !== user?.email) body.email = email;

      if (Object.keys(body).length > 0) {
        await authFetch('/api/users/me', {
          method: 'PUT',
          body: JSON.stringify(body),
        });
      }

      // Refresh user data
      const updated = await authFetch('/api/users/me');
      onUserUpdated(updated);
      setSuccess('Profile updated');
    } catch (err) {
      setError(err.message === '409' ? 'Username or email already taken' : 'Failed to update profile');
    }
    setSaving(false);
  };

  return (
    <Box>
      <SectionHeader label="Profile" />

      <Stack alignItems="center" mb="36px">
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
            src={avatarSrc}
            sx={{
              width: 88, height: 88,
              fontSize: '28px', fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.04em',
              background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
              color: '#fff',
              border: `3px solid ${theme.palette.divider}`,
            }}
          >
            {!avatarSrc && initials}
          </Avatar>
          <IconButton
            onClick={() => fileRef.current?.click()}
            size="small"
            sx={{
              position: 'absolute', bottom: 0, right: 0, width: 28, height: 28,
              backgroundColor: 'background.paper',
              border: `1.5px solid ${theme.palette.divider}`,
              '&:hover': { backgroundColor: 'rgba(255,38,37,0.08)', borderColor: 'primary.main' },
            }}
          >
            <CameraAlt sx={{ fontSize: '14px', color: 'text.secondary' }} />
          </IconButton>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
        </Box>
        <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: 'text.secondary', mt: '10px' }}>
          Click the camera icon to update your photo
        </Typography>
      </Stack>

      <Stack gap="20px">
        {error && <Alert severity="error" sx={{ borderRadius: '10px' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ borderRadius: '10px' }}>{success}</Alert>}
        <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth size="small" sx={fieldSx} />
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth size="small" type="email" sx={fieldSx} />
        <Box><SaveButton loading={saving} onClick={handleSave} /></Box>
      </Stack>
    </Box>
  );
}

// ─── Section: Appearance ─────────────────────────────────────────────────────

function AppearanceSection() {
  const { mode, setMode } = useThemeMode();
  const theme = useTheme();

  const handleSetMode = (value) => {
    setMode(value);
    // Background sync to backend (fire and forget)
    authFetch('/api/users/me/preferences', {
      method: 'PUT',
      body: JSON.stringify({ theme: value }),
    }).catch(() => {});
  };

  const ThemeCard = ({ value, label }) => {
    const selected = mode === value;
    const isDark = value === 'dark';
    return (
      <Box
        onClick={() => handleSetMode(value)}
        sx={{
          flex: 1, borderRadius: '14px',
          border: `2px solid ${selected ? '#FF2625' : theme.palette.divider}`,
          overflow: 'hidden', cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: selected ? '0 0 0 3px rgba(255,38,37,0.15)' : 'none',
          '&:hover': { borderColor: selected ? '#FF2625' : 'rgba(255,38,37,0.4)' },
        }}
      >
        <Box sx={{ backgroundColor: isDark ? '#0A0A0A' : '#F5F5F5', p: '14px', height: '100px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mb: '10px' }}>
            <Box sx={{ width: 16, height: 16, borderRadius: '50%', background: 'linear-gradient(135deg, #FF2625, #FF6B35)' }} />
            <Box sx={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: isDark ? '#222' : '#DDD' }} />
            <Box sx={{ width: 24, height: 6, borderRadius: 3, backgroundColor: isDark ? '#333' : '#CCC' }} />
          </Box>
          <Stack gap="6px">
            <Box sx={{ height: 8, borderRadius: 3, width: '70%', backgroundColor: isDark ? '#1E1E1E' : '#E0E0E0' }} />
            <Box sx={{ height: 6, borderRadius: 3, width: '90%', backgroundColor: isDark ? '#181818' : '#EAEAEA' }} />
            <Box sx={{ height: 6, borderRadius: 3, width: '55%', backgroundColor: isDark ? '#181818' : '#EAEAEA' }} />
          </Stack>
        </Box>
        <Box sx={{ px: '14px', py: '10px', backgroundColor: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" alignItems="center" gap="6px">
            {isDark
              ? <DarkMode sx={{ fontSize: '15px', color: selected ? 'primary.main' : 'text.secondary' }} />
              : <LightMode sx={{ fontSize: '15px', color: selected ? 'primary.main' : 'text.secondary' }} />
            }
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '13px', color: selected ? 'primary.main' : 'text.primary' }}>
              {label}
            </Typography>
          </Stack>
          {selected && (
            <Box sx={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg, #FF2625, #FF6B35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check sx={{ fontSize: '11px', color: '#fff' }} />
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      <SectionHeader label="Appearance" />
      <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: 'text.secondary', mb: '24px' }}>
        Choose how Muscle Forger looks to you.
      </Typography>
      <Stack direction="row" gap="16px">
        <ThemeCard value="dark" label="Dark" />
        <ThemeCard value="light" label="Light" />
      </Stack>
    </Box>
  );
}

// ─── Section: Security ───────────────────────────────────────────────────────

function SecuritySection() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (next !== confirm) { setError('New passwords do not match'); return; }
    if (next.length < 8) { setError('New password must be at least 8 characters'); return; }
    setSaving(true);
    try {
      await authFetch('/api/users/me/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      setSuccess('Password updated');
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (err) {
      setError(err.message === '400' ? 'Current password is incorrect' : 'Failed to update password');
    }
    setSaving(false);
  };

  return (
    <Box>
      <SectionHeader label="Security" />
      <Stack gap="20px">
        {error && <Alert severity="error" sx={{ borderRadius: '10px' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ borderRadius: '10px' }}>{success}</Alert>}
        <TextField label="Current Password" value={current} onChange={(e) => setCurrent(e.target.value)} fullWidth size="small" type="password" sx={fieldSx} />
        <TextField label="New Password" value={next} onChange={(e) => setNext(e.target.value)} fullWidth size="small" type="password" sx={fieldSx} />
        <TextField label="Confirm New Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} fullWidth size="small" type="password" sx={fieldSx} />
        <Box><SaveButton loading={saving} onClick={handleSubmit}>Update Password</SaveButton></Box>
      </Stack>
    </Box>
  );
}

// ─── Section: Danger Zone ────────────────────────────────────────────────────

function DangerSection() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setError('');
    if (!password) { setError('Password is required'); return; }
    setDeleting(true);
    try {
      await authFetch('/api/users/me', {
        method: 'DELETE',
        body: JSON.stringify({ password }),
      });
      logout();
      navigate('/');
    } catch (err) {
      setError(err.message === '400' ? 'Incorrect password' : 'Failed to delete account');
    }
    setDeleting(false);
  };

  return (
    <Box>
      <SectionHeader label="Danger Zone" />
      <Box
        sx={{
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,38,37,0.2)' : 'rgba(255,38,37,0.25)'}`,
          borderRadius: '12px', p: '20px 24px',
          background: theme.palette.mode === 'dark' ? 'rgba(255,38,37,0.04)' : 'rgba(255,38,37,0.03)',
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" gap="16px">
          <Box>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '14px', color: 'text.primary', mb: '4px' }}>
              Delete Account
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: 'text.secondary', maxWidth: '360px', lineHeight: 1.5 }}>
              Permanently delete your account and all associated data. This action cannot be undone.
            </Typography>
          </Box>
          <Button
            onClick={() => setDialogOpen(true)}
            variant="outlined" color="error"
            sx={{
              fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '13px',
              px: '20px', py: '8px', borderRadius: '10px', whiteSpace: 'nowrap', flexShrink: 0,
              '&:hover': { background: 'rgba(211,47,47,0.08)' },
            }}
          >
            Delete Account
          </Button>
        </Stack>
      </Box>

      {/* Confirmation dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setPassword(''); setError(''); }}
        PaperProps={{ sx: { borderRadius: '14px', backgroundColor: 'background.paper', border: `1px solid ${theme.palette.divider}`, maxWidth: '400px', m: '16px' } }}
      >
        <DialogTitle sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '24px', letterSpacing: '0.04em', pb: '4px' }}>
          Delete Account?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: 'text.secondary', mb: '20px' }}>
            This will permanently delete your account, weight logs, progress photos, plans, and all other data. Enter your password to confirm.
          </Typography>
          {error && <Alert severity="error" sx={{ borderRadius: '10px', mb: '16px' }}>{error}</Alert>}
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            size="small"
            sx={fieldSx}
          />
        </DialogContent>
        <DialogActions sx={{ px: '20px', pb: '16px', gap: '8px' }}>
          <Button
            onClick={() => { setDialogOpen(false); setPassword(''); setError(''); }}
            sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '13px', color: 'text.secondary', borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleting}
            sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '13px', borderRadius: '8px', px: '20px', backgroundColor: '#d32f2f', '&:hover': { backgroundColor: '#b71c1c' } }}
          >
            {deleting ? <CircularProgress size={18} color="inherit" /> : 'Delete Forever'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const CONTENT = {
  overview:   OverviewSection,
  profile:    ProfileSection,
  appearance: AppearanceSection,
  security:   SecuritySection,
  danger:     DangerSection,
};

export default function SettingsPage() {
  const theme = useTheme();
  const { user } = useAuth();
  const [active, setActive] = useState('overview');

  // Update local user state after profile changes
  const handleUserUpdated = (updatedProfile) => {
    const userData = {
      id: updatedProfile.id,
      username: updatedProfile.username,
      email: updatedProfile.email,
      avatarUrl: updatedProfile.avatarUrl,
      createdAt: updatedProfile.createdAt,
    };
    localStorage.setItem('mf_user', JSON.stringify(userData));
    useAuth.setState({ user: userData });
  };

  const ContentComponent = CONTENT[active];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <Box sx={{ px: { xs: '16px', sm: '32px', lg: '48px' }, py: { xs: '40px', lg: '60px' }, minHeight: 'calc(100vh - 160px)' }}>

        {/* Page title */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}>
          <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { lg: '64px', xs: '42px' }, letterSpacing: '0.04em', color: 'text.primary', lineHeight: 1, mb: '8px' }}>
            Account{' '}
            <Box component="span" sx={{ background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Settings
            </Box>
          </Typography>
          <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '15px', color: 'text.secondary', mb: { xs: '32px', lg: '48px' } }}>
            Manage your profile, appearance, and account preferences.
          </Typography>
        </motion.div>

        {/* Layout */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '200px 1fr' }, gap: { xs: '0', md: '40px' }, alignItems: 'start' }}>

          {/* Mobile: dropdown select */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, mb: '16px' }}>
            <FormControl fullWidth size="small">
              <Select
                value={active}
                onChange={(e) => setActive(e.target.value)}
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  borderRadius: '10px',
                  '& .MuiOutlinedInput-notchedOutline': { borderRadius: '10px' },
                }}
              >
                {SECTIONS.map(({ id, label, icon: Icon }) => (
                  <MenuItem key={id} value={id} sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', fontWeight: 600, gap: '10px' }}>
                    <Stack direction="row" alignItems="center" gap="10px">
                      <Icon sx={{ fontSize: '16px', color: active === id ? 'primary.main' : 'text.secondary' }} />
                      {label}
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Desktop: vertical sidebar */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              backgroundColor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '14px',
              overflow: 'hidden',
              position: 'sticky',
              top: '88px',
            }}
          >
            {SECTIONS.map(({ id, label, icon: Icon }, i) => {
              const isActive = active === id;
              return (
                <Box
                  key={id}
                  onClick={() => setActive(id)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    px: '16px', py: '13px', cursor: 'pointer', position: 'relative',
                    borderBottom: i < SECTIONS.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                    backgroundColor: isActive ? (theme.palette.mode === 'dark' ? 'rgba(255,38,37,0.07)' : 'rgba(255,38,37,0.05)') : 'transparent',
                    transition: 'background-color 0.2s ease',
                    '&:hover': {
                      backgroundColor: isActive
                        ? (theme.palette.mode === 'dark' ? 'rgba(255,38,37,0.07)' : 'rgba(255,38,37,0.05)')
                        : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'),
                    },
                  }}
                >
                  {isActive && (
                    <Box sx={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: '3px', borderRadius: '0 2px 2px 0', background: 'linear-gradient(180deg, #FF2625 0%, #FF6B35 100%)' }} />
                  )}
                  <Icon sx={{ fontSize: '17px', color: isActive ? 'primary.main' : 'text.secondary', flexShrink: 0 }} />
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', fontWeight: isActive ? 700 : 500, color: isActive ? 'primary.main' : 'text.secondary' }}>
                    {label}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* Content panel */}
          <Box
            sx={{
              backgroundColor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '14px',
              p: { xs: '24px', sm: '32px' },
              minHeight: '400px',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              >
                <ContentComponent user={user} onUserUpdated={handleUserUpdated} />
              </motion.div>
            </AnimatePresence>
          </Box>

        </Box>
      </Box>
    </motion.div>
  );
}
