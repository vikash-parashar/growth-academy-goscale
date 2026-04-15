package handler

import (
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/goscalelabs/api/internal/config"
	"github.com/goscalelabs/api/internal/repository"
	"github.com/goscalelabs/api/internal/service"
	"github.com/goscalelabs/api/internal/validation"
)

type EmployeeHandler struct {
	cfg *config.Config
	svc *service.EmployeeService
}

func NewEmployeeHandler(cfg *config.Config, s *service.EmployeeService) *EmployeeHandler {
	return &EmployeeHandler{cfg: cfg, svc: s}
}

func (h *EmployeeHandler) List(c *gin.Context) {
	q := c.Query("q")
	items, err := h.svc.List(c.Request.Context(), q)
	if err != nil {
		slog.Error("employee list", "err", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "list failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": items})
}

func (h *EmployeeHandler) Create(c *gin.Context) {
	var req service.CreateEmployeeInput
	if err := c.ShouldBindJSON(&req); err != nil {
		replyJSONBind(c, err)
		return
	}
	if req.Phone != "" {
		if err := validation.LeadPhone(req.Phone); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}
	e, err := h.svc.Create(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, e)
}

func (h *EmployeeHandler) Get(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	e, err := h.svc.GetByID(c.Request.Context(), id)
	if err != nil {
		if err == repository.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "load failed"})
		return
	}
	c.JSON(http.StatusOK, e)
}

type patchEmployeeJSON struct {
	Name               *string `json:"name" binding:"omitempty,min=1,max=200"`
	Email              *string `json:"email" binding:"omitempty,email,max=320"`
	Phone              *string `json:"phone" binding:"omitempty,max=32"`
	RoleTitle          *string `json:"role_title" binding:"omitempty,max=200"`
	Department         *string `json:"department" binding:"omitempty,max=200"`
	Experience         *string `json:"experience" binding:"omitempty,max=2000"`
	MonthlySalaryPaise *int64  `json:"monthly_salary_paise" binding:"omitempty,gte=0"`
	IncentivesNotes    *string `json:"incentives_notes" binding:"omitempty,max=5000"`
	StartDate          *string `json:"start_date" binding:"omitempty,max=32"`
	EndDate            *string `json:"end_date" binding:"omitempty,max=32"`
	ClearEndDate       *bool   `json:"clear_end_date"`
	Status             *string `json:"status" binding:"omitempty,max=32"`
}

func (h *EmployeeHandler) Patch(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	var req patchEmployeeJSON
	if err := c.ShouldBindJSON(&req); err != nil {
		replyJSONBind(c, err)
		return
	}
	if req.Phone != nil && *req.Phone != "" {
		if err := validation.LeadPhone(*req.Phone); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}
	in := service.PatchEmployeeInput{
		Name:               req.Name,
		Email:              req.Email,
		Phone:              req.Phone,
		RoleTitle:          req.RoleTitle,
		Department:         req.Department,
		Experience:         req.Experience,
		MonthlySalaryPaise: req.MonthlySalaryPaise,
		IncentivesNotes:    req.IncentivesNotes,
		StartDate:          req.StartDate,
		EndDate:            req.EndDate,
		Status:             req.Status,
	}
	if req.ClearEndDate != nil && *req.ClearEndDate {
		in.EndDateExplicitNull = true
		in.EndDate = nil
	}
	if err := h.svc.Patch(c.Request.Context(), id, in); err != nil {
		if err == repository.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *EmployeeHandler) ListPayments(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	items, err := h.svc.ListPayments(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "list failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": items})
}

func (h *EmployeeHandler) RecordPayment(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	var req service.RecordPaymentInput
	if err := c.ShouldBindJSON(&req); err != nil {
		replyJSONBind(c, err)
		return
	}
	p, err := h.svc.RecordPayment(c.Request.Context(), id, req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, p)
}

func (h *EmployeeHandler) UploadResume(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	fh, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file is required"})
		return
	}
	ext := strings.ToLower(filepath.Ext(fh.Filename))
	if ext == "" {
		ext = ".bin"
	}
	sub := filepath.Join(h.cfg.UploadDir, "employees", fmt.Sprintf("%d", id))
	if err := os.MkdirAll(sub, 0o755); err != nil {
		slog.Error("mkdir employee upload", "err", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "upload failed"})
		return
	}
	name := fmt.Sprintf("resume_%d%s", time.Now().UnixNano(), ext)
	dstPath := filepath.Join(sub, name)
	if err := c.SaveUploadedFile(fh, dstPath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "save failed"})
		return
	}
	rel := fmt.Sprintf("/uploads/employees/%d/%s", id, name)
	if err := h.svc.SetResumeURL(c.Request.Context(), id, rel); err != nil {
		if err == repository.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db failed"})
		return
	}
	e, err := h.svc.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"resume_url": rel})
		return
	}
	c.JSON(http.StatusOK, e)
}
