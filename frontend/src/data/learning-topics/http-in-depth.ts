/**
 * Learning hub — HTTP fundamentals for developers.
 */
import type { GuideSection } from "@/data/deployment-guide-sections";

export const HTTP_SECTIONS: GuideSection[] = [
  {
    id: "request-response",
    eyebrow: "The exchange",
    title: "Request and response — what actually moves over the wire",
    blocks: [
      {
        type: "callout",
        variant: "info",
        title: "New to these words?",
        body:
          "If “protocol”, “client”, or “TLS” feel unfamiliar, read the Start here tab in Learning first. This page goes one level deeper with the same vocabulary.",
      },
      {
        type: "p",
        text:
          "HTTP is a text-based (often TLS-wrapped) protocol between a client and a server. The client opens a connection, sends a request line (method + path + version), headers, optional body; the server returns a status line, headers, optional body.",
      },
      {
        type: "code",
        text: `GET /api/users/42 HTTP/1.1
Host: example.com
Accept: application/json

`,
      },
      {
        type: "code",
        text: `HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 21

{"id":42,"name":"Ada"}`,
      },
      {
        type: "h3",
        text: "Common methods",
      },
      {
        type: "ul",
        items: [
          "GET — read a resource; should not change server state (in theory).",
          "POST — create something or trigger an action; body often carries JSON or form data.",
          "PUT / PATCH — replace or partially update a resource.",
          "DELETE — remove a resource.",
          "OPTIONS — discover allowed methods (CORS preflight uses this).",
        ],
      },
    ],
  },
  {
    id: "status-codes",
    eyebrow: "Semantics",
    title: "Status codes you should know",
    blocks: [
      {
        type: "ul",
        items: [
          "2xx — success (200 OK, 201 Created, 204 No Content).",
          "3xx — redirection (301 permanent, 302/307/308 temporary — caching differs).",
          "4xx — client fault (400 bad request, 401 unauthorized, 403 forbidden, 404 not found, 429 rate limit).",
          "5xx — server fault (500 generic, 502 bad gateway, 503 unavailable).",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "API design",
        body:
          "Pick codes that match reality: if auth failed, use 401; if auth worked but role is wrong, use 403. Consistency across your API saves frontend and mobile teams hours.",
      },
    ],
  },
  {
    id: "headers-cookies",
    eyebrow: "Metadata",
    title: "Headers, cookies, and content negotiation",
    blocks: [
      {
        type: "p",
        text:
          "Headers carry auth (`Authorization: Bearer …`), caching (`Cache-Control`), security (`Content-Security-Policy`), and typing (`Content-Type`). Cookies are headers the server asks the browser to store and send back — useful for sessions; prefer HttpOnly and Secure flags.",
      },
      {
        type: "p",
        text:
          "REST APIs often use `Accept` and `Content-Type: application/json`. File uploads use `multipart/form-data` with boundaries in the body.",
      },
    ],
  },
  {
    id: "tls",
    eyebrow: "HTTPS",
    title: "TLS (HTTPS) in one minute",
    blocks: [
      {
        type: "p",
        text:
          "HTTPS is HTTP inside a TLS tunnel. The TLS handshake proves server identity (certificates), negotiates encryption keys, and protects integrity. Browsers warn on invalid or expired certs — that is why you terminate TLS with a valid chain (Let’s Encrypt, your cloud provider, etc.).",
      },
    ],
  },
  {
    id: "go-http-client",
    eyebrow: "Example",
    title: "Minimal Go client and server",
    blocks: [
      {
        type: "code",
        text: `// Server
http.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain")
	fmt.Fprint(w, "hi")
})
log.Fatal(http.ListenAndServe(":8080", nil))

// Client
resp, err := http.Get("http://localhost:8080/hello")
if err != nil { /* handle */ }
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)`,
      },
    ],
  },
];
