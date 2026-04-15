// Usage: DATABASE_URL=postgres://... go run ./cmd/checkdb
// Prints connectivity and relation names for the configured database.
package main

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/goscalelabs/api/internal/config"
	"github.com/goscalelabs/api/internal/database"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		fmt.Fprintln(os.Stderr, "config:", err)
		os.Exit(1)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	db, err := database.OpenPostgres(cfg.DatabaseURL)
	if err != nil {
		fmt.Fprintln(os.Stderr, "connect:", err)
		os.Exit(1)
	}
	defer db.Close()

	if err := db.PingContext(ctx); err != nil {
		fmt.Fprintln(os.Stderr, "ping:", err)
		os.Exit(1)
	}
	fmt.Println("ok: connected to postgres")

	rows, err := db.QueryContext(ctx, `
		SELECT table_name FROM information_schema.tables
		WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
		ORDER BY table_name`)
	if err != nil {
		fmt.Fprintln(os.Stderr, "list tables:", err)
		os.Exit(1)
	}
	defer rows.Close()
	fmt.Println("tables:")
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			fmt.Fprintln(os.Stderr, "scan:", err)
			os.Exit(1)
		}
		fmt.Println(" -", name)
	}
	if err := rows.Err(); err != nil {
		fmt.Fprintln(os.Stderr, rows.Err())
		os.Exit(1)
	}
}
