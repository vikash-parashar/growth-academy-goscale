package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/goscalelabs/api/internal/auth"
	"github.com/goscalelabs/api/internal/config"
	"github.com/goscalelabs/api/internal/model"
	"github.com/goscalelabs/api/internal/repository"
	"github.com/goscalelabs/api/internal/service"
	"golang.org/x/crypto/bcrypt"
)

type StudentHandler struct {
	svc  *service.StudentService
	repo *repository.StudentRepository
	cfg  *config.Config
}

func NewStudentHandler(svc *service.StudentService, repo *repository.StudentRepository, cfg *config.Config) *StudentHandler {
	return &StudentHandler{svc: svc, repo: repo, cfg: cfg}
}

// === AUTH ENDPOINTS ===

type SignupRequest struct {
	FirstName       string `json:"first_name" binding:"required"`
	LastName        string `json:"last_name" binding:"required"`
	Email           string `json:"email" binding:"required"`
	Phone           string `json:"phone" binding:"required"`
	WhatsAppNumber  string `json:"whatsapp_number"`
	UserID          string `json:"user_id" binding:"required"`
	Password        string `json:"password" binding:"required"`
	ConfirmPassword string `json:"confirm_password" binding:"required"`
	Goal            string `json:"goal"`
}

type SignupResponse struct {
	ID      int64  `json:"id"`
	Email   string `json:"email"`
	UserID  string `json:"user_id"`
	Token   string `json:"token"`
	Message string `json:"message"`
}

// Signup handles student registration
func (h *StudentHandler) Signup(c *gin.Context) {
	var req SignupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
		return
	}

	if req.Password != req.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{"error": "passwords do not match"})
		return
	}

	student, err := h.svc.Signup(c.Request.Context(), req.FirstName, req.LastName, req.Email, req.Phone, req.WhatsAppNumber, req.UserID, req.Password, req.Goal)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Generate JWT token
	expiry := 24 * time.Hour
	token, err := auth.IssueStudentToken(h.cfg.JWTSecret, student.ID, student.Email, student.UserID, expiry)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	c.JSON(http.StatusCreated, SignupResponse{
		ID:      student.ID,
		Email:   student.Email,
		UserID:  student.UserID,
		Token:   token,
		Message: "Signup successful! Welcome to Go Developer Bootcamp",
	})
}

type LoginRequest struct {
	UserIDOrEmail string `json:"user_id_or_email" binding:"required"`
	Password      string `json:"password" binding:"required"`
}

type LoginResponse struct {
	ID        int64  `json:"id"`
	Email     string `json:"email"`
	UserID    string `json:"user_id"`
	FirstName string `json:"first_name"`
	Token     string `json:"token"`
}

// Login handles student login
func (h *StudentHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	ctx := c.Request.Context()
	var student *model.Student
	var err error

	// Try to get by user_id first, then by email
	student, err = h.repo.GetByUserID(ctx, req.UserIDOrEmail)
	if err != nil || student == nil {
		student, err = h.repo.GetByEmail(ctx, req.UserIDOrEmail)
		if err != nil || student == nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
			return
		}
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(student.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	// Generate JWT
	expiry := 24 * time.Hour
	token, err := auth.IssueStudentToken(h.cfg.JWTSecret, student.ID, student.Email, student.UserID, expiry)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, LoginResponse{
		ID:        student.ID,
		Email:     student.Email,
		UserID:    student.UserID,
		FirstName: student.FirstName,
		Token:     token,
	})
}

// === VALIDATION ENDPOINTS ===

type CheckUserIDRequest struct {
	UserID string `json:"user_id" binding:"required"`
}

type CheckUserIDResponse struct {
	Available bool `json:"available"`
}

// CheckUserIDAvailability checks if a user ID is available
func (h *StudentHandler) CheckUserIDAvailability(c *gin.Context) {
	var req CheckUserIDRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	available, err := h.svc.CheckUserIDAvailable(c.Request.Context(), req.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check availability"})
		return
	}

	c.JSON(http.StatusOK, CheckUserIDResponse{Available: available})
}

// GetPasswordRequirements returns password strength requirements
func (h *StudentHandler) GetPasswordRequirements(c *gin.Context) {
	c.JSON(http.StatusOK, service.GetPasswordStrengthRequirements())
}

// === PAYMENT ENDPOINTS ===

type PaymentPlanResponse struct {
	ID               int64  `json:"id"`
	Name             string `json:"name"`
	Description      string `json:"description"`
	PlanType         string `json:"plan_type"`
	TotalAmountPaise int64  `json:"total_amount_paise"`
	DisplayAmount    string `json:"display_amount"` // For frontend display
}

