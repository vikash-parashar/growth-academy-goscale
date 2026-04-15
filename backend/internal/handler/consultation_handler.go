package handler

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/goscalelabs/api/internal/config"
	"github.com/goscalelabs/api/internal/service"
	"github.com/goscalelabs/api/internal/validation"
)

type ConsultationHandler struct {
	cfg     *config.Config
	consult *service.ConsultationService
	leads   *service.LeadService
	pay     *service.PaymentService
}

func NewConsultationHandler(
	cfg *config.Config,
	consult *service.ConsultationService,
	leads *service.LeadService,
	pay *service.PaymentService,
) *ConsultationHandler {
	return &ConsultationHandler{cfg: cfg, consult: consult, leads: leads, pay: pay}
}

func (h *ConsultationHandler) GetConfig(c *gin.Context) {
	loc := h.cfg.ConsultTimezone()
	sh, sm := h.cfg.ConsultStartClock()
	eh, em := h.cfg.ConsultEndClock()
	c.JSON(http.StatusOK, gin.H{
		"fee_rupees":       h.cfg.ConsultFeeRupeesString(),
		"timezone":         loc,
		"slot_minutes":     h.cfg.ConsultSlotDurationMinutes(),
		"weekdays":         h.cfg.ConsultWeekdays,
		"window_start_hm":  []int{sh, sm},
		"window_end_hm":    []int{eh, em},
		"currency":         "INR",
		"call_description": "Video or voice — programme overview and founder journey",
	})
}

func (h *ConsultationHandler) GetAvailability(c *gin.Context) {
	days := 14
	if v := c.Query("days"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 {
			days = n
			if days > 60 {
				days = 60
			}
		}
	}
	slots, err := h.consult.ListAvailability(c.Request.Context(), days)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "availability failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"slots": slots})
}

type reserveReq struct {
	Name    string `json:"name" binding:"required,min=1,max=200"`
	Phone   string `json:"phone" binding:"required,max=32"`
	Email   string `json:"email" binding:"required,email,max=320"`
	SlotUTC string `json:"slot_utc" binding:"required"`
}

func (h *ConsultationHandler) Reserve(c *gin.Context) {
	var req reserveReq
	if err := c.ShouldBindJSON(&req); err != nil {
		replyJSONBind(c, err)
		return
	}
	if err := validation.LeadPhone(req.Phone); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := validation.LeadEmail(req.Email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	slot, err := time.Parse(time.RFC3339, req.SlotUTC)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "slot_utc must be RFC3339"})
		return
	}
	if err := h.consult.ValidateSlotForBooking(c.Request.Context(), slot.UTC()); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	lead, err := h.leads.CreateConsultationLead(c.Request.Context(), req.Name, req.Phone, req.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	t := slot.UTC()
	out, err := h.pay.CreateOrder(c.Request.Context(), service.CreateOrderInput{
		LeadID:               lead.ID,
		AmountRupees:         h.cfg.ConsultFeeRupeesString(),
		PendingAppointmentAt: &t,
	})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"lead_id":      lead.ID,
		"order_id":     out.OrderID,
		"amount_paise": out.AmountPaise,
		"key_id":       out.KeyID,
		"slot_utc":     t.Format(time.RFC3339),
		"fee_rupees":   h.cfg.ConsultFeeRupeesString(),
	})
}
