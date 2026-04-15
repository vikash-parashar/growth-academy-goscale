package service

import (
	"context"
	"fmt"
	"regexp"
	"strings"

	"github.com/goscalelabs/api/internal/config"
	"github.com/goscalelabs/api/internal/model"
	"github.com/goscalelabs/api/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type StudentService struct {
	Repo *repository.StudentRepository
	cfg  *config.Config
}

func NewStudentService(repo *repository.StudentRepository, cfg *config.Config) *StudentService {
	return &StudentService{Repo: repo, cfg: cfg}
}

// Signup creates a new student
func (s *StudentService) Signup(ctx context.Context, firstName, lastName, email, phone, whatsappNumber, userID, password, goal string) (*model.Student, error) {
	// Validate inputs
	if err := s.validateSignupInput(firstName, lastName, email, phone, userID, password); err != nil {
		return nil, err
	}

	// Check if email already exists
	existing, err := s.Repo.GetByEmail(ctx, email)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, fmt.Errorf("email already registered")
	}

	// Check if user_id already exists
	existing, err = s.Repo.GetByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, fmt.Errorf("user ID already taken")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("hash password: %w", err)
	}

	student := &model.Student{
		FirstName:      strings.TrimSpace(firstName),
		LastName:       strings.TrimSpace(lastName),
		Email:          strings.ToLower(strings.TrimSpace(email)),
		Phone:          strings.TrimSpace(phone),
		WhatsAppNumber: strings.TrimSpace(whatsappNumber),
		UserID:         strings.TrimSpace(userID),
		PasswordHash:   string(hashedPassword),
		Goal:           strings.TrimSpace(goal),
		Status:         "active",
	}

	if err := s.Repo.Create(ctx, student); err != nil {
		return nil, err
	}

	// Create default course enrollment and payment
	courses, err := s.Repo.GetCourses(ctx)
	if err != nil || len(courses) == 0 {
		return student, nil
	}

	// Enroll in first course and create progress
	course := courses[0]
	progress := &model.StudentCourseProgress{
		StudentID:     student.ID,
		CourseID:      course.ID,
		TotalSessions: course.DurationDays,
	}
	_ = s.Repo.CreateProgress(ctx, progress)

	// Create payment entry
	plans, err := s.Repo.GetPaymentPlans(ctx)
	if err != nil || len(plans) == 0 {
		return student, nil
	}

	// Default to EMI plan
	plan := plans[2]
	studentPayment := &model.StudentPayment{
		StudentID:          student.ID,
		PaymentPlanID:      plan.ID,
		TotalAmountPaise:   plan.TotalAmountPaise,
		PaidAmountPaise:    0,
		PendingAmountPaise: plan.TotalAmountPaise,
		Status:             "pending",
	}
	_ = s.Repo.CreatePayment(ctx, studentPayment)

	return student, nil
}

// VerifyPassword checks if password matches
func (s *StudentService) VerifyPassword(ctx context.Context, studentID int64, password string) (bool, error) {
	student, err := s.Repo.GetByID(ctx, studentID)
	if err != nil {
		return false, err
	}
	if student == nil {
		return false, fmt.Errorf("student not found")
	}

	err = bcrypt.CompareHashAndPassword([]byte(student.PasswordHash), []byte(password))
	return err == nil, nil
}

// CheckUserIDAvailable checks if user ID is available
func (s *StudentService) CheckUserIDAvailable(ctx context.Context, userID string) (bool, error) {
	student, err := s.Repo.GetByUserID(ctx, userID)
	if err != nil {
		return false, err
	}
	return student == nil, nil
}

// GetPaymentPlans returns available payment plans
func (s *StudentService) GetPaymentPlans(ctx context.Context) ([]*model.PaymentPlan, error) {
	return s.Repo.GetPaymentPlans(ctx)
}

// GetCourses returns available courses
func (s *StudentService) GetCourses(ctx context.Context) ([]*model.LearningCourse, error) {
	return s.Repo.GetCourses(ctx)
}

