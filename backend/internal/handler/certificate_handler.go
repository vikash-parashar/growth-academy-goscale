package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/goscalelabs/api/internal/auth"
	"github.com/goscalelabs/api/internal/certificate"
	"github.com/goscalelabs/api/internal/model"
	"github.com/goscalelabs/api/internal/repository"
)

// CertificateHandler handles certificate-related API endpoints
type CertificateHandler struct {
	certRepo  *repository.CertificateRepository
	generator *certificate.CertificateGenerator
}

// NewCertificateHandler creates a new certificate handler
func NewCertificateHandler(certRepo *repository.CertificateRepository, generator *certificate.CertificateGenerator) *CertificateHandler {
	return &CertificateHandler{
		certRepo:  certRepo,
		generator: generator,
	}
}

// CreateCertificate creates a new certificate (admin only)
// POST /api/admin/certificates
func (h *CertificateHandler) CreateCertificate(c *gin.Context) {
	// Verify admin token
	_, err := auth.VerifyToken(c.GetHeader("Authorization"), "")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req struct {
		StudentID       int64    `json:"student_id" binding:"required"`
		CourseID        int64    `json:"course_id" binding:"required"`
		ClassesAttended int      `json:"classes_attended"`
		TotalClasses    int      `json:"total_classes"`
		Score           float64  `json:"score"`
		TopicsLearned   []string `json:"topics_learned"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	cert := &model.Certificate{
		StudentID:       req.StudentID,
		CourseID:        req.CourseID,
		Title:           "Course Completion Certificate",
		ClassesAttended: req.ClassesAttended,
		TotalClasses:    req.TotalClasses,
		Score:           req.Score,
		TopicsLearned:   req.TopicsLearned,
		Status:          "pending",
	}

	created, err := h.certRepo.Create(c.Request.Context(), cert)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create certificate"})
		return
	}

	c.JSON(http.StatusCreated, created)
}

// GetCertificate retrieves a specific certificate
// GET /api/certificates/:id
func (h *CertificateHandler) GetCertificate(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid certificate id"})
		return
	}

	cert, err := h.certRepo.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get certificate"})
		return
	}

	if cert == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "certificate not found"})
		return
	}

	c.JSON(http.StatusOK, cert)
}

// GetStudentCertificates retrieves all certificates for a student
// GET /api/students/certificates
func (h *CertificateHandler) GetStudentCertificates(c *gin.Context) {
	// Get student ID from query parameter or from JWT claims
	studentIDStr := c.Query("studentId")

	var studentID int64
	var err error

	if studentIDStr != "" {
		studentID, err = strconv.ParseInt(studentIDStr, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid student id"})
			return
		}
	} else {
		// Try to get from context (set by middleware)
		studentID = getStudentIDFromContext(c)
		if studentID == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "student id required"})
			return
		}
	}

	// Verify student token
	token := c.GetHeader("Authorization")
	_, err = auth.VerifyToken(token, "")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	certs, err := h.certRepo.ListByStudent(c.Request.Context(), studentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get certificates"})
		return
	}

	// Filter only issued certificates for students
	var issued []*model.Certificate
	for _, cert := range certs {
		if cert.Status == "issued" {
			issued = append(issued, cert)
		}
	}

	if issued == nil {
		issued = []*model.Certificate{}
	}

	c.JSON(http.StatusOK, gin.H{"certificates": issued})
}

// GetCourseCertificates retrieves all certificates in a course (admin)
// GET /api/admin/courses/:courseId/certificates
func (h *CertificateHandler) GetCourseCertificates(c *gin.Context) {
	courseID, err := strconv.ParseInt(c.Param("courseId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid course id"})
		return
	}

	// Verify admin token
	_, err = auth.VerifyToken(c.GetHeader("Authorization"), "")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	certs, err := h.certRepo.ListByCourse(c.Request.Context(), courseID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get certificates"})
		return
	}

	if certs == nil {
		certs = []*model.Certificate{}
	}

	c.JSON(http.StatusOK, gin.H{
		"certificates": certs,
		"total":        len(certs),
		"issued":       len(getCertsWithStatus(certs, "issued")),
		"pending":      len(getCertsWithStatus(certs, "pending")),
	})
}

// IssueCertificate approves and issues a certificate (admin)
// PATCH /api/admin/certificates/:id/issue
func (h *CertificateHandler) IssueCertificate(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid certificate id"})
		return
	}

	// Verify admin token
	_, err = auth.VerifyToken(c.GetHeader("Authorization"), "")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	cert, err := h.certRepo.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get certificate"})
		return
	}

	if cert == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "certificate not found"})
		return
	}

	// Update status to issued
	cert.Status = "issued"
	updated, err := h.certRepo.Update(c.Request.Context(), cert)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to issue certificate"})
		return
	}

	c.JSON(http.StatusOK, updated)
}

// RejectCertificate rejects a pending certificate (admin)
// PATCH /api/admin/certificates/:id/reject
func (h *CertificateHandler) RejectCertificate(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid certificate id"})
		return
	}

	// Verify admin token
	_, err = auth.VerifyToken(c.GetHeader("Authorization"), "")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	cert, err := h.certRepo.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get certificate"})
		return
	}

	if cert == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "certificate not found"})
		return
	}

	// Update status to rejected
	cert.Status = "rejected"
	updated, err := h.certRepo.Update(c.Request.Context(), cert)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to reject certificate"})
		return
	}

	c.JSON(http.StatusOK, updated)
}

// GetPendingCertificates retrieves all pending certificates (admin)
// GET /api/admin/certificates/pending
func (h *CertificateHandler) GetPendingCertificates(c *gin.Context) {
	// Verify admin token
	_, err := auth.VerifyToken(c.GetHeader("Authorization"), "")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	certs, err := h.certRepo.ListPending(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get certificates"})
		return
	}

	if certs == nil {
		certs = []*model.Certificate{}
	}

	c.JSON(http.StatusOK, gin.H{
		"certificates": certs,
		"total":        len(certs),
	})
}

// GetCertificatePreview retrieves certificate data for UI preview
// GET /api/certificates/:id/preview
func (h *CertificateHandler) GetCertificatePreview(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid certificate id"})
		return
	}

	// Verify authentication
	_, err = auth.VerifyToken(c.GetHeader("Authorization"), "")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	cert, err := h.certRepo.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get certificate"})
		return
	}

	if cert == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "certificate not found"})
		return
	}

	// Get student name from database (simplified - would need student repo)
	studentName := "Student"

	previewData := certificate.NewCertificateData(cert, studentName)

	c.JSON(http.StatusOK, gin.H{
		"certificate": cert,
		"preview":     previewData,
		"formats":     []string{"pdf", "png", "jpeg"},
	})
}

// DownloadCertificatePDF downloads certificate as PDF
// GET /api/certificates/:id/download/pdf
func (h *CertificateHandler) DownloadCertificatePDF(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid certificate id"})
		return
	}

	// Verify authentication
	_, err = auth.VerifyToken(c.GetHeader("Authorization"), "")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	cert, err := h.certRepo.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get certificate"})
		return
	}

	if cert == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "certificate not found"})
		return
	}

	// Get student name (simplified)
	studentName := "Student"

	// Generate PDF
	pdfBytes, err := h.generator.GeneratePDF(cert, studentName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate certificate"})
		return
	}

	// Set response headers for PDF download
	filename := "certificate_" + cert.CertificateNumber + ".pdf"
	c.Header("Content-Disposition", "attachment; filename="+filename)
	c.Header("Content-Type", "application/pdf")
	c.Data(http.StatusOK, "application/pdf", pdfBytes)
}

// PreviewCertificateHTML provides HTML preview for certificate
// GET /api/certificates/:id/preview-html
func (h *CertificateHandler) PreviewCertificateHTML(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid certificate id"})
		return
	}

	// Verify authentication
	_, err = auth.VerifyToken(c.GetHeader("Authorization"), "")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	cert, err := h.certRepo.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get certificate"})
		return
	}

	if cert == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "certificate not found"})
		return
	}

	c.JSON(http.StatusOK, cert)
}

// Helper function to filter certificates by status
func getCertsWithStatus(certs []*model.Certificate, status string) []*model.Certificate {
	var filtered []*model.Certificate
	for _, cert := range certs {
		if cert.Status == status {
			filtered = append(filtered, cert)
		}
	}
	return filtered
}

// Helper function to get student ID from context
func getStudentIDFromContext(c *gin.Context) int64 {
	val, exists := c.Get("student_id")
	if !exists {
		return 0
	}
	studentID, ok := val.(int64)
	if !ok {
		return 0
	}
	return studentID
}
