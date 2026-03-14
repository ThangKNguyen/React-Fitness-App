import { Typography, Stack, Box, Button } from '@mui/material';
import { Favorite, FavoriteBorder, FitnessCenter, CheckCircle } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import BodyPartImage from '../assets/icons/body-part.png';
import TargetImage from '../assets/icons/target.png';
import EquipmentImage from '../assets/icons/equipment.png';
import { useFavorites } from '../utils/useFavorites';
import { useWorkout } from '../utils/useWorkout';

const muscleDescriptions = {
  abs: (name) =>
    `${name} is a core powerhouse move. A strong core transfers force through every lift, protects your spine, and is the foundation of all athletic performance. Consistency here pays dividends across every other exercise you do.`,
  quads: (name) =>
    `${name} hammers the front of your thighs — the largest muscle group in your lower body. Strong quads drive explosive jumping, sprinting, and squatting power. Building them also protects your knees long-term.`,
  hamstrings: (name) =>
    `${name} develops the posterior chain, the engine behind speed and power. Strong hamstrings balance out quad dominance, reduce injury risk, and are critical for pulling strength and athletic performance.`,
  glutes: (name) =>
    `${name} targets the glutes — the most powerful muscles in your body. Glute strength drives hip extension in every sport, protects your lower back, and is essential for building an athletic physique.`,
  pectorals: (name) =>
    `${name} builds chest thickness and pressing power. The pectorals are the primary movers in all push patterns. Developing them creates the width and definition that defines a strong upper body.`,
  biceps: (name) =>
    `${name} isolates the biceps for peak development and pulling strength. Strong biceps support every row and pull-up variation, and are one of the most visible markers of a well-trained physique.`,
  triceps: (name) =>
    `${name} builds the triceps, which make up two-thirds of your upper arm mass. They are the primary mover in all pressing movements — stronger triceps mean a stronger bench, overhead press, and bigger arms overall.`,
  lats: (name) =>
    `${name} develops the latissimus dorsi, the wide back muscles that create the V-taper look. Strong lats improve posture, shoulder stability, and are the engine behind every pulling movement.`,
  delts: (name) =>
    `${name} targets the deltoids for full shoulder development. Well-rounded shoulders improve the look of your entire upper body and are essential for overhead pressing strength and shoulder health.`,
  traps: (name) =>
    `${name} builds the trapezius, a muscle that spans your upper back and neck. Strong traps improve posture, support the spine under heavy loads, and add that powerful, thick upper-back look.`,
  calves: (name) =>
    `${name} develops the calf complex for lower leg power and stability. Strong calves improve ankle stiffness for jumping and sprinting, and are often the most undertrained muscle group on serious lifters.`,
  forearms: (name) =>
    `${name} builds forearm strength and grip — the limiting factor in most pulling and carrying exercises. Grip strength is one of the best predictors of overall athletic performance and longevity.`,
  'upper back': (name) =>
    `${name} targets the upper back musculature for thickness, posture, and injury resilience. A strong upper back counters the effects of prolonged sitting and is essential for maintaining healthy shoulders.`,
  adductors: (name) =>
    `${name} trains the inner thighs for hip stability and injury prevention. Strong adductors keep your knees tracking correctly and are essential for lateral movement in sport.`,
  abductors: (name) =>
    `${name} strengthens the outer hips and glutes for lateral stability. These muscles keep your pelvis level when running and are key for preventing knee valgus under load.`,
  'cardiovascular system': (name) =>
    `${name} challenges your cardiovascular system to improve endurance, burn calories, and boost heart health. Regular cardio work accelerates recovery between strength sessions and extends your athletic career.`,
  spine: (name) =>
    `${name} strengthens the muscles that support and extend your spine. Spinal erector strength is essential for safe deadlifting, squatting, and maintaining posture under heavy loads.`,
  'levator scapulae': (name) =>
    `${name} targets the neck and upper shoulder stabilizers. Strengthening this area reduces neck tension, improves posture, and protects against injury in overhead pressing movements.`,
  'serratus anterior': (name) =>
    `${name} develops the serratus anterior — the muscle responsible for proper scapular rotation. Strong serratus function is critical for shoulder health, overhead mobility, and the classic "boxer" aesthetic.`,
};

const getDescription = (name, target) => {
  if (!name || !target) return '';
  const key = target.toLowerCase();
  const fn = muscleDescriptions[key];
  if (fn) return fn(name.charAt(0).toUpperCase() + name.slice(1));
  return `${name.charAt(0).toUpperCase() + name.slice(1)} is an effective exercise for developing your ${target}. Training this muscle group consistently will improve strength, build muscle, and enhance your overall athletic performance.`;
};

