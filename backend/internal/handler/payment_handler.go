package handler

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/goscalelabs/api/internal/service"
)

type PaymentHandler struct {
	svc  *service.PaymentService
	appt *service.AppointmentService
}

func NewPaymentHandler(s *service.PaymentService, appt *service.AppointmentService) *PaymentHandler {
	return &PaymentHandler{svc: s, appt: appt}
}

func (h *PaymentHandler) CreateOrder(c *gin.Context) {
	var req service.CreateOrderInput
	if err := c.ShouldBindJSON(&req); err != nil {
		replyJSONBind(c, err)
		return
	}
	out, err := h.svc.CreateOrder(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, out)
}

func (h *PaymentHandler) Verify(c *gin.Context) {
	var req service.VerifyInput
	if err := c.ShouldBindJSON(&req); err != nil {
		replyJSONBind(c, err)
		return
	}
	if err := h.svc.Verify(c.Request.Context(), req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	pay, err := h.svc.GetByOrderID(c.Request.Context(), req.RazorpayOrderID)
	if err != nil {
		slog.Warn("payment verify: get payment", "err", err, "order", req.RazorpayOrderID)
	} else if pay != nil && pay.PendingAppointmentAt != nil && h.appt != nil {
		_, err := h.appt.Create(c.Request.Context(), service.CreateAppointmentInput{
			LeadID:   pay.LeadID,
			DateTime: *pay.PendingAppointmentAt,
		})
		if err != nil {
			slog.Warn("consultation appointment after payment", "err", err, "order", req.RazorpayOrderID, "lead", pay.LeadID)
		} else {
			if err := h.svc.ClearConsultationPending(c.Request.Context(), req.RazorpayOrderID); err != nil {
				slog.Warn("clear pending appointment", "err", err, "order", req.RazorpayOrderID)
			}
		}
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *PaymentHandler) ListAdmin(c *gin.Context) {
	items, err := h.svc.ListAll(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "list failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": items})
}
