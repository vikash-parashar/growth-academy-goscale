package service

import (
	"context"
	"errors"

	"github.com/goscalelabs/api/internal/model"
	"github.com/goscalelabs/api/internal/repository"
)

// CertificateService handles business logic for certificates
type CertificateService struct {
	certRepo     *repository.CertificateRepository
	studentRepo  *repository.StudentRepository
	employeeRepo *repository.EmployeeRepository
}

// NewCertificateService creates a new certificate service
func NewCertificateService(
	certRepo *repository.CertificateRepository,
	studentRepo *repository.StudentRepository,
	employeeRepo *repository.EmployeeRepository,
) *CertificateService {
	return &CertificateService{
		certRepo:     certRepo,
		studentRepo:  studentRepo,
		employeeRepo: employeeRepo,
	}
}

// CreateCertificateRequest represents the request to create a certificate
type CreateCertificateRequest struct {
	StudentID       int64
	CourseID        int64
	ClassesAttended int
	TotalClasses    int
	Score           float64
	TopicsLearned   []string
}

// CreateCertificate creates a new certificate for a student's course completion
func (s *CertificateService) CreateCertificate(ctx context.Context, req *CreateCertificateRequest) (*model.Certificate, error) {
	if req.StudentID == 0 || req.CourseID == 0 {
		return nil, errors.New("invalid student or course id")
	}

	if req.Score < 0 || req.Score > 100 {
		return nil, errors.New("score must be between 0 and 100")
	}

	if req.ClassesAttended > req.TotalClasses && req.TotalClasses > 0 {
		return nil, errors.New("classes attended cannot exceed total classes")
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

	created, err := s.certRepo.Create(ctx, cert)
	if err != nil {
		return nil, err
	}

	return created, nil
}

// IssueCertificate marks a certificate as issued/approved
func (s *CertificateService) IssueCertificate(ctx context.Context, certificateID int64, verifiedByAdminID int64) (*model.Certificate, error) {
	cert, err := s.certRepo.GetByID(ctx, certificateID)
	if err != nil {
		return nil, err
	}

	if cert == nil {
		return nil, errors.New("certificate not found")
	}

	if cert.Status == "issued" {
		return nil, errors.New("certificate is already issued")
	}

	cert.Status = "issued"
	cert.VerifiedBy = &verifiedByAdminID

	return s.certRepo.Update(ctx, cert)
}

// RejectCertificate marks a certificate as rejected
func (s *CertificateService) RejectCertificate(ctx context.Context, certificateID int64, reason string) (*model.Certificate, error) {
	cert, err := s.certRepo.GetByID(ctx, certificateID)
	if err != nil {
		return nil, err
	}

	if cert == nil {
		return nil, errors.New("certificate not found")
	}

	if cert.Status == "rejected" {
		return nil, errors.New("certificate is already rejected")
	}

	cert.Status = "rejected"

	return s.certRepo.Update(ctx, cert)
}

// GetStudentCertificates retrieves all approved certificates for a student
func (s *CertificateService) GetStudentCertificates(ctx context.Context, studentID int64) ([]*model.Certificate, error) {
	certs, err := s.certRepo.ListByStudent(ctx, studentID)
	if err != nil {
		return nil, err
	}

	// Filter only issued certificates
	var approved []*model.Certificate
	for _, cert := range certs {
		if cert.Status == "issued" {
			approved = append(approved, cert)
		}
	}

	return approved, nil
}

// GetCourseCertificatesSummary returns statistics about certificates in a course
type CertificateSummary struct {
	Total        int
	Issued       int
	Pending      int
	Rejected     int
	AverageScore float64
}

// GetCourseCertificatesSummary gets statistics for a course's certificates
func (s *CertificateService) GetCourseCertificatesSummary(ctx context.Context, courseID int64) (*CertificateSummary, error) {
	certs, err := s.certRepo.ListByCourse(ctx, courseID)
	if err != nil {
		return nil, err
	}

	summary := &CertificateSummary{
		Total: len(certs),
	}

	var totalScore float64
	issuedCount := 0

	for _, cert := range certs {
		switch cert.Status {
		case "issued":
			summary.Issued++
			totalScore += cert.Score
			issuedCount++
		case "pending":
			summary.Pending++
		case "rejected":
			summary.Rejected++
		}
	}

	if issuedCount > 0 {
		summary.AverageScore = totalScore / float64(issuedCount)
	}

	return summary, nil
}

// GetPendingCertificates retrieves all certificates awaiting verification
func (s *CertificateService) GetPendingCertificates(ctx context.Context) ([]*model.Certificate, error) {
	return s.certRepo.ListPending(ctx)
}

// CertificateStats returns detailed statistics
type CertificateStats struct {
	Total             int64
	Issued            int64
	Pending           int64
	Rejected          int64
	AverageScore      float64
	AverageAttendance float64
}

// GetStats returns certificate statistics
func (s *CertificateService) GetStats(ctx context.Context) (*CertificateStats, error) {
	pending, err := s.certRepo.ListPending(ctx)
	if err != nil {
		return nil, err
	}

	stats := &CertificateStats{}

	for _, cert := range pending {
		stats.Total++
		stats.Pending++
		stats.AverageScore += cert.Score
		if cert.TotalClasses > 0 {
			stats.AverageAttendance += float64(cert.ClassesAttended) / float64(cert.TotalClasses) * 100
		}
	}

	if len(pending) > 0 {
		stats.AverageScore = stats.AverageScore / float64(len(pending))
		stats.AverageAttendance = stats.AverageAttendance / float64(len(pending))
	}

	return stats, nil
}
