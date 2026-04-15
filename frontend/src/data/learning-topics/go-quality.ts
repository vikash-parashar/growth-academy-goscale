/**
 * Learning hub — Go formatting, linting, and testing.
 */
import type { GuideSection } from "@/data/deployment-guide-sections";

export const GO_QUALITY_SECTIONS: GuideSection[] = [
  {
    id: "fmt-vet",
    eyebrow: "Ship clean code",
    title: "`gofmt`, `go vet`, and static analysis",
    blocks: [
      {
        type: "callout",
        variant: "info",
        title: "Order",
        body:
          "Finish Start here and Go basics before worrying about CI. This page is for when you already run small programs and want team-style checks.",
      },
      {
        type: "p",
        text:
          "`gofmt` is the canonical formatter — run it on save in your editor. `go vet` finds suspicious constructs (printf format mismatches, unreachable code). Add `staticcheck` or `golangci-lint` in CI for deeper checks.",
      },
      {
        type: "code",
        text: `# Format all packages in module
gofmt -w .

# High-signal quick checks
go vet ./...

# Optional: aggregated linters (install binary separately)
golangci-lint run`,
      },
      {
        type: "callout",
        variant: "info",
        title: "CI",
        body:
          "Fail the build if `gofmt` would change files (`gofmt -l .` should print nothing) or if linters report issues. That keeps reviews focused on behavior.",
      },
    ],
  },
  {
    id: "table-tests",
    eyebrow: "Tests",
    title: "Table-driven tests",
    blocks: [
      {
        type: "p",
        text:
          "Table-driven tests run many cases from one function — easy to add edge cases and keep assertions consistent.",
      },
      {
        type: "code",
        text: `package mathx

import "testing"

func Abs(n int) int {
	if n < 0 {
		return -n
	}
	return n
}

func TestAbs(t *testing.T) {
	tests := []struct {
		name string
		in   int
		want int
	}{
		{"zero", 0, 0},
		{"positive", 3, 3},
		{"negative", -5, 5},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := Abs(tt.in); got != tt.want {
				t.Fatalf("Abs(%d) = %d; want %d", tt.in, got, tt.want)
			}
		})
	}
}`,
      },
    ],
  },
  {
    id: "httptest",
    eyebrow: "HTTP handlers",
    title: "`httptest` for handlers and clients",
    blocks: [
      {
        type: "p",
        text:
          "`net/http/httptest` gives a `ResponseRecorder` to call `ServeHTTP` without a real network port, and a test server for integration-style client tests.",
      },
      {
        type: "code",
        text: `package api

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func ping(w http.ResponseWriter, _ *http.Request) {
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte("pong"))
}

func TestPing(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/ping", nil)
	rr := httptest.NewRecorder()
	ping(rr, req)
	if rr.Code != http.StatusOK {
		t.Fatalf("status %d", rr.Code)
	}
}`,
      },
    ],
  },
  {
    id: "bench-race",
    eyebrow: "Depth",
    title: "Benchmarks and the race detector",
    blocks: [
      {
        type: "p",
        text:
          "Benchmarks (`func BenchmarkX(*testing.B)`) measure hot paths with `b.N`. Run `go test -race ./...` in CI or locally to catch data races on shared memory.",
      },
      {
        type: "code",
        text: `import "testing"

func BenchmarkSum(b *testing.B) {
	xs := make([]int, 1024)
	for i := 0; i < b.N; i++ {
		_ = sum(xs) // your function
	}
}`,
      },
      {
        type: "callout",
        variant: "tip",
        title: "Coverage",
        body:
          "`go test -cover ./...` reports statement coverage; use it as a guide, not a goal — exhaustive tests of critical paths matter more than 100%.",
      },
    ],
  },
];
