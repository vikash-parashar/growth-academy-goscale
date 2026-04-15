package handler

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/goscalelabs/api/internal/model"
	"github.com/goscalelabs/api/internal/service"
)

type AppointmentHandler struct {
	svc *service.AppointmentService
}

func NewAppointmentHandler(s *service.AppointmentService) *AppointmentHandler {
	return &AppointmentHandler{svc: s}
}

type createApptReq struct {
	LeadID   int64  `json:"lead_id" binding:"required,gt=0"`
	DateTime string `json:"datetime" binding:"required"`
}

func (h *AppointmentHandler) Create(c *gin.Context) {
	var req createApptReq
	if err := c.ShouldBindJSON(&req); err != nil {
		replyJSONBind(c, err)
		return
	}
	dt, err := time.Parse(time.RFC3339, req.DateTime)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "datetime must be RFC3339"})
		return
	}
	ap, err := h.svc.Create(c.Request.Context(), service.CreateAppointmentInput{LeadID: req.LeadID, DateTime: dt})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, ap)
}

func (h *AppointmentHandler) List(c *gin.Context) {
	items, err := h.svc.List(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "list failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": items})
}

type patchApptReq struct {
	Status model.AppointmentStatus `json:"status" binding:"required"`
}

func (h *AppointmentHandler) Patch(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	var req patchApptReq
	if err := c.ShouldBindJSON(&req); err != nil {
		replyJSONBind(c, err)
		return
	}
	switch req.Status {
	case model.ApptAccepted, model.ApptRejected, model.ApptPending:
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid status"})
		return
	}
	if err := h.svc.SetStatus(c.Request.Context(), id, req.Status); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}
