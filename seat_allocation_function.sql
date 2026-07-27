-- Atomic seat allocation function
-- Run this AFTER schema.sql in the Supabase SQL Editor

-- This function is called when a student submits their fee payment.
-- It does everything in ONE transaction with a row lock, so if two students
-- pay at nearly the same moment, they cannot both grab the last seat.

create or replace function confirm_fee_payment(
  p_application_id uuid,
  p_amount numeric
)
returns text  -- returns 'admitted' or 'waitlisted'
language plpgsql
as $$
declare
  v_stream text;
  v_total_seats int;
  v_seats_filled int;
  v_result text;
begin
  -- Get the student's stream
  select desired_stream into v_stream
  from applications
  where id = p_application_id and status = 'offered';

  if v_stream is null then
    raise exception 'Application not found or not in offered status';
  end if;

  -- Lock the seat_capacity row for this stream so no other transaction
  -- can read/write it until this one finishes (this is the key line
  -- that prevents overselling seats)
  select total_seats, seats_filled into v_total_seats, v_seats_filled
  from seat_capacity
  where stream = v_stream
  for update;

  -- Record the fee payment regardless of outcome
  insert into fee_payments (application_id, amount, paid_at)
  values (p_application_id, p_amount, now());

  if v_seats_filled < v_total_seats then
    -- Seat available: confirm admission
    update seat_capacity
    set seats_filled = seats_filled + 1
    where stream = v_stream;

    update applications
    set status = 'admitted'
    where id = p_application_id;

    update fee_payments
    set seat_confirmed = true
    where application_id = p_application_id;

    v_result := 'admitted';
  else
    -- Seats already full: waitlist (fee may be refunded per your policy)
    update applications
    set status = 'waitlisted'
    where id = p_application_id;

    v_result := 'waitlisted';
  end if;

  return v_result;
end;
$$;
