# Workout Templates & Custom Exercises — Feature Spec

## Overview

Replace the existing "My Workout" quick-list with a full workout template builder. Users create named plans (e.g., "Push/Pull/Legs"), assign days (1–7), and for each day pick exercises with sets, reps, and optional RPE. Users can also create custom exercises that aren't in ExerciseDB — these appear in search results and in a dedicated "My Custom Exercises" section on the Saved page.

**My Workout is removed.** `WorkoutDrawer.jsx`, `useWorkout.js`, the workout icon in Navbar, and "Add to Workout" buttons are all deleted. The backend `workout_exercises` table and `/api/user/workout` endpoints already exist (V2 migration) — leave them in place but they will no longer be called.

---

## Data Model

```
workout_templates  (named plan, owned by user)
  └── template_days  (1–7 days, ordered by day_number)
        └── template_exercises  (exercise + sets/reps/rpe per day)

custom_exercises  (user-created, keyed as "custom_{id}" strings)
```

Custom exercise IDs use `"custom_{dbId}"` prefix (e.g., `"custom_42"`) to distinguish from ExerciseDB string IDs (e.g., `"0001"`). This lets `ExerciseService.getExerciseById()` branch on prefix with no changes to existing favorites schema.

---

## Backend

### Step 1 — Flyway Migration: `V3__create_template_tables.sql`

```sql
CREATE TABLE custom_exercises (
    id           BIGSERIAL    PRIMARY KEY,
    user_id      BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name         VARCHAR(200) NOT NULL,
    body_part    VARCHAR(100) NOT NULL,
    target       VARCHAR(100) NOT NULL,
    equipment    VARCHAR(100) NOT NULL,
    instructions TEXT,
    description  TEXT,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_custom_exercises_user ON custom_exercises(user_id);

CREATE TABLE workout_templates (
    id         BIGSERIAL    PRIMARY KEY,
    user_id    BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name       VARCHAR(100) NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_workout_templates_user ON workout_templates(user_id);

CREATE TABLE template_days (
    id          BIGSERIAL PRIMARY KEY,
    template_id BIGINT    NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
    day_number  SMALLINT  NOT NULL CHECK (day_number BETWEEN 1 AND 7),
    label       VARCHAR(50),
    UNIQUE (template_id, day_number)
);
CREATE INDEX idx_template_days_template ON template_days(template_id);

CREATE TABLE template_exercises (
    id          BIGSERIAL   PRIMARY KEY,
    day_id      BIGINT      NOT NULL REFERENCES template_days(id) ON DELETE CASCADE,
    exercise_id VARCHAR(50) NOT NULL,
    position    SMALLINT    NOT NULL DEFAULT 0,
    sets        SMALLINT    NOT NULL,
    reps        SMALLINT    NOT NULL,
    rpe         NUMERIC(3,1),
    UNIQUE (day_id, position)
);
CREATE INDEX idx_template_exercises_day ON template_exercises(day_id);
```

> `VARCHAR(50)` on `exercise_id` to accommodate `"custom_"` prefix. Existing tables use `VARCHAR(20)` — fine for ExerciseDB IDs but a future V4 migration can widen `favorites` and `workout_exercises` to `VARCHAR(50)` for consistency.

---

### Step 2 — New Entities

Follow the existing Lombok + JPA pattern (`@Entity`, `@Table`, `@Id @GeneratedValue`, `@ManyToOne(fetch = LAZY)`, `@Column`, `@CreationTimestamp` / `@UpdateTimestamp`).

| Entity | Table | Key Fields |
|--------|-------|-----------|
| `CustomExercise` | `custom_exercises` | `user (ManyToOne LAZY)`, `name`, `bodyPart`, `target`, `equipment`, `instructions?`, `description?`, `createdAt` |
| `WorkoutTemplate` | `workout_templates` | `user (ManyToOne LAZY)`, `name`, `createdAt`, `updatedAt` |
| `TemplateDay` | `template_days` | `template (ManyToOne LAZY)`, `dayNumber (Short)`, `label?` |
| `TemplateExercise` | `template_exercises` | `day (ManyToOne LAZY)`, `exerciseId`, `position (Short)`, `sets (Short)`, `reps (Short)`, `rpe (BigDecimal)?` |

