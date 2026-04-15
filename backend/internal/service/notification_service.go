package service

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/goscalelabs/api/internal/config"
	"github.com/goscalelabs/api/internal/notify"
	"github.com/goscalelabs/api/internal/repository"
	"github.com/goscalelabs/api/internal/util"
)

type NotificationService struct {
	repo *repository.LeadRepository
	n    *notify.Notifier
	cfg  *config.Config
}

func NewNotificationService(repo *repository.LeadRepository, n *notify.Notifier, cfg *config.Config) *NotificationService {
	return &NotificationService{repo: repo, n: n, cfg: cfg}
}

type BroadcastInput struct {
	Subject  string   `json:"subject" binding:"omitempty,max=200"`
	Message  string   `json:"message" binding:"required,min=1,max=20000"`
	Channels []string `json:"channels" binding:"required,min=1,dive,oneof=email sms whatsapp"` // email, sms, whatsapp
	Audience string   `json:"audience" binding:"omitempty,oneof=all new contacted converted rejected"`
}

type BroadcastResult struct {
	EmailSent    int      `json:"email_sent"`
	SMSSent      int      `json:"sms_sent"`
	WhatsAppSent int      `json:"whatsapp_sent"`
	Errors       []string `json:"errors,omitempty"`
}

func (s *NotificationService) Broadcast(ctx context.Context, in BroadcastInput) (*BroadcastResult, error) {
	subject := strings.TrimSpace(in.Subject)
	msg := strings.TrimSpace(in.Message)
	if msg == "" {
		return nil, errors.New("message is required")
	}
	if len(in.Channels) == 0 {
		return nil, errors.New("at least one channel is required")
	}
	status := "all"
	switch a := strings.ToLower(strings.TrimSpace(in.Audience)); a {
	case "", "all":
		status = "all"
	case "new", "contacted", "converted", "rejected":
		status = a // must match lowercase lead.status in the database
	default:
		return nil, errors.New("invalid audience")
	}

	leads, err := s.repo.List(ctx, status, "")
	if err != nil {
		return nil, err
	}

	ch := map[string]bool{}
	for _, c := range in.Channels {
		ch[strings.ToLower(strings.TrimSpace(c))] = true
	}

	res := &BroadcastResult{}
	smtpOK := s.cfg.SMTPHost != ""
	for _, lead := range leads {
		if ch["email"] && lead.Email != "" && smtpOK {
			sub := subject
			if sub == "" {
				sub = "Gopher Lab — update"
			}
			s.n.SendEmail(lead.Email, sub, fmt.Sprintf("Hi %s,\n\n%s\n\n— Gopher Lab\n", lead.Name, msg))
			res.EmailSent++
		}
		digits := util.ToE164Digits(lead.Phone)
		if len(digits) < 10 {
			if ch["sms"] || ch["whatsapp"] {
				res.Errors = append(res.Errors, fmt.Sprintf("lead %d: invalid phone", lead.ID))
			}
			time.Sleep(50 * time.Millisecond)
			continue
		}
		if ch["sms"] && notify.TwilioConfigured(s.cfg) && s.cfg.TwilioSMSFrom != "" {
			if err := s.n.SendSMS(digits, msg); err != nil {
				res.Errors = append(res.Errors, fmt.Sprintf("lead %d sms: %v", lead.ID, err))
			} else {
				res.SMSSent++
			}
		}
		if ch["whatsapp"] && notify.TwilioConfigured(s.cfg) && s.cfg.TwilioWhatsAppFrom != "" {
			if err := s.n.SendWhatsApp(digits, fmt.Sprintf("Hi %s,\n\n%s", lead.Name, msg)); err != nil {
				res.Errors = append(res.Errors, fmt.Sprintf("lead %d wa: %v", lead.ID, err))
			} else {
				res.WhatsAppSent++
			}
		}
		time.Sleep(80 * time.Millisecond)
	}
	return res, nil
}