// GetCourseContent returns course with all modules and sessions
func (s *StudentService) GetCourseContent(ctx context.Context, courseID int64) (*model.LearningCourse, []*model.LearningModule, error) {
	course, err := s.Repo.GetCourseByID(ctx, courseID)
	if err != nil {
		return nil, nil, err
	}
	if course == nil {
		return nil, nil, fmt.Errorf("course not found")
	}

	modules, err := s.Repo.GetModulesByCourseID(ctx, courseID)
	if err != nil {
		return nil, nil, err
	}

	return course, modules, nil
}

// GetModuleSessions returns sessions for a module
func (s *StudentService) GetModuleSessions(ctx context.Context, moduleID int64) ([]*model.LearningSession, error) {
	return s.Repo.GetSessionsByModuleID(ctx, moduleID)
}

// GetSession returns a single session
func (s *StudentService) GetSession(ctx context.Context, sessionID int64) (*model.LearningSession, error) {
	return s.Repo.GetSessionByID(ctx, sessionID)
}

// MarkSessionComplete marks a session as attended
func (s *StudentService) MarkSessionComplete(ctx context.Context, studentID, sessionID int64) error {
	attendance := &model.StudentAttendance{
		StudentID: studentID,
		SessionID: sessionID,
		Attended:  true,
	}
	return s.Repo.MarkAttendance(ctx, attendance)
}

// GetStudentProgress returns progress in a course
func (s *StudentService) GetStudentProgress(ctx context.Context, studentID, courseID int64) (*model.StudentCourseProgress, error) {
	return s.Repo.GetStudentProgress(ctx, studentID, courseID)
}

// Validation helpers

func (s *StudentService) validateSignupInput(firstName, lastName, email, phone, userID, password string) error {
	firstName = strings.TrimSpace(firstName)
	lastName = strings.TrimSpace(lastName)
	email = strings.TrimSpace(email)
	phone = strings.TrimSpace(phone)
	userID = strings.TrimSpace(userID)

	if firstName == "" {
		return fmt.Errorf("first name required")
	}
	if lastName == "" {
		return fmt.Errorf("last name required")
	}
	if !isValidEmail(email) {
		return fmt.Errorf("invalid email format")
	}
	if phone == "" {
		return fmt.Errorf("phone number required")
	}
	if len(userID) < 3 {
		return fmt.Errorf("user ID must be at least 3 characters")
	}
	if !isValidUserID(userID) {
		return fmt.Errorf("user ID must contain only letters, numbers, and underscores")
	}
	if err := validatePasswordStrength(password); err != nil {
		return err
	}

	return nil
}

func isValidEmail(email string) bool {
	pattern := `^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`
	matched, _ := regexp.MatchString(pattern, email)
	return matched
}

func isValidUserID(userID string) bool {
	pattern := `^[a-zA-Z0-9_]{3,}$`
	matched, _ := regexp.MatchString(pattern, userID)
	return matched
}

func validatePasswordStrength(password string) error {
	if len(password) < 8 {
		return fmt.Errorf("password must be at least 8 characters")
	}
	hasUpper := regexp.MustCompile(`[A-Z]`).MatchString(password)
	hasLower := regexp.MustCompile(`[a-z]`).MatchString(password)
	hasNum := regexp.MustCompile(`[0-9]`).MatchString(password)
	hasSpecial := regexp.MustCompile(`[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/\\]`).MatchString(password)

	if !hasUpper || !hasLower || !hasNum || !hasSpecial {
		return fmt.Errorf("password must contain uppercase, lowercase, number, and special character")
	}

	return nil
}

func GetPasswordStrengthRequirements() map[string]interface{} {
	return map[string]interface{}{
		"minLength": 8,
		"requirements": []string{
			"At least 8 characters",
			"At least one uppercase letter (A-Z)",
			"At least one lowercase letter (a-z)",
			"At least one number (0-9)",
			"At least one special character (!@#$%^&*()_+-=[]{}|;:'\".<>?/\\)",
		},
	}
}