---

### Step 3 — New Repositories (Spring Data derived queries)

**`CustomExerciseRepository`:**
- `findByUserOrderByCreatedAtDesc(User)`
- `findByIdAndUser(Long, User)` — ownership check
- `@Query` JPQL search: `LOWER(name) LIKE`, `LOWER(bodyPart) LIKE`, `LOWER(target) LIKE`, `LOWER(equipment) LIKE`

**`WorkoutTemplateRepository`:**
- `findByUserOrderByUpdatedAtDesc(User)`
- `findByIdAndUser(Long, User)`

**`TemplateDayRepository`:**
- `findByTemplateOrderByDayNumberAsc(WorkoutTemplate)`

**`TemplateExerciseRepository`:**
- `findByDayOrderByPositionAsc(TemplateDay)`
- `findByIdAndDay(Long, TemplateDay)`
- `@Query` max position in a day (for append ordering)

---

### Step 4 — New DTOs (Java records with jakarta.validation)

**Custom exercises:**
- `CreateCustomExerciseRequest` — `@NotBlank` name, bodyPart, target, equipment; optional instructions, description
- `CustomExerciseResponse` — id (`"custom_{n}"`), name, bodyPart, target, equipment, `gifUrl: null`, instructions, description, `boolean custom = true`

**Templates:**
- `CreateTemplateRequest` — `@NotBlank` name, `@Min(1) @Max(7)` numberOfDays
- `UpdateTemplateNameRequest` — `@NotBlank` name
- `UpdateDayLabelRequest` — optional label string
- `AddExerciseToDay` — `@NotBlank` exerciseId, `@Min(1)` sets, `@Min(1)` reps, optional rpe
- `UpdateExerciseConfig` — sets, reps, optional rpe
- `TemplateSummaryResponse` — id, name, dayCount, updatedAt
- `TemplateDetailResponse` — id, name, createdAt, updatedAt, `List<TemplateDayResponse>`
- `TemplateDayResponse` — id, dayNumber, label, `List<TemplateExerciseResponse>`
- `TemplateExerciseResponse` — id, exerciseId, position, sets, reps, rpe, exerciseDetail (enriched Object from ExerciseService)

---

### Step 5 — Modify `ExerciseService.java`

**`getExerciseById(String id)` — add custom prefix branch at top:**
```java
if (id.startsWith("custom_")) {
    Long customId = Long.parseLong(id.substring(7));
    return customExerciseService.getById(customId);
}
// existing cache logic below unchanged
```

**`searchExercises()` — add optional User overload:**
```java
public List<Object> searchExercises(String query, User user) {
    List<Object> results = new ArrayList<>(/* existing rapidapi filter */);
    if (user != null) {
        results.addAll(0, customExerciseService.search(user, query)); // prepend custom results
    }
    return results;
}
public List<Object> searchExercises(String query) {
    return searchExercises(query, null);
}
```

**`ExerciseController.search()`** — accept optional `Authentication`:
```java
@GetMapping("/search")
public List<Object> search(@RequestParam String q, Authentication auth) {
    if (auth != null) {
        User user = userRepository.findByEmail(auth.getName()).orElse(null);
        return exerciseService.searchExercises(q, user);
    }
    return exerciseService.searchExercises(q);
}
```

No security config changes needed — `/api/exercises/**` is already public; Spring sets `Authentication` to `null` for unauthenticated requests on public endpoints.

---

### Step 6 — New Services

