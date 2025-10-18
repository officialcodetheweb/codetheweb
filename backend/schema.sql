-- Run this in your Postgres DB to create tables
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE registrants (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  age INTEGER,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT,
  occupation TEXT,
  interest_area TEXT,
  experience TEXT,
  program_type TEXT,
  registration_id TEXT UNIQUE,
  payment_status TEXT DEFAULT 'UNPAID',
  payment_ref TEXT,
  qr_code TEXT,
  attended BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  registrant_id INTEGER REFERENCES registrants(id) ON DELETE CASCADE,
  ref TEXT UNIQUE,
  amount INTEGER,
  currency TEXT,
  gateway TEXT,
  status TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now()
);
