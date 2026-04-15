package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/goscalelabs/api/internal/service"
)

type NotificationHandler struct {
	svc *service.NotificationService
}

func NewNotificationHandler(s *service.NotificationService) *NotificationHandler {
	return &NotificationHandler{svc: s}
}

func (h *NotificationHandler) Broadcast(c *gin.Context) {
	var req service.BroadcastInput
	if err := c.ShouldBindJSON(&req); err != nil {
		replyJSONBind(c, err)
		return
	}
	res, err := h.svc.Broadcast(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, res)
}