**`CustomExerciseService`:**
- `getAll(User)` → `List<CustomExerciseResponse>`
- `create(User, CreateCustomExerciseRequest)` → `CustomExerciseResponse` `@Transactional`
- `update(User, Long id, CreateCustomExerciseRequest)` → `CustomExerciseResponse` `@Transactional`
- `delete(User, Long id)` `@Transactional`
- `search(User, String q)` → `List<CustomExerciseResponse>` (called by ExerciseService)
- `getById(Long id)` → `CustomExerciseResponse` (called by ExerciseService for `custom_` IDs)
- Private `toResponse(CustomExercise e)` — sets id as `"custom_" + e.getId()`, gifUrl as null, custom as true

**`TemplateService`:**
- `getTemplates(User)` → `List<TemplateSummaryResponse>`
- `createTemplate(User, CreateTemplateRequest)` → creates template + N `TemplateDay` rows eagerly `@Transactional`
- `getTemplate(User, Long)` → `TemplateDetailResponse` with enriched exercise details per entry via `exerciseService.getExerciseById()`
- `updateTemplateName(User, Long, UpdateTemplateNameRequest)` `@Transactional`
- `deleteTemplate(User, Long)` `@Transactional` (cascade deletes days + exercises)
- `updateDayLabel(User, Long templateId, Long dayId, UpdateDayLabelRequest)` `@Transactional`
- `addExerciseToDay(User, Long templateId, Long dayId, AddExerciseToDay)` — position = maxPosition + 1 `@Transactional`
- `updateExerciseConfig(User, Long templateId, Long dayId, Long exId, UpdateExerciseConfig)` `@Transactional`
- `removeExerciseFromDay(User, Long templateId, Long dayId, Long exId)` `@Transactional`
- Private: `findTemplateForUser(Long, User)` (throws 404), `findDay(Long, WorkoutTemplate)` (throws 404), `touchTemplate(WorkoutTemplate)` (sets updatedAt = now)

---

### Step 7 — New Controllers

Follow `UserDataController.java` exactly: `getUser(Authentication auth)` helper, `@Valid @RequestBody`, `ResponseStatusException` for ownership/not-found errors.

**`CustomExerciseController`** — `@RequestMapping("/api/user/custom-exercises")`

| Method | Path | Returns |
|--------|------|---------|
| GET | `/api/user/custom-exercises` | 200 `List<CustomExerciseResponse>` |
| POST | `/api/user/custom-exercises` | 201 `CustomExerciseResponse` |
| PUT | `/api/user/custom-exercises/{id}` | 200 `CustomExerciseResponse` |
| DELETE | `/api/user/custom-exercises/{id}` | 204 |

**`TemplateController`** — `@RequestMapping("/api/user/templates")`

| Method | Path | Returns |
|--------|------|---------|
| GET | `/api/user/templates` | 200 `List<TemplateSummaryResponse>` |
| POST | `/api/user/templates` | 201 `TemplateSummaryResponse` |
| GET | `/api/user/templates/{templateId}` | 200 `TemplateDetailResponse` |
| PATCH | `/api/user/templates/{templateId}` | 200 (rename) |
| DELETE | `/api/user/templates/{templateId}` | 204 |
| PATCH | `/api/user/templates/{templateId}/days/{dayId}` | 200 (update label) |
| POST | `/api/user/templates/{templateId}/days/{dayId}/exercises` | 201 `TemplateExerciseResponse` |
| PATCH | `/api/user/templates/{templateId}/days/{dayId}/exercises/{exId}` | 200 |
| DELETE | `/api/user/templates/{templateId}/days/{dayId}/exercises/{exId}` | 204 |

All endpoints require a valid JWT (`Authorization: Bearer {token}`). Return 401 if missing/invalid, 403/404 if user doesn't own the resource.

---

## Frontend

### Remove My Workout

**Delete these files:**
- `src/components/WorkoutDrawer.jsx`
- `src/utils/useWorkout.js`

**Strip from existing files:**
- `App.jsx` — remove `WorkoutDrawer` import, state, and `onOpenWorkout` prop
- `Navbar.jsx` — remove workout icon, badge, and `onOpenWorkout` prop
- `ExerciseCard.jsx` — remove "Add to Workout" button and `useWorkout` import
- `Detail.jsx` — remove "Add to Workout" button and `useWorkout` import

