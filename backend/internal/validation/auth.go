package validation

import (
	"errors"
	"regexp"
	"strings"
)

var legacyLoginID = regexp.MustCompile(`^[a-zA-Z0-9][a-zA-Z0-9._-]{0,62}$`)
var loginEmail = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)

// LoginIdentifier accepts either a normal email (admin_users) or a short legacy env username (e.g. admin).
func LoginIdentifier(s string) error {
	s = strings.TrimSpace(s)
	if s == "" {
		return errors.New("username is required")
	}
	if len(s) > 254 {
		return errors.New("username too long")
	}
	if strings.Contains(s, "@") {
		if !loginEmail.MatchString(s) {
			return errors.New("invalid email")
		}
		return nil
	}
	if !legacyLoginID.MatchString(s) {
		return errors.New("username must be an email or alphanumeric identifier")
	}
	return nil
}

// LoginPassword enforces length bounds (complexity optional for portal UX).
func LoginPassword(pw string) error {
	if len(pw) < 8 {
		return errors.New("password must be at least 8 characters")
	}
	if len(pw) > 128 {
		return errors.New("password too long")
	}
	return nil
}
