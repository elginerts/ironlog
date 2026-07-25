# IronLog

Social workout tracking backed exclusively by Supabase Auth and Postgres.

## Local setup

1. Back up an existing database, then apply the migration in
   `supabase/migrations`. See `supabase/README.md` for the legacy-user rollout.
2. Copy `backend/.env.example` and `frontend/.env.example` to `.env` in their
   respective folders and fill in the Supabase values. Never expose the backend
   service-role key to the frontend.
3. Run `npm install` and `npm run dev` in `backend`.
4. Run `npm install` and `npm run dev` in `frontend`.

The frontend defaults to `http://localhost:5173` and calls the backend at
`http://localhost:3000`.

## Verification

Run `npm run build` in both folders. In `frontend`, also run
`npm run test:run` and `npm run lint`.
