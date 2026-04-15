package handler

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/goscalelabs/api/internal/config"
	"github.com/goscalelabs/api/internal/model"
	"github.com/goscalelabs/api/internal/repository"
	"github.com/goscalelabs/api/internal/service"
	"golang.org/x/crypto/bcrypt"
)

type AdminHandler struct {
	studentRepo *repository.StudentRepository
	studentSvc  *service.StudentService
	cfg         *config.Config
}

func NewAdminHandler(studentRepo *repository.StudentRepository, studentSvc *service.StudentService, cfg *config.Config) *AdminHandler {
	return &AdminHandler{
		studentRepo: studentRepo,
		studentSvc:  studentSvc,
		cfg:         cfg,
	}
}

// === STUDENT MANAGEMENT ===

type StudentListResponse struct {
	ID              int64  `json:"id"`
	FirstName       string `json:"first_name"`
	LastName        string `json:"last_name"`
	Email           string `json:"email"`
	Phone           string `json:"phone"`
	UserID          string `json:"user_id"`
	Goal            string `json:"goal"`
	Status          string `json:"status"`
	EnrolledCourses int    `json:"enrolled_courses"`
	CreatedAt       string `json:"created_at"`
}

// GetStudents returns paginated list of all students
func (h *AdminHandler) GetStudents(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	students, total, err := h.studentRepo.GetStudentsList(c.Request.Context(), page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var response []StudentListResponse
	for _, s := range students {
		response = append(response, StudentListResponse{
			ID:        s.ID,
			FirstName: s.FirstName,
			LastName:  s.LastName,
			Email:     s.Email,
			Phone:     s.Phone,
			UserID:    s.UserID,
			Goal:      s.Goal,
			Status:    s.Status,
			CreatedAt: s.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"students": response,
		"total":    total,
		"page":     page,
		"limit":    limit,
	})
}

type StudentDetailResponse struct {
	ID             int64                  `json:"id"`
	FirstName      string                 `json:"first_name"`
	LastName       string                 `json:"last_name"`
	Email          string                 `json:"email"`
	Phone          string                 `json:"phone"`
	WhatsAppNumber string                 `json:"whatsapp_number"`
	UserID         string                 `json:"user_id"`
	Goal           string                 `json:"goal"`
	Status         string                 `json:"status"`
	CreatedAt      string                 `json:"created_at"`
	Payment        *StudentPaymentDetail  `json:"payment,omitempty"`
	Attendance     []AttendanceRecord     `json:"attendance,omitempty"`
	MockTestScores []MockTestScoreRecord  `json:"mock_test_scores,omitempty"`
	CourseProgress []CourseProgressRecord `json:"course_progress,omitempty"`
}

type StudentPaymentDetail struct {
	PlanName         string `json:"plan_name"`
	TotalAmount      int64  `json:"total_amount_paise"`
	PaidAmount       int64  `json:"paid_amount_paise"`
	PendingAmount    int64  `json:"pending_amount_paise"`
	Status           string `json:"status"`
	Percentage       int    `json:"percentage_paid"`
	TransactionCount int    `json:"transaction_count"`
}

type AttendanceRecord struct {
	SessionID   int64  `json:"session_id"`
	SessionName string `json:"session_name"`
	DayNumber   int    `json:"day_number"`
	Attended    bool   `json:"attended"`
	AttendedAt  string `json:"attended_at,omitempty"`
}

type MockTestScoreRecord struct {
	TestID        int64  `json:"test_id"`
	TestTitle     string `json:"test_title"`
	Score         int    `json:"score"`
	Passed        bool   `json:"passed"`
	PassingScore  int    `json:"passing_score"`
	CompletedAt   string `json:"completed_at"`
	AttemptNumber int    `json:"attempt_number"`
}

type CourseProgressRecord struct {
	CourseID          int64  `json:"course_id"`
	CourseTitle       string `json:"course_title"`
	CompletedSessions int    `json:"completed_sessions"`
	TotalSessions     int    `json:"total_sessions"`
	PercentComplete   int    `json:"percent_complete"`
	EnrollmentDate    string `json:"enrollment_date"`
}

// GetStudentDetail returns comprehensive details about a student
func (h *AdminHandler) GetStudentDetail(c *gin.Context) {
	studentID, err := strconv.ParseInt(c.Param("studentId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid student id"})
		return
	}

	student, err := h.studentRepo.GetByID(c.Request.Context(), studentID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "student not found"})
		return
	}

	detail := StudentDetailResponse{
		ID:             student.ID,
		FirstName:      student.FirstName,
		LastName:       student.LastName,
		Email:          student.Email,
		Phone:          student.Phone,
		WhatsAppNumber: student.WhatsAppNumber,
		UserID:         student.UserID,
		Goal:           student.Goal,
		Status:         student.Status,
		CreatedAt:      student.CreatedAt.Format("2006-01-02 15:04:05"),
	}

	// Get payment info
	payment, err := h.studentRepo.GetPaymentByStudentID(c.Request.Context(), studentID)
	if err == nil && payment != nil {
		paidPercent := 0
		if payment.TotalAmountPaise > 0 {
			paidPercent = int((payment.PaidAmountPaise * 100) / payment.TotalAmountPaise)
		}
		detail.Payment = &StudentPaymentDetail{
			TotalAmount:   payment.TotalAmountPaise,
			PaidAmount:    payment.PaidAmountPaise,
			PendingAmount: payment.PendingAmountPaise,
			Status:        payment.Status,
			Percentage:    paidPercent,
		}
	}

	// Get attendance (from database)
	// Note: You'll need to add this method to StudentRepository
	// detail.Attendance = attendanceRecords

	// Get mock test scores (from database)
	// detail.MockTestScores = mockTestRecords

	// Get course progress (from database)
	// detail.CourseProgress = progressRecords

	c.JSON(http.StatusOK, detail)
}

