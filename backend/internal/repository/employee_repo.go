package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/goscalelabs/api/internal/model"
)

type EmployeeRepository struct {
	db *sql.DB
}

func NewEmployeeRepository(db *sql.DB) *EmployeeRepository {
	return &EmployeeRepository{db: db}
}

func (r *EmployeeRepository) Create(ctx context.Context, e *model.Employee) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback() }()

	resume := strings.TrimSpace(e.ResumeURL)
	inc := strings.TrimSpace(e.IncentivesNotes)
	err = tx.QueryRowContext(ctx, `
		INSERT INTO employees (
			name, email, phone, role_title, department, experience, resume_url,
			monthly_salary_paise, incentives_notes, start_date, end_date, status
		)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
		RETURNING id, created_at, updated_at`,
		nullIfEmpty(e.Name), nullIfEmpty(e.Email), nullIfEmpty(e.Phone),
		nullIfEmpty(e.RoleTitle), nullIfEmpty(e.Department), nullIfEmpty(e.Experience),
		resume, e.MonthlySalaryPaise, inc,
		e.StartDate, nullTime(e.EndDate), strings.TrimSpace(e.Status),
	).Scan(&e.ID, &e.CreatedAt, &e.UpdatedAt)
	if err != nil {
		return err
	}

	code := fmt.Sprintf("GL-%d-%05d", time.Now().Year(), e.ID)
	_, err = tx.ExecContext(ctx, `UPDATE employees SET employee_code = $1, updated_at = NOW() WHERE id = $2`, code, e.ID)
	if err != nil {
		return err
	}
	e.EmployeeCode = code

	return tx.Commit()
}

func nullTime(t *time.Time) any {
	if t == nil {
		return nil
	}
	return *t
}

func (r *EmployeeRepository) GetByID(ctx context.Context, id int64) (*model.Employee, error) {
	row := r.db.QueryRowContext(ctx, `
		SELECT id, employee_code, name, email, phone, role_title, department, experience, resume_url,
			monthly_salary_paise, incentives_notes, start_date, end_date, status, created_at, updated_at
		FROM employees WHERE id = $1`, id)
	e, err := scanEmployee(row)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return e, nil
}

func nullStr(ns sql.NullString) string {
	if ns.Valid {
		return ns.String
	}
	return ""
}

func scanEmployee(row *sql.Row) (*model.Employee, error) {
	var e model.Employee
	var end sql.NullTime
	var code sql.NullString
	var email, phone, roleTitle, dept, experience sql.NullString
	err := row.Scan(
		&e.ID, &code, &e.Name, &email, &phone, &roleTitle, &dept, &experience, &e.ResumeURL,
		&e.MonthlySalaryPaise, &e.IncentivesNotes, &e.StartDate, &end, &e.Status, &e.CreatedAt, &e.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	e.Email = nullStr(email)
	e.Phone = nullStr(phone)
	e.RoleTitle = nullStr(roleTitle)
	e.Department = nullStr(dept)
	e.Experience = nullStr(experience)
	if code.Valid {
		e.EmployeeCode = code.String
	}
	if end.Valid {
		t := end.Time
		e.EndDate = &t
	}
	return &e, nil
}

func (r *EmployeeRepository) List(ctx context.Context, q string) ([]model.Employee, error) {
	sqlQ := `SELECT id, employee_code, name, email, phone, role_title, department, experience, resume_url,
		monthly_salary_paise, incentives_notes, start_date, end_date, status, created_at, updated_at
		FROM employees WHERE 1=1`
	args := []any{}
	n := 1
	if strings.TrimSpace(q) != "" {
		s := "%" + strings.ToLower(q) + "%"
		sqlQ += fmt.Sprintf(` AND (
			lower(coalesce(name,'')) LIKE $%d OR lower(coalesce(email,'')) LIKE $%d OR coalesce(phone,'') LIKE $%d
			OR lower(coalesce(employee_code,'')) LIKE $%d OR lower(coalesce(role_title,'')) LIKE $%d
		)`, n, n, n, n, n)
		args = append(args, s)
		n++
	}
	sqlQ += ` ORDER BY created_at DESC`

	rows, err := r.db.QueryContext(ctx, sqlQ, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]model.Employee, 0)
	for rows.Next() {
		var e model.Employee
		var end sql.NullTime
		var code sql.NullString
		var email, phone, roleTitle, dept, experience sql.NullString
		if err := rows.Scan(
			&e.ID, &code, &e.Name, &email, &phone, &roleTitle, &dept, &experience, &e.ResumeURL,
			&e.MonthlySalaryPaise, &e.IncentivesNotes, &e.StartDate, &end, &e.Status, &e.CreatedAt, &e.UpdatedAt,
		); err != nil {
			return nil, err
		}
		e.Email = nullStr(email)
		e.Phone = nullStr(phone)
		e.RoleTitle = nullStr(roleTitle)
		e.Department = nullStr(dept)
		e.Experience = nullStr(experience)
		if code.Valid {
			e.EmployeeCode = code.String
		}
		if end.Valid {
			t := end.Time
			e.EndDate = &t
		}
		out = append(out, e)
	}
	return out, rows.Err()
}

