package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/goscalelabs/api/internal/model"
	"github.com/lib/pq"
)

// CertificateRepository handles certificate CRUD operations
type CertificateRepository struct {
	db *sql.DB
}

// NewCertificateRepository creates a new certificate repository
func NewCertificateRepository(db *sql.DB) *CertificateRepository {
	return &CertificateRepository{db: db}
}

// GenerateCertificateNumber creates a unique certificate number
func (r *CertificateRepository) GenerateCertificateNumber() string {
	return fmt.Sprintf("GOPHER-%d-%d", time.Now().Unix(), time.Now().Nanosecond())
}

// Create inserts a new certificate
func (r *CertificateRepository) Create(ctx context.Context, cert *model.Certificate) (*model.Certificate, error) {
	if cert.CertificateNumber == "" {
		cert.CertificateNumber = r.GenerateCertificateNumber()
	}

	query := `
		INSERT INTO certificates (
			student_id, course_id, title, completion_date, classes_attended,
			total_classes, score, topics_learned, certificate_number, status, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
		RETURNING id, student_id, course_id, title, issued_date, completion_date, classes_attended,
		          total_classes, score, topics_learned, certificate_number, certificate_url, status,
		          verified_by, created_at, updated_at
	`

	err := r.db.QueryRowContext(ctx, query,
		cert.StudentID,
		cert.CourseID,
		cert.Title,
		cert.CompletionDate,
		cert.ClassesAttended,
		cert.TotalClasses,
		cert.Score,
		pq.Array(cert.TopicsLearned),
		cert.CertificateNumber,
		cert.Status,
	).Scan(
		&cert.ID,
		&cert.StudentID,
		&cert.CourseID,
		&cert.Title,
		&cert.IssuedDate,
		&cert.CompletionDate,
		&cert.ClassesAttended,
		&cert.TotalClasses,
		&cert.Score,
		pq.Array(&cert.TopicsLearned),
		&cert.CertificateNumber,
		&cert.CertificateURL,
		&cert.Status,
		&cert.VerifiedBy,
		&cert.CreatedAt,
		&cert.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("create certificate: %w", err)
	}

	return cert, nil
}

// GetByID retrieves a certificate by ID
func (r *CertificateRepository) GetByID(ctx context.Context, id int64) (*model.Certificate, error) {
	query := `
		SELECT id, student_id, course_id, title, issued_date, completion_date, classes_attended,
		       total_classes, score, topics_learned, certificate_number, certificate_url, status,
		       verified_by, created_at, updated_at
		FROM certificates WHERE id = $1
	`

	var cert model.Certificate
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&cert.ID,
		&cert.StudentID,
		&cert.CourseID,
		&cert.Title,
		&cert.IssuedDate,
		&cert.CompletionDate,
		&cert.ClassesAttended,
		&cert.TotalClasses,
		&cert.Score,
		pq.Array(&cert.TopicsLearned),
		&cert.CertificateNumber,
		&cert.CertificateURL,
		&cert.Status,
		&cert.VerifiedBy,
		&cert.CreatedAt,
		&cert.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("get certificate: %w", err)
	}

	return &cert, nil
}

// GetByStudentAndCourse retrieves a certificate for a student in a course
func (r *CertificateRepository) GetByStudentAndCourse(ctx context.Context, studentID int64, courseID int64) (*model.Certificate, error) {
	query := `
		SELECT id, student_id, course_id, title, issued_date, completion_date, classes_attended,
		       total_classes, score, topics_learned, certificate_number, certificate_url, status,
		       verified_by, created_at, updated_at
		FROM certificates WHERE student_id = $1 AND course_id = $2
	`

	var cert model.Certificate
	err := r.db.QueryRowContext(ctx, query, studentID, courseID).Scan(
		&cert.ID,
		&cert.StudentID,
		&cert.CourseID,
		&cert.Title,
		&cert.IssuedDate,
		&cert.CompletionDate,
		&cert.ClassesAttended,
		&cert.TotalClasses,
		&cert.Score,
		pq.Array(&cert.TopicsLearned),
		&cert.CertificateNumber,
		&cert.CertificateURL,
		&cert.Status,
		&cert.VerifiedBy,
		&cert.CreatedAt,
		&cert.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("get certificate by student and course: %w", err)
	}

	return &cert, nil
}