// GetPaymentPlans returns available payment plans
func (h *StudentHandler) GetPaymentPlans(c *gin.Context) {
	plans, err := h.svc.GetPaymentPlans(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var response []PaymentPlanResponse
	for _, p := range plans {
		response = append(response, PaymentPlanResponse{
			ID:               p.ID,
			Name:             p.Name,
			Description:      p.Description,
			PlanType:         p.PlanType,
			TotalAmountPaise: p.TotalAmountPaise,
			DisplayAmount:    fmt.Sprintf("₹%d", p.TotalAmountPaise/100),
		})
	}

	c.JSON(http.StatusOK, response)
}

// === LEARNING ENDPOINTS ===

type CourseResponse struct {
	ID           int64  `json:"id"`
	Title        string `json:"title"`
	Description  string `json:"description"`
	DurationDays int    `json:"duration_days"`
}

// GetCourses returns available courses
func (h *StudentHandler) GetCourses(c *gin.Context) {
	courses, err := h.svc.GetCourses(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var response []CourseResponse
	for _, course := range courses {
		response = append(response, CourseResponse{
			ID:           course.ID,
			Title:        course.Title,
			Description:  course.Description,
			DurationDays: course.DurationDays,
		})
	}

	c.JSON(http.StatusOK, response)
}

type ModuleResponse struct {
	ID          int64  `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	OrderIndex  int    `json:"order_index"`
	TotalDays   int    `json:"total_days"`
}

// GetCourseModules returns modules for a course
func (h *StudentHandler) GetCourseModules(c *gin.Context) {
	courseID, err := strconv.ParseInt(c.Param("courseId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid course ID"})
		return
	}

	_, modules, err := h.svc.GetCourseContent(c.Request.Context(), courseID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	var response []ModuleResponse
	for _, m := range modules {
		response = append(response, ModuleResponse{
			ID:          m.ID,
			Title:       m.Title,
			Description: m.Description,
			OrderIndex:  m.OrderIndex,
			TotalDays:   m.TotalDays,
		})
	}

	c.JSON(http.StatusOK, response)
}

type SessionResponse struct {
	ID           int64       `json:"id"`
	SessionName  string      `json:"session_name"`
	DayNumber    int         `json:"day_number"`
	Content      string      `json:"content"`
	CodeExamples interface{} `json:"code_examples"` // Parsed JSON
	HasMockTest  bool        `json:"has_mock_test"`
}

// GetModuleSessions returns sessions for a module
func (h *StudentHandler) GetModuleSessions(c *gin.Context) {
	moduleID, err := strconv.ParseInt(c.Param("moduleId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid module ID"})
		return
	}

	sessions, err := h.svc.GetModuleSessions(c.Request.Context(), moduleID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var response []SessionResponse
	for _, s := range sessions {
		var codeExamples interface{}
		if s.CodeExamples != "" {
			// Try to parse as JSON, otherwise return as string
			_ = json.Unmarshal([]byte(s.CodeExamples), &codeExamples)
		}
		response = append(response, SessionResponse{
			ID:           s.ID,
			SessionName:  s.SessionName,
			DayNumber:    s.DayNumber,
			Content:      s.Content,
			CodeExamples: codeExamples,
			HasMockTest:  s.HasMockTest,
		})
	}

	c.JSON(http.StatusOK, response)
}

// GetSession returns a single session
func (h *StudentHandler) GetSession(c *gin.Context) {
	sessionID, err := strconv.ParseInt(c.Param("sessionId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid session ID"})
		return
	}

	session, err := h.svc.GetSession(c.Request.Context(), sessionID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if session == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "session not found"})
		return
	}

	var codeExamples interface{}
	if session.CodeExamples != "" {
		_ = json.Unmarshal([]byte(session.CodeExamples), &codeExamples)
	}

	c.JSON(http.StatusOK, SessionResponse{
		ID:           session.ID,
		SessionName:  session.SessionName,
		DayNumber:    session.DayNumber,
		Content:      session.Content,
		CodeExamples: codeExamples,
		HasMockTest:  session.HasMockTest,
	})
}

// MarkSessionComplete marks a session as completed
func (h *StudentHandler) MarkSessionComplete(c *gin.Context) {
	studentID := c.GetInt64("student_id") // From JWT middleware
	sessionID, err := strconv.ParseInt(c.Param("sessionId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid session ID"})
		return
	}

	if err := h.svc.MarkSessionComplete(c.Request.Context(), studentID, sessionID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "session marked complete"})
}

// GetProgress returns student's course progress
func (h *StudentHandler) GetProgress(c *gin.Context) {
	studentID := c.GetInt64("student_id")
	courseID, err := strconv.ParseInt(c.Param("courseId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid course ID"})
		return
	}

	progress, err := h.svc.GetStudentProgress(c.Request.Context(), studentID, courseID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, progress)
}
