package util

import (
	"strings"
)

// ToE164Digits strips non-digits. If 10 digits (India mobile), returns 91 + digits; if already 12+ with country code, returns as-is.
func ToE164Digits(phone string) string {
	var b strings.Builder
	for _, r := range phone {
		if r >= '0' && r <= '9' {
			b.WriteRune(r)
		}
	}
	d := b.String()
	if len(d) == 10 {
		return "91" + d
	}
	return d
}
