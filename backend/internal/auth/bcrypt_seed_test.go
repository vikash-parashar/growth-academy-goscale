package auth

import (
	"testing"

	"golang.org/x/crypto/bcrypt"
)

func TestSeedAdminPasswordHash(t *testing.T) {
	// Must match migrations/002_seed_admin.sql and MigratePostgres seed.
	hash := []byte(`$2a$10$FZbQRC6A8m6ys/6Qo2qQ2uNLn5ehAvV1XsQ8jWYTuaFCFRGtvlgSW`)
	if err := bcrypt.CompareHashAndPassword(hash, []byte("Vikash@9966")); err != nil {
		t.Fatalf("seed hash does not match Vikash@9966: %v", err)
	}
}
