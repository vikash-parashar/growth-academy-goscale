package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/goscalelabs/api/internal/config"
	"github.com/goscalelabs/api/internal/model"
	"github.com/goscalelabs/api/internal/razorpay"
	"github.com/goscalelabs/api/internal/repository"
)

type PaymentService struct {
	cfg   *config.Config
	pay   *repository.PaymentRepository
	leads *repository.LeadRepository
}

func NewPaymentService(cfg *config.Config, p *repository.PaymentRepository, l *repository.LeadRepository) *PaymentService {
	return &PaymentService{cfg: cfg, pay: p, leads: l}
}

type CreateOrderInput struct {
	LeadID               int64      `json:"lead_id" binding:"required,gt=0"`
	AmountRupees         string     `json:"amount_rupees" binding:"omitempty,max=32"`
	PendingAppointmentAt *time.Time `json:"pending_appointment_at,omitempty"`
}

type CreateOrderResult struct {
	OrderID     string `json:"order_id"`
	AmountPaise int64  `json:"amount_paise"`
	KeyID       string `json:"key_id"`
}

func (s *PaymentService) CreateOrder(ctx context.Context, in CreateOrderInput) (*CreateOrderResult, error) {
	if s.cfg.RazorpayKeyID == "" || s.cfg.RazorpayKeySecret == "" {
		return nil, errors.New("razorpay is not configured")
	}
	if in.LeadID <= 0 {
		return nil, errors.New("lead_id is required")
	}
	if _, err := s.leads.GetByID(ctx, in.LeadID); err != nil {
		if errors.Is(err, repository.ErrNotFound) {
			return nil, errors.New("lead not found")
		}
		return nil, err
	}
	amountStr := in.AmountRupees
	if amountStr == "" {
		amountStr = s.cfg.DefaultPaymentRupees()
	}
	if in.PendingAppointmentAt != nil {
		amountStr = s.cfg.ConsultFeeRupeesString()
	}
	paise, err := razorpay.INRToPaise(amountStr)
	if err != nil || paise <= 0 {
		return nil, fmt.Errorf("invalid amount")
	}
	if in.PendingAppointmentAt != nil {
		consultPaise, err := razorpay.INRToPaise(s.cfg.ConsultFeeRupeesString())
		if err != nil || paise != consultPaise {
			return nil, fmt.Errorf("consultation fee mismatch")
		}
	}
	receipt := fmt.Sprintf("L%dT%d", in.LeadID, time.Now().Unix())
	if len(receipt) > 40 {
		receipt = receipt[:40]
	}

	ord, err := razorpay.CreateOrder(s.cfg.RazorpayKeyID, s.cfg.RazorpayKeySecret, paise, receipt)
	if err != nil {
		return nil, err
	}
	var pending *time.Time
	if in.PendingAppointmentAt != nil {
		t := in.PendingAppointmentAt.UTC()
		pending = &t
	}
	p := &model.Payment{
		LeadID:               in.LeadID,
		Amount:               paise,
		Status:               "created",
		OrderID:              ord.ID,
		PaymentID:            "",
		PendingAppointmentAt: pending,
	}
	if err := s.pay.Create(ctx, p); err != nil {
		return nil, err
	}
	return &CreateOrderResult{OrderID: ord.ID, AmountPaise: paise, KeyID: s.cfg.RazorpayKeyID}, nil
}

type VerifyInput struct {
	RazorpayOrderID   string `json:"razorpay_order_id" binding:"required,min=1,max=128"`
	RazorpayPaymentID string `json:"razorpay_payment_id" binding:"required,min=1,max=128"`
	RazorpaySignature string `json:"razorpay_signature" binding:"required,min=1,max=256"`
}

func (s *PaymentService) Verify(ctx context.Context, in VerifyInput) error {
	if s.cfg.RazorpayKeySecret == "" {
		return errors.New("razorpay is not configured")
	}
	if !razorpay.VerifySignature(in.RazorpayOrderID, in.RazorpayPaymentID, in.RazorpaySignature, s.cfg.RazorpayKeySecret) {
		return errors.New("invalid signature")
	}
	return s.pay.UpdateByOrderID(ctx, in.RazorpayOrderID, "captured", in.RazorpayPaymentID)
}

func (s *PaymentService) ListAll(ctx context.Context) ([]model.Payment, error) {
	return s.pay.ListAll(ctx)
}

// GetByOrderID loads a payment row (used after Razorpay verify for consultation booking).
func (s *PaymentService) GetByOrderID(ctx context.Context, orderID string) (*model.Payment, error) {
	return s.pay.GetByOrderID(ctx, orderID)
}

// ClearConsultationPending clears the pending slot marker after the appointment row exists.
func (s *PaymentService) ClearConsultationPending(ctx context.Context, orderID string) error {
	return s.pay.ClearPendingAppointment(ctx, orderID)
}
