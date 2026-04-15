package repository

import (
	"context"
	"database/sql"
	"time"

	"github.com/goscalelabs/api/internal/model"
)

type PaymentRepository struct {
	db *sql.DB
}

func NewPaymentRepository(db *sql.DB) *PaymentRepository {
	return &PaymentRepository{db: db}
}

func (r *PaymentRepository) Create(ctx context.Context, p *model.Payment) error {
	row := r.db.QueryRowContext(ctx, `
		INSERT INTO payments (lead_id, amount, status, payment_id, order_id, pending_appointment_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at`,
		p.LeadID, p.Amount, p.Status, p.PaymentID, p.OrderID, nullTimePtr(p.PendingAppointmentAt),
	)
	return row.Scan(&p.ID, &p.CreatedAt)
}

func nullTimePtr(t *time.Time) interface{} {
	if t == nil {
		return nil
	}
	return *t
}

func (r *PaymentRepository) UpdateByOrderID(ctx context.Context, orderID string, status string, paymentID string) error {
	_, err := r.db.ExecContext(ctx, `
		UPDATE payments SET status = $1, payment_id = $2 WHERE order_id = $3`, status, paymentID, orderID)
	return err
}

func (r *PaymentRepository) GetByOrderID(ctx context.Context, orderID string) (*model.Payment, error) {
	row := r.db.QueryRowContext(ctx, `
		SELECT id, lead_id, amount, status, payment_id, order_id, pending_appointment_at, created_at
		FROM payments WHERE order_id = $1`, orderID)
	var p model.Payment
	var pending sql.NullTime
	if err := row.Scan(&p.ID, &p.LeadID, &p.Amount, &p.Status, &p.PaymentID, &p.OrderID, &pending, &p.CreatedAt); err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrNotFound
		}
		return nil, err
	}
	if pending.Valid {
		t := pending.Time.UTC()
		p.PendingAppointmentAt = &t
	}
	return &p, nil
}

// ClearPendingAppointment sets pending_appointment_at to NULL after the slot is booked.
func (r *PaymentRepository) ClearPendingAppointment(ctx context.Context, orderID string) error {
	_, err := r.db.ExecContext(ctx, `UPDATE payments SET pending_appointment_at = NULL WHERE order_id = $1`, orderID)
	return err
}

func (r *PaymentRepository) ListAll(ctx context.Context) ([]model.Payment, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT id, lead_id, amount, status, payment_id, order_id, pending_appointment_at, created_at
		FROM payments
		ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]model.Payment, 0)
	for rows.Next() {
		var p model.Payment
		var pending sql.NullTime
		if err := rows.Scan(&p.ID, &p.LeadID, &p.Amount, &p.Status, &p.PaymentID, &p.OrderID, &pending, &p.CreatedAt); err != nil {
			return nil, err
		}
		if pending.Valid {
			t := pending.Time.UTC()
			p.PendingAppointmentAt = &t
		}
		out = append(out, p)
	}
	return out, rows.Err()
}
