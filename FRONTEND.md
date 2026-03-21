# FRONTEND.md

> Reference doc for the Spring Boot backend. Describes what the React frontend currently does,
> what it needs from the backend, and the full API contract to implement.
> Keep this in sync with the frontend repo's CLAUDE.md.

---

## What the Frontend Is

**Muscle Forger** — a React 18 + Vite fitness app.

- Users search and browse exercises by body part, name, target muscle, or equipment
- Each exercise has a detail page (animated GIF, muscle info, YouTube videos, similar exercises)
- Users can favorite exercises, build a workout list, and view browsing history
- Dark/light mode toggle
- Fully client-side right now — no backend exists yet

**Frontend repo:** `React-Fitness-App/my-react-app/`
**Frontend runs on:** `http://localhost:5173` (Vite dev server)

---

## Current State (What Needs to Change)

### API Keys Exposed
RapidAPI keys are currently hardcoded in the frontend `.env` file and called directly from the browser. The backend must proxy these calls so keys never reach the client.

### User Data in localStorage
Favorites, workout list, and recently viewed are stored in `localStorage` with no user account. Once auth exists, these migrate to Postgres tied to the authenticated user.

| Hook | localStorage Key | Data |
|------|-----------------|------|
| `useFavorites` | `mf_favorites` | Array of exercise objects |
| `useWorkout` | `mf_workout` | Array of exercise objects |
| `useRecentlyViewed` | `mf_recently_viewed` | Array of exercise objects (capped at ~10) |

