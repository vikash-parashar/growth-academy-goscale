package service

import (
	"context"
	"strings"

	"github.com/goscalelabs/api/internal/config"
	"github.com/goscalelabs/api/internal/model"
	"github.com/goscalelabs/api/internal/repository"
)

type ProofService struct {
	repo *repository.ProofRepository
	cfg  *config.Config
}

func NewProofService(r *repository.ProofRepository, cfg *config.Config) *ProofService {
	return &ProofService{repo: r, cfg: cfg}
}

func (s *ProofService) ListPublic(ctx context.Context) ([]model.PublicProof, error) {
	all, err := s.repo.List(ctx)
	if err != nil {
		return nil, err
	}
	out := make([]model.PublicProof, 0, len(all))
	base := s.cfg.PublicBaseURL
	for _, p := range all {
		pp := model.PublicProof{
			ID:         p.ID,
			Type:       p.Type,
			PreviewURL: publicURL(base, p.PreviewURL),
			Unlocked:   p.Unlocked,
			CreatedAt:  p.CreatedAt,
		}
		if p.Unlocked {
			pp.URL = publicURL(base, p.URL)
		}
		out = append(out, pp)
	}
	return out, nil
}

func (s *ProofService) ListAdmin(ctx context.Context) ([]model.Proof, error) {
	all, err := s.repo.List(ctx)
	if err != nil {
		return nil, err
	}
	base := s.cfg.PublicBaseURL
	for i := range all {
		all[i].URL = publicURL(base, all[i].URL)
		all[i].PreviewURL = publicURL(base, all[i].PreviewURL)
	}
	return all, nil
}

func (s *ProofService) Create(ctx context.Context, p *model.Proof) error {
	return s.repo.Create(ctx, p)
}

func (s *ProofService) SetUnlocked(ctx context.Context, id int64, unlocked bool) error {
	return s.repo.SetUnlocked(ctx, id, unlocked)
}

func publicURL(base, path string) string {
	if path == "" {
		return ""
	}
	if strings.HasPrefix(path, "http://") || strings.HasPrefix(path, "https://") {
		return path
	}
	if len(path) > 0 && path[0] == '/' {
		return base + path
	}
	return base + "/" + path
}
