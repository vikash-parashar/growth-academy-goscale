package database

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	_ "github.com/lib/pq"
)

// OpenPostgres opens a PostgreSQL pool using database/sql + pq driver.
func OpenPostgres(dsn string) (*sql.DB, error) {
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(time.Hour)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := db.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("ping postgres: %w", err)
	}
	return db, nil
}

// MigratePostgres applies schema (idempotent).
func MigratePostgres(ctx context.Context, db *sql.DB) error {
	stmts := []string{
		`CREATE TABLE IF NOT EXISTS leads (
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
		);`,
		`CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);`,
		`CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);`,

		`CREATE TABLE IF NOT EXISTS appointments (
			id SERIAL PRIMARY KEY,
			lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
			scheduled_at TIMESTAMPTZ NOT NULL,
			status TEXT NOT NULL DEFAULT 'pending',
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);`,
		`CREATE INDEX IF NOT EXISTS idx_appointments_lead ON appointments(lead_id);`,

		`CREATE TABLE IF NOT EXISTS payments (
			id SERIAL PRIMARY KEY,
			lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
			amount BIGINT NOT NULL,
			status TEXT NOT NULL DEFAULT 'created',
			payment_id TEXT NOT NULL DEFAULT '',
			order_id TEXT NOT NULL DEFAULT '',
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);`,
		`CREATE INDEX IF NOT EXISTS idx_payments_lead ON payments(lead_id);`,
		`CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);`,
		`ALTER TABLE payments ADD COLUMN IF NOT EXISTS pending_appointment_at TIMESTAMPTZ;`,

		`CREATE TABLE IF NOT EXISTS proofs (
			id SERIAL PRIMARY KEY,
			type TEXT NOT NULL,
			url TEXT NOT NULL,
			preview_url TEXT NOT NULL DEFAULT '',
			unlocked BOOLEAN NOT NULL DEFAULT false,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);`,

		`CREATE TABLE IF NOT EXISTS employees (
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
		);`,
		`CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);`,
		`CREATE INDEX IF NOT EXISTS idx_employees_created ON employees(created_at);`,

		`CREATE TABLE IF NOT EXISTS employee_salary_payments (
			id SERIAL PRIMARY KEY,
			employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
			period_month DATE NOT NULL,
			amount_paise BIGINT NOT NULL,
			incentive_paise BIGINT NOT NULL DEFAULT 0,
			notes TEXT NOT NULL DEFAULT '',
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			UNIQUE(employee_id, period_month)
		);`,
		`CREATE INDEX IF NOT EXISTS idx_emp_pay_employee ON employee_salary_payments(employee_id);`,

		`CREATE TABLE IF NOT EXISTS admin_users (
			id SERIAL PRIMARY KEY,
			email TEXT NOT NULL UNIQUE,
			password_hash TEXT NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);`,
		`CREATE INDEX IF NOT EXISTS idx_admin_users_email_lower ON admin_users (lower(trim(email)));`,

		// Seed default portal admin (bcrypt cost 10 for "Vikash@9966"). Idempotent.
		`INSERT INTO admin_users (email, password_hash) VALUES (
			'gowithvikash@gmail.com',
			'$2a$10$FZbQRC6A8m6ys/6Qo2qQ2uNLn5ehAvV1XsQ8jWYTuaFCFRGtvlgSW'
		) ON CONFLICT (email) DO NOTHING;`,

		// === STUDENT LEARNING SYSTEM ===
		`CREATE TABLE IF NOT EXISTS students (
			id SERIAL PRIMARY KEY,
			first_name TEXT NOT NULL,
			last_name TEXT NOT NULL,
			email TEXT NOT NULL UNIQUE,
			phone TEXT NOT NULL,
			whatsapp_number TEXT NOT NULL DEFAULT '',
			user_id TEXT NOT NULL UNIQUE,
			password_hash TEXT NOT NULL,
			goal TEXT NOT NULL DEFAULT '',
			status TEXT NOT NULL DEFAULT 'active',
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);`,
		`CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);`,
		`CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);`,
		`CREATE INDEX IF NOT EXISTS idx_students_created ON students(created_at);`,

		`CREATE TABLE IF NOT EXISTS payment_plans (
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			description TEXT NOT NULL,
			plan_type TEXT NOT NULL,
			total_amount_paise BIGINT NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);`,
		`INSERT INTO payment_plans (name, description, plan_type, total_amount_paise) VALUES 
			('One Time Payment', 'Pay full amount upfront', 'one_time', 300000000),
			('Two Part Payment', '50% now, 50% during program', 'two_part', 300000000),
			('EMI 6 Months', '5 EMIs of ₹50,000/month + 6th month free (₹250,000 total)', 'emi', 250000000)
		ON CONFLICT DO NOTHING;`,

		`CREATE TABLE IF NOT EXISTS student_payments (
			id SERIAL PRIMARY KEY,
			student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
			payment_plan_id INTEGER NOT NULL REFERENCES payment_plans(id),
			total_amount_paise BIGINT NOT NULL,
			paid_amount_paise BIGINT NOT NULL DEFAULT 0,
			pending_amount_paise BIGINT NOT NULL,
			status TEXT NOT NULL DEFAULT 'pending',
			started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			UNIQUE(student_id)
		);`,
		`CREATE INDEX IF NOT EXISTS idx_student_payments_student ON student_payments(student_id);`,
		`CREATE INDEX IF NOT EXISTS idx_student_payments_status ON student_payments(status);`,

		`CREATE TABLE IF NOT EXISTS payment_transactions (
			id SERIAL PRIMARY KEY,
			student_payment_id INTEGER NOT NULL REFERENCES student_payments(id) ON DELETE CASCADE,
			amount_paise BIGINT NOT NULL,
			payment_date TIMESTAMPTZ NOT NULL,
			payment_mode TEXT NOT NULL,
			razorpay_id TEXT NOT NULL DEFAULT '',
			status TEXT NOT NULL DEFAULT 'completed',
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);`,
		`CREATE INDEX IF NOT EXISTS idx_payment_transactions_student ON payment_transactions(student_payment_id);`,

		`CREATE TABLE IF NOT EXISTS learning_courses (
			id SERIAL PRIMARY KEY,
			title TEXT NOT NULL,
			description TEXT NOT NULL,
			duration_days INTEGER NOT NULL DEFAULT 180,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);`,
		`INSERT INTO learning_courses (title, description, duration_days) VALUES 
			('Go Developer Bootcamp', 'Learn Go from zero to full-stack developer in 180 days', 180)
		ON CONFLICT DO NOTHING;`,

		`CREATE TABLE IF NOT EXISTS learning_modules (
			id SERIAL PRIMARY KEY,
			course_id INTEGER NOT NULL REFERENCES learning_courses(id) ON DELETE CASCADE,
			title TEXT NOT NULL,
			description TEXT NOT NULL,
			order_index INTEGER NOT NULL,
			total_days INTEGER NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);`,
		`INSERT INTO learning_modules (course_id, title, description, order_index, total_days) VALUES
		(1, 'Computer Fundamentals', 'Understand the basics of computers, hardware, and how they work', 1, 30),
		(1, 'Terminal & Shell', 'Master the command line interface and shell scripting', 2, 20),
		(1, 'Git & Version Control', 'Learn Git workflows and collaborative development practices', 3, 15),
		(1, 'Go Basics', 'Introduction to Go syntax, variables, functions, and control flows', 4, 50),
		(1, 'Go Advanced Topics', 'Goroutines, channels, interfaces, and concurrent programming in Go', 5, 65)
	ON CONFLICT DO NOTHING;`,

		`CREATE TABLE IF NOT EXISTS learning_sessions (
		id SERIAL PRIMARY KEY,
		module_id INTEGER NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
		session_name TEXT NOT NULL,
		day_number INTEGER NOT NULL,
		content TEXT NOT NULL,
		code_examples TEXT NOT NULL DEFAULT '[]',
		has_mock_test BOOLEAN NOT NULL DEFAULT false,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);`,
		`INSERT INTO learning_sessions (module_id, session_name, day_number, content, code_examples, has_mock_test) VALUES
		((SELECT id FROM learning_modules WHERE title='Computer Fundamentals' AND course_id=1 LIMIT 1), 'What is a Computer?', 1, '<h2>Understanding Computers</h2><p>A computer is an electronic device that processes data. In this session, we will learn about the basic components of a computer.</p><h3>Key Components:</h3><ul><li>CPU - Central Processing Unit</li><li>RAM - Memory for running programs</li><li>Storage - Hard Disk/SSD</li><li>Motherboard - Connects all components</li></ul>', '[]', false),
		((SELECT id FROM learning_modules WHERE title='Computer Fundamentals' AND course_id=1 LIMIT 1), 'Hardware vs Software', 2, '<h2>Hardware vs Software</h2><p>Understanding the difference between physical components and programs that run on them.</p><h3>Hardware:</h3><p>Physical devices you can touch - monitor, keyboard, CPU, RAM</p><h3>Software:</h3><p>Programs and applications - Windows, macOS, Chrome browser</p>', '[]', false),
		((SELECT id FROM learning_modules WHERE title='Terminal & Shell' AND course_id=1 LIMIT 1), 'Introduction to Terminal', 1, '<h2>Getting Started with Terminal</h2><p>The terminal (or command line) is a text-based interface to your computer. Instead of clicking buttons, you type commands.</p><h3>Why Terminal?</h3><ul><li>Faster for developers</li><li>Direct access to system files</li><li>Automation capabilities</li><li>Remote server management</li></ul>', '[]', false),
		((SELECT id FROM learning_modules WHERE title='Terminal & Shell' AND course_id=1 LIMIT 1), 'Basic Terminal Commands', 2, '<h2>Essential Commands</h2><p>Learn the most important terminal commands:</p><ul><li><code>ls</code> - List files</li><li><code>cd</code> - Change directory</li><li><code>pwd</code> - Print working directory</li><li><code>mkdir</code> - Make directory</li><li><code>touch</code> - Create file</li></ul>', '[]', false),
		((SELECT id FROM learning_modules WHERE title='Git & Version Control' AND course_id=1 LIMIT 1), 'Introduction to Git', 1, '<h2>What is Version Control?</h2><p>Version control tracks changes to your code over time. Git is the most popular version control system.</p><h3>Why Git?</h3><ul><li>Track code changes</li><li>Collaborate with others</li><li>Revert to previous versions</li><li>Manage branches and features</li></ul>', '[]', false),
		((SELECT id FROM learning_modules WHERE title='Go Basics' AND course_id=1 LIMIT 1), 'Hello World in Go', 1, '<h2>Your First Go Program</h2><p>Let us write our first Go program!</p><pre class=\"bg-slate-800 p-4 rounded\">package main\nimport \"fmt\"\nfunc main() {\n  fmt.Println(\"Hello, World!\")\n}</pre>', '[{"language":"go","code":"package main\\nimport \\\"fmt\\\"\\nfunc main() {\\n  fmt.Println(\\\"Hello, World!\\\")\\n}"}]', true),
		((SELECT id FROM learning_modules WHERE title='Go Basics' AND course_id=1 LIMIT 1), 'Variables and Data Types', 2, '<h2>Variables in Go</h2><p>Variables store data. Go has static typing - you must declare the type.</p><pre class=\"bg-slate-800 p-4 rounded\">var age int = 25\nvar name string = \"Alice\"\nvar balance float64 = 1000.50</pre>', '[{"language":"go","code":"var age int = 25\\nvar name string = \\\"Alice\\\"\\nvar balance float64 = 1000.50\\nfmt.Println(age, name, balance)"}]', true)
	ON CONFLICT DO NOTHING;`,
		`CREATE INDEX IF NOT EXISTS idx_learning_sessions_module ON learning_sessions(module_id);`,

		`CREATE TABLE IF NOT EXISTS student_attendance (
			id SERIAL PRIMARY KEY,
			student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
			session_id INTEGER NOT NULL REFERENCES learning_sessions(id) ON DELETE CASCADE,
			attended BOOLEAN NOT NULL DEFAULT false,
			attended_at TIMESTAMPTZ,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			UNIQUE(student_id, session_id)
		);`,
		`CREATE INDEX IF NOT EXISTS idx_attendance_student ON student_attendance(student_id);`,
		`CREATE INDEX IF NOT EXISTS idx_attendance_session ON student_attendance(session_id);`,

		`CREATE TABLE IF NOT EXISTS mock_tests (
			id SERIAL PRIMARY KEY,
			session_id INTEGER NOT NULL REFERENCES learning_sessions(id) ON DELETE CASCADE,
			title TEXT NOT NULL,
			questions TEXT NOT NULL,
			passing_score INTEGER NOT NULL DEFAULT 70,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);`,

		`CREATE TABLE IF NOT EXISTS student_mock_scores (
			id SERIAL PRIMARY KEY,
			student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
			mock_test_id INTEGER NOT NULL REFERENCES mock_tests(id) ON DELETE CASCADE,
			score INTEGER NOT NULL,
			passed BOOLEAN NOT NULL,
			completed_at TIMESTAMPTZ NOT NULL,
			attempt_number INTEGER NOT NULL DEFAULT 1,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);`,
		`CREATE INDEX IF NOT EXISTS idx_mock_scores_student ON student_mock_scores(student_id);`,
		`CREATE INDEX IF NOT EXISTS idx_mock_scores_test ON student_mock_scores(mock_test_id);`,

		`CREATE TABLE IF NOT EXISTS student_course_progress (
			id SERIAL PRIMARY KEY,
			student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
			course_id INTEGER NOT NULL REFERENCES learning_courses(id) ON DELETE CASCADE,
			current_session_id INTEGER REFERENCES learning_sessions(id),
			completed_sessions INTEGER NOT NULL DEFAULT 0,
			total_sessions INTEGER NOT NULL,
			enrollment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			UNIQUE(student_id, course_id)
		);`,
		`CREATE INDEX IF NOT EXISTS idx_course_progress_student ON student_course_progress(student_id);`,
	}
	for _, s := range stmts {
		if _, err := db.ExecContext(ctx, s); err != nil {
			return fmt.Errorf("migrate postgres: %w", err)
		}
	}
	return nil
}