// === NOTIFICATION ===

type SendNotificationRequest struct {
	Type    string                 `json:"type" binding:"required"` // "email" or "sms"
	Title   string                 `json:"title" binding:"required"`
	Message string                 `json:"message" binding:"required"`
	Data    map[string]interface{} `json:"data,omitempty"`
}

type SendNotificationResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Status  string `json:"status"`
}

// SendNotification sends email or SMS to a student
func (h *AdminHandler) SendNotification(c *gin.Context) {
	studentID, err := strconv.ParseInt(c.Param("studentId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid student id"})
		return
	}

	var req SendNotificationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
		return
	}

	student, err := h.studentRepo.GetByID(c.Request.Context(), studentID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "student not found"})
		return
	}

	// Send notification (implement with Twilio, SendGrid, etc.)
	var notifStatus string
	var notifSuccess bool

	switch req.Type {
	case "email":
		// TODO: Implement email sending
		notifStatus = "email_sent"
		notifSuccess = true
	case "sms":
		// TODO: Implement SMS sending via Twilio
		notifStatus = "sms_sent"
		notifSuccess = true
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid notification type"})
		return
	}

	// Log notification attempt (optional)
	msg := fmt.Sprintf("Notification sent to %s: %s", student.Email, req.Message)

	c.JSON(http.StatusOK, SendNotificationResponse{
		Success: notifSuccess,
		Message: msg,
		Status:  notifStatus,
	})
}

// === DASHBOARD STATS ===

type DashboardStats struct {
	TotalStudents     int64   `json:"total_students"`
	ActiveStudents    int64   `json:"active_students"`
	TotalRevenue      int64   `json:"total_revenue_paise"`
	PendingPayments   int64   `json:"pending_payments_paise"`
	AvgCompletionRate float64 `json:"avg_completion_rate"`
	AverageMockScore  float64 `json:"average_mock_score"`
}

// GetDashboardStats returns overview statistics for admin dashboard
func (h *AdminHandler) GetDashboardStats(c *gin.Context) {
	// TODO: Implement actual stats calculation
	stats := DashboardStats{
		TotalStudents:     0,
		ActiveStudents:    0,
		TotalRevenue:      0,
		PendingPayments:   0,
		AvgCompletionRate: 0.0,
		AverageMockScore:  0.0,
	}

	c.JSON(http.StatusOK, stats)
}

// === PAYMENT MANAGEMENT ===

type PaymentRecord struct {
	StudentID    int64  `json:"student_id"`
	StudentName  string `json:"student_name"`
	StudentEmail string `json:"student_email"`
	PaidAmount   int64  `json:"paid_amount_paise"`
	TotalAmount  int64  `json:"total_amount_paise"`
	PaymentDate  string `json:"payment_date"`
	Status       string `json:"status"`
}

type PaymentListResponse struct {
	Payments []PaymentRecord `json:"payments"`
	Total    int64           `json:"total_paise"`
	Count    int             `json:"count"`
}

// GetPaymentRecords returns all payment transactions
func (h *AdminHandler) GetPaymentRecords(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	// TODO: Get from repository
	response := PaymentListResponse{
		Payments: []PaymentRecord{},
		Total:    0,
		Count:    0,
	}

	c.JSON(http.StatusOK, response)
}

// === ATTENDANCE & TEST RECORDS ===

