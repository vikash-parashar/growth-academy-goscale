package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/goscalelabs/api/internal/config"
	"github.com/goscalelabs/api/internal/model"
	"github.com/goscalelabs/api/internal/notify"
	"github.com/goscalelabs/api/internal/repository"
	"github.com/goscalelabs/api/internal/util"
)

type AppointmentService struct {
	appts *repository.AppointmentRepository
	leads *repository.LeadRepository
	n     *notify.Notifier
	cfg   *config.Config
}

func NewAppointmentService(
	a *repository.AppointmentRepository,
	l *repository.LeadRepository,
	n *notify.Notifier,
	cfg *config.Config,
) *AppointmentService {
	return &AppointmentService{appts: a, leads: l, n: n, cfg: cfg}
}

type CreateAppointmentInput struct {
	LeadID   int64     `json:"lead_id"`
	DateTime time.Time `json:"datetime"`
}

func (s *AppointmentService) Create(ctx context.Context, in CreateAppointmentInput) (*model.Appointment, error) {
	if in.LeadID <= 0 {
		return nil, errors.New("lead_id is required")
	}
	lead, err := s.leads.GetByID(ctx, in.LeadID)
	if err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, errors.New("lead not found")
		}
		return nil, err
	}
	if in.DateTime.IsZero() {
		return nil, errors.New("datetime is required")
	}
	ap := &model.Appointment{
		LeadID:   in.LeadID,
		DateTime: in.DateTime,
		Status:   model.ApptPending,
	}
	if err := s.appts.Create(ctx, ap); err != nil {
		return nil, err
	}
	s.notifyBooking(lead, ap, "created")
	return ap, nil
}

func (s *AppointmentService) List(ctx context.Context) ([]model.Appointment, error) {
	return s.appts.List(ctx)
}

func (s *AppointmentService) SetStatus(ctx context.Context, id int64, st model.AppointmentStatus) error {
	ap, err := s.appts.GetByID(ctx, id)
	if err != nil {
		return err
	}
	lead, err := s.leads.GetByID(ctx, ap.LeadID)
	if err != nil {
		return err
	}
	if err := s.appts.UpdateStatus(ctx, id, st); err != nil {
		return err
	}
	ap.Status = st
	s.notifyBooking(lead, ap, string(st))
	return nil
}

func (s *AppointmentService) notifyBooking(lead *model.Lead, ap *model.Appointment, kind string) {
	if s.n == nil {
		return
	}
	when := ap.DateTime.In(time.Local).Format("Mon Jan 2, 2006 3:04 PM MST")
	var subj, body string
	switch kind {
	case "created":
		subj = "Gopher Lab — booking received"
		body = fmt.Sprintf(
			"Hi %s,\n\nYour call / session is booked for %s (pending confirmation).\n\nWe’ll confirm shortly.\n\n— Gopher Lab\n",
			lead.Name, when,
		)
	case "accepted":
		subj = "Gopher Lab — booking confirmed"
		body = fmt.Sprintf(
			"Hi %s,\n\nYour booking is confirmed for %s.\n\nSee you on the call.\n\n— Gopher Lab\n",
			lead.Name, when,
		)
	case "rejected":
		subj = "Gopher Lab — booking update"
		body = fmt.Sprintf(
			"Hi %s,\n\nWe couldn’t confirm the slot at %s. Our team will suggest another time.\n\n— Gopher Lab\n",
			lead.Name, when,
		)
	default:
		subj = "Gopher Lab — booking update"
		body = fmt.Sprintf("Hi %s,\n\nYour booking status for %s is now: %s.\n\n— Gopher Lab\n", lead.Name, when, kind)
	}

	go s.n.SendEmail(lead.Email, subj, body)

	digits := util.ToE164Digits(lead.Phone)
	if len(digits) < 10 {
		return
	}
	short := fmt.Sprintf("Gopher Lab: booking update — %s. %s", kind, when)
	go func() {
		_ = s.n.SendSMS(digits, short)
		_ = s.n.SendWhatsApp(digits, body)
	}()
}
