package validation

import (
	"errors"
	"net/mail"
	"strings"
	"unicode"
)

// LeadEmail checks a trimmed RFC-style email for public forms.
func LeadEmail(email string) error {
	email = strings.TrimSpace(strings.ToLower(email))
	if email == "" {
		return errors.New("email is required")
	}
	if len(email) > 320 {
		return errors.New("email too long")
	}
	if _, err := mail.ParseAddress(email); err != nil {
		return errors.New("invalid email")
	}
	return nil
}

// LeadPhone requires enough digits for IN/intl contact numbers after stripping separators.
func LeadPhone(phone string) error {
	phone = strings.TrimSpace(phone)
	if phone == "" {
		return errors.New("phone is required")
	}
	var digits int
	for _, r := range phone {
		if unicode.IsDigit(r) {
			digits++
		}
	}
	if digits < 10 {
		return errors.New("phone must include at least 10 digits")
	}
	if digits > 15 {
		return errors.New("phone has too many digits")
	}
	if len(phone) > 32 {
		return errors.New("phone value too long")
	}
	return nil
}
