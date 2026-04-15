package validation

import (
	"errors"
	"regexp"
	"strings"
)

var proofTypeRe = regexp.MustCompile(`^[a-zA-Z0-9][a-zA-Z0-9 _.-]{0,63}$`)

// ProofType limits proof category labels from multipart forms.
func ProofType(s string) error {
	s = strings.TrimSpace(s)
	if s == "" {
		return errors.New("type is required")
	}
	if !proofTypeRe.MatchString(s) {
		return errors.New("type must be 1–64 characters: letters, numbers, space, _, -, .")
	}
	return nil
}
