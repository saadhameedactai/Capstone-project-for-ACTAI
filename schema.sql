-- PrimeCampus Admission System Schema
-- Run this in Supabase SQL Editor (Project -> SQL Editor -> New Query)

-- 1. Students & their applications
create table applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  cnic_or_bform text not null unique,       -- unique to prevent duplicate applications
  email text not null,
  phone text not null,

  ssc_percentage numeric(5,2) not null check (ssc_percentage >= 0 and ssc_percentage <= 100),
  ssc_result_url text,                       -- uploaded result card (Supabase Storage path)

  desired_stream text not null check (desired_stream in ('Arts','Science')),
  subject_combination text not null,         -- e.g. "Pre-Medical", "Pre-Engineering", "Humanities"

  -- computed / workflow status
  basic_eligible boolean not null default false,   -- SSC% threshold met
  status text not null default 'applied' check (status in (
    'applied',            -- just submitted
    'not_eligible',       -- failed SSC% threshold
    'awaiting_test',      -- Science stream, waiting to take entry test
    'test_failed',        -- Science stream, failed entry test
    'offered',            -- passed all gates, fee window open
    'admitted',           -- paid fee, seat locked
    'waitlisted',         -- passed all gates but seats filled before they paid
    'offer_expired'       -- didn't pay before deadline
  )),

  fee_deadline timestamptz,
  created_at timestamptz not null default now()
);

-- 2. Entry test results (Science stream only)
create table entry_test_results (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  english_score int not null check (english_score between 0 and 10),
  math_score int not null check (math_score between 0 and 10),
  physics_score int not null check (physics_score between 0 and 10),
  total_score int generated always as (english_score + math_score + physics_score) stored,
  passed boolean generated always as (english_score + math_score + physics_score >= 15) stored,
  taken_at timestamptz not null default now(),
  unique (application_id)  -- one attempt per applicant
);

-- 3. Fee payments -- this is what actually locks a seat (FCFS by payment time)
create table fee_payments (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade unique,
  amount numeric(10,2) not null,
  paid_at timestamptz not null default now(),
  seat_confirmed boolean not null default false
);

-- 4. Seat capacity config (single row per stream)
create table seat_capacity (
  stream text primary key check (stream in ('Arts','Science')),
  total_seats int not null,
  seats_filled int not null default 0
);

insert into seat_capacity (stream, total_seats, seats_filled) values
  ('Arts', 40, 0),
  ('Science', 60, 0);

-- Index to speed up eligibility/status queries
create index idx_applications_status on applications(status);
create index idx_applications_stream on applications(desired_stream);
