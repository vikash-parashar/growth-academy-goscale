package model

import "time"

type LeadStatus string

const (
	LeadNew       LeadStatus = "new"
	LeadContacted LeadStatus = "contacted"
	LeadConverted LeadStatus = "converted"
	LeadRejected  LeadStatus = "rejected"
)

// Lead matches PostgreSQL `leads` table (no terms columns — consent handled in app layer only if needed).
type Lead struct {
	ID           int64      `json:"id"`
	Name         string     `json:"name"`
	Phone        string     `json:"phone"`
	Email        string     `json:"email"`
	Experience   string     `json:"experience"`
	Salary       string     `json:"salary"`
	Goal         string     `json:"goal"`
	Status       LeadStatus `json:"status"`
	Notes        string     `json:"notes"`
	CreatedAt    time.Time  `json:"created_at"`
	WhatsAppLink string     `json:"whatsapp_link,omitempty"`
}

type AppointmentStatus string

const (
	ApptPending  AppointmentStatus = "pending"
	ApptAccepted AppointmentStatus = "accepted"
	ApptRejected AppointmentStatus = "rejected"
)

type Appointment struct {
	ID        int64             `json:"id"`
	LeadID    int64             `json:"lead_id"`
	DateTime  time.Time         `json:"datetime"` // stored as scheduled_at in PostgreSQL
	Status    AppointmentStatus `json:"status"`
	CreatedAt time.Time         `json:"created_at"`
}

type Payment struct {
	ID                   int64      `json:"id"`
	LeadID               int64      `json:"lead_id"`
	Amount               int64      `json:"amount"`
	Status               string     `json:"status"`
	PaymentID            string     `json:"payment_id"`
	OrderID              string     `json:"order_id"`
	PendingAppointmentAt *time.Time `json:"pending_appointment_at,omitempty"`
	CreatedAt            time.Time  `json:"created_at"`
}

type Proof struct {
	ID         int64     `json:"id"`
	Type       string    `json:"type"`
	URL        string    `json:"url"`
	PreviewURL string    `json:"preview_url"`
	Unlocked   bool      `json:"unlocked"`
	CreatedAt  time.Time `json:"created_at"`
}

type PublicProof struct {
	ID         int64     `json:"id"`
	Type       string    `json:"type"`
	PreviewURL string    `json:"preview_url"`
	Unlocked   bool      `json:"unlocked"`
	URL        string    `json:"url,omitempty"`
	CreatedAt  time.Time `json:"created_at"`
}

// Employee is an internal team member record (HR / payroll).
type Employee struct {
	ID                 int64      `json:"id"`
	EmployeeCode       string     `json:"employee_code"`
	Name               string     `json:"name"`
	Email              string     `json:"email"`
	Phone              string     `json:"phone"`
	RoleTitle          string     `json:"role_title"`
	Department         string     `json:"department"`
	Experience         string     `json:"experience"`
	ResumeURL          string     `json:"resume_url"`
	MonthlySalaryPaise int64      `json:"monthly_salary_paise"`
	IncentivesNotes    string     `json:"incentives_notes"`
	StartDate          time.Time  `json:"start_date"`
	EndDate            *time.Time `json:"end_date,omitempty"`
	Status             string     `json:"status"`
	CreatedAt          time.Time  `json:"created_at"`
	UpdatedAt          time.Time  `json:"updated_at"`
}

// EmployeeSalaryPayment is one payroll line for a calendar month.
type EmployeeSalaryPayment struct {
	ID             int64     `json:"id"`
	EmployeeID     int64     `json:"employee_id"`
	PeriodMonth    time.Time `json:"period_month"`
	AmountPaise    int64     `json:"amount_paise"`
	IncentivePaise int64     `json:"incentive_paise"`
	Notes          string    `json:"notes"`
	CreatedAt      time.Time `json:"created_at"`
}

// AdminUser matches PostgreSQL `admin_users` (portal login).
type AdminUser struct {
	ID           int64  `json:"id"`
	Email        string `json:"email"`
	PasswordHash string `json:"-"`
}

// === STUDENT LEARNING SYSTEM ===

