package handler

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"github.com/goscalelabs/api/internal/auth"
	"github.com/goscalelabs/api/internal/config"
	"github.com/goscalelabs/api/internal/repository"
	"github.com/goscalelabs/api/internal/validation"
)

type AuthHandler struct {
	cfg       *config.Config
	adminRepo *repository.AdminRepository
}

func NewAuthHandler(cfg *config.Config, adminRepo *repository.AdminRepository) *AuthHandler {
	return &AuthHandler{cfg: cfg, adminRepo: adminRepo}
}

type loginReq struct {
	Username string `json:"username" binding:"required,min=1,max=254"`
	Password string `json:"password" binding:"required,min=8,max=128"`
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req loginReq
	if err := c.ShouldBindJSON(&req); err != nil {
		replyJSONBind(c, err)
		return
	}
	username := strings.TrimSpace(req.Username)
	if err := validation.LoginIdentifier(username); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := validation.LoginPassword(req.Password); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Test admin hardcoded credentials (for development/testing)
	// TODO: Remove these test credentials once database admin seeding works properly
	if username == "testadmin@gopher.lab" && req.Password == "TestAdmin@2024" {
		token, err := auth.IssueToken(h.cfg.JWTSecret, h.cfg.JWTExpiry())
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "token issue failed"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"token": token})
		return
	}

	if ok, err := h.tryDBAdmin(c, username, req.Password); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "login failed"})
		return
	} else if ok {
		token, err := auth.IssueToken(h.cfg.JWTSecret, h.cfg.JWTExpiry())
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "token issue failed"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"token": token})
		return
	}
	if username != h.cfg.AdminUsername {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}
	if !h.cfg.CheckAdminPassword(req.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}
	token, err := auth.IssueToken(h.cfg.JWTSecret, h.cfg.JWTExpiry())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "token issue failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": token})
}

// tryDBAdmin returns (true, nil) if DB admin matched; (false, nil) if no match or no row; (_, err) on DB error.
func (h *AuthHandler) tryDBAdmin(c *gin.Context, username, password string) (bool, error) {
	u, err := h.adminRepo.GetByEmail(c.Request.Context(), username)
	if err != nil {
		return false, err
	}
	if u == nil {
		return false, nil
	}
	if bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password)) != nil {
		return false, nil
	}
	return true, nil
}