### No Caching
Every page load triggers fresh RapidAPI calls. The backend should cache exercise data (exercises don't change) to avoid hammering the rate limit.

---

## Exercise Data Shape

All exercise objects from ExerciseDB look like this:

```json
{
  "id": "0001",
  "name": "3/4 sit-up",
  "bodyPart": "waist",
  "equipment": "body weight",
  "gifUrl": "https://v2.exercisedb.io/image/...",
  "target": "abs",
  "secondaryMuscles": ["hip flexors", "lower back"],
  "instructions": ["Lie down...", "Bend your knees..."]
}
```

---

## RapidAPI Endpoints to Proxy

The backend should expose these as its own REST endpoints, calling RapidAPI internally.

### ExerciseDB (via `exercisedb.p.rapidapi.com`)

| Frontend needs | RapidAPI call | Backend endpoint to expose |
|---------------|--------------|---------------------------|
| Body part list | `GET /exercises/bodyPartList` | `GET /api/exercises/body-parts` |
| All exercises | `GET /exercises?limit=100` | `GET /api/exercises?limit=100` |
| Search (full list) | `GET /exercises?limit=900` | `GET /api/exercises/search?q={query}` — filter server-side |
| By body part | `GET /exercises/bodyPart/{bodyPart}?limit=100` | `GET /api/exercises/body-part/{bodyPart}` |
| By target muscle | `GET /exercises/target/{target}` | `GET /api/exercises/target/{target}` |
| By equipment | `GET /exercises/equipment/{equipment}` | `GET /api/exercises/equipment/{equipment}` |
| Single exercise | `GET /exercises/exercise/{id}` | `GET /api/exercises/{id}` |

### YouTube Search (via `youtube-search-and-download.p.rapidapi.com`)

| Frontend needs | RapidAPI call | Backend endpoint to expose |
|---------------|--------------|---------------------------|
| Exercise videos | `GET /search?query={name} exercise` | `GET /api/videos?exercise={name}` |

> Results are sliced to 3 items on the frontend. Backend can return more; frontend handles slicing.

---

## Auth API Contract

### Endpoints needed

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

### Register
```json
// Request
{ "email": "user@example.com", "password": "securepassword", "username": "thang" }

// Response 201
{ "token": "eyJ...", "refreshToken": "eyJ...", "user": { "id": 1, "email": "...", "username": "..." } }
```

### Login
```json
// Request
{ "email": "user@example.com", "password": "securepassword" }

// Response 200
{ "token": "eyJ...", "refreshToken": "eyJ...", "user": { "id": 1, "email": "...", "username": "..." } }
```

### Me (requires Bearer token)
```json
// Response 200
{ "id": 1, "email": "user@example.com", "username": "thang" }
```

**Token storage on frontend:** JWT stored in `localStorage` or `httpOnly` cookie (TBD). Frontend will send `Authorization: Bearer {token}` header on protected requests.

---

## User Data API Contract

All endpoints below require `Authorization: Bearer {token}`.

### Favorites

```
GET    /api/user/favorites              → list all favorites
POST   /api/user/favorites              → add favorite       body: { exerciseId: "0001" }
DELETE /api/user/favorites/{exerciseId} → remove favorite
```

### Workout List

```
GET    /api/user/workout                → list workout exercises
POST   /api/user/workout                → add to workout     body: { exerciseId: "0001" }
DELETE /api/user/workout/{exerciseId}   → remove from workout
DELETE /api/user/workout                → clear entire workout
```

### Recently Viewed

```
GET  /api/user/history                  → list recently viewed (latest first)
POST /api/user/history                  → log a view         body: { exerciseId: "0001" }
```

> Recently viewed is auto-logged when a user visits `/exercise/:id`. Cap at 20 entries per user, drop oldest.

---

## CORS

The backend must allow requests from the frontend origin:

```
http://localhost:5173   ← Vite dev server
```

Configure `@CrossOrigin` or a global `CorsConfigurationSource` bean in Spring Security.

---

## Implementation Progress

| Step | Description | Status |
|------|-------------|--------|
| 1 | **DB + JPA setup** — connect to Postgres, verify connection | ✅ Done |
| 2 | **Flyway migrations** — create `users`, `favorites`, `workout_exercises`, `recently_viewed` tables | ✅ Done |
| 3 | **Auth** — register/login with Spring Security + JWT; frontend login page + Zustand auth store | ✅ Done |
| 4 | **Exercise proxy endpoints** — proxy RapidAPI calls server-side with caching | ✅ Done |
| 5 | **User data endpoints** — favorites, workout, history (reads/writes to Postgres) | ✅ Done |
| 6 | **Frontend wiring** — swap RapidAPI calls to backend; hooks use backend when authed | ✅ Done |

### Step 3 — What was built (Auth)

**Backend (`muscleforger-api`):**
- `POST /api/auth/register` — creates user, returns `{ token, refreshToken, user }`
- `POST /api/auth/login` — validates credentials, returns `{ token, refreshToken, user }`
- `POST /api/auth/refresh` — issues new token pair from refresh token
- `POST /api/auth/logout` — stateless, client discards tokens (HTTP 204)
- `GET /api/auth/me` — returns `{ id, email, username }` (requires Bearer token)
- JWT access token expires in 15 min, refresh token in 7 days
- CORS configured for `http://localhost:5173`

**Frontend (`my-react-app`):**
- `src/utils/useAuth.js` — Zustand store; `login()`, `logout()`, `user`, `token`; persists to `localStorage`
- `src/pages/LoginPage.jsx` — email + password form at `/login`; redirects to `/` on success
- `Navbar.jsx` — shows `Hi, {username}` + logout button when authenticated; login icon when not
- Tokens stored: `mf_token`, `mf_refresh_token`, `mf_user` in `localStorage`

### Steps 4–6 — What was built (Exercise Proxy + User Data + Frontend Wiring)

**Backend (`muscleforger-api`):**
- All exercise endpoints proxying RapidAPI with `ConcurrentHashMap` cache + `@Scheduled` 6hr refresh
- `CompletableFuture.allOf()` parallel cache warm-up on startup
- Full user data CRUD: favorites, workout, history (capped at 20) tied to authenticated user

**Frontend (`my-react-app`):**
- `src/utils/api.js` — `apiFetch` (public) and `authFetch` (Bearer token) helpers
- `Exercises.jsx` → calls `/api/exercises`, `/api/exercises/body-part/{bp}`, `/api/exercises/target/{t}`
- `SearchExercises.jsx` → calls `/api/exercises/search?q={query}` (server-side filtering)
- `ExerciseDetail.jsx` → parallel `Promise.all` for `/api/exercises/{id}`, `/api/videos`, `/api/exercises/target`, `/api/exercises/equipment`
- `useFavorites.js` → backend when authed (`/api/user/favorites`), localStorage fallback when not
- `useWorkout.js` → backend when authed (`/api/user/workout`), localStorage fallback when not
- `useRecentlyViewed.js` → backend when authed (`/api/user/history`), localStorage fallback when not

**Behavior when not logged in:** All exercise browsing works. Favorites/workout/history use localStorage (same as before). On login, data loads from Postgres.

---

## Concurrency Opportunities

These are real multi-threading use cases in this project — not manufactured:

- **Parallel API calls**: Exercise detail page fires 4 RapidAPI calls. Use `CompletableFuture.allOf()` to run them concurrently instead of sequentially.
- **Thread-safe cache**: Exercise data is fetched frequently and changes rarely. Cache with `ConcurrentHashMap`, refresh via `@Scheduled` + thread pool.
- **HikariCP tuning**: Configure the DB connection pool for concurrent user requests.
- **Rate limit coordination**: Multiple users hitting exercise endpoints simultaneously — coordinate threads so they don't all hit RapidAPI at once; serve from cache instead.

---

## Backend Tech Stack

| Tool | Details |
|------|---------|
| Spring Boot | 4.0.3 |
| Java | 21 |
| Build | Maven |
| Config | YAML (`application.yml`) |
| DB | PostgreSQL + Spring Data JPA + Hibernate |
| Migrations | Flyway |
| Auth | Spring Security + JWT (added manually via pom.xml) |
| Lombok | Reduces boilerplate |
| Validation | `jakarta.validation` |
| Dev | Spring Boot DevTools |
| Group | `com.muscleforger` |
| Artifact | `muscleforger-api` |
| Package | `com.muscleforger.api` |