---

### New Hooks

**`src/utils/useTemplates.js`** — same pattern as removed `useWorkout.js`:
```js
export function useTemplates() {
  const { token } = useAuth();
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    if (!token) { setTemplates([]); return; }
    authFetch('/api/user/templates').then(data => setTemplates(Array.isArray(data) ? data : []));
  }, [token]);

  const createTemplate = async (name, numberOfDays) => { /* POST, append to state */ };
  const deleteTemplate = async (id) => { /* DELETE, filter from state */ };
  const renameTemplate = async (id, name) => { /* PATCH, update in state */ };

  return { templates, createTemplate, deleteTemplate, renameTemplate };
}
```

**`src/utils/useCustomExercises.js`** — same pattern as `useFavorites.js`:
```js
export function useCustomExercises() {
  const { token } = useAuth();
  const [customExercises, setCustomExercises] = useState([]);

  useEffect(() => {
    if (!token) { setCustomExercises([]); return; }
    authFetch('/api/user/custom-exercises').then(data => setCustomExercises(Array.isArray(data) ? data : []));
  }, [token]);

  const createCustomExercise = async (data) => { /* POST, prepend to state */ };
  const deleteCustomExercise = async (id) => { /* DELETE, filter from state */ };

  return { customExercises, createCustomExercise, deleteCustomExercise };
}
```

---

### New Pages

**`src/pages/PlansPage.jsx`**
- Header with "My Plans" title + "New Plan" button
- Grid of `TemplateCard` components (uses `useTemplates()`)
- Empty state when no templates
- Auth guard: redirect to `/login` if not logged in
- Follows `SavedPage.jsx` layout/style conventions

**`src/pages/TemplatePage.jsx`**
- Fetches full `TemplateDetailResponse` via `GET /api/user/templates/:templateId`
- Days displayed as MUI Tabs or accordion panels
- Each day shows list of `DayExerciseRow` components
- "Add Exercise" button per day → opens `ExercisePickerDrawer`
- Rename template inline (click-to-edit heading)

---

### New Components

**`src/components/TemplateCard.jsx`**
- Shows: name, day count, last updated date
- Actions: rename (inline edit or dialog), delete (with confirmation)
- Navigates to `/plans/:templateId` on click

**`src/components/CreateTemplateDialog.jsx`**
- MUI Dialog; name TextField + days number select (1–7)
- On submit: calls `createTemplate(name, days)` → navigates to new template's page

**`src/components/ExercisePickerDrawer.jsx`**
- Right-side MUI Drawer (temporary anchor="right")
- Debounced search field (300ms) → `GET /api/exercises/search?q=`
- "My Custom Exercises" section shown above search results (uses `useCustomExercises()`)
- Compact exercise rows: GIF thumbnail (or placeholder), name, bodyPart chip, "Add" button
- Clicking "Add" → inline form: sets (number), reps (number), RPE (optional decimal)
- On confirm: calls `POST /api/user/templates/{id}/days/{dayId}/exercises`

**`src/components/DayExerciseRow.jsx`**
- Row: position #, exercise name + bodyPart chip, `{sets}×{reps}`, RPE badge (if set), edit icon (opens inline edit), delete icon
- Delete: calls `DELETE /api/user/templates/{id}/days/{dayId}/exercises/{exId}`
- Edit: inline sets/reps/RPE update → `PATCH /api/user/templates/{id}/days/{dayId}/exercises/{exId}`

**`src/components/CreateCustomExerciseDialog.jsx`**
- MUI Dialog
- Fields: name (required TextField), body part (Select — reuse `BODY_PARTS` from `SearchExercises.jsx`), target (TextField), equipment (TextField), instructions (multiline optional), description (multiline optional)
- On submit: calls `createCustomExercise(data)` from `useCustomExercises()`

---

### Changes to Existing Files

