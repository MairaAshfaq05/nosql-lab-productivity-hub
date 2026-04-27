# NoSQL Lab — Personal Productivity Hub

Boilerplate for the in-class NoSQL lab. The webapp is fully built — your job is to bring its database layer to life.

---

## Submission workflow (read first)

This lab is GitHub-based. You **fork** this repo, work on your own public fork, then submit your fork's URL.

### Step by step

1. **Fork** this repository on GitHub. Keep your fork **public** until grading completes — private forks cannot be reviewed.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start MongoDB.** Pick **one**:
   - **Docker (preferred):** `docker compose up -d`
   - **Local install:** MongoDB Community Edition running on `localhost:27017`
   - **Atlas (fallback):** free M0 cluster, paste connection string into `.env`
5. **Configure environment:**
   ```bash
   cp .env.example .env
   # only edit .env 
   ```
6. **Implement** the lab work (see "What you do" below).
7. **Run and verify:**
   ```bash
   npm run seed   # only after seed.js is implemented
   npm start      # http://localhost:3000
   ```
   Each unimplemented query produces an error page telling you which function to fix next.
8. **Commit as you go:**
   ```bash
   git add .
   git commit -m "implement signup query"
   ```
9. **Take screenshots** and put them in `screenshots/`:
   - `screenshots/dashboard.png` — working dashboard with seeded data
   - `screenshots/aggregation.png` — output of query 14 in Compass or terminal
10. **Push** to your fork:
    ```bash
    git push origin main
    ```
11. **Submit your fork URL** via the form/email shared by your instructor — **before the session ends**.

### Workflow rules

- Your fork must remain **public** until grading completes.
- Only commits pushed by the session deadline are evaluated.
- Each student forks individually — **shared forks are treated as a violation of the individual-work rule**.

---

## What you do

1. Design the schema and document it in `MODELING.md`
2. Fill in `seed.js` to load realistic test data
3. Implement all 15 query functions in `db/queries.js`

That's it. Do **not** edit anything in `routes/`, `views/`, `server.js`, or `middleware/`.

---

## Order of work (suggested)

The app fails fast on any unimplemented query — error pages tell you which one to fix next. A natural order:

1. **Schema** — Fill in `MODELING.md` first. Don't skip this; the rest is easier with a plan.
2. **Seed** — `seed.js`. Insert at least 2 users, 4 projects, 20 tasks, 10 notes.
3. **Auth** — Queries 1–2. Now you can sign up and log in.
4. **Projects** — Queries 3–5. Projects page works.
5. **Tasks** — Queries 6–12. Project detail page comes alive.
6. **Notes** — Query 13.
7. **Dashboard** — Queries 14–15. The two `$lookup` pipelines are last because they're the hardest.

---

## Where the queries fit

| Query | File that calls it          | Page that uses it |
|-------|------------------------------|------------------|
| 1     | `routes/auth.js`            | /signup           |
| 2     | `routes/auth.js`            | /login            |
| 3     | `routes/projects.js`        | /projects         |
| 4     | `routes/projects.js`        | /projects (POST)  |
| 5     | `routes/projects.js`        | /projects/:id/archive |
| 6     | `routes/projects.js`        | /projects/:id     |
| 7     | `routes/tasks.js`           | /tasks (POST)     |
| 8     | `routes/tasks.js`           | task status form  |
| 9     | `routes/tasks.js`           | tag add form      |
| 10    | `routes/tasks.js`           | tag remove button |
| 11    | `routes/tasks.js`           | subtask checkbox  |
| 12    | `routes/tasks.js`           | task delete button |
| 13    | `routes/notes.js`           | /notes?tags=...   |
| 14    | `routes/dashboard.js`       | /dashboard        |
| 15    | `routes/dashboard.js`       | /dashboard        |

---

## Rules

- Use the **native** `mongodb` driver only. **No Mongoose** or any other ODM.
- Do not change function names, parameters, or return shapes in `db/queries.js`.
- Individual work — discussing approach is fine; sharing code is not.