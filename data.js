const PROGRAM = [
  {
    day: "Tuesday",
    tag: "Lower Body Strength + Core",
    blocks: [
      { label: "Warm-up", items: [
        { name: "Treadmill incline walk", detail: "5 min, easy pace" }
      ]},
      { label: "Mobility", items: [
        { name: "Hip circles", detail: "10/side" },
        { name: "Leg swings (front/back, side/side)", detail: "10/side each direction" },
        { name: "Walking lunge w/ rotation", detail: "8/side" },
        { name: "Ankle rocks", detail: "10/side" }
      ]},
      { label: "Activation", items: [
        { name: "Glute bridges", detail: "15 reps" },
        { name: "Lateral monster walks", detail: "10/side" },
        { name: "Bodyweight squats", detail: "10 reps" }
      ]},
      { label: "Compound Lifts", items: [
        { name: "Goblet Squat", detail: "4x8-10 · RPE 6-7 · rest 90s · tempo 3-1-1" },
        { name: "Romanian Deadlift (DB)", detail: "3x10 · RPE 6-7 · rest 90s · tempo 3-1-1" },
        { name: "DB Walking Lunge", detail: "3x10/leg · RPE 6 · rest 75s" }
      ]},
      { label: "Accessory", items: [
        { name: "Single-Leg RDL", detail: "3x8/leg · RPE 6 · rest 60s" },
        { name: "Calf Raises (DB in hand)", detail: "3x15 · RPE 7 · rest 45s" }
      ]},
      { label: "Core", items: [
        { name: "Dead Bug", detail: "3x10/side" },
        { name: "Side Plank", detail: "3x30s/side" }
      ]},
      { label: "Cooldown", items: [
        { name: "Couch stretch, hamstring stretch, child's pose", detail: "5-8 min + easy walk" }
      ]}
    ]
  },
  {
    day: "Wednesday",
    tag: "Upper Pull-Focused + Shoulder Health",
    blocks: [
      { label: "Warm-up", items: [
        { name: "Arm circles + light DB shoulder dislocates (towel)", detail: "5 min" }
      ]},
      { label: "Mobility", items: [
        { name: "Thoracic spine rotations (quadruped)", detail: "8/side" },
        { name: "Wall slides", detail: "10 reps" },
        { name: "Shoulder pass-throughs", detail: "10 reps" }
      ]},
      { label: "Activation", items: [
        { name: "Scapular squeezes", detail: "10 reps" },
        { name: "Prone Y-T-W raises", detail: "8 each (light/no weight)" }
      ]},
      { label: "Compound Lifts", items: [
        { name: "Single-Arm DB Row", detail: "4x10/side · RPE 6-7 · rest 90s · tempo 2-1-2" },
        { name: "Floor Press (DB)", detail: "3x10 · RPE 6 · rest 90s" }
      ]},
      { label: "Accessory", items: [
        { name: "Renegade Row", detail: "3x8/side · RPE 6 · rest 75s" },
        { name: "Rear Delt Fly (light, bent over)", detail: "3x15 · RPE 6 · rest 45s" },
        { name: "Bicep Curl", detail: "2x12 · RPE 6 · rest 45s" }
      ]},
      { label: "Core", items: [
        { name: "Pallof-style anti-rotation hold", detail: "3x20s/side" },
        { name: "Hollow Body Hold", detail: "3x20-30s" }
      ]},
      { label: "Cooldown", items: [
        { name: "Cross-body shoulder + doorway chest stretch, child's pose reach", detail: "5-8 min" }
      ]}
    ]
  },
  {
    day: "Thursday",
    tag: "Lower Body Power + Posterior Chain",
    blocks: [
      { label: "Warm-up", items: [
        { name: "Treadmill jog, light", detail: "5 min" }
      ]},
      { label: "Mobility", items: [
        { name: "Hip flexor stretch", detail: "30s/side" },
        { name: "90/90 hip switches", detail: "8/side" },
        { name: "Leg swings", detail: "10/side" }
      ]},
      { label: "Activation", items: [
        { name: "Glute bridges", detail: "15 reps" },
        { name: "Single-leg balance", detail: "20s/side" }
      ]},
      { label: "Compound Lifts", items: [
        { name: "DB Deadlift (conventional)", detail: "4x8 · RPE 6-7 · rest 90s · 2s controlled down" },
        { name: "Bulgarian Split Squat (rear foot elevated)", detail: "3x8/leg · RPE 7 · rest 90s" },
        { name: "DB Step-Up", detail: "3x8/leg · RPE 6 · rest 75s" }
      ]},
      { label: "Accessory", items: [
        { name: "Lateral Lunge", detail: "3x10/side · RPE 6 · rest 60s" },
        { name: "Standing Calf Raise", detail: "3x15 · RPE 7 · rest 45s" }
      ]},
      { label: "Core", items: [
        { name: "Russian Twist (light DB)", detail: "3x12/side" },
        { name: "Plank", detail: "3x40s" }
      ]},
      { label: "Cooldown", items: [
        { name: "Pigeon, quad, hamstring stretch", detail: "5-8 min" }
      ]}
    ]
  },
  {
    day: "Friday",
    tag: "Upper Push + Pull Volume",
    blocks: [
      { label: "Warm-up", items: [
        { name: "Arm circles + light shoulder dislocates", detail: "5 min" }
      ]},
      { label: "Mobility", items: [
        { name: "Thoracic rotations", detail: "8/side" },
        { name: "Wall slides", detail: "10 reps" }
      ]},
      { label: "Activation", items: [
        { name: "Band/towel pull-aparts", detail: "15 reps" },
        { name: "Y-T-W raises", detail: "8 each" }
      ]},
      { label: "Compound Lifts", items: [
        { name: "Single-Arm DB Row", detail: "3x12/side · RPE 7 · rest 90s" },
        { name: "Floor Press", detail: "3x10 · RPE 6-7 · rest 90s" },
        { name: "Single-Arm Overhead Press (light, strict)", detail: "2x8/side · RPE 5-6 · rest 90s" }
      ]},
      { label: "Accessory", items: [
        { name: "Reverse Fly", detail: "3x15 · RPE 6 · rest 45s" },
        { name: "Lateral Raise", detail: "2x15 · RPE 6 · rest 45s" },
        { name: "Tricep Overhead Extension", detail: "2x12 · RPE 6 · rest 45s" }
      ]},
      { label: "Core", items: [
        { name: "Bicycle Crunch", detail: "3x15/side" },
        { name: "Superman Hold", detail: "3x20s" }
      ]},
      { label: "Cooldown", items: [
        { name: "Doorway chest stretch, child's pose, lat stretch", detail: "5-8 min" }
      ]}
    ]
  }
];

const NUTRITION = {
  maintenance: "3,000–3,300 kcal",
  target: "3,300–3,600 kcal",
  protein: "115–130 g",
  carbs: "450–500 g",
  fat: "90–100 g",
  notes: [
    "You're 14, lean, and training ~12.5 hrs/week swimming + 4 lifting days — this is a growth + performance phase, not a cutting phase.",
    "Carbs are your priority macro: they fuel swim performance and spare protein for muscle repair.",
    "Pre-swim (1-2 hrs before): carb-focused, moderate protein, low fat.",
    "Post-swim: protein + carbs within ~60 min (chocolate milk, sandwich, yogurt + fruit).",
    "Post-lift: protein-forward meal within 1-2 hours.",
    "Don't skip breakfast — easiest way to slip into a deficit without noticing."
  ]
};
