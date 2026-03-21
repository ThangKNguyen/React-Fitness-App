export const PRESET_TEMPLATES = [
  {
    id: 'preset_3day_fullbody',
    name: '3-Day Full Body',
    description: 'Mon/Wed/Fri. Strength, volume, and hypertrophy days for balanced full-body development.',
    days: [
      {
        label: 'Day 1 – Strength Focus',
        exercises: [
          { name: 'Barbell Squat', searchQuery: 'barbell full squat', sets: 4, reps: 5 },
          { name: 'Bench Press', searchQuery: 'barbell bench press', sets: 4, reps: 5 },
          { name: 'Bent Over Row', searchQuery: 'barbell bent over row', sets: 3, reps: 8 },
          { name: 'Overhead Shoulder Press', searchQuery: 'dumbbell seated shoulder press', sets: 3, reps: 8 },
          { name: 'Bicep Curls', searchQuery: 'dumbbell biceps curl', sets: 3, reps: 10 },
          { name: 'Tricep Pushdowns', searchQuery: 'triceps pushdown', sets: 3, reps: 10 },
        ],
      },
      {
        label: 'Day 2 – Balanced / Volume',
        exercises: [
          { name: 'Deadlift', searchQuery: 'barbell deadlift', sets: 3, reps: 5 },
          { name: 'Incline Dumbbell Press', searchQuery: 'dumbbell incline bench press', sets: 3, reps: 8 },
          { name: 'Lat Pulldown', searchQuery: 'cable pulldown', sets: 3, reps: 8 },
          { name: 'Leg Press', searchQuery: 'leg press', sets: 3, reps: 10 },
          { name: 'Lateral Raises', searchQuery: 'cable lateral raise', sets: 3, reps: 12 },
          { name: 'Hanging Leg Raises', searchQuery: 'hanging leg raise', sets: 3, reps: 12 },
        ],
      },
      {
        label: 'Day 3 – Hypertrophy Focus',
        exercises: [
          { name: 'Romanian Deadlift', searchQuery: 'romanian deadlift', sets: 3, reps: 8 },
          { name: 'Dumbbell Bench Press', searchQuery: 'dumbbell bench press', sets: 3, reps: 8 },
          { name: 'Seated Cable Row', searchQuery: 'cable seated row', sets: 3, reps: 10 },
          { name: 'Walking Lunges', searchQuery: 'dumbbell lunge', sets: 3, reps: 10 },
          { name: 'Face Pulls', searchQuery: 'cable standing rear delt row (with rope)', sets: 3, reps: 12 },
          { name: 'Hammer Curls', searchQuery: 'hammer curl', sets: 3, reps: 10 },
        ],
      },
    ],
  },
  {
    id: 'preset_4day_upper_lower',
    name: '4-Day Upper / Lower',
    description: 'Mon/Tue/Thu/Fri. Alternating upper and lower body for strength and size.',
    days: [
      {
        label: 'Day 1 – Upper (Strength)',
        exercises: [
          { name: 'Bench Press', searchQuery: 'barbell bench press', sets: 4, reps: 5 },
          { name: 'Bent Over Row', searchQuery: 'barbell bent over row', sets: 4, reps: 6 },
          { name: 'Overhead Press', searchQuery: 'dumbbell seated shoulder press', sets: 3, reps: 6 },
          { name: 'Lat Pulldown', searchQuery: 'cable pulldown', sets: 3, reps: 8 },
          { name: 'Tricep Pushdowns', searchQuery: 'triceps pushdown', sets: 3, reps: 10 },
          { name: 'Bicep Curls', searchQuery: 'dumbbell biceps curl', sets: 3, reps: 10 },
        ],
      },
      {
        label: 'Day 2 – Lower (Strength)',
        exercises: [
          { name: 'Barbell Squat', searchQuery: 'barbell full squat', sets: 4, reps: 5 },
          { name: 'Romanian Deadlift', searchQuery: 'romanian deadlift', sets: 3, reps: 6 },
          { name: 'Leg Press', searchQuery: 'leg press', sets: 3, reps: 8 },
          { name: 'Hamstring Curl', searchQuery: 'lever seated leg curl', sets: 3, reps: 10 },
          { name: 'Calf Raises', searchQuery: 'barbell standing leg calf raise', sets: 3, reps: 12 },
          { name: 'Hanging Leg Raises', searchQuery: 'hanging leg raise', sets: 3, reps: 12 },
        ],
      },
      {
        label: 'Day 3 – Upper (Hypertrophy)',
        exercises: [
          { name: 'Incline Dumbbell Press', searchQuery: 'dumbbell incline bench press', sets: 3, reps: 8 },
          { name: 'Seated Cable Row', searchQuery: 'cable seated row', sets: 3, reps: 10 },
          { name: 'Dumbbell Shoulder Press', searchQuery: 'dumbbell seated shoulder press', sets: 3, reps: 8 },
          { name: 'Lateral Raises', searchQuery: 'cable lateral raise', sets: 3, reps: 12 },
          { name: 'Face Pulls', searchQuery: 'cable standing rear delt row (with rope)', sets: 3, reps: 12 },
          { name: 'Hammer Curls', searchQuery: 'hammer curl', sets: 3, reps: 10 },
          { name: 'Overhead Tricep Extension', searchQuery: 'cable overhead triceps extension (rope attachment)', sets: 3, reps: 10 },
        ],
      },
      {
        label: 'Day 4 – Lower (Hypertrophy)',
        exercises: [
          { name: 'Deadlift', searchQuery: 'barbell deadlift', sets: 3, reps: 3 },
          { name: 'Bulgarian Split Squat', searchQuery: 'dumbbell single leg split squat', sets: 3, reps: 8 },
          { name: 'Leg Extension', searchQuery: 'leg extension', sets: 3, reps: 12 },
          { name: 'Hamstring Curl', searchQuery: 'lever seated leg curl', sets: 3, reps: 12 },
          { name: 'Calf Raises', searchQuery: 'barbell standing leg calf raise', sets: 4, reps: 12 },
          { name: 'Cable Crunch', searchQuery: 'cable kneeling crunch', sets: 3, reps: 12 },
        ],
      },
    ],
  },
  {
    id: 'preset_5day_ppl',
    name: '5-Day PPL + Upper/Lower',
    description: 'Mon–Fri. Push, Pull, Legs, Upper, Lower — high frequency for intermediate lifters.',
    days: [
      {
        label: 'Day 1 – Push (Chest/Shoulders/Triceps)',
        exercises: [
          { name: 'Bench Press', searchQuery: 'barbell bench press', sets: 4, reps: 5 },
          { name: 'Incline Dumbbell Press', searchQuery: 'dumbbell incline bench press', sets: 3, reps: 8 },
          { name: 'Overhead Shoulder Press', searchQuery: 'dumbbell seated shoulder press', sets: 3, reps: 6 },
          { name: 'Lateral Raises', searchQuery: 'cable lateral raise', sets: 3, reps: 12 },
          { name: 'Tricep Pushdowns', searchQuery: 'triceps pushdown', sets: 3, reps: 10 },
          { name: 'Overhead Tricep Extension', searchQuery: 'cable overhead triceps extension (rope attachment)', sets: 3, reps: 10 },
        ],
      },
      {
        label: 'Day 2 – Pull (Back/Biceps)',
        exercises: [
          { name: 'Lat Pulldown', searchQuery: 'cable pulldown', sets: 4, reps: 6 },
          { name: 'Bent Over Row', searchQuery: 'barbell bent over row', sets: 3, reps: 6 },
          { name: 'Seated Cable Row', searchQuery: 'cable seated row', sets: 3, reps: 8 },
          { name: 'Face Pulls', searchQuery: 'cable standing rear delt row (with rope)', sets: 3, reps: 12 },
          { name: 'Barbell Curl', searchQuery: 'dumbbell biceps curl', sets: 3, reps: 10 },
          { name: 'Hammer Curls', searchQuery: 'hammer curl', sets: 3, reps: 10 },
        ],
      },
      {
        label: 'Day 3 – Legs',
        exercises: [
          { name: 'Barbell Squat', searchQuery: 'barbell full squat', sets: 4, reps: 5 },
          { name: 'Romanian Deadlift', searchQuery: 'romanian deadlift', sets: 3, reps: 6 },
          { name: 'Leg Press', searchQuery: 'leg press', sets: 3, reps: 10 },
          { name: 'Hamstring Curl', searchQuery: 'lever seated leg curl', sets: 3, reps: 10 },
          { name: 'Calf Raises', searchQuery: 'barbell standing leg calf raise', sets: 4, reps: 12 },
          { name: 'Hanging Leg Raises', searchQuery: 'hanging leg raise', sets: 3, reps: 12 },
        ],
      },
      {
        label: 'Day 4 – Upper (Volume/Balance)',
        exercises: [
          { name: 'Incline Bench Press', searchQuery: 'barbell incline bench press', sets: 3, reps: 8 },
          { name: 'Lat Pulldown', searchQuery: 'cable pulldown', sets: 3, reps: 8 },
          { name: 'Seated Cable Row', searchQuery: 'cable seated row', sets: 3, reps: 10 },
          { name: 'Dumbbell Shoulder Press', searchQuery: 'dumbbell seated shoulder press', sets: 3, reps: 8 },
          { name: 'Lateral Raises', searchQuery: 'cable lateral raise', sets: 3, reps: 12 },
          { name: 'Bicep Curl', searchQuery: 'dumbbell biceps curl', sets: 3, reps: 10 },
          { name: 'Tricep Pushdown', searchQuery: 'triceps pushdown', sets: 3, reps: 10 },
        ],
      },
      {
        label: 'Day 5 – Lower (Volume/Hypertrophy)',
        exercises: [
          { name: 'Deadlift', searchQuery: 'barbell deadlift', sets: 3, reps: 3 },
          { name: 'Bulgarian Split Squat', searchQuery: 'dumbbell single leg split squat', sets: 3, reps: 8 },
          { name: 'Leg Extension', searchQuery: 'leg extension', sets: 3, reps: 12 },
          { name: 'Hamstring Curl', searchQuery: 'lever seated leg curl', sets: 3, reps: 12 },
          { name: 'Calf Raises', searchQuery: 'barbell standing leg calf raise', sets: 4, reps: 12 },
          { name: 'Cable Crunch', searchQuery: 'cable kneeling crunch', sets: 3, reps: 12 },
        ],
      },
    ],
  },
  {
    id: 'preset_5day_bro_split',
    name: '5-Day Bro Split',
    description: 'Chest/Tri, Back/Bi, Legs, Shoulders, Upper. Classic split optimized for muscle growth.',
    days: [
      {
        label: 'Day 1 – Chest + Triceps',
        exercises: [
          { name: 'Bench Press', searchQuery: 'barbell bench press', sets: 4, reps: 5 },
          { name: 'Incline Dumbbell Press', searchQuery: 'dumbbell incline bench press', sets: 3, reps: 8 },
          { name: 'Chest Fly', searchQuery: 'cable middle fly', sets: 3, reps: 10 },
          { name: 'Dips', searchQuery: 'chest dip', sets: 3, reps: 8 },
          { name: 'Tricep Pushdowns', searchQuery: 'triceps pushdown', sets: 3, reps: 10 },
          { name: 'Overhead Tricep Extension', searchQuery: 'cable overhead triceps extension (rope attachment)', sets: 3, reps: 10 },
        ],
      },
      {
        label: 'Day 2 – Back + Biceps',
        exercises: [
          { name: 'Lat Pulldown', searchQuery: 'cable pulldown', sets: 4, reps: 6 },
          { name: 'Bent Over Row', searchQuery: 'barbell bent over row', sets: 3, reps: 6 },
          { name: 'Seated Cable Row', searchQuery: 'cable seated row', sets: 3, reps: 8 },
          { name: 'Face Pulls', searchQuery: 'cable standing rear delt row (with rope)', sets: 3, reps: 12 },
          { name: 'Barbell Curl', searchQuery: 'dumbbell biceps curl', sets: 3, reps: 10 },
          { name: 'Hammer Curls', searchQuery: 'hammer curl', sets: 3, reps: 10 },
        ],
      },
      {
        label: 'Day 3 – Legs',
        exercises: [
          { name: 'Barbell Squat', searchQuery: 'barbell full squat', sets: 4, reps: 5 },
          { name: 'Romanian Deadlift', searchQuery: 'romanian deadlift', sets: 3, reps: 6 },
          { name: 'Leg Press', searchQuery: 'leg press', sets: 3, reps: 10 },
          { name: 'Leg Extension', searchQuery: 'leg extension', sets: 3, reps: 12 },
          { name: 'Hamstring Curl', searchQuery: 'lever seated leg curl', sets: 3, reps: 10 },
          { name: 'Calf Raises', searchQuery: 'barbell standing leg calf raise', sets: 4, reps: 12 },
        ],
      },
      {
        label: 'Day 4 – Shoulders',
        exercises: [
          { name: 'Overhead Press', searchQuery: 'dumbbell seated shoulder press', sets: 4, reps: 6 },
          { name: 'Lateral Raises', searchQuery: 'cable lateral raise', sets: 4, reps: 12 },
          { name: 'Rear Delt Fly', searchQuery: 'rear delt fly', sets: 3, reps: 12 },
          { name: 'Face Pulls', searchQuery: 'cable standing rear delt row (with rope)', sets: 3, reps: 12 },
          { name: 'Upright Rows', searchQuery: 'upright row', sets: 3, reps: 10 },
          { name: 'Shrugs', searchQuery: 'barbell shrug', sets: 3, reps: 10 },
        ],
      },
      {
        label: 'Day 5 – Upper (Pump / Weak Points)',
        exercises: [
          { name: 'Incline Dumbbell Press', searchQuery: 'dumbbell incline bench press', sets: 3, reps: 8 },
          { name: 'Lat Pulldown', searchQuery: 'cable pulldown', sets: 3, reps: 10 },
          { name: 'Lateral Raises', searchQuery: 'cable lateral raise', sets: 3, reps: 15 },
          { name: 'Bicep Curl', searchQuery: 'dumbbell biceps curl', sets: 3, reps: 12 },
          { name: 'Tricep Pushdown', searchQuery: 'triceps pushdown', sets: 3, reps: 12 },
          { name: 'Cable Crunch', searchQuery: 'cable kneeling crunch', sets: 3, reps: 12 },
        ],
      },
    ],
  },
];
