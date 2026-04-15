package repository

import (
	"context"
	"database/sql"
	"time"

	"github.com/goscalelabs/api/internal/model"
)

type AppointmentRepository struct {
	db *sql.DB
}

func NewAppointmentRepository(db *sql.DB) *AppointmentRepository {
	return &AppointmentRepository{db: db}
}

func (r *AppointmentRepository) Create(ctx context.Context, a *model.Appointment) error {
	row := r.db.QueryRowContext(ctx, `
		INSERT INTO appointments (lead_id, scheduled_at, status)
		VALUES ($1, $2, $3)
		RETURNING id, created_at`,
		a.LeadID, a.DateTime.UTC(), string(a.Status),
	)
	return row.Scan(&a.ID, &a.CreatedAt)
}

func (r *AppointmentRepository) List(ctx context.Context) ([]model.Appointment, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT id, lead_id, scheduled_at, status, created_at
		FROM appointments
		ORDER BY scheduled_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]model.Appointment, 0)
	for rows.Next() {
		var a model.Appointment
		if err := rows.Scan(&a.ID, &a.LeadID, &a.DateTime, &a.Status, &a.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, a)
	}
	return out, rows.Err()
}

func (r *AppointmentRepository) UpdateStatus(ctx context.Context, id int64, st model.AppointmentStatus) error {
	_, err := r.db.ExecContext(ctx, `UPDATE appointments SET status = $1 WHERE id = $2`, string(st), id)
	return err
}

// ListOccupiedBetween returns scheduled times for pending or accepted appointments in [start, end) UTC.
func (r *AppointmentRepository) ListOccupiedBetween(ctx context.Context, start, end time.Time) ([]time.Time, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT scheduled_at FROM appointments
		WHERE scheduled_at >= $1 AND scheduled_at < $2
		AND status IN ('pending', 'accepted')`,
		start.UTC(), end.UTC(),
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]time.Time, 0)
	for rows.Next() {
		var t time.Time
		if err := rows.Scan(&t); err != nil {
			return nil, err
		}
		out = append(out, t.UTC())
	}
	return out, rows.Err()
}

func (r *AppointmentRepository) GetByID(ctx context.Context, id int64) (*model.Appointment, error) {
	row := r.db.QueryRowContext(ctx, `
		SELECT id, lead_id, scheduled_at, status, created_at
		FROM appointments WHERE id = $1`, id)
	var a model.Appointment
	if err := row.Scan(&a.ID, &a.LeadID, &a.DateTime, &a.Status, &a.CreatedAt); err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return &a, nil
}
