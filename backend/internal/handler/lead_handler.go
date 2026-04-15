package handler

import (
	"log/slog"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/goscalelabs/api/internal/model"
	"github.com/goscalelabs/api/internal/service"
)

type LeadHandler struct {
	svc *service.LeadService
}

func NewLeadHandler(s *service.LeadService) *LeadHandler {
	return &LeadHandler{svc: s}
}

func (h *LeadHandler) Create(c *gin.Context) {
	var req service.CreateLeadInput
	if err := c.ShouldBindJSON(&req); err != nil {
		replyJSONBind(c, err)
		return
	}
	lead, err := h.svc.Create(c.Request.Context(), req)
	if err != nil {
		slog.Warn("lead create failed", "err", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, lead)
}

func (h *LeadHandler) List(c *gin.Context) {
	status := c.Query("status")
	q := c.Query("q")
	leads, err := h.svc.List(c.Request.Context(), status, q)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "list failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": leads})
}

type patchLeadReq struct {
	Status *string `json:"status" binding:"omitempty,oneof=new contacted converted rejected"`
	Notes  *string `json:"notes" binding:"omitempty,max=10000"`
}

func (h *LeadHandler) Patch(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	var req patchLeadReq
	if err := c.ShouldBindJSON(&req); err != nil {
		replyJSONBind(c, err)
		return
	}
	if req.Status == nil && req.Notes == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "provide status and/or notes"})
		return
	}
	var st *model.LeadStatus
	if req.Status != nil {
		v := model.LeadStatus(*req.Status)
		switch v {
		case model.LeadNew, model.LeadContacted, model.LeadConverted, model.LeadRejected:
			st = &v
		default:
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid status"})
			return
		}
	}
	if err := h.svc.Update(c.Request.Context(), id, st, req.Notes); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}
