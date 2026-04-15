package notify

import (
	"encoding/base64"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/goscalelabs/api/internal/config"
)

// TwilioConfigured returns true if outbound SMS/WhatsApp can be attempted.
func TwilioConfigured(c *config.Config) bool {
	return c.TwilioAccountSID != "" && c.TwilioAuthToken != "" &&
		(c.TwilioSMSFrom != "" || c.TwilioWhatsAppFrom != "")
}

func twilioPost(c *config.Config, form url.Values) error {
	if c.TwilioAccountSID == "" || c.TwilioAuthToken == "" {
		return fmt.Errorf("twilio not configured")
	}
	ep := fmt.Sprintf("https://api.twilio.com/2010-04-01/Accounts/%s/Messages.json", c.TwilioAccountSID)
	req, err := http.NewRequest(http.MethodPost, ep, strings.NewReader(form.Encode()))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	auth := base64.StdEncoding.EncodeToString([]byte(c.TwilioAccountSID + ":" + c.TwilioAuthToken))
	req.Header.Set("Authorization", "Basic "+auth)

	client := &http.Client{Timeout: 25 * time.Second}
	res, err := client.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)
	if res.StatusCode < 200 || res.StatusCode >= 300 {
		return fmt.Errorf("twilio %d: %s", res.StatusCode, strings.TrimSpace(string(body)))
	}
	return nil
}

// SendSMS sends a plain SMS (requires TWILIO_SMS_FROM in E.164).
func (n *Notifier) SendSMS(toE164Digits, body string) error {
	if n.cfg.TwilioSMSFrom == "" {
		slog.Info("notify: sms skipped (no TWILIO_SMS_FROM)", "to", toE164Digits)
		return nil
	}
	to := "+" + strings.TrimPrefix(toE164Digits, "+")
	form := url.Values{}
	form.Set("To", to)
	form.Set("From", n.cfg.TwilioSMSFrom)
	form.Set("Body", body)
	if err := twilioPost(n.cfg, form); err != nil {
		slog.Error("notify: twilio sms", "err", err, "to", to)
		return err
	}
	slog.Info("notify: sms sent", "to", to)
	return nil
}

// SendWhatsApp sends via Twilio WhatsApp (requires TWILIO_WHATSAPP_FROM like whatsapp:+14155238886).
func (n *Notifier) SendWhatsApp(toE164Digits, body string) error {
	if n.cfg.TwilioWhatsAppFrom == "" {
		slog.Info("notify: whatsapp skipped (no TWILIO_WHATSAPP_FROM)", "to", toE164Digits)
		return nil
	}
	d := strings.TrimPrefix(toE164Digits, "+")
	to := "whatsapp:+" + d
	form := url.Values{}
	form.Set("To", to)
	form.Set("From", n.cfg.TwilioWhatsAppFrom)
	form.Set("Body", body)
	if err := twilioPost(n.cfg, form); err != nil {
		slog.Error("notify: twilio whatsapp", "err", err, "to", to)
		return err
	}
	slog.Info("notify: whatsapp sent", "to", to)
	return nil
}
