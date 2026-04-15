package service

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/goscalelabs/api/internal/config"
	"github.com/goscalelabs/api/internal/model"
	"github.com/goscalelabs/api/internal/notify"
	"github.com/goscalelabs/api/internal/repository"
	"github.com/goscalelabs/api/internal/util"
	"github.com/goscalelabs/api/internal/validation"
)

type LeadService struct {
	repo   *repository.LeadRepository
	notify *notify.Notifier
	cfg    *config.Config
}

func NewLeadService(repo *repository.LeadRepository, n *notify.Notifier, cfg *config.Config) *LeadService {
	return &LeadService{repo: repo, notify: n, cfg: cfg}
}

type CreateLeadInput struct {
	Name          string `json:"name" binding:"required,min=1,max=200"`
	Phone         string `json:"phone" binding:"required,max=32"`
	Email         string `json:"email" binding:"required,email,max=320"`
	Experience    string `json:"experience" binding:"required,min=1,max=5000"`
	Salary        string `json:"salary" binding:"required,min=1,max=500"`
	Goal          string `json:"goal" binding:"required,min=1,max=5000"`
	TermsAccepted bool   `json:"terms_accepted" binding:"eq=true"`
}

// CreateConsultationLead creates a minimal lead for a paid discovery-call booking (no full programme application).
func (s *LeadService) CreateConsultationLead(ctx context.Context, name, phone, email string) (*model.Lead, error) {
	name = strings.TrimSpace(name)
	phone = strings.TrimSpace(phone)
	email = strings.TrimSpace(strings.ToLower(email))
	if name == "" {
		return nil, errors.New("name is required")
	}
	if phone == "" {
		return nil, errors.New("phone is required")
	}
	if email == "" {
		return nil, errors.New("email is required")
	}
	l := &model.Lead{
		Name:       name,
		Phone:      phone,
		Email:      email,
		Experience: "Consultation booking (paid)",
		Salary:     "—",
		Goal:       "Paid video / voice call — programme fit and founder journey (consultation)",
		Status:     model.LeadNew,
		Notes:      "source: consultation_checkout",
	}
	if err := s.repo.Create(ctx, l); err != nil {
		return nil, err
	}
	msg := fmt.Sprintf("Hi, I'm %s. I booked a paid consultation on Gopher Lab.", l.Name)
	if s.cfg.WhatsAppPhone != "" {
		l.WhatsAppLink = util.WhatsAppLink(s.cfg.WhatsAppPhone, msg)
	}
	go s.notify.AdminNewLead(ctx, l.Name, l.Email, l.Phone)
	return l, nil
}

func (s *LeadService) Create(ctx context.Context, in CreateLeadInput) (*model.Lead, error) {
	if err := validateLead(in); err != nil {
		return nil, err
	}
	l := &model.Lead{
		Name:       strings.TrimSpace(in.Name),
		Phone:      strings.TrimSpace(in.Phone),
		Email:      strings.TrimSpace(strings.ToLower(in.Email)),
		Experience: strings.TrimSpace(in.Experience),
		Salary:     strings.TrimSpace(in.Salary),
		Goal:       strings.TrimSpace(in.Goal),
		Status:     model.LeadNew,
		Notes:      "",
	}
	if err := s.repo.Create(ctx, l); err != nil {
		return nil, err
	}
	msg := fmt.Sprintf("Hi, I'm %s. I applied on Gopher Lab. Experience: %s", l.Name, l.Experience)
	if s.cfg.WhatsAppPhone != "" {
		l.WhatsAppLink = util.WhatsAppLink(s.cfg.WhatsAppPhone, msg)
	}
	go s.notify.AdminNewLead(ctx, l.Name, l.Email, l.Phone)
	go s.notify.StudentAck(ctx, l.Email, l.Name)

	digits := util.ToE164Digits(l.Phone)
	if len(digits) >= 10 {
		go func(name, phoneDigits string) {
			ack := fmt.Sprintf(
				"Hi %s — thanks for applying to Gopher Lab. We received your form and will reach out on WhatsApp/call soon.",
				name,
			)
			_ = s.notify.SendSMS(phoneDigits, "Gopher Lab: Application received. We'll contact you soon.")
			_ = s.notify.SendWhatsApp(phoneDigits, ack)
		}(l.Name, digits)
	}
	return l, nil
}

func validateLead(in CreateLeadInput) error {
	if err := validation.LeadPhone(in.Phone); err != nil {
		return err
	}
	if err := validation.LeadEmail(in.Email); err != nil {
		return err
	}
	return nil
}

func (s *LeadService) List(ctx context.Context, status, search string) ([]model.Lead, error) {
	return s.repo.List(ctx, status, search)
}

func (s *LeadService) Update(ctx context.Context, id int64, status *model.LeadStatus, notes *string) error {
	return s.repo.Update(ctx, id, status, notes)
}
