package middleware

import (
	"crypto/rand"
	"encoding/hex"

	"github.com/gin-gonic/gin"
)

const RequestIDHeader = "X-Request-Id"

// RequestID assigns a request id (from client header or generated) and exposes it in the response.
func RequestID() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.GetHeader(RequestIDHeader)
		if id == "" {
			var b [10]byte
			if _, err := rand.Read(b[:]); err != nil {
				id = "unknown"
			} else {
				id = hex.EncodeToString(b[:])
			}
		}
		c.Writer.Header().Set(RequestIDHeader, id)
		c.Set("request_id", id)
		c.Next()
	}
}
