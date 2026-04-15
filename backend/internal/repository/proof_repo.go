package repository

import (
	"context"
	"database/sql"

	"github.com/goscalelabs/api/internal/model"
)

type ProofRepository struct {
	db *sql.DB
}

func NewProofRepository(db *sql.DB) *ProofRepository {
	return &ProofRepository{db: db}
}

func (r *ProofRepository) Create(ctx context.Context, p *model.Proof) error {
	row := r.db.QueryRowContext(ctx, `
		INSERT INTO proofs (type, url, preview_url, unlocked)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at`,
		p.Type, p.URL, p.PreviewURL, p.Unlocked,
	)
	return row.Scan(&p.ID, &p.CreatedAt)
}

func (r *ProofRepository) List(ctx context.Context) ([]model.Proof, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT id, type, url, preview_url, unlocked, created_at
		FROM proofs
		ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]model.Proof, 0)
	for rows.Next() {
		var p model.Proof
		if err := rows.Scan(&p.ID, &p.Type, &p.URL, &p.PreviewURL, &p.Unlocked, &p.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, p)
	}
	return out, rows.Err()
}

func (r *ProofRepository) SetUnlocked(ctx context.Context, id int64, unlocked bool) error {
	_, err := r.db.ExecContext(ctx, `UPDATE proofs SET unlocked = $1 WHERE id = $2`, unlocked, id)
	return err
}