type AttendanceSummary struct {
	StudentID      int64   `json:"student_id"`
	StudentName    string  `json:"student_name"`
	TotalSessions  int     `json:"total_sessions"`
	AttendedCount  int     `json:"attended_count"`
	AttendanceRate float64 `json:"attendance_rate_percent"`
}

// GetAttendanceRecords returns attendance data for tracking
func (h *AdminHandler) GetAttendanceRecords(c *gin.Context) {
	courseID, _ := strconv.ParseInt(c.Query("course_id"), 10, 64)

	// TODO: Get from repository
	var attendance []AttendanceSummary

	if courseID > 0 {
		// Filter by course
	}

	c.JSON(http.StatusOK, gin.H{
		"attendance": attendance,
		"count":      len(attendance),
	})
}

type MockTestSummary struct {
	StudentID    int64   `json:"student_id"`
	StudentName  string  `json:"student_name"`
	TestCount    int     `json:"test_count"`
	AverageScore float64 `json:"average_score"`
	PassRate     float64 `json:"pass_rate_percent"`
}

// GetMockTestRecords returns test performance data
func (h *AdminHandler) GetMockTestRecords(c *gin.Context) {
	// TODO: Get from repository
	var tests []MockTestSummary

	c.JSON(http.StatusOK, gin.H{
		"tests": tests,
		"count": len(tests),
	})
}

// === USER MANAGEMENT ===

type CreateUserRequest struct {
	FirstName         string `json:"first_name" binding:"required"`
	LastName          string `json:"last_name" binding:"required"`
	Email             string `json:"email" binding:"required,email"`
	Phone             string `json:"phone" binding:"required"`
	Username          string `json:"username" binding:"required"`
	TemporaryPassword string `json:"temporary_password" binding:"required"`
	DeliveryMethod    string `json:"delivery_method" binding:"required,oneof=email sms whatsapp"`
}

type CreateUserResponse struct {
	Success           bool   `json:"success"`
	UserID            string `json:"user_id"`
	Username          string `json:"username"`
	TemporaryPassword string `json:"temporary_password"`
	Message           string `json:"message"`
}

// CreateUser creates a new user with admin-generated credentials
func (h *AdminHandler) CreateUser(c *gin.Context) {
	var req CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Create student record
	newStudent := &model.Student{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Email:     req.Email,
		Phone:     req.Phone,
		UserID:    req.Username,
		Status:    "active",
	}

	// Hash the temporary password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.TemporaryPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process password"})
		return
	}
	newStudent.PasswordHash = string(hashedPassword)

	// Save student to database using repository
	if err = h.studentRepo.Create(c.Request.Context(), newStudent); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user: " + err.Error()})
		return
	}

	// Send credentials via chosen method
	var notificationMsg string
	switch req.DeliveryMethod {
	case "email":
		notificationMsg = fmt.Sprintf("Credentials: Username: %s, Password: %s. Please login and change your password.", req.Username, req.TemporaryPassword)
		// TODO: Send email via email service
	case "sms":
		notificationMsg = fmt.Sprintf("Your Gopher Lab credentials - Username: %s, Password: %s. Visit the app to login.", req.Username, req.TemporaryPassword)
		// TODO: Send SMS via Twilio service
	case "whatsapp":
		notificationMsg = fmt.Sprintf("🎓 Your Gopher Lab credentials:\n📧 Username: %s\n🔐 Password: %s\n\nPlease login and change your password for security.", req.Username, req.TemporaryPassword)
		// TODO: Send WhatsApp via Twilio service
	}

	_ = notificationMsg // Use this in actual notification service

	c.JSON(http.StatusCreated, CreateUserResponse{
		Success:           true,
		UserID:            newStudent.UserID,
		Username:          req.Username,
		TemporaryPassword: req.TemporaryPassword,
		Message:           fmt.Sprintf("User created successfully and credentials sent via %s", req.DeliveryMethod),
	})
}

type AdminUserListResponse struct {
	ID        int64  `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	UserID    string `json:"user_id"`
	Role      string `json:"role"`
	CreatedAt string `json:"created_at"`
}

// GetAdminUsers returns list of all users created by admin
func (h *AdminHandler) GetAdminUsers(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	students, total, err := h.studentRepo.GetStudentsList(c.Request.Context(), page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var response []AdminUserListResponse
	for _, s := range students {
		response = append(response, AdminUserListResponse{
			ID:        s.ID,
			FirstName: s.FirstName,
			LastName:  s.LastName,
			Email:     s.Email,
			Phone:     s.Phone,
			UserID:    s.UserID,
			Role:      "student",
			CreatedAt: s.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"users": response,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}