type PatchEmployeeInput struct {
	Name               *string
	Email              *string
	Phone              *string
	RoleTitle          *string
	Department         *string
	Experience         *string
	ResumeURL          *string
	MonthlySalaryPaise *int64
	IncentivesNotes    *string
	StartDate          *time.Time
	EndDate            *time.Time // use pointer to nil to clear end date
	ClearEndDate       bool
	Status             *string
}

func (r *EmployeeRepository) Patch(ctx context.Context, id int64, p PatchEmployeeInput) error {
	set := []string{}
	args := []any{}
	n := 1
	add := func(col string, val any) {
		set = append(set, fmt.Sprintf("%s = $%d", col, n))
		args = append(args, val)
		n++
	}
	if p.Name != nil {
		add("name", *p.Name)
	}
	if p.Email != nil {
		add("email", *p.Email)
	}
	if p.Phone != nil {
		add("phone", *p.Phone)
	}
	if p.RoleTitle != nil {
		add("role_title", *p.RoleTitle)
	}
	if p.Department != nil {
		add("department", *p.Department)
	}
	if p.Experience != nil {
		add("experience", *p.Experience)
	}
	if p.ResumeURL != nil {
		add("resume_url", *p.ResumeURL)
	}
	if p.MonthlySalaryPaise != nil {
		add("monthly_salary_paise", *p.MonthlySalaryPaise)
	}
	if p.IncentivesNotes != nil {
		add("incentives_notes", *p.IncentivesNotes)
	}
	if p.StartDate != nil {
		add("start_date", *p.StartDate)
	}
	if p.ClearEndDate {
		set = append(set, "end_date = NULL")
	} else if p.EndDate != nil {
		add("end_date", *p.EndDate)
	}
	if p.Status != nil {
		add("status", *p.Status)
	}
	if len(set) == 0 {
		return fmt.Errorf("nothing to update")
	}
	set = append(set, "updated_at = NOW()")
	args = append(args, id)
	q := fmt.Sprintf(`UPDATE employees SET %s WHERE id = $%d`, strings.Join(set, ", "), n)
	res, err := r.db.ExecContext(ctx, q, args...)
	if err != nil {
		return err
	}
	aff, _ := res.RowsAffected()
	if aff == 0 {
		return ErrNotFound
	}
	return nil
}

func (r *EmployeeRepository) SetResumeURL(ctx context.Context, id int64, url string) error {
	res, err := r.db.ExecContext(ctx, `UPDATE employees SET resume_url = $1, updated_at = NOW() WHERE id = $2`, url, id)
	if err != nil {
		return err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return ErrNotFound
	}
	return nil
}

// ListPayments returns salary rows for an employee, newest month first.
func (r *EmployeeRepository) ListPayments(ctx context.Context, employeeID int64) ([]model.EmployeeSalaryPayment, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT id, employee_id, period_month, amount_paise, incentive_paise, notes, created_at
		FROM employee_salary_payments WHERE employee_id = $1
		ORDER BY period_month DESC`, employeeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]model.EmployeeSalaryPayment, 0)
	for rows.Next() {
		var p model.EmployeeSalaryPayment
		if err := rows.Scan(&p.ID, &p.EmployeeID, &p.PeriodMonth, &p.AmountPaise, &p.IncentivePaise, &p.Notes, &p.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, p)
	}
	return out, rows.Err()
}

func (r *EmployeeRepository) UpsertPayment(ctx context.Context, p *model.EmployeeSalaryPayment) error {
	notes := strings.TrimSpace(p.Notes)
	row := r.db.QueryRowContext(ctx, `
		INSERT INTO employee_salary_payments (employee_id, period_month, amount_paise, incentive_paise, notes)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (employee_id, period_month) DO UPDATE SET
			amount_paise = EXCLUDED.amount_paise,
			incentive_paise = EXCLUDED.incentive_paise,
			notes = EXCLUDED.notes
		RETURNING id, created_at`,
		p.EmployeeID, p.PeriodMonth, p.AmountPaise, p.IncentivePaise, notes,
	)
	return row.Scan(&p.ID, &p.CreatedAt)
}
