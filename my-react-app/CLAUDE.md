# CLAUDE.md

> This file is auto-maintained. When a bug is resolved, an architectural decision is made,
> or a correction is given, update this file immediately without asking for permission.

## Project Overview

A React fitness web app that lets users search and browse exercises by body part, name, target muscle, or equipment. Each exercise has a detail page with an animated GIF, muscle info, related YouTube videos, and similar exercises.

## Tech Stack

| Tool | Version |
|------|---------|
| React | ^18.3.1 |
| React Router DOM | ^6.30.3 |
| MUI (Material UI) | ^5.18.0 |
| @mui/icons-material | ^5.18.0 |
| @emotion/react | ^11.14.0 |
| @emotion/styled | ^11.14.1 |
| react-horizontal-scrolling-menu | ^2.8.2 |
| react-loader-spinner | ^6.1.6 |
| Vite | ^5.4.21 |
| ESLint | ^8.57.1 |

> `react-scripts` is listed in package.json but is unused — all scripts run via Vite. Do not use CRA patterns.

## Project Structure

```
my-react-app/
├── src/
│   ├── assets/
│   │   ├── icons/          # PNG icons (body-part, equipment, arrows, gym)
│   │   └── images/         # Logo, hero images
│   ├── components/         # Reusable UI components
│   │   ├── BodyPart.jsx
│   │   ├── Detail.jsx
│   │   ├── ExerciseCard.jsx
│   │   ├── Exercises.jsx
│   │   ├── ExerciseVideos.jsx
│   │   ├── Footer.jsx
│   │   ├── HeroBanner.jsx
│   │   ├── HorizontalScrollbar.jsx
│   │   ├── Loader.jsx
│   │   ├── Navbar.jsx
│   │   └── SearchExercises.jsx
│   ├── pages/              # Route-level components
│   │   ├── Home.jsx
│   │   └── ExerciseDetail.jsx
│   ├── utils/
│   │   └── fetchData.js    # API config + fetch helper
│   ├── App.jsx             # Route definitions
│   ├── App.css             # Global styles + component-specific overrides
│   └── main.jsx            # Entry point, BrowserRouter wraps App
├── index.html
├── vite.config.js
└── .eslintrc.cjs
```

## Dev Commands

```bash
cd my-react-app

npm install       # Install dependencies
npm run dev       # Start Vite dev server (hot reload)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run lint      # ESLint (max-warnings 0 — strict)
```

## Code Style & Conventions

**Files:**
- Components: `PascalCase.jsx` (e.g., `ExerciseCard.jsx`, `HeroBanner.jsx`)
- Utilities: `camelCase.js` (e.g., `fetchData.js`)
- Pages live in `src/pages/`, reusable components in `src/components/`

**Variables & Functions:**
- State setters: `set{PropertyName}` — e.g., `setBodyPart`, `setExercises`
- Event handlers: `handle{Action}` — e.g., `handleSearch`
- API option objects: `{name}Options` — e.g., `exerciseOptions`, `youtubeOptions`
- Boolean props: `is{Name}` — e.g., `isBodyParts`

**Imports (observed ordering):**
1. React and hooks
2. React Router
3. MUI components
4. Third-party libraries
5. Local components
6. Utils / assets

## Component Guidelines

**All components are functional with hooks.** No class components, no PropTypes, no TypeScript.

**Patterns in use:**
- `useState` + `useEffect` for local state and data fetching
- `useParams()` for extracting dynamic route params
- `useEffect` dependencies tied to props that trigger re-fetches (e.g., `[bodyPart]`, `[id]`)
- Prop drilling from page → child components (no Context, no Redux)
- Conditional rendering with ternary (`isLoading ? <Loader /> : <Content />`)
- `.slice()` for pagination, `.filter()` for search, `.map()` for rendering lists

**Styling:**
- Primary: MUI `sx` prop with responsive breakpoint objects `{ lg: '...', xs: '...' }`
- Breakpoints used: `xs` (mobile), `sm` (tablet), `lg` (desktop) — `md` rarely used
- Global/override styles: `App.css` (custom classes like `.exercise-card`, `.bodyPart-card`)
- Brand color: `#FF2625` (red), Background: `#FFFAFB`, Font: `Josefin Sans`
- No CSS modules, no Tailwind, no styled-components

**Component structure template:**
```jsx
import { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { fetchData, exerciseOptions } from '../utils/fetchData'

const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null)

  useEffect(() => {
    const fetchSomething = async () => {
      const data = await fetchData(url, options)
      setState(data)
    }
    fetchSomething()
  }, [dependency])

  return (
    <Box sx={{ ... }}>
      ...
    </Box>
  )
}

export default ComponentName
```

## API & Data

**`src/utils/fetchData.js` exports:**
- `exerciseOptions` — headers for ExerciseDB API (RapidAPI)
- `youtubeOptions` — headers for YouTube Search API (RapidAPI)
- `fetchData(url, options)` — generic async fetch wrapper, returns parsed JSON

**ExerciseDB endpoints used:**
- `/exercises/bodyPartList` — all body parts
- `/exercises?limit=900` — full exercise list (filtered client-side)
- `/exercises/bodyPart/{bodyPart}?limit=100`
- `/exercises/target/{target}`
- `/exercises/equipment/{equipment}`
- `/exercises/exercise/{id}`

**YouTube endpoint:** `/search?query={exerciseName} exercise` — results sliced to 3 items

## Routes

Defined in `App.jsx`, router in `main.jsx`:
- `/` → `<Home />` (search + exercise grid)
- `/exercise/:id` → `<ExerciseDetail />` (detail page)

## Rules

- **Never use class components** — all components are functional with hooks
- **Never introduce Redux or Context** unless explicitly asked — prop drilling is intentional here
- **Never use `react-scripts`** — this project uses Vite exclusively
- **Match MUI v5 API** — do not use v6/v7 syntax (e.g., no `Grid2`, no new slot APIs)
- **Responsive sx props only** — avoid inline `style={{}}` for layout; use MUI `sx`
- **Flag ambiguity** — if a change could break the existing prop-drilling chain or API integration, flag it before proceeding
- **API keys are currently hardcoded** in `fetchData.js` — do not log or expose them further; flag if asked to add new API calls

## Bug Log

<!-- Append bugs and resolutions here as they are encountered -->

## Architecture Decisions

- **Vite over CRA**: Project was migrated from Create React App to Vite. `react-scripts` remains in package.json but is unused. All builds go through Vite.
- **Prop drilling over Context**: State (`bodyPart`, `exercises`) lives in `Home.jsx` and is passed down. This is intentional for simplicity — do not abstract into Context unless the tree grows significantly.
- **Client-side API calls**: `fetchData` calls RapidAPI directly from the browser. No backend proxy exists. This is a dev/learning project — not production-ready as-is.
- **Dependencies updated (2026-03)**: All packages updated to latest within their current major version. Major version upgrades (React 19, MUI v7, React Router v7, Vite v8) deferred due to breaking changes.
