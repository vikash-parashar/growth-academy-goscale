package handler

import (
	"context"
	"database/sql"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

// HealthHandler reports liveness and optional database connectivity.
type HealthHandler struct {
	DB *sql.DB
}

func (h *HealthHandler) Get(c *gin.Context) {
	out := gin.H{
		"status":  "ok",
		"service": "gopherlab-api",
	}
	if v := os.Getenv("APP_VERSION"); v != "" {
		out["version"] = v
	}
	if h.DB != nil {
		ctx, cancel := context.WithTimeout(c.Request.Context(), 2*time.Second)
		defer cancel()
		if err := h.DB.PingContext(ctx); err != nil {
			out["status"] = "degraded"
			out["database"] = gin.H{"ok": false, "error": err.Error()}
			c.JSON(http.StatusServiceUnavailable, out)
			return
		}
		out["database"] = gin.H{"ok": true}
	}
	c.JSON(http.StatusOK, out)
}
