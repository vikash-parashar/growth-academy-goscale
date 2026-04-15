package repository

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/goscalelabs/api/internal/model"
)

type StudentRepository struct {
	db *sql.DB
}

func NewStudentRepository(db *sql.DB) *StudentRepository {
	return &StudentRepository{db: db}
}

func (r *StudentRepository) Create(ctx context.Context, s *model.Student) error {
	row := r.db.QueryRowContext(ctx, `
		INSERT INTO students (first_name, last_name, email, phone, whatsapp_number, user_id, password_hash, goal, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, created_at, updated_at`,
		s.FirstName, s.LastName, s.Email, s.Phone, s.WhatsAppNumber, s.UserID, s.PasswordHash, s.Goal, s.Status,
	)
	if err := row.Scan(&s.ID, &s.CreatedAt, &s.UpdatedAt); err != nil {
		return fmt.Errorf("create student: %w", err)
	}
	return nil
}

func (r *StudentRepository) GetByEmail(ctx context.Context, email string) (*model.Student, error) {
	s := &model.Student{}
	err := r.db.QueryRowContext(ctx, `
		SELECT id, first_name, last_name, email, phone, whatsapp_number, user_id, password_hash, goal, status, created_at, updated_at
		FROM students WHERE email = $1`, email).Scan(
		&s.ID, &s.FirstName, &s.LastName, &s.Email, &s.Phone, &s.WhatsAppNumber, &s.UserID, &s.PasswordHash, &s.Goal, &s.Status, &s.CreatedAt, &s.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get student by email: %w", err)
	}
	return s, nil
}

func (r *StudentRepository) GetByUserID(ctx context.Context, userID string) (*model.Student, error) {
	s := &model.Student{}
	err := r.db.QueryRowContext(ctx, `
		SELECT id, first_name, last_name, email, phone, whatsapp_number, user_id, password_hash, goal, status, created_at, updated_at
		FROM students WHERE user_id = $1`, userID).Scan(
		&s.ID, &s.FirstName, &s.LastName, &s.Email, &s.Phone, &s.WhatsAppNumber, &s.UserID, &s.PasswordHash, &s.Goal, &s.Status, &s.CreatedAt, &s.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get student by user_id: %w", err)
	}
	return s, nil
}

func (r *StudentRepository) GetByID(ctx context.Context, id int64) (*model.Student, error) {
	s := &model.Student{}
	err := r.db.QueryRowContext(ctx, `
		SELECT id, first_name, last_name, email, phone, whatsapp_number, user_id, password_hash, goal, status, created_at, updated_at
		FROM students WHERE id = $1`, id).Scan(
		&s.ID, &s.FirstName, &s.LastName, &s.Email, &s.Phone, &s.WhatsAppNumber, &s.UserID, &s.PasswordHash, &s.Goal, &s.Status, &s.CreatedAt, &s.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get student by id: %w", err)
	}
	return s, nil
}

func (r *StudentRepository) GetPaymentByStudentID(ctx context.Context, studentID int64) (*model.StudentPayment, error) {
	sp := &model.StudentPayment{}
	err := r.db.QueryRowContext(ctx, `
		SELECT id, student_id, payment_plan_id, total_amount_paise, paid_amount_paise, pending_amount_paise, status, started_at, created_at, updated_at
		FROM student_payments WHERE student_id = $1`, studentID).Scan(
		&sp.ID, &sp.StudentID, &sp.PaymentPlanID, &sp.TotalAmountPaise, &sp.PaidAmountPaise, &sp.PendingAmountPaise, &sp.Status, &sp.StartedAt, &sp.CreatedAt, &sp.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get payment: %w", err)
	}
	return sp, nil
}

