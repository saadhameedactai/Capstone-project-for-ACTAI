# PrimeCampus - HSSC Admissions Portal

An admission shortlisting system for HSSC Part 1 (Arts & Science), built with
Next.js, Supabase, and the Claude API.

## How it works

1. Students apply with their SSC result percentage and desired stream.
2. **Arts**: needs SSC >= 45%. If met, an offer is made immediately.
3. **Science**: needs SSC >= 60%, then must pass a 30-question entry test
   (10 English / 10 Math / 10 Physics, pass = 15/30).
4. Students who clear all gates get an offer and a fee payment window.
5. Seats (40 Arts / 60 Science) are locked to whoever **pays the fee first**
   among eligible offer-holders - handled atomically in Postgres so seats
   can never be oversold, even under concurrent payments.
6. An AI Eligibility Explainer lets students ask "why wasn't I offered a
   seat?" and get an answer grounded in their real data and the actual rules.
   7. Screenshots of working system file are also available in files.

## Setup

### 1. Database
Run `schema.sql` then `seat_allocation_function.sql` in your Supabase
project's SQL Editor (in that order).

### 2. Environment variables
Copy `.env.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`
  from Supabase Project Settings -> API
- `ANTHROPIC_API_KEY` from console.anthropic.com

### 3. Install & run locally
```bash
npm install
npm run dev
```
Visit http://localhost:3000

### 4. Deploy
Push this repo to GitHub, then import it into Vercel. Add the same
environment variables in Vercel's Project Settings -> Environment Variables,
then deploy.

## Project structure
- `lib/eligibility.ts` - all admission rules in one auditable place
- `lib/questions.ts` - entry test question bank (server-only)
- `app/api/apply` - application submission + basic eligibility check
- `app/api/test` - serves test questions, scores submissions
- `app/api/pay` - triggers the atomic seat-locking database function
- `app/api/explain` - the AI Eligibility Explainer
  