// ListByStudent retrieves all certificates for a student
func (r *CertificateRepository) ListByStudent(ctx context.Context, studentID int64) ([]*model.Certificate, error) {
	query := `
		SELECT id, student_id, course_id, title, issued_date, completion_date, classes_attended,
		       total_classes, score, topics_learned, certificate_number, certificate_url, status,
		       verified_by, created_at, updated_at
		FROM certificates WHERE student_id = $1 ORDER BY issued_date DESC
	`

	rows, err := r.db.QueryContext(ctx, query, studentID)
	if err != nil {
		return nil, fmt.Errorf("list certificates by student: %w", err)
	}
	defer rows.Close()

	var certs []*model.Certificate
	for rows.Next() {
		var cert model.Certificate
		err := rows.Scan(
			&cert.ID,
			&cert.StudentID,
			&cert.CourseID,
			&cert.Title,
			&cert.IssuedDate,
			&cert.CompletionDate,
			&cert.ClassesAttended,
			&cert.TotalClasses,
			&cert.Score,
			pq.Array(&cert.TopicsLearned),
			&cert.CertificateNumber,
			&cert.CertificateURL,
			&cert.Status,
			&cert.VerifiedBy,
			&cert.CreatedAt,
			&cert.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("scan certificate: %w", err)
		}
		certs = append(certs, &cert)
	}

	return certs, nil
}

// ListByCourse retrieves all certificates in a course
func (r *CertificateRepository) ListByCourse(ctx context.Context, courseID int64) ([]*model.Certificate, error) {
	query := `
		SELECT id, student_id, course_id, title, issued_date, completion_date, classes_attended,
		       total_classes, score, topics_learned, certificate_number, certificate_url, status,
		       verified_by, created_at, updated_at
		FROM certificates WHERE course_id = $1 ORDER BY issued_date DESC
	`

	rows, err := r.db.QueryContext(ctx, query, courseID)
	if err != nil {
		return nil, fmt.Errorf("list certificates by course: %w", err)
	}
	defer rows.Close()

	var certs []*model.Certificate
	for rows.Next() {
		var cert model.Certificate
		err := rows.Scan(
			&cert.ID,
			&cert.StudentID,
			&cert.CourseID,
			&cert.Title,
			&cert.IssuedDate,
			&cert.CompletionDate,
			&cert.ClassesAttended,
			&cert.TotalClasses,
			&cert.Score,
			pq.Array(&cert.TopicsLearned),
			&cert.CertificateNumber,
			&cert.CertificateURL,
			&cert.Status,
			&cert.VerifiedBy,
			&cert.CreatedAt,
			&cert.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("scan certificate: %w", err)
		}
		certs = append(certs, &cert)
	}

	return certs, nil
}

// Update updates a certificate
func (r *CertificateRepository) Update(ctx context.Context, cert *model.Certificate) (*model.Certificate, error) {
	query := `
		UPDATE certificates SET
			status = $1, certificate_url = $2, verified_by = $3, updated_at = NOW()
		WHERE id = $4
		RETURNING id, student_id, course_id, title, issued_date, completion_date, classes_attended,
		          total_classes, score, topics_learned, certificate_number, certificate_url, status,
		          verified_by, created_at, updated_at
	`

	err := r.db.QueryRowContext(ctx, query,
		cert.Status,
		cert.CertificateURL,
		cert.VerifiedBy,
		cert.ID,
	).Scan(
		&cert.ID,
		&cert.StudentID,
		&cert.CourseID,
		&cert.Title,
		&cert.IssuedDate,
		&cert.CompletionDate,
		&cert.ClassesAttended,
		&cert.TotalClasses,
		&cert.Score,
		pq.Array(&cert.TopicsLearned),
		&cert.CertificateNumber,
		&cert.CertificateURL,
		&cert.Status,
		&cert.VerifiedBy,
		&cert.CreatedAt,
		&cert.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("update certificate: %w", err)
	}

	return cert, nil
}

// ListPending retrieves all pending certificates
func (r *CertificateRepository) ListPending(ctx context.Context) ([]*model.Certificate, error) {
	query := `
		SELECT id, student_id, course_id, title, issued_date, completion_date, classes_attended,
		       total_classes, score, topics_learned, certificate_number, certificate_url, status,
		       verified_by, created_at, updated_at
		FROM certificates WHERE status = 'pending' ORDER BY created_at ASC
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("list pending certificates: %w", err)
	}
	defer rows.Close()

	var certs []*model.Certificate
	for rows.Next() {
		var cert model.Certificate
		err := rows.Scan(
			&cert.ID,
			&cert.StudentID,
			&cert.CourseID,
			&cert.Title,
			&cert.IssuedDate,
			&cert.CompletionDate,
			&cert.ClassesAttended,
			&cert.TotalClasses,
			&cert.Score,
			pq.Array(&cert.TopicsLearned),
			&cert.CertificateNumber,
			&cert.CertificateURL,
			&cert.Status,
			&cert.VerifiedBy,
			&cert.CreatedAt,
			&cert.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("scan certificate: %w", err)
		}
		certs = append(certs, &cert)
	}

	return certs, nil
}
