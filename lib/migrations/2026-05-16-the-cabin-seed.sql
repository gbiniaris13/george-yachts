-- =============================================================
-- THE CABIN — seed data for local dev / staging only.
--
-- Creates one synthetic cabin so the end-to-end flow can be
-- exercised without touching real client data.
--
-- WARNING: NEVER run this in production. The principal charterer
-- email is george@georgeyachts.com — when you visit /cabin/login
-- and enter that email, you will receive the magic link in your
-- own inbox and can step through the client experience.
--
-- To reset:   delete from cabins where vessel_name = 'M/Y Test Vessel';
-- =============================================================

do $$
declare
  v_cabin_id uuid;
begin
  -- Idempotent cleanup
  delete from cabins where vessel_name = 'M/Y Test Vessel';

  insert into cabins (
    status,
    vessel_name, vessel_make_model, vessel_length, vessel_capacity, homeport,
    charter_period_from, charter_period_to,
    port_embarkation, port_disembarkation, cruising_area,
    principal_charterer_name, principal_charterer_email, principal_charterer_mobile,
    captain_name_internal, chef_name_internal, hostess_name_internal,
    crew_display,
    sample_menu,
    inspiration_content,
    brief_completion_percent
  )
  values (
    'invited',
    'M/Y Test Vessel', 'Sunreef 50 Power', '51 ft', 10, 'Piraeus',
    '2027-07-15', '2027-07-22',
    'Piraeus', 'Mykonos', 'Cyclades',
    'George P. Biniaris (test)', 'george@georgeyachts.com', '+30 6970 380 999',
    'Captain Stavros', 'Chef Nikos', 'Hostess Eleni',
    '[
       {"first_name":"Stavros","role":"Captain","bio":"Twenty-two years across Greek waters. Quiet, exacting, generous at sundown."},
       {"first_name":"Nikos","role":"Chef","bio":"Trained in Crete and Paris. Plays with what the islands offer that morning."},
       {"first_name":"Eleni","role":"Hostess","bio":"Athenian. Speaks five languages. Loves the music more than the cocktails."}
     ]'::jsonb,
    '{"sample":true}'::jsonb,
    '{"sample":true}'::jsonb,
    0
  )
  returning id into v_cabin_id;

  insert into cabin_members (cabin_id, role, email, display_name, mobile)
  values (v_cabin_id, 'principal_charterer', 'george@georgeyachts.com', 'George P. Biniaris', '+30 6970 380 999');

  -- Pre-create empty section rows (one per section), so the brief
  -- overview page can show all of them straight away.
  insert into cabin_brief_sections (cabin_id, section_key, data)
  select v_cabin_id, k, '{}'::jsonb
  from unnest(array[
    'arrival', 'guests', 'health', 'itinerary', 'life_aboard',
    'dining', 'beverages', 'little_things'
  ]::brief_section_key[]) as k;

  raise notice 'Seeded test cabin %', v_cabin_id;
end $$;
