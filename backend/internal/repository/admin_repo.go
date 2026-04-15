package repository

import (
	"context"
	"database/sql"
	"strings"

	"github.com/goscalelabs/api/internal/model"
)

type AdminRepository struct {
	db *sql.DB
}

func NewAdminRepository(db *sql.DB) *AdminRepository {
	return &AdminRepository{db: db}
}

// GetByEmail returns the admin row or nil if not found.
func (r *AdminRepository) GetByEmail(ctx context.Context, email string) (*model.AdminUser, error) {
	email = strings.TrimSpace(strings.ToLower(email))
	if email == "" {
		return nil, nil
	}
	row := r.db.QueryRowContext(ctx,
		`SELECT id, email, password_hash FROM admin_users WHERE lower(trim(email)) = $1`,
		email,
	)
	var u model.AdminUser
	if err := row.Scan(&u.ID, &u.Email, &u.PasswordHash); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &u, nil
}
