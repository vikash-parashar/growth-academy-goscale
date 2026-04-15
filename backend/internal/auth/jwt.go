package auth

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	Role      string `json:"role"` // "admin" or "student"
	AdminID   int64  `json:"admin_id,omitempty"`
	StudentID int64  `json:"student_id,omitempty"`
	Email     string `json:"email,omitempty"`
	UserID    string `json:"user_id,omitempty"`
	jwt.RegisteredClaims
}

func IssueToken(secret string, expiry time.Duration) (string, error) {
	now := time.Now()
	claims := Claims{
		Role: "admin",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(expiry)),
			IssuedAt:  jwt.NewNumericDate(now),
			Issuer:    "gopher-lab",
		},
	}
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString([]byte(secret))
}

func IssueStudentToken(secret string, studentID int64, email, userID string, expiry time.Duration) (string, error) {
	now := time.Now()
	claims := Claims{
		Role:      "student",
		StudentID: studentID,
		Email:     email,
		UserID:    userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(expiry)),
			IssuedAt:  jwt.NewNumericDate(now),
			Issuer:    "gopher-lab",
		},
	}
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString([]byte(secret))
}

func ParseToken(secret, tokenStr string) (*Claims, error) {
	t, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}
	cl, ok := t.Claims.(*Claims)
	if !ok || !t.Valid {
		return nil, errors.New("invalid token")
	}
	return cl, nil
}
