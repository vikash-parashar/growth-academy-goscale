-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Course Completion Certificate',
  issued_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completion_date TIMESTAMPTZ,
  classes_attended INTEGER NOT NULL DEFAULT 0,
  total_classes INTEGER NOT NULL DEFAULT 0,
  score DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  topics_learned TEXT[] DEFAULT ARRAY[]::TEXT[],
  certificate_number TEXT NOT NULL UNIQUE,
  certificate_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  verified_by INTEGER REFERENCES admin_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_certificates_student ON certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_course ON certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_issued_date ON certificates(issued_date);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status);
