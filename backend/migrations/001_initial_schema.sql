-- Gopher Lab API — PostgreSQL schema (matches internal/database.MigratePostgres).
-- Apply: psql "$DATABASE_URL" -f migrations/001_initial_schema.sql

CREATE TABLE IF NOT EXISTS leads (
	id SERIAL PRIMARY KEY,
	name TEXT,
	phone TEXT,
	email TEXT,
	experience TEXT,
	salary TEXT,
	goal TEXT,
	status TEXT DEFAULT 'new',
	notes TEXT,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);

CREATE TABLE IF NOT EXISTS appointments (
	id SERIAL PRIMARY KEY,
	lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
	scheduled_at TIMESTAMPTZ NOT NULL,
	status TEXT NOT NULL DEFAULT 'pending',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_lead ON appointments(lead_id);

CREATE TABLE IF NOT EXISTS payments (
	id SERIAL PRIMARY KEY,
	lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
	amount BIGINT NOT NULL,
	status TEXT NOT NULL DEFAULT 'created',
	payment_id TEXT NOT NULL DEFAULT '',
	order_id TEXT NOT NULL DEFAULT '',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_lead ON payments(lead_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);

ALTER TABLE payments ADD COLUMN IF NOT EXISTS pending_appointment_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS proofs (
	id SERIAL PRIMARY KEY,
	type TEXT NOT NULL,
	url TEXT NOT NULL,
	preview_url TEXT NOT NULL DEFAULT '',
	unlocked BOOLEAN NOT NULL DEFAULT false,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employees (
	id SERIAL PRIMARY KEY,
	employee_code TEXT UNIQUE,
	name TEXT NOT NULL,
	email TEXT,
	phone TEXT,
	role_title TEXT,
	department TEXT,
	experience TEXT,
	resume_url TEXT NOT NULL DEFAULT '',
	monthly_salary_paise BIGINT NOT NULL DEFAULT 0,
	incentives_notes TEXT NOT NULL DEFAULT '',
	start_date DATE NOT NULL,
	end_date DATE,
	status TEXT NOT NULL DEFAULT 'active',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_created ON employees(created_at);

CREATE TABLE IF NOT EXISTS employee_salary_payments (
	id SERIAL PRIMARY KEY,
	employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
	period_month DATE NOT NULL,
	amount_paise BIGINT NOT NULL,
	incentive_paise BIGINT NOT NULL DEFAULT 0,
	notes TEXT NOT NULL DEFAULT '',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE(employee_id, period_month)
);

CREATE INDEX IF NOT EXISTS idx_emp_pay_employee ON employee_salary_payments(employee_id);

CREATE TABLE IF NOT EXISTS admin_users (
	id SERIAL PRIMARY KEY,
	email TEXT NOT NULL UNIQUE,
	password_hash TEXT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email_lower ON admin_users (lower(trim(email)));
