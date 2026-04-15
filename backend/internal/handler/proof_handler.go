package handler

import (
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/goscalelabs/api/internal/config"
	"github.com/goscalelabs/api/internal/model"
	"github.com/goscalelabs/api/internal/service"
	"github.com/goscalelabs/api/internal/validation"
)

type ProofHandler struct {
	cfg *config.Config
	svc *service.ProofService
}

func NewProofHandler(cfg *config.Config, s *service.ProofService) *ProofHandler {
	return &ProofHandler{cfg: cfg, svc: s}
}

func (h *ProofHandler) ListPublic(c *gin.Context) {
	items, err := h.svc.ListPublic(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "list failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": items})
}

func (h *ProofHandler) ListAdmin(c *gin.Context) {
	items, err := h.svc.ListAdmin(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "list failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": items})
}

func (h *ProofHandler) Upload(c *gin.Context) {
	proofType := strings.TrimSpace(c.PostForm("type"))
	if err := validation.ProofType(proofType); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fh, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file is required"})
		return
	}
	ext := strings.ToLower(filepath.Ext(fh.Filename))
	if ext == "" {
		ext = ".bin"
	}
	name := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
	sub := filepath.Join(h.cfg.UploadDir, "proofs")
	if err := os.MkdirAll(sub, 0o755); err != nil {
		slog.Error("mkdir uploads", "err", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "upload failed"})
		return
	}
	dstPath := filepath.Join(sub, name)
	if err := c.SaveUploadedFile(fh, dstPath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "save failed"})
		return
	}
	rel := "/uploads/proofs/" + name

	previewRel := ""
	previewH, err := c.FormFile("preview")
	if err == nil && previewH != nil {
		pname := fmt.Sprintf("p%d%s", time.Now().UnixNano(), strings.ToLower(filepath.Ext(previewH.Filename)))
		pdst := filepath.Join(sub, pname)
		if err := c.SaveUploadedFile(previewH, pdst); err == nil {
			previewRel = "/uploads/proofs/" + pname
		}
	}
	if previewRel == "" {
		previewRel = rel
	}

	p := &model.Proof{Type: proofType, URL: rel, PreviewURL: previewRel, Unlocked: false}
	if err := h.svc.Create(c.Request.Context(), p); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db failed"})
		return
	}
	c.JSON(http.StatusCreated, p)
}

func (h *ProofHandler) Unlock(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	var body struct {
		Unlocked bool `json:"unlocked"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		replyJSONBind(c, err)
		return
	}
	if err := h.svc.SetUnlocked(c.Request.Context(), id, body.Unlocked); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

// SaveUpload is a helper for tests or future use.
func SaveUpload(r io.Reader, dir, name string) (string, error) {
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return "", err
	}
	path := filepath.Join(dir, name)
	f, err := os.Create(path)
	if err != nil {
		return "", err
	}
	defer f.Close()
	if _, err := io.Copy(f, r); err != nil {
		return "", err
	}
	return path, nil
}