**`ExerciseCard.jsx` — gifUrl null guard:**
```jsx
{exercise.gifUrl ? (
  <img src={exercise.gifUrl} alt={exercise.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
) : (
  <Box sx={{ aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,38,37,0.05)' }}>
    <FitnessCenter sx={{ fontSize: '64px', color: 'primary.main', opacity: 0.2 }} />
  </Box>
)}
```

**`ExerciseCard.jsx` — "Custom" badge:**
```jsx
{exercise.custom && (
  <Chip label="Custom" size="small" color="primary" variant="outlined" sx={{ position: 'absolute', top: 8, left: 8, fontSize: '10px' }} />
)}
```

**`Navbar.jsx` — add "Plans" link (after "Saved"):**
```jsx
const isPlansActive = location.pathname.startsWith('/plans');

{user && (
  <Box sx={{ position: 'relative' }}>
    <Link to="/plans" style={{ ...navLinkStyle, color: isPlansActive ? theme.palette.primary.main : theme.palette.text.secondary }}>
      Plans
    </Link>
    <AnimatePresence>{isPlansActive && <NavUnderline />}</AnimatePresence>
  </Box>
)}
```

**`SavedPage.jsx` — add third section "My Custom Exercises":**
- Uses `useCustomExercises()` hook
- Same `SectionHeader` + `EmptyState` pattern as favorites/history sections
- "Create Custom Exercise" button → opens `CreateCustomExerciseDialog`
- Renders exercises as `ExerciseCard` grid (gifUrl placeholder handles no-gif)

**`ExerciseDetail.jsx` — guard for custom exercise IDs:**
```jsx
const isCustom = id.startsWith('custom_');
// Skip YouTube video fetch if isCustom
// Skip similar exercises fetch if isCustom
// Don't render <ExerciseVideos /> or <SimilarExercises /> if isCustom
```

**`App.jsx` — new routes:**
```jsx
<Route path="/plans" element={<PlansPage />} />
<Route path="/plans/:templateId" element={<TemplatePage />} />
```

---

## Implementation Order

| # | What |
|---|------|
| 1 | V3 Flyway migration SQL |
| 2 | `CustomExercise` entity + repo + `CustomExerciseService` + `CustomExerciseController` |
| 3 | `ExerciseService` modifications (`custom_` prefix routing + search merge) |
| 4 | Template entities + repos (`WorkoutTemplate`, `TemplateDay`, `TemplateExercise`) |
| 5 | `TemplateService` + `TemplateController` |
| 6 | **Frontend** — Remove My Workout (`WorkoutDrawer`, `useWorkout`, Navbar icon, card buttons) |
| 7 | `ExerciseCard` gifUrl null guard + Custom badge |
| 8 | `useCustomExercises` hook + `CreateCustomExerciseDialog` + SavedPage "My Custom Exercises" section |
| 9 | `useTemplates` hook + `PlansPage` + `CreateTemplateDialog` + Navbar "Plans" link |
| 10 | `TemplatePage` + `ExercisePickerDrawer` + `DayExerciseRow` |

---

## Verification

1. **Custom exercises (backend):** `POST /api/user/custom-exercises` → then `GET /api/exercises/search?q={name}` (with auth header) → confirm response includes entry with `"custom": true`
2. **Templates (backend):** `POST /api/user/templates` with `{ name, numberOfDays: 3 }` → `POST /api/user/templates/{id}/days/{dayId}/exercises` → `GET /api/user/templates/{id}` → verify nested days + enriched exercise objects
3. **My Workout removed:** Confirm no workout drawer, no workout icon in navbar, no "Add to Workout" buttons anywhere
4. **Custom exercise display (frontend):** Create custom exercise → appears in SavedPage "My Custom Exercises" + in search results with placeholder image and "Custom" badge
5. **Plan builder (frontend):** `/plans` → create plan → open day → add exercise → verify sets/reps/RPE stored and displayed
6. **ExerciseDetail guard:** `/exercise/custom_1` → page renders without crashing; no YouTube section, no similar exercises section
7. **Auth gates:** "Plans" link hidden when not logged in; all `/api/user/templates/**` and `/api/user/custom-exercises/**` return 401 without token
