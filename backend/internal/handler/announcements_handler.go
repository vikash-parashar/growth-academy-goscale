package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/goscalelabs/api/internal/config"
)

type AnnouncementsHandler struct {
	cfg *config.Config
}

func NewAnnouncementsHandler(cfg *config.Config) *AnnouncementsHandler {
	return &AnnouncementsHandler{cfg: cfg}
}

// Get returns public pricing / fee announcements (no secrets).
func (h *AnnouncementsHandler) Get(c *gin.Context) {
	p := h.cfg.FeeIncreasePercent
	d := h.cfg.FeeIncreaseDays
	msg := h.cfg.FeeIncreaseMessage
	if msg == "" && p > 0 && d > 0 {
		msg = "Program fee will increase by " + strconv.Itoa(p) + "% in the next " + strconv.Itoa(d) +
			" days. Lock in current pricing by completing your application."
	}
	c.JSON(http.StatusOK, gin.H{
		"fee_increase_percent": p,
		"fee_increase_days":    d,
		"message":              msg,
	})
}