func (r *StudentRepository) CreatePayment(ctx context.Context, sp *model.StudentPayment) error {
	row := r.db.QueryRowContext(ctx, `
		INSERT INTO student_payments (student_id, payment_plan_id, total_amount_paise, paid_amount_paise, pending_amount_paise, status, started_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, created_at, updated_at`,
		sp.StudentID, sp.PaymentPlanID, sp.TotalAmountPaise, sp.PaidAmountPaise, sp.PendingAmountPaise, sp.Status, sp.StartedAt,
	)
	if err := row.Scan(&sp.ID, &sp.CreatedAt, &sp.UpdatedAt); err != nil {
		return fmt.Errorf("create payment: %w", err)
	}
	return nil
}

func (r *StudentRepository) GetPaymentPlans(ctx context.Context) ([]*model.PaymentPlan, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT id, name, description, plan_type, total_amount_paise
		FROM payment_plans ORDER BY id`)
	if err != nil {
		return nil, fmt.Errorf("get payment plans: %w", err)
	}
	defer rows.Close()

	var plans []*model.PaymentPlan
	for rows.Next() {
		p := &model.PaymentPlan{}
		if err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.PlanType, &p.TotalAmountPaise); err != nil {
			return nil, fmt.Errorf("scan payment plan: %w", err)
		}
		plans = append(plans, p)
	}
	return plans, rows.Err()
}

// Course methods
func (r *StudentRepository) GetCourses(ctx context.Context) ([]*model.LearningCourse, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT id, title, description, duration_days, created_at
		FROM learning_courses ORDER BY created_at`)
	if err != nil {
		return nil, fmt.Errorf("get courses: %w", err)
	}
	defer rows.Close()

	var courses []*model.LearningCourse
	for rows.Next() {
		c := &model.LearningCourse{}
		if err := rows.Scan(&c.ID, &c.Title, &c.Description, &c.DurationDays, &c.CreatedAt); err != nil {
			return nil, fmt.Errorf("scan course: %w", err)
		}
		courses = append(courses, c)
	}
	return courses, rows.Err()
}

func (r *StudentRepository) GetCourseByID(ctx context.Context, courseID int64) (*model.LearningCourse, error) {
	c := &model.LearningCourse{}
	err := r.db.QueryRowContext(ctx, `
		SELECT id, title, description, duration_days, created_at
		FROM learning_courses WHERE id = $1`, courseID).Scan(
		&c.ID, &c.Title, &c.Description, &c.DurationDays, &c.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get course: %w", err)
	}
	return c, nil
}

// Module methods
func (r *StudentRepository) GetModulesByCourseID(ctx context.Context, courseID int64) ([]*model.LearningModule, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT id, course_id, title, description, order_index, total_days, created_at
		FROM learning_modules WHERE course_id = $1 ORDER BY order_index`, courseID)
	if err != nil {
		return nil, fmt.Errorf("get modules: %w", err)
	}
	defer rows.Close()

	var modules []*model.LearningModule
	for rows.Next() {
		m := &model.LearningModule{}
		if err := rows.Scan(&m.ID, &m.CourseID, &m.Title, &m.Description, &m.OrderIndex, &m.TotalDays, &m.CreatedAt); err != nil {
			return nil, fmt.Errorf("scan module: %w", err)
		}
		modules = append(modules, m)
	}
	return modules, rows.Err()
}

// Session methods
func (r *StudentRepository) GetSessionsByModuleID(ctx context.Context, moduleID int64) ([]*model.LearningSession, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT id, module_id, session_name, day_number, content, code_examples, has_mock_test, created_at
		FROM learning_sessions WHERE module_id = $1 ORDER BY day_number`, moduleID)
	if err != nil {
		return nil, fmt.Errorf("get sessions: %w", err)
	}
	defer rows.Close()

	var sessions []*model.LearningSession
	for rows.Next() {
		s := &model.LearningSession{}
		if err := rows.Scan(&s.ID, &s.ModuleID, &s.SessionName, &s.DayNumber, &s.Content, &s.CodeExamples, &s.HasMockTest, &s.CreatedAt); err != nil {
			return nil, fmt.Errorf("scan session: %w", err)
		}
		sessions = append(sessions, s)
	}
	return sessions, rows.Err()
}

