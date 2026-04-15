package repository

import (
	"context"
	"database/sql"
	"fmt"
	"strings"

	"github.com/goscalelabs/api/internal/model"
)

type LeadRepository struct {
	db *sql.DB
}

func NewLeadRepository(db *sql.DB) *LeadRepository {
	return &LeadRepository{db: db}
}

func (r *LeadRepository) Create(ctx context.Context, l *model.Lead) error {
	row := r.db.QueryRowContext(ctx, `
		INSERT INTO leads (name, phone, email, experience, salary, goal, status, notes)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, created_at`,
		nullIfEmpty(l.Name), nullIfEmpty(l.Phone), nullIfEmpty(l.Email),
		nullIfEmpty(l.Experience), nullIfEmpty(l.Salary), nullIfEmpty(l.Goal),
		string(l.Status), nullString(l.Notes),
	)
	if err := row.Scan(&l.ID, &l.CreatedAt); err != nil {
		return err
	}
	return nil
}

func nullIfEmpty(s string) any {
	if strings.TrimSpace(s) == "" {
		return nil
	}
	return s
}

func nullString(s string) any {
	if s == "" {
		return nil
	}
	return s
}

func (r *LeadRepository) GetByID(ctx context.Context, id int64) (*model.Lead, error) {
	row := r.db.QueryRowContext(ctx, `
		SELECT id, name, phone, email, experience, salary, goal, status, notes, created_at
		FROM leads WHERE id = $1`, id)
	return scanLeadRow(row)
}

func (r *LeadRepository) List(ctx context.Context, status string, search string) ([]model.Lead, error) {
	q := `SELECT id, name, phone, email, experience, salary, goal, status, notes, created_at FROM leads WHERE 1=1`
	args := []any{}
	n := 1
	if status != "" && status != "all" {
		q += fmt.Sprintf(" AND status = $%d", n)
		args = append(args, status)
		n++
	}
	if search != "" {
		s := "%" + strings.ToLower(search) + "%"
		ph := fmt.Sprintf("$%d", n)
		q += ` AND (lower(coalesce(name,'')) LIKE ` + ph +
			` OR lower(coalesce(email,'')) LIKE ` + ph +
			` OR coalesce(phone,'') LIKE ` + ph +
			` OR lower(coalesce(goal,'')) LIKE ` + ph + `)`
		args = append(args, s)
		n++
	}
	q += ` ORDER BY created_at DESC`

	rows, err := r.db.QueryContext(ctx, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]model.Lead, 0)
	for rows.Next() {
		l, err := scanLeadRows(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *l)
	}
	return out, rows.Err()
}

func (r *LeadRepository) Update(ctx context.Context, id int64, status *model.LeadStatus, notes *string) error {
	if status == nil && notes == nil {
		return fmt.Errorf("nothing to update")
	}
	set := []string{}
	args := []any{}
	n := 1
	if status != nil {
		set = append(set, fmt.Sprintf("status = $%d", n))
		args = append(args, string(*status))
		n++
	}
	if notes != nil {
		set = append(set, fmt.Sprintf("notes = $%d", n))
		args = append(args, *notes)
		n++
	}
	args = append(args, id)
	q := fmt.Sprintf(`UPDATE leads SET %s WHERE id = $%d`, strings.Join(set, ", "), n)
	_, err := r.db.ExecContext(ctx, q, args...)
	return err
}

func scanLeadRow(row *sql.Row) (*model.Lead, error) {
	var l model.Lead
	var name, phone, email, experience, salary, goal, status, notes sql.NullString
	if err := row.Scan(&l.ID, &name, &phone, &email, &experience, &salary, &goal, &status, &notes, &l.CreatedAt); err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrNotFound
		}
		return nil, err
	}
	l.Name, l.Phone, l.Email = name.String, phone.String, email.String
	l.Experience, l.Salary, l.Goal = experience.String, salary.String, goal.String
	l.Status = model.LeadStatus(status.String)
	l.Notes = notes.String
	return &l, nil
}

func scanLeadRows(rows *sql.Rows) (*model.Lead, error) {
	var l model.Lead
	var name, phone, email, experience, salary, goal, status, notes sql.NullString
	if err := rows.Scan(&l.ID, &name, &phone, &email, &experience, &salary, &goal, &status, &notes, &l.CreatedAt); err != nil {
		return nil, err
	}
	l.Name, l.Phone, l.Email = name.String, phone.String, email.String
	l.Experience, l.Salary, l.Goal = experience.String, salary.String, goal.String
	l.Status = model.LeadStatus(status.String)
	l.Notes = notes.String
	return &l, nil
}
