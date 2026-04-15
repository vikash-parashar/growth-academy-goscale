package main

import (
	"context"
	"log/slog"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/goscalelabs/api/internal/certificate"
	"github.com/goscalelabs/api/internal/config"
	"github.com/goscalelabs/api/internal/database"
	"github.com/goscalelabs/api/internal/handler"
	"github.com/goscalelabs/api/internal/middleware"
	"github.com/goscalelabs/api/internal/notify"
	"github.com/goscalelabs/api/internal/repository"
	"github.com/goscalelabs/api/internal/service"
)

func main() {
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{})))

	cfg, err := config.Load()
	if err != nil {
		slog.Error("config", "err", err)
		os.Exit(1)
	}

	if err := os.MkdirAll(cfg.UploadDir, 0o755); err != nil {
		slog.Error("upload dir", "err", err)
		os.Exit(1)
	}
	proofDir := filepath.Join(cfg.UploadDir, "proofs")
	_ = os.MkdirAll(proofDir, 0o755)

	db, err := database.OpenPostgres(cfg.DatabaseURL)
	if err != nil {
		slog.Error("db open", "err", err)
		os.Exit(1)
	}
	defer db.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	if err := database.MigratePostgres(ctx, db); err != nil {
		slog.Error("migrate", "err", err)
		os.Exit(1)
	}
	cancel()

	leadRepo := repository.NewLeadRepository(db)
	apptRepo := repository.NewAppointmentRepository(db)
	payRepo := repository.NewPaymentRepository(db)
	proofRepo := repository.NewProofRepository(db)
	empRepo := repository.NewEmployeeRepository(db)
	adminRepo := repository.NewAdminRepository(db)
	studentRepo := repository.NewStudentRepository(db)
	certRepo := repository.NewCertificateRepository(db)

	notifier := notify.New(cfg)
	leadSvc := service.NewLeadService(leadRepo, notifier, cfg)
	apptSvc := service.NewAppointmentService(apptRepo, leadRepo, notifier, cfg)
	consultSvc := service.NewConsultationService(cfg, apptRepo)
	notifSvc := service.NewNotificationService(leadRepo, notifier, cfg)
	paySvc := service.NewPaymentService(cfg, payRepo, leadRepo)
	proofSvc := service.NewProofService(proofRepo, cfg)
	empSvc := service.NewEmployeeService(empRepo)
	studentSvc := service.NewStudentService(studentRepo, cfg)
	certSvc := service.NewCertificateService(certRepo, studentRepo, empRepo)

	// Initialize certificate generator with configuration
	certGen := certificate.NewCertificateGenerator(certificate.GeneratorConfig{
		InstituteName:       "Gopher Lab",
		InstituteTagline:    "Professional Backend Development Training",
		TeacherName:         "Your Name", // This should be configurable
		TeacherTitle:        "Senior Backend Engineer",
		WebsiteName:         "Gopher Lab",
		WebsiteDescription: "Industry-leading online Backend Development Training Institute",
		CourseName:          "Backend Developer Training",
		CourseDuration:      "6 Months",
	})

	authH := handler.NewAuthHandler(cfg, adminRepo)
	leadH := handler.NewLeadHandler(leadSvc)
	apptH := handler.NewAppointmentHandler(apptSvc)
	payH := handler.NewPaymentHandler(paySvc, apptSvc)
	consultH := handler.NewConsultationHandler(cfg, consultSvc, leadSvc, paySvc)
	proofH := handler.NewProofHandler(cfg, proofSvc)
	empH := handler.NewEmployeeHandler(cfg, empSvc)
	notifH := handler.NewNotificationHandler(notifSvc)
	annH := handler.NewAnnouncementsHandler(cfg)
	studentH := handler.NewStudentHandler(studentSvc, studentRepo, cfg)
	adminH := handler.NewAdminHandler(studentRepo, studentSvc, cfg)
	certH := handler.NewCertificateHandler(certRepo, certGen)
	healthH := &handler.HealthHandler{DB: db}

	loginLimiter := middleware.NewLoginIPLimiter()

	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(middleware.RequestID())
	r.Use(middleware.AccessLog())

	r.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.CORSOrigins,
		AllowMethods:     []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", middleware.RequestIDHeader},
		ExposeHeaders:    []string{"Content-Length", middleware.RequestIDHeader},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/health", healthH.Get)
	r.GET("/api/public/announcements", annH.Get)

	r.GET("/api/public/consultation/config", consultH.GetConfig)
	r.GET("/api/public/consultation/availability", consultH.GetAvailability)
	r.POST("/api/public/consultation/reserve", consultH.Reserve)

	// Student authentication endpoints (public)
	r.POST("/api/students/signup", studentH.Signup)
	r.POST("/api/students/login", studentH.Login)
	r.POST("/api/students/check-user-id", studentH.CheckUserIDAvailability)
	r.GET("/api/students/password-requirements", studentH.GetPasswordRequirements)

	// Public learning content
	r.GET("/api/students/courses", studentH.GetCourses)
	r.GET("/api/students/courses/:courseId/modules", studentH.GetCourseModules)
	r.GET("/api/students/modules/:moduleId/sessions", studentH.GetModuleSessions)
	r.GET("/api/students/sessions/:sessionId", studentH.GetSession)
	r.GET("/api/students/payment-plans", studentH.GetPaymentPlans)

	// Student authenticated endpoints
	student := r.Group("/api/students")
	student.Use(middleware.StudentJWT(cfg))
	{
		student.POST("/sessions/:sessionId/complete", studentH.MarkSessionComplete)
		student.GET("/courses/:courseId/progress", studentH.GetProgress)
		student.GET("/certificates", certH.GetStudentCertificates)
	}

	r.Static("/uploads", cfg.UploadDir)

	r.POST("/api/auth/login", middleware.LoginRateLimit(loginLimiter), authH.Login)

	r.POST("/api/leads", leadH.Create)
	leadsAPI := r.Group("/api/leads")
	leadsAPI.Use(middleware.AdminJWT(cfg))
	{
		leadsAPI.GET("", leadH.List)
		leadsAPI.PATCH("/:id", leadH.Patch)
	}
	r.GET("/api/proofs", proofH.ListPublic)

	r.POST("/api/appointments", apptH.Create)

	r.POST("/api/payments/order", payH.CreateOrder)
	r.POST("/api/payments/verify", payH.Verify)

	// Back-compat paths from product spec
	r.POST("/appointments", apptH.Create)
	r.GET("/appointments", middleware.AdminJWT(cfg), apptH.List)

	admin := r.Group("/api/admin")
	admin.Use(middleware.AdminJWT(cfg))
	{
		admin.GET("/appointments", apptH.List)
		admin.PATCH("/appointments/:id", apptH.Patch)
		admin.GET("/proofs", proofH.ListAdmin)
		admin.POST("/proofs", proofH.Upload)
		admin.PATCH("/proofs/:id/unlock", proofH.Unlock)
		admin.GET("/payments", payH.ListAdmin)

		admin.GET("/employees", empH.List)
		admin.POST("/employees", empH.Create)
		admin.GET("/employees/:id", empH.Get)
		admin.PATCH("/employees/:id", empH.Patch)
		admin.POST("/employees/:id/resume", empH.UploadResume)
		admin.GET("/employees/:id/payments", empH.ListPayments)
		admin.POST("/employees/:id/payments", empH.RecordPayment)

		admin.POST("/notifications/broadcast", notifH.Broadcast)

		// Certificate management endpoints
		admin.POST("/certificates", certH.CreateCertificate)
		admin.GET("/certificates/pending", certH.GetPendingCertificates)
		admin.GET("/certificates/:id", certH.GetCertificate)
		admin.GET("/courses/:courseId/certificates", certH.GetCourseCertificates)
		admin.PATCH("/certificates/:id/issue", certH.IssueCertificate)
		admin.PATCH("/certificates/:id/reject", certH.RejectCertificate)

		// Student management endpoints
		admin.GET("/students", adminH.GetStudents)
		admin.GET("/students/:studentId", adminH.GetStudentDetail)
		admin.GET("/students/attendance", adminH.GetAttendanceRecords)
		admin.GET("/students/tests", adminH.GetMockTestRecords)
		admin.GET("/students/payments", adminH.GetPaymentRecords)
		admin.GET("/dashboard/stats", adminH.GetDashboardStats)
		admin.POST("/students/:studentId/notify", adminH.SendNotification)
	}

	// Certificate view and download routes (authenticated)
	certs := r.Group("/api/certificates")
	certs.Use(middleware.AdminJWT(cfg))
	{
		certs.GET("/:id/preview", certH.GetCertificatePreview)
		certs.GET("/:id/preview-html", certH.PreviewCertificateHTML)
		certs.GET("/:id/download/pdf", certH.DownloadCertificatePDF)

	srvAddr := ":" + cfg.Port
	slog.Info("listening", "addr", srvAddr)

	go func() {
		if err := r.Run(srvAddr); err != nil {
			slog.Error("server", "err", err)
			os.Exit(1)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop
	slog.Info("shutdown")
}
