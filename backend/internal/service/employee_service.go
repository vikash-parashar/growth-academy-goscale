package service

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/goscalelabs/api/internal/model"
	"github.com/goscalelabs/api/internal/repository"
)

type EmployeeService struct {
	repo *repository.EmployeeRepository
}

func NewEmployeeService(r *repository.EmployeeRepository) *EmployeeService {
	return &EmployeeService{repo: r}
}

type CreateEmployeeInput struct {
	Name               string  `json:"name" binding:"required,min=1,max=200"`
	Email              string  `json:"email" binding:"omitempty,email,max=320"`
	Phone              string  `json:"phone" binding:"omitempty,max=32"`
	RoleTitle          string  `json:"role_title" binding:"max=200"`
	Department         string  `json:"department" binding:"max=200"`
	Experience         string  `json:"experience" binding:"max=2000"`
	MonthlySalaryPaise int64   `json:"monthly_salary_paise" binding:"gte=0"`
	IncentivesNotes    string  `json:"incentives_notes" binding:"max=5000"`
	StartDate          string  `json:"start_date" binding:"required,max=32"`
	EndDate            *string `json:"end_date" binding:"omitempty,max=32"`
	Status             string  `json:"status" binding:"omitempty,max=32"`
}

func parseDate(s string) (time.Time, error) {
	s = strings.TrimSpace(s)
	if s == "" {
		return time.Time{}, fmt.Errorf("empty date")
	}
	return time.ParseInLocation("2006-01-02", s, time.UTC)
}

func (s *EmployeeService) Create(ctx context.Context, in CreateEmployeeInput) (*model.Employee, error) {
	name := strings.TrimSpace(in.Name)
	if name == "" {
		return nil, fmt.Errorf("name is required")
	}
	sd, err := parseDate(in.StartDate)
	if err != nil {
		return nil, fmt.Errorf("invalid start_date")
	}
	var endPtr *time.Time
	if in.EndDate != nil && strings.TrimSpace(*in.EndDate) != "" {
		ed, err := parseDate(*in.EndDate)
		if err != nil {
			return nil, fmt.Errorf("invalid end_date")
		}
		endPtr = &ed
	}
	st := strings.TrimSpace(in.Status)
	if st == "" {
		st = "active"
	}
	e := &model.Employee{
		Name:               name,
		Email:              strings.TrimSpace(in.Email),
		Phone:              strings.TrimSpace(in.Phone),
		RoleTitle:          strings.TrimSpace(in.RoleTitle),
		Department:         strings.TrimSpace(in.Department),
		Experience:         strings.TrimSpace(in.Experience),
		ResumeURL:          "",
		MonthlySalaryPaise: in.MonthlySalaryPaise,
		IncentivesNotes:    strings.TrimSpace(in.IncentivesNotes),
		StartDate:          sd,
		EndDate:            endPtr,
		Status:             st,
	}
	if err := s.repo.Create(ctx, e); err != nil {
		return nil, err
	}
	return s.repo.GetByID(ctx, e.ID)
}

type PatchEmployeeInput struct {
	Name                *string `json:"name"`
	Email               *string `json:"email"`
	Phone               *string `json:"phone"`
	RoleTitle           *string `json:"role_title"`
	Department          *string `json:"department"`
	Experience          *string `json:"experience"`
	MonthlySalaryPaise  *int64  `json:"monthly_salary_paise"`
	IncentivesNotes     *string `json:"incentives_notes"`
	StartDate           *string `json:"start_date"`
	EndDate             *string `json:"end_date"`
	EndDateExplicitNull bool    `json:"-"` // set by handler when raw JSON has null
	Status              *string `json:"status"`
}

func (s *EmployeeService) Patch(ctx context.Context, id int64, in PatchEmployeeInput) error {
	p := repository.PatchEmployeeInput{}
	if in.Name != nil {
		p.Name = in.Name
	}
	if in.Email != nil {
		p.Email = in.Email
	}
	if in.Phone != nil {
		p.Phone = in.Phone
	}
	if in.RoleTitle != nil {
		p.RoleTitle = in.RoleTitle
	}
	if in.Department != nil {
		p.Department = in.Department
	}
	if in.Experience != nil {
		p.Experience = in.Experience
	}
	if in.MonthlySalaryPaise != nil {
		p.MonthlySalaryPaise = in.MonthlySalaryPaise
	}
	if in.IncentivesNotes != nil {
		p.IncentivesNotes = in.IncentivesNotes
	}
	if in.StartDate != nil {
		t, err := parseDate(*in.StartDate)
		if err != nil {
			return fmt.Errorf("invalid start_date")
		}
		p.StartDate = &t
	}
	if in.EndDateExplicitNull {
		p.ClearEndDate = true
	} else if in.EndDate != nil {
		t, err := parseDate(*in.EndDate)
		if err != nil {
			return fmt.Errorf("invalid end_date")
		}
		p.EndDate = &t
	}
	if in.Status != nil {
		p.Status = in.Status
	}
	return s.repo.Patch(ctx, id, p)
}

func firstOfMonthUTC(t time.Time) time.Time {
	y, m, _ := t.Date()
	return time.Date(y, m, 1, 0, 0, 0, 0, time.UTC)
}

type RecordPaymentInput struct {
	PeriodMonth    string `json:"period_month" binding:"required,max=32"` // YYYY-MM-01 or YYYY-MM-DD
	AmountPaise    int64  `json:"amount_paise" binding:"gte=0"`
	IncentivePaise int64  `json:"incentive_paise" binding:"gte=0"`
	Notes          string `json:"notes" binding:"max=5000"`
}

func (s *EmployeeService) RecordPayment(ctx context.Context, employeeID int64, in RecordPaymentInput) (*model.EmployeeSalaryPayment, error) {
	pm, err := parseDate(in.PeriodMonth)
	if err != nil {
		return nil, fmt.Errorf("invalid period_month")
	}
	pm = firstOfMonthUTC(pm)
	p := &model.EmployeeSalaryPayment{
		EmployeeID:     employeeID,
		PeriodMonth:    pm,
		AmountPaise:    in.AmountPaise,
		IncentivePaise: in.IncentivePaise,
		Notes:          strings.TrimSpace(in.Notes),
	}
	if err := s.repo.UpsertPayment(ctx, p); err != nil {
		return nil, err
	}
	return p, nil
}

func (s *EmployeeService) List(ctx context.Context, q string) ([]model.Employee, error) {
	return s.repo.List(ctx, q)
}

func (s *EmployeeService) GetByID(ctx context.Context, id int64) (*model.Employee, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *EmployeeService) ListPayments(ctx context.Context, employeeID int64) ([]model.EmployeeSalaryPayment, error) {
	return s.repo.ListPayments(ctx, employeeID)
}

func (s *EmployeeService) SetResumeURL(ctx context.Context, id int64, url string) error {
	return s.repo.SetResumeURL(ctx, id, url)
}