export default function Detail({ exerciseDetail }) {
  const { bodyPart, gifUrl, name, target, equipment } = exerciseDetail;
  const theme = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInWorkout, addToWorkout, removeFromWorkout } = useWorkout();

  const favorited = exerciseDetail.id ? isFavorite(exerciseDetail.id) : false;
  const inWorkout = exerciseDetail.id ? isInWorkout(exerciseDetail.id) : false;

  const bodyPartDetail = [
    { icon: BodyPartImage, name: bodyPart, label: 'Body Part' },
    { icon: TargetImage, name: target, label: 'Target Muscle' },
    { icon: EquipmentImage, name: equipment, label: 'Equipment' },
  ];

  return (
    <Stack
      mt="30px"
      gap="60px"
      sx={{ flexDirection: { lg: 'row' }, p: '20px', alignItems: 'center' }}
    >
      <motion.img
        src={gifUrl}
        alt={name}
        loading="lazy"
        className="detail-image"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      />

      <Stack sx={{ gap: { lg: '28px', xs: '20px' } }}>
        {/* Exercise name */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
        >
          <Typography
            sx={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: { lg: '64px', xs: '40px' },
              letterSpacing: '0.03em',
              color: 'text.primary',
              lineHeight: 1,
              textTransform: 'capitalize',
              mb: '16px',
            }}
          >
            {name}
          </Typography>

          {/* Action buttons */}
          {exerciseDetail.id && (
            <Stack direction="row" gap="12px" flexWrap="wrap">
              <Button
                variant={favorited ? 'contained' : 'outlined'}
                startIcon={favorited ? <Favorite sx={{ fontSize: '16px' }} /> : <FavoriteBorder sx={{ fontSize: '16px' }} />}
                onClick={() => toggleFavorite(exerciseDetail)}
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: '13px',
                  borderRadius: '10px',
                  px: '20px',
                  py: '9px',
                  textTransform: 'none',
                  ...(favorited
                    ? {
                        background: 'linear-gradient(135deg, #FF2625 0%, #FF6B35 100%)',
                        boxShadow: '0 4px 16px rgba(255,38,37,0.3)',
                        color: '#fff',
                        border: 'none',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #CC1E1D 0%, #e55d2a 100%)',
                        },
                      }
                    : {
                        borderColor: 'rgba(255,38,37,0.4)',
                        color: 'primary.main',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'rgba(255,38,37,0.06)',
                        },
                      }),
                }}
              >
                {favorited ? 'Saved' : 'Save'}
              </Button>

              <Button
                variant={inWorkout ? 'contained' : 'outlined'}
                startIcon={
                  inWorkout
                    ? <CheckCircle sx={{ fontSize: '16px' }} />
                    : <FitnessCenter sx={{ fontSize: '16px' }} />
                }
                onClick={() => {
                  if (inWorkout) removeFromWorkout(exerciseDetail.id);
                  else addToWorkout(exerciseDetail);
                }}
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: '13px',
                  borderRadius: '10px',
                  px: '20px',
                  py: '9px',
                  textTransform: 'none',
                  ...(inWorkout
                    ? {
                        background: 'linear-gradient(135deg, #FF6B35 0%, #FF2625 100%)',
                        boxShadow: '0 4px 16px rgba(255,107,53,0.3)',
                        color: '#fff',
                        border: 'none',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #e55d2a 0%, #CC1E1D 100%)',
                        },
                      }
                    : {
                        borderColor: theme.palette.divider,
                        color: 'text.secondary',
                        '&:hover': {
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          backgroundColor: 'rgba(255,38,37,0.06)',
                        },
                      }),
                }}
              >
                {inWorkout ? 'In Workout' : 'Add to Workout'}
              </Button>
            </Stack>
          )}
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.18 }}
        >
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '15px',
              lineHeight: '1.8',
              color: 'text.secondary',
              maxWidth: '520px',
            }}
          >
            {getDescription(name, target)}
          </Typography>
        </motion.div>

        {/* Info badges */}
        <Stack gap="16px" mt="8px">
          {bodyPartDetail.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1], delay: 0.26 + i * 0.1 }}
            >
              <Stack direction="row" gap="20px" alignItems="center">
                <Box
                  sx={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 38, 37, 0.12)'
                        : 'rgba(255, 38, 37, 0.08)',
                    border: '1.5px solid rgba(255, 38, 37, 0.2)',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    style={{
                      width: '34px',
                      height: '34px',
                      filter:
                        'invert(20%) sepia(100%) saturate(6000%) hue-rotate(0deg) brightness(95%) contrast(115%)',
                    }}
                  />
                </Box>
                <Stack>
                  <Typography
                    sx={{
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      color: 'text.secondary',
                      fontFamily: '"DM Sans", sans-serif',
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { lg: '22px', xs: '18px' },
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      color: 'text.primary',
                      fontFamily: '"DM Sans", sans-serif',
                      letterSpacing: '-0.2px',
                    }}
                  >
                    {item.name}
                  </Typography>
                </Stack>
              </Stack>
            </motion.div>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
