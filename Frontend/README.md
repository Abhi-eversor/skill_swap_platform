# Frontend

React client for Skill Swap Platform. Install with `npm ci`, then run `npm run dev`. Start the backend on port 5000 first; Vite proxies `/api` to it.

For a separate API host, set `VITE_API_URL` in `.env` before building. Production hosting must forward client-side routes to `index.html` and route `/api` to the backend, or use a separate `VITE_API_URL`.

`npm run lint` checks the source; `npm run build` creates `dist/`.

See the [project README](../README.md) for backend setup and supported features.
