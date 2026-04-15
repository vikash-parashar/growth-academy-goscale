package handler

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/goscalelabs/api/internal/validation"
)

func replyJSONBind(c *gin.Context, err error) {
	var syn *json.SyntaxError
	if errors.As(err, &syn) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON"})
		return
	}
	var unmarshal *json.UnmarshalTypeError
	if errors.As(err, &unmarshal) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON field types"})
		return
	}
	if details := validation.FormatErrors(err); len(details) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "validation failed", "details": details})
		return
	}
	c.JSON(http.StatusBadRequest, gin.H{"error": "invalid body"})
}