// Student represents a learner registered in the platform
type Student struct {
	ID             int64     `json:"id"`
	FirstName      string    `json:"first_name"`
	LastName       string    `json:"last_name"`
	Email          string    `json:"email"`
	Phone          string    `json:"phone"`
	WhatsAppNumber string    `json:"whatsapp_number"`
	UserID         string    `json:"user_id"`
	PasswordHash   string    `json:"-"`
	Goal           string    `json:"goal"`
	Status         string    `json:"status"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// PaymentPlan represents different payment options
type PaymentPlan struct {
	ID               int64  `json:"id"`
	Name             string `json:"name"`
	Description      string `json:"description"`
	PlanType         string `json:"plan_type"` // one_time, two_part, emi
	TotalAmountPaise int64  `json:"total_amount_paise"`
}

// StudentPayment tracks student's payment status and plan
type StudentPayment struct {
	ID                 int64     `json:"id"`
	StudentID          int64     `json:"student_id"`
	PaymentPlanID      int64     `json:"payment_plan_id"`
	TotalAmountPaise   int64     `json:"total_amount_paise"`
	PaidAmountPaise    int64     `json:"paid_amount_paise"`
	PendingAmountPaise int64     `json:"pending_amount_paise"`
	Status             string    `json:"status"`
	StartedAt          time.Time `json:"started_at"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

// PaymentTransaction records individual payments
type PaymentTransaction struct {
	ID               int64     `json:"id"`
	StudentPaymentID int64     `json:"student_payment_id"`
	AmountPaise      int64     `json:"amount_paise"`
	PaymentDate      time.Time `json:"payment_date"`
	PaymentMode      string    `json:"payment_mode"`
	RazorpayID       string    `json:"razorpay_id,omitempty"`
	Status           string    `json:"status"`
	CreatedAt        time.Time `json:"created_at"`
}

// LearningCourse represents a course
type LearningCourse struct {
	ID           int64     `json:"id"`
	Title        string    `json:"title"`
	Description  string    `json:"description"`
	DurationDays int       `json:"duration_days"`
	CreatedAt    time.Time `json:"created_at"`
}

// LearningModule groups sessions by topic
type LearningModule struct {
	ID          int64     `json:"id"`
	CourseID    int64     `json:"course_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	OrderIndex  int       `json:"order_index"`
	TotalDays   int       `json:"total_days"`
	CreatedAt   time.Time `json:"created_at"`
}

// LearningSession represents one day's content
type LearningSession struct {
	ID           int64     `json:"id"`
	ModuleID     int64     `json:"module_id"`
	SessionName  string    `json:"session_name"`
	DayNumber    int       `json:"day_number"`
	Content      string    `json:"content"`
	CodeExamples string    `json:"code_examples"` // JSON array of code examples
	HasMockTest  bool      `json:"has_mock_test"`
	CreatedAt    time.Time `json:"created_at"`
}

// StudentAttendance tracks which sessions student has completed
type StudentAttendance struct {
	ID         int64      `json:"id"`
	StudentID  int64      `json:"student_id"`
	SessionID  int64      `json:"session_id"`
	Attended   bool       `json:"attended"`
	AttendedAt *time.Time `json:"attended_at,omitempty"`
	CreatedAt  time.Time  `json:"created_at"`
}

// MockTest represents assessment for a session
type MockTest struct {
	ID           int64     `json:"id"`
	SessionID    int64     `json:"session_id"`
	Title        string    `json:"title"`
	Questions    string    `json:"questions"` // JSON
	PassingScore int       `json:"passing_score"`
	CreatedAt    time.Time `json:"created_at"`
}

// StudentMockScore tracks test results
type StudentMockScore struct {
	ID            int64     `json:"id"`
	StudentID     int64     `json:"student_id"`
	MockTestID    int64     `json:"mock_test_id"`
	Score         int       `json:"score"`
	Passed        bool      `json:"passed"`
	CompletedAt   time.Time `json:"completed_at"`
	AttemptNumber int       `json:"attempt_number"`
	CreatedAt     time.Time `json:"created_at"`
}

// StudentCourseProgress tracks progress in a course
type StudentCourseProgress struct {
	ID                int64     `json:"id"`
	StudentID         int64     `json:"student_id"`
	CourseID          int64     `json:"course_id"`
	CurrentSessionID  *int64    `json:"current_session_id,omitempty"`
	CompletedSessions int       `json:"completed_sessions"`
	TotalSessions     int       `json:"total_sessions"`
	EnrollmentDate    time.Time `json:"enrollment_date"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}
