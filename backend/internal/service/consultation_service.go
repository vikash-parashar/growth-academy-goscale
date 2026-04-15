package service

import (
	"context"
	"errors"
	"sort"
	"time"

	"github.com/goscalelabs/api/internal/config"
	"github.com/goscalelabs/api/internal/repository"
)

// ConsultationService computes availability and validates slots against configured working hours.
type ConsultationService struct {
	cfg   *config.Config
	appts *repository.AppointmentRepository
}

func NewConsultationService(cfg *config.Config, appts *repository.AppointmentRepository) *ConsultationService {
	return &ConsultationService{cfg: cfg, appts: appts}
}

// AvailableSlot is a UTC instant when a consultation can start.
type AvailableSlot struct {
	StartUTC string `json:"start_utc"`
}

// ListAvailability returns bookable slot starts (UTC RFC3339) for the next `days` calendar days.
func (s *ConsultationService) ListAvailability(ctx context.Context, days int) ([]AvailableSlot, error) {
	if days <= 0 || days > 60 {
		days = 14
	}
	loc, err := time.LoadLocation(s.cfg.ConsultTimezone())
	if err != nil {
		return nil, err
	}
	now := time.Now().In(loc)
	startDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, loc)
	endDay := startDay.AddDate(0, 0, days+1)

	occupied, err := s.appts.ListOccupiedBetween(ctx, startDay.UTC(), endDay.UTC())
	if err != nil {
		return nil, err
	}
	occ := make(map[int64]struct{})
	for _, t := range occupied {
		occ[t.UTC().Unix()] = struct{}{}
	}

	slotDur := time.Duration(s.cfg.ConsultSlotDurationMinutes()) * time.Minute
	allowed := s.cfg.ConsultWeekdaySet()

	var out []AvailableSlot
	for d := 0; d <= days; d++ {
		day := startDay.AddDate(0, 0, d)
		wd := int(day.Weekday())
		if wd == 0 {
			wd = 7
		}
		if !allowed[wd] {
			continue
		}
		sh, sm := s.cfg.ConsultStartClock()
		eh, em := s.cfg.ConsultEndClock()
		dayStart := time.Date(day.Year(), day.Month(), day.Day(), sh, sm, 0, 0, loc)
		dayEnd := time.Date(day.Year(), day.Month(), day.Day(), eh, em, 0, 0, loc)

		for t := dayStart; ; t = t.Add(slotDur) {
			slotEnd := t.Add(slotDur)
			if slotEnd.After(dayEnd) {
				break
			}
			if !t.After(now.Add(-1 * time.Minute)) {
				continue
			}
			u := t.UTC()
			if _, taken := occ[u.Unix()]; taken {
				continue
			}
			out = append(out, AvailableSlot{StartUTC: u.Format(time.RFC3339)})
		}
	}

	sort.Slice(out, func(i, j int) bool { return out[i].StartUTC < out[j].StartUTC })
	return out, nil
}

// ValidateSlotForBooking returns nil if the instant is allowed and still free.
func (s *ConsultationService) ValidateSlotForBooking(ctx context.Context, slotUTC time.Time) error {
	if slotUTC.IsZero() {
		return errors.New("slot time is required")
	}
	if slotUTC.Before(time.Now().UTC().Add(5 * time.Minute)) {
		return errors.New("slot must be at least 5 minutes in the future")
	}
	loc, err := time.LoadLocation(s.cfg.ConsultTimezone())
	if err != nil {
		return err
	}
	local := slotUTC.In(loc)
	wd := int(local.Weekday())
	if wd == 0 {
		wd = 7
	}
	if !s.cfg.ConsultWeekdaySet()[wd] {
		return errors.New("slot is outside working days")
	}
	sh, sm := s.cfg.ConsultStartClock()
	eh, em := s.cfg.ConsultEndClock()
	dayStart := time.Date(local.Year(), local.Month(), local.Day(), sh, sm, 0, 0, loc)
	dayEnd := time.Date(local.Year(), local.Month(), local.Day(), eh, em, 0, 0, loc)
	slotDur := time.Duration(s.cfg.ConsultSlotDurationMinutes()) * time.Minute
	slotEnd := local.Add(slotDur)
	if local.Before(dayStart) || slotEnd.After(dayEnd) {
		return errors.New("slot is outside working hours")
	}
	// Align to slot grid
	if rem := int(local.Sub(dayStart).Minutes()) % s.cfg.ConsultSlotDurationMinutes(); rem != 0 {
		return errors.New("slot must match the configured slot grid")
	}

	occupied, err := s.appts.ListOccupiedBetween(ctx, slotUTC.Add(-time.Minute), slotUTC.Add(time.Minute))
	if err != nil {
		return err
	}
	for _, o := range occupied {
		if o.UTC().Unix() == slotUTC.UTC().Unix() {
			return errors.New("this slot was just taken — pick another")
		}
	}
	return nil
}
