package middleware

import (
	"log/slog"
	"time"

	"github.com/gin-gonic/gin"
)

// AccessLog emits one JSON log line per request with request_id, status, latency, path.
func AccessLog() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()

		rid, _ := c.Get("request_id")
		path := c.FullPath()
		if path == "" {
			path = c.Request.URL.Path
		}

		slog.Info("http_request",
			"request_id", rid,
			"method", c.Request.Method,
			"path", path,
			"status", c.Writer.Status(),
			"duration_ms", time.Since(start).Milliseconds(),
			"client_ip", c.ClientIP(),
		)
	}
}
