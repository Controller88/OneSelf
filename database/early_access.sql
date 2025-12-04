create table early_access (
  id bigint generated always as identity primary key,
  email text not null unique,
  created_at timestamptz default now()
);