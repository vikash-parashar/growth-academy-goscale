package util

import (
	"net/url"
	"strings"
)

// WhatsAppLink builds wa.me deep link. phoneE164 should be digits only (country code without +).
func WhatsAppLink(phoneE164, message string) string {
	p := strings.TrimPrefix(phoneE164, "+")
	var b strings.Builder
	for _, r := range p {
		if r >= '0' && r <= '9' {
			b.WriteRune(r)
		}
	}
	digits := b.String()
	if digits == "" {
		return ""
	}
	q := url.Values{}
	q.Set("text", message)
	return "https://wa.me/" + digits + "?" + q.Encode()
}
