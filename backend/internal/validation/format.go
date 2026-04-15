package validation

import (
	"errors"
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
)

// FormatErrors turns validator errors into short field messages for API clients.
func FormatErrors(err error) []string {
	var ve validator.ValidationErrors
	if err == nil || !errors.As(err, &ve) {
		return nil
	}
	out := make([]string, 0, len(ve))
	for _, e := range ve {
		f := e.Field()
		if f == "" {
			f = "field"
		}
		out = append(out, fmt.Sprintf("%s: %s", strings.ToLower(f), humanizeFieldError(e)))
	}
	return out
}

func humanizeFieldError(e validator.FieldError) string {
	switch e.Tag() {
	case "required":
		return "required"
	case "email":
		return "must be a valid email"
	case "min":
		return fmt.Sprintf("min length %s", e.Param())
	case "max":
		return fmt.Sprintf("max length %s", e.Param())
	case "gte":
		return fmt.Sprintf("must be >= %s", e.Param())
	case "lte":
		return fmt.Sprintf("must be <= %s", e.Param())
	case "gt":
		return fmt.Sprintf("must be > %s", e.Param())
	case "oneof":
		return fmt.Sprintf("must be one of: %s", e.Param())
	case "eq":
		return fmt.Sprintf("must equal %s", e.Param())
	case "dive":
		return "invalid list item"
	default:
		return fmt.Sprintf("failed rule %s", e.Tag())
	}
}
