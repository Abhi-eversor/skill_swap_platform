# Skill Swap Platform

A React and Express app for exchanging skills with other members. Users can create a profile, find people by skill and availability, and manage swap requests.

Project built for Odoo India Hackathon 2025.

## What works

- Registration and login with a one-day session.
- Profile editing, including skills offered, skills wanted, availability and public/private visibility.
- Public profiles with name, skill and availability search.
- Swap requests with a message. The recipient can accept or reject a pending request; the sender can cancel it.

Ratings, reviews, password reset and administration tools are not implemented.

## Run locally

Use Node.js 22.12 or later and a local MongoDB instance or your own MongoDB connection string.

```sh
git clone https://github.com/Abhi-eversor/skill_swap_platform.git
cd skill_swap_platform
npm --prefix Backend ci
npm --prefix Frontend ci
```

Create `Backend/.env` from `Backend/.env.example`, preserving any existing local settings:

- `MONGO_URI`: your MongoDB connection string.
- `JWT_SECRET`: a random secret of at least 32 characters.
- `FRONTEND_URL`: `http://localhost:5173` for local development.
- `PORT`: `5000` by default.

Generate a secret with:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Start the API in one terminal:

```sh
npm run dev:backend
```

Start the frontend in another:

```sh
npm run dev:frontend
```

Open `http://localhost:5173`. The Vite development server forwards `/api` to the API on port 5000. To use a different API origin, set `VITE_API_URL` using `Frontend/.env.example`. For a production build, configure that URL or have your web server forward `/api` to Express.

On Windows PowerShell, use `npm.cmd` if the execution policy blocks `npm.ps1`.

## Checks

```sh
npm test
npm run lint
npm run build
```

The API tests use an in-memory model fixture and exercise HTTP validation, authentication, profile visibility and swap permissions. They do not require a running MongoDB instance. Running the app itself requires MongoDB.

## API

| Route | Purpose |
| --- | --- |
| `POST /api/user/register` | Create an account and session |
| `POST /api/user/login` | Sign in |
| `GET /api/user/me` | Read your profile |
| `PATCH /api/user/me` | Edit your profile |
| `GET /api/users?q=&availability=` | Search public profiles |
| `GET /api/users/:id` | Read a public profile, or your own private profile |
| `GET /api/swaps` | List your sent and received requests |
| `POST /api/swaps` | Request a swap |
| `GET /api/swaps/:id` | Read a request you participate in |
| `PATCH /api/swaps/:id` | Accept, reject or cancel a pending request |

Authenticated routes expect `Authorization: Bearer <token>`. The API returns validation errors as `{ "message": "..." }`.

`Backend/` contains the Express API and Mongoose models. `Frontend/` contains the React app, Vite configuration and browser API client. Dependency folders, build output and local environment files are excluded from Git.

