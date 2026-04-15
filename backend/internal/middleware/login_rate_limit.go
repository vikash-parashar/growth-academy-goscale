package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

// LoginIPLimiter rate-limits login attempts per client IP (in-memory; resets on process restart).
type LoginIPLimiter struct {
	mu sync.Mutex
	m  map[string]*rate.Limiter
}

func NewLoginIPLimiter() *LoginIPLimiter {
	return &LoginIPLimiter{m: make(map[string]*rate.Limiter)}
}

func (l *LoginIPLimiter) get(ip string) *rate.Limiter {
	l.mu.Lock()
	defer l.mu.Unlock()
	lim, ok := l.m[ip]
	if !ok {
		// ~12 login attempts per minute per IP, short burst 4
		lim = rate.NewLimiter(rate.Every(time.Minute/12), 4)
		l.m[ip] = lim
	}
	return lim
}

// LoginRateLimit returns 429 when the per-IP limiter rejects.
func LoginRateLimit(limiter *LoginIPLimiter) gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		if !limiter.get(ip).Allow() {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{"error": "too many login attempts, try again shortly"})
			return
		}
		c.Next()
	}
}
