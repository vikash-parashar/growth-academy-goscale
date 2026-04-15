/**
 * Learning hub — Go advanced + net/http + web concepts (after Go basics).
 */
import type { GuideSection } from "@/data/deployment-guide-sections";

export const GO_ADVANCED_SECTIONS: GuideSection[] = [
  {
    id: "not-inheritance",
    eyebrow: "Mindset",
    title: "Go does not use class inheritance — composition instead",
    blocks: [
      {
        type: "p",
        text:
          "If you heard “inheritance” in other languages: Go has no parent class that passes down methods. You build bigger types by embedding smaller structs or by satisfying interfaces. That avoids deep hierarchies and keeps behavior visible in one file.",
      },
      {
        type: "code",
        text: `type Person struct{ Name string }

type Employee struct {
	Person // embedded — Employee gets Person’s fields
	ID     int
}`,
      },
    ],
  },
  {
    id: "interfaces",
    eyebrow: "Behavior",
    title: "Interfaces — describing what a type can do",
    blocks: [
      {
        type: "p",
        text:
          "An interface lists methods. If your type has those methods, it satisfies the interface automatically — no `implements` keyword. That is how `http.Handler` and `fmt.Stringer` work.",
      },
      {
        type: "code",
        text: `import "fmt"

type Greeter interface {
	Hello() string
}

type Robot struct{}
func (Robot) Hello() string { return "hello" }

func say(g Greeter) {
	fmt.Println(g.Hello())
}`,
      },
    ],
  },
  {
    id: "generics-note",
    eyebrow: "Go 1.18+",
    title: "Generics — one paragraph",
    blocks: [
      {
        type: "p",
        text:
          "Go can parameterize types and functions with type parameters, for example a reusable `Map` over slices. You will see it in newer standard-library packages. Until you need it daily, structs, interfaces, and plain functions cover most services.",
      },
    ],
  },
  {
    id: "conversion",
    eyebrow: "Types",
    title: "Type conversion and safe string/number helpers",
    blocks: [
      {
        type: "p",
        text:
          "Conversions look like `Type(value)` when the language allows them (for example `int64(n)`, `float64(n)`). For text and numbers from user input or HTTP, prefer `strconv` — it reports errors instead of silently doing the wrong thing.",
      },
      {
        type: "code",
        text: `import "strconv"

x := int64(42)
s := strconv.FormatInt(x, 10)

n, err := strconv.Atoi("15")
_ = err // in real code: handle errors`,
      },
      {
        type: "h3",
        text: "strings package — common helpers",
      },
      {
        type: "p",
        text:
          "Package `strings` trims whitespace, splits lines, checks containment, replaces substrings — pair it with `strconv` when parsing.",
      },
      {
        type: "code",
        text: `import "strings"

raw := "  hello world  "
clean := strings.TrimSpace(raw)
parts := strings.Fields(clean) // split on whitespace`,
      },
    ],
  },
  {
    id: "goroutines",
    eyebrow: "Concurrency",
    title: "Goroutines — the `go` keyword",
    blocks: [
      {
        type: "p",
        text:
          "Prefix a function call with `go` to run it concurrently with the rest of `main`. The scheduler multiplexes goroutines onto OS threads — cheap, but you must wait for goroutines to finish before `main` ends, or the program may exit too early.",
      },
      {
        type: "code",
        text: `package main

import (
	"fmt"
	"sync"
)

func work() { fmt.Println("inside") }

func main() {
	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		work()
	}()
	fmt.Println("outside")
	wg.Wait() // wait for the goroutine
}`,
      },
    ],
  },
  {
    id: "channels",
    eyebrow: "Communication",
    title: "Channels — send and receive between goroutines",
    blocks: [
      {
        type: "p",
        text:
          "A channel is a typed pipe: `ch <- v` sends, `v := <-ch` receives. Buffered channels accept a fixed number of sends without a receiver; unbuffered channels synchronize sender and receiver at the same moment.",
      },
      {
        type: "code",
        text: `package main

import "fmt"

func main() {
	ch := make(chan string)
	go func() { ch <- "ping" }()
	msg := <-ch
	fmt.Println(msg)
}`,
      },
    ],
  },
  {
    id: "select-context",
    eyebrow: "Control",
    title: "`select` and `context` (short tour)",
    blocks: [
      {
        type: "p",
        text:
          "`select` waits on several channel operations; the first ready branch runs. `context.Context` carries cancellation and deadlines — pass `r.Context()` from HTTP handlers into slow calls so work stops if the client disconnects.",
      },
    ],
  },
  {
    id: "what-server-is",
    eyebrow: "Bridge to the web",
    title: "What a Go `http.Server` is doing",
    blocks: [
      {
        type: "p",
        text:
          "A server listens on an address and port (for example :8080 on all interfaces). For each incoming connection it reads HTTP requests, dispatches to your code, and writes responses. `ListenAndServe` starts that loop; stopping it cleanly uses `Shutdown` in production.",
      },
    ],
  },
  {
    id: "handler-handlefunc",
    eyebrow: "net/http",
    title: "`Handler`, `Handle`, and `HandleFunc`",
    blocks: [
      {
        type: "p",
        text:
          "A `Handler` is anything with `ServeHTTP(ResponseWriter, *Request)`. `Handle` registers a path prefix with a handler value. `HandleFunc` is a shortcut: you pass a plain function whose signature matches `ServeHTTP`, and Go wraps it for you.",
      },
      {
        type: "code",
        text: `mux := http.NewServeMux()
mux.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "hi")
})

server := &http.Server{Addr: ":8080", Handler: mux}
log.Fatal(server.ListenAndServe())`,
      },
      {
        type: "callout",
        variant: "info",
        title: "Default mux",
        body:
          "http.HandleFunc on the `DefaultServeMux` works for tiny demos. Named `ServeMux` values are easier to test and reason about as the app grows.",
      },
    ],
  },
  {
    id: "routes-what",
    eyebrow: "Paths",
    title: "What people mean by “route”",
    blocks: [
      {
        type: "p",
        text:
          "A route is a rule: “if the URL path starts with this pattern, run this handler”. Go’s `ServeMux` matches the longest registered prefix. For fancy patterns (`/users/{id}`) people use libraries like `gorilla/mux` or Go 1.22+ routing enhancements — start simple with fixed paths first.",
      },
    ],
  },
  {
    id: "request-response",
    eyebrow: "Inputs and outputs",
    title: "`http.Request` and `ResponseWriter` in plain words",
    blocks: [
      {
        type: "ul",
        items: [
          "`r.Method` — GET, POST, etc.",
          "`r.URL.Path` — path part of the URL.",
          "`r.URL.Query().Get(\"q\")` — read query parameters like `?q=hello`.",
          "`r.Header.Get(\"Authorization\")` — read a header string.",
          "`w.WriteHeader(404)` — set status (call before body if you need a non-default 200).",
          "`w.Write(...)` or `fmt.Fprint(w, ...)` — send the body bytes.",
        ],
      },
    ],
  },
  {
    id: "json-api",
    eyebrow: "API body",
    title: "How a JSON API usually looks in Go",
    blocks: [
      {
        type: "p",
        text:
          "Clients often send JSON (`Content-Type: application/json`). You decode into a struct with `json.Decoder` or `json.Unmarshal`, do work, then encode with `json.NewEncoder(w).Encode` — and set `w.Header().Set(\"Content-Type\", \"application/json\")` before writing.",
      },
      {
        type: "code",
        text: `import (
	"encoding/json"
	"net/http"
)

type item struct{ Message string }

func api(w http.ResponseWriter, _ *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(item{Message: "ok"})
}`,
      },
    ],
  },
  {
    id: "how-api-works",
    eyebrow: "Plain English",
    title: "How an API call works end to end",
    blocks: [
      {
        type: "ol",
        items: [
          "A client builds an HTTP request: URL, method, optional headers and body.",
          "DNS and TCP connect it to a server.",
          "The Go server accepts, parses the request, picks the handler.",
          "Your handler reads the request, talks to a database or other services, builds JSON or HTML, writes the response.",
        ],
      },
    ],
  },
  {
    id: "cookies",
    eyebrow: "State",
    title: "Cookies — small pieces the browser stores for you",
    blocks: [
      {
        type: "p",
        text:
          "A cookie is a short string the server asks the browser to remember and send back on later requests. Good for session IDs, language choice, or consent flags — not for large secret data. Set `HttpOnly` to hide the cookie from JavaScript; use `Secure` in production with HTTPS.",
      },
      {
        type: "code",
        text: `http.SetCookie(w, &http.Cookie{
	Name:  "sid",
	Value: "opaque-session-id",
	Path:  "/",
})

c, err := r.Cookie("sid")
_ = c
_ = err`,
      },
    ],
  },
  {
    id: "tokens",
    eyebrow: "Auth over HTTP",
    title: "Tokens (including JWT-shaped ideas) without hype",
    blocks: [
      {
        type: "p",
        text:
          "Many APIs avoid session cookies and instead send a token in the `Authorization` header (often `Bearer <token>`). A session token is usually an opaque random string looked up in a database or cache. A JWT is a signed, self-contained blob — convenient, but if you accept it blindly you must validate signatures and expiry carefully.",
      },
      {
        type: "callout",
        variant: "caution",
        title: "Secrets",
        body:
          "Tokens are passwords. Log only their prefixes in diagnostics, rotate on leak, and always use HTTPS in production.",
      },
    ],
  },
];
