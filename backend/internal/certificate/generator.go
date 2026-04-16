package certificate

import (
	"bytes"
	"fmt"
	"os"
	"time"

	"github.com/goscalelabs/api/internal/model"
	"github.com/jung-kurt/gofpdf"
)

// GeneratorConfig holds configuration for certificate generation
type GeneratorConfig struct {
	InstituteName      string
	InstituteTagline   string
	TeacherName        string
	TeacherTitle       string
	WebsiteName        string
	WebsiteDescription string
	CourseName         string
	CourseDuration     string
}

// CertificateGenerator generates certificates in various formats
type CertificateGenerator struct {
	config GeneratorConfig
}

// NewCertificateGenerator creates a new certificate generator
func NewCertificateGenerator(config GeneratorConfig) *CertificateGenerator {
	return &CertificateGenerator{config: config}
}

// GeneratePDF generates a PDF certificate
func (cg *CertificateGenerator) GeneratePDF(cert *model.Certificate, studentName string) ([]byte, error) {
	pdf := gofpdf.New("L", "mm", "A4", "")
	pdf.AddPage()

	// Set background color to light cream
	pdf.SetFillColor(255, 250, 240)
	pdf.Rect(0, 0, 297, 210, "F")

	// Border
	pdf.SetDrawColor(184, 134, 11) // Dark gold
	pdf.SetLineWidth(3)
	pdf.Rect(10, 10, 277, 190, "D")

	pdf.SetDrawColor(218, 165, 32) // Goldenrod
	pdf.SetLineWidth(1)
	pdf.Rect(12, 12, 273, 186, "D")

	// Top section - Institute name and tagline
	pdf.SetFont("Arial", "B", 28)
	pdf.SetTextColor(0, 51, 102) // Dark blue
	pdf.SetY(25)
	pdf.CellFormat(277, 10, cg.config.InstituteName, "", 1, "C", false, 0, "")

	pdf.SetFont("Arial", "I", 12)
	pdf.SetTextColor(100, 100, 100)
	pdf.SetY(38)
	pdf.CellFormat(277, 5, cg.config.InstituteTagline, "", 1, "C", false, 0, "")

	// Divider line
	pdf.SetDrawColor(184, 134, 11)
	pdf.SetLineWidth(2)
	pdf.Line(30, 45, 267, 45)

	// Certificate title
	pdf.SetFont("Arial", "B", 24)
	pdf.SetTextColor(184, 134, 11) // Dark gold
	pdf.SetY(52)
	pdf.CellFormat(277, 10, "Certificate of Completion", "", 1, "C", false, 0, "")

	// Main content
	pdf.SetFont("Arial", "", 11)
	pdf.SetTextColor(0, 0, 0)
	pdf.SetY(65)
	pdf.CellFormat(277, 5, "This is to certify that", "", 1, "C", false, 0, "")

	// Student name - highlighted
	pdf.SetFont("Arial", "B", 18)
	pdf.SetTextColor(0, 51, 102)
	pdf.SetY(72)
	pdf.CellFormat(277, 8, studentName, "", 1, "C", false, 0, "")

	// Course information
	pdf.SetFont("Arial", "", 11)
	pdf.SetTextColor(0, 0, 0)
	pdf.SetY(82)
	certText := fmt.Sprintf("has successfully completed the %s program", cg.config.CourseName)
	pdf.CellFormat(277, 5, certText, "", 1, "C", false, 0, "")

	pdf.SetY(88)
	pdf.CellFormat(277, 5, fmt.Sprintf("with a duration of %s", cg.config.CourseDuration), "", 1, "C", false, 0, "")

	// Performance details
	pdf.SetFont("Arial", "B", 10)
	pdf.SetY(98)
	pdf.SetX(40)
	pdf.CellFormat(50, 5, "Final Score:", "LT", 0, "L", false, 0, "")
	pdf.SetX(95)
	pdf.CellFormat(50, 5, fmt.Sprintf("%.1f%%", cert.Score), "RT", 1, "L", false, 0, "")

	pdf.SetX(40)
	pdf.CellFormat(50, 5, "Attendance:", "LB", 0, "L", false, 0, "")
	pdf.SetX(95)
	pdf.CellFormat(50, 5, fmt.Sprintf("%d/%d Classes", cert.ClassesAttended, cert.TotalClasses), "RB", 1, "L", false, 0, "")

	// Skills/Topics
	if len(cert.TopicsLearned) > 0 {
		pdf.SetFont("Arial", "B", 9)
		pdf.SetY(115)
		pdf.SetX(40)
		pdf.CellFormat(200, 5, "Skills Acquired:", "", 1, "L", false, 0, "")

		pdf.SetFont("Arial", "", 9)
		topicsStr := ""
		for i, topic := range cert.TopicsLearned {
			if i > 0 {
				topicsStr += " • "
			}
			topicsStr += topic
		}

		pdf.SetX(45)
		pdf.MultiCell(200, 4, topicsStr, "", "L", false)
	}

	// Divider line before footer
	pdf.SetDrawColor(184, 134, 11)
	pdf.SetLineWidth(1)
	pdf.Line(30, 140, 267, 140)

	// Certificate number
	pdf.SetFont("Arial", "", 8)
	pdf.SetTextColor(100, 100, 100)
	pdf.SetY(145)
	pdf.CellFormat(277, 3, fmt.Sprintf("Certificate No: %s | Date: %s", cert.CertificateNumber, cert.IssuedDate.Format("January 2, 2006")), "", 1, "C", false, 0, "")

	// Signature section
	pdf.SetY(155)
	pdf.SetFont("Arial", "B", 10)
	pdf.SetTextColor(0, 51, 102)

	// Left signature - Institute representative
	pdf.SetX(40)
	pdf.SetY(160)
	pdf.CellFormat(60, 4, "_________________", "", 1, "C", false, 0, "")
	pdf.SetX(40)
	pdf.SetFont("Arial", "", 9)
	pdf.SetTextColor(0, 0, 0)
	pdf.CellFormat(60, 4, "Institute Director", "", 1, "C", false, 0, "")
	pdf.SetX(40)
	pdf.CellFormat(60, 3, cg.config.InstituteName, "", 1, "C", false, 0, "")

	// Middle - stamp area
	pdf.SetFont("Arial", "B", 9)
	pdf.SetTextColor(184, 134, 11)
	pdf.SetX(140)
	pdf.SetY(160)
	pdf.CellFormat(60, 4, "GOPHER LAB", "", 1, "C", false, 0, "")
	pdf.SetX(140)
	pdf.SetFont("Arial", "", 7)
	pdf.SetTextColor(100, 100, 100)
	pdf.CellFormat(60, 3, "Certified Teaching Institute", "", 1, "C", false, 0, "")

	// Right signature - Teacher
	pdf.SetX(200)
	pdf.SetY(160)
	pdf.SetFont("Arial", "B", 10)
	pdf.SetTextColor(0, 51, 102)
	pdf.CellFormat(60, 4, "_________________", "", 1, "C", false, 0, "")
	pdf.SetX(200)
	pdf.SetFont("Arial", "", 9)
	pdf.SetTextColor(0, 0, 0)
	pdf.CellFormat(60, 4, cg.config.TeacherName, "", 1, "C", false, 0, "")
	pdf.SetX(200)
	pdf.CellFormat(60, 3, cg.config.TeacherTitle, "", 1, "C", false, 0, "")

	// Footer message
	pdf.SetY(185)
	pdf.SetFont("Arial", "I", 8)
	pdf.SetTextColor(100, 100, 100)
	msg := fmt.Sprintf("This certificate is awarded in recognition of successfully completing %s training with demonstrated expertise and practical programming skills. | %s", cg.config.CourseName, cg.config.WebsiteDescription)
	pdf.MultiCell(277, 3, msg, "", "C", false)

	// Return PDF bytes
	var buf bytes.Buffer
	err := pdf.Output(&buf)
	if err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

// SavePDFToFile saves PDF to a file
func (cg *CertificateGenerator) SavePDFToFile(cert *model.Certificate, studentName string, filepath string) error {
	pdfBytes, err := cg.GeneratePDF(cert, studentName)
	if err != nil {
		return err
	}

	// Create directory if not exists
	dir := ""
	for i := len(filepath) - 1; i >= 0; i-- {
		if filepath[i] == '/' {
			dir = filepath[:i]
			break
		}
	}

	if dir != "" {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			return err
		}
	}

	// Write file
	return os.WriteFile(filepath, pdfBytes, 0o644)
}

// CertificateData represents data for preview
type CertificateData struct {
	StudentName       string    `json:"student_name"`
	CourseName        string    `json:"course_name"`
	Score             float64   `json:"score"`
	ClassesAttended   int       `json:"classes_attended"`
	TotalClasses      int       `json:"total_classes"`
	TopicsLearned     []string  `json:"topics_learned"`
	CertificateNumber string    `json:"certificate_number"`
	IssuedDate        time.Time `json:"issued_date"`
}

// NewCertificateData creates preview data from certificate
func NewCertificateData(cert *model.Certificate, studentName string) *CertificateData {
	return &CertificateData{
		StudentName:       studentName,
		CourseName:        cert.Title,
		Score:             cert.Score,
		ClassesAttended:   cert.ClassesAttended,
		TotalClasses:      cert.TotalClasses,
		TopicsLearned:     cert.TopicsLearned,
		CertificateNumber: cert.CertificateNumber,
		IssuedDate:        cert.IssuedDate,
	}
}