func (r *StudentRepository) GetSessionByID(ctx context.Context, sessionID int64) (*model.LearningSession, error) {
	s := &model.LearningSession{}
	err := r.db.QueryRowContext(ctx, `
		SELECT id, module_id, session_name, day_number, content, code_examples, has_mock_test, created_at
		FROM learning_sessions WHERE id = $1`, sessionID).Scan(
		&s.ID, &s.ModuleID, &s.SessionName, &s.DayNumber, &s.Content, &s.CodeExamples, &s.HasMockTest, &s.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get session: %w", err)
	}
	return s, nil
}

// Attendance
func (r *StudentRepository) MarkAttendance(ctx context.Context, attendance *model.StudentAttendance) error {
	now := sql.NullTime{Valid: true}
	row := r.db.QueryRowContext(ctx, `
		INSERT INTO student_attendance (student_id, session_id, attended, attended_at)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (student_id, session_id) DO UPDATE SET attended = $3, attended_at = $4
		RETURNING id, created_at`,
		attendance.StudentID, attendance.SessionID, attendance.Attended, now,
	)
	if err := row.Scan(&attendance.ID, &attendance.CreatedAt); err != nil {
		return fmt.Errorf("mark attendance: %w", err)
	}
	attendance.AttendedAt = &now.Time
	return nil
}

func (r *StudentRepository) GetStudentProgress(ctx context.Context, studentID int64, courseID int64) (*model.StudentCourseProgress, error) {
	p := &model.StudentCourseProgress{}
	err := r.db.QueryRowContext(ctx, `
		SELECT id, student_id, course_id, current_session_id, completed_sessions, total_sessions, enrollment_date, created_at, updated_at
		FROM student_course_progress WHERE student_id = $1 AND course_id = $2`, studentID, courseID).Scan(
		&p.ID, &p.StudentID, &p.CourseID, &p.CurrentSessionID, &p.CompletedSessions, &p.TotalSessions, &p.EnrollmentDate, &p.CreatedAt, &p.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("get progress: %w", err)
	}
	return p, nil
}

func (r *StudentRepository) CreateProgress(ctx context.Context, progress *model.StudentCourseProgress) error {
	row := r.db.QueryRowContext(ctx, `
		INSERT INTO student_course_progress (student_id, course_id, total_sessions, enrollment_date)
		VALUES ($1, $2, $3, NOW())
		RETURNING id, created_at, updated_at`,
		progress.StudentID, progress.CourseID, progress.TotalSessions,
	)
	if err := row.Scan(&progress.ID, &progress.CreatedAt, &progress.UpdatedAt); err != nil {
		return fmt.Errorf("create progress: %w", err)
	}
	return nil
}

// Admin: Get paginated list of all students
func (r *StudentRepository) GetStudentsList(ctx context.Context, page, limit int) ([]*model.Student, int64, error) {
	// Get total count
	var total int64
	err := r.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM students`).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("count students: %w", err)
	}

	// Get paginated results
	offset := (page - 1) * limit
	rows, err := r.db.QueryContext(ctx, `
		SELECT id, first_name, last_name, email, phone, whatsapp_number, user_id, password_hash, goal, status, created_at, updated_at
		FROM students ORDER BY created_at DESC OFFSET $1 LIMIT $2`, offset, limit)
	if err != nil {
		return nil, 0, fmt.Errorf("get students list: %w", err)
	}
	defer rows.Close()

	var students []*model.Student
	for rows.Next() {
		s := &model.Student{}
		if err := rows.Scan(&s.ID, &s.FirstName, &s.LastName, &s.Email, &s.Phone, &s.WhatsAppNumber, &s.UserID, &s.PasswordHash, &s.Goal, &s.Status, &s.CreatedAt, &s.UpdatedAt); err != nil {
			return nil, 0, fmt.Errorf("scan student: %w", err)
		}
		students = append(students, s)
	}
	return students, total, rows.Err()
}
