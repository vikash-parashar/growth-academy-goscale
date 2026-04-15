package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/goscalelabs/api/internal/auth"
	"github.com/goscalelabs/api/internal/config"
)

func AdminJWT(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		h := c.GetHeader("Authorization")
		if h == "" || !strings.HasPrefix(strings.ToLower(h), "bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing token"})
			return
		}
		token := strings.TrimSpace(h[7:])
		cl, err := auth.ParseToken(cfg.JWTSecret, token)
		if err != nil || cl.Role != "admin" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}
		c.Next()
	}
}

func StudentJWT(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		h := c.GetHeader("Authorization")
		if h == "" || !strings.HasPrefix(strings.ToLower(h), "bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing token"})
			return
		}
		token := strings.TrimSpace(h[7:])
		cl, err := auth.ParseToken(cfg.JWTSecret, token)
		if err != nil || cl.Role != "student" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}
		c.Set("student_id", cl.StudentID)
		c.Set("student_email", cl.Email)
		c.Set("student_user_id", cl.UserID)
		c.Next()
	}
}
