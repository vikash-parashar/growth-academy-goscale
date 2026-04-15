package notify

import (
	"context"
	"fmt"
	"log/slog"
	"net/smtp"
	"strings"

	"github.com/goscalelabs/api/internal/config"
)

type Notifier struct {
	cfg *config.Config
}

func New(cfg *config.Config) *Notifier {
	return &Notifier{cfg: cfg}
}

// AdminNewLead sends alert to admin when a lead is captured (mock/logs if SMTP not configured).
func (n *Notifier) AdminNewLead(ctx context.Context, name, email, phone string) {
	subject := "[Gopher Lab] New lead: " + name
	body := fmt.Sprintf("New application received.\n\nName: %s\nEmail: %s\nPhone: %s\n", name, email, phone)

	if n.cfg.SMTPHost == "" || n.cfg.AdminEmail == "" {
		slog.Info("notify: admin alert (mock)", "subject", subject, "body", body)
		return
	}

	addr := fmt.Sprintf("%s:%d", n.cfg.SMTPHost, n.cfg.SMTPPort)
	msg := []byte(fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\n\r\n%s",
		n.cfg.FromEmail, n.cfg.AdminEmail, subject, body))

	var auth smtp.Auth
	if n.cfg.SMTPUser != "" {
		auth = smtp.PlainAuth("", n.cfg.SMTPUser, n.cfg.SMTPPassword, n.cfg.SMTPHost)
	}
	err := smtp.SendMail(addr, auth, n.cfg.FromEmail, []string{n.cfg.AdminEmail}, msg)
	if err != nil {
		slog.Error("notify: smtp send failed", "err", err)
	}
}

// StudentAck optional acknowledgement (mock if no SMTP).
func (n *Notifier) StudentAck(ctx context.Context, toEmail, name string) {
	if toEmail == "" || n.cfg.SMTPHost == "" {
		slog.Info("notify: student ack (mock)", "to", toEmail, "name", name)
		return
	}
	subject := "Gopher Lab — Application received"
	body := fmt.Sprintf("Hi %s,\n\nThanks for applying to Gopher Lab. Our team will reach out shortly.\n\n— Vikash Parashar, Gopher Lab\n", strings.TrimSpace(name))
	addr := fmt.Sprintf("%s:%d", n.cfg.SMTPHost, n.cfg.SMTPPort)
	msg := []byte(fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\n\r\n%s",
		n.cfg.FromEmail, toEmail, subject, body))
	var auth smtp.Auth
	if n.cfg.SMTPUser != "" {
		auth = smtp.PlainAuth("", n.cfg.SMTPUser, n.cfg.SMTPPassword, n.cfg.SMTPHost)
	}
	_ = smtp.SendMail(addr, auth, n.cfg.FromEmail, []string{toEmail}, msg)
}

// SendEmail sends a plain-text email to one recipient (no-op logs if SMTP not configured).
func (n *Notifier) SendEmail(toEmail, subject, body string) {
	toEmail = strings.TrimSpace(toEmail)
	if toEmail == "" || n.cfg.SMTPHost == "" {
		slog.Info("notify: email skipped", "to", toEmail, "subject", subject)
		return
	}
	addr := fmt.Sprintf("%s:%d", n.cfg.SMTPHost, n.cfg.SMTPPort)
	msg := []byte(fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\n\r\n%s",
		n.cfg.FromEmail, toEmail, subject, body))
	var auth smtp.Auth
	if n.cfg.SMTPUser != "" {
		auth = smtp.PlainAuth("", n.cfg.SMTPUser, n.cfg.SMTPPassword, n.cfg.SMTPHost)
	}
	if err := smtp.SendMail(addr, auth, n.cfg.FromEmail, []string{toEmail}, msg); err != nil {
		slog.Error("notify: smtp send", "err", err, "to", toEmail)
	}
}
