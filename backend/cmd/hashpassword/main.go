// Usage: go run ./cmd/hashpassword 'your-plain-password'
// Paste the output into ADMIN_PASSWORD when GIN_MODE=release.
package main

import (
	"fmt"
	"os"

	"golang.org/x/crypto/bcrypt"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Fprintln(os.Stderr, "usage: go run ./cmd/hashpassword <plain-password>")
		os.Exit(1)
	}
	plain := os.Args[1]
	hash, err := bcrypt.GenerateFromPassword([]byte(plain), bcrypt.DefaultCost)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	fmt.Println(string(hash))
}
