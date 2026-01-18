-- Organic Fuel CRM Schema
-- Run this in your Supabase SQL Editor

-- Leads table: Core contact records
create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  source text check (source in ('chat','form')) not null,
  status text default 'new',
  outbound_sms_count int default 0,
  created_at timestamp with time zone default now()
);

-- Messages table: Complete communication history
create table messages (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  direction text check (direction in ('inbound','outbound')) not null,
  channel text check (channel in ('chat','sms','email')) not null,
  body text not null,
  created_at timestamp with time zone default now()
);

-- Notifications table: Delivery tracking
create table notifications (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  type text check (type in ('sms','email')) not null,
  recipients text,
  status text,
  created_at timestamp with time zone default now()
);

-- Indexes for performance
create index idx_leads_created_at on leads(created_at desc);
create index idx_leads_status on leads(status);
create index idx_messages_lead_id on messages(lead_id);
create index idx_messages_created_at on messages(created_at desc);
create index idx_notifications_lead_id on notifications(lead_id);

-- Enable Row Level Security (optional, for future auth)
alter table leads enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;

-- Service role bypass (functions use service key)
create policy "Service role full access" on leads for all using (true);
create policy "Service role full access" on messages for all using (true);
create policy "Service role full access" on notifications for all using (true);
