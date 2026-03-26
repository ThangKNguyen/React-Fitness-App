# Muscle Forger

A full-stack fitness web app for discovering exercises, building workout plans, and tracking your training library.

**Live:** [muscleforger.netlify.app](https://muscleforger.netlify.app)
**Backend:** [muscleforger-api](https://github.com/ThangKNguyen/muscleforger-api)

---

## Features

- **Exercise Browser** — Search thousands of exercises by name, body part, target muscle, or equipment. Each exercise includes an animated GIF, muscle diagrams, related YouTube videos, and similar movements.
- **Workout Plans** — Create custom weekly training templates with named days and structured exercise lists. Reorder exercises via drag-and-drop or arrow controls. Add notes to individual exercises.
- **Starter Templates** — Import expert-designed splits (3-Day Full Body, 4-Day Upper/Lower, 5-Day PPL, 5-Day Bro Split) with one click.
- **Saved Library** — Favorite exercises and revisit your browsing history from a dedicated saved page.
- **Custom Exercises** — Create your own exercises when the database doesn't have what you need.
- **Authentication** — JWT-based auth with register and login. All user data is persisted server-side.
- **Dark / Light Mode** — System-aware theme with manual toggle.

---

## Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React 18 + Vite | UI framework and build tool |
| React Router v6 | Client-side routing |
| MUI v5 | Component library and theming |
| Zustand | Auth state and shared data stores |
| Framer Motion | Page transitions and animations |
| @dnd-kit | Drag-and-drop exercise reordering |

### Backend
| Tool | Purpose |
|------|---------|
| Spring Boot | REST API |
| PostgreSQL | Persistent storage |
| JWT | Stateless authentication |
| Flyway | Database migrations |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A running instance of the [backend API](https://github.com/ThangKNguyen/muscleforger-api)

### Setup

```bash
cd my-react-app
npm install
```

Create a `.env` file in `my-react-app/`:

```env
VITE_API_URL=http://localhost:8080
```

### Run

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

---

## Project Structure

```
my-react-app/src/
├── components/     # Reusable UI components
├── pages/          # Route-level page components
├── utils/          # Hooks, API helpers, Zustand stores
├── data/           # Static data (preset templates)
└── assets/         # Icons and images
```

---

## Deployment

- **Frontend** — Netlify (auto-deploys from `main`). Set `VITE_API_URL` in Netlify environment variables.
- **Backend** — AWS (EC2/Elastic IP) and SupaBase. See the [backend repo](https://github.com/ThangKNguyen/muscleforger-api) for setup.
