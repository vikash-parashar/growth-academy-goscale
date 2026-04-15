/**
 * Learning hub — absolute beginner track (no prior tech assumed).
 */
import type { GuideSection } from "@/data/deployment-guide-sections";

export const START_HERE_SECTIONS: GuideSection[] = [
  {
    id: "welcome",
    eyebrow: "You belong here",
    title: "How to use this page",
    blocks: [
      {
        type: "p",
        text:
          "This tutorial assumes nothing. Words are explained the first time they appear. Read in order, or jump using the outline — but if a word feels unfamiliar, scroll up or open the earlier topic in the Learning tabs.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "One idea at a time",
        body:
          "You do not memorize everything. The goal is to recognize terms when you see them again in the Go lessons or on the job.",
      },
    ],
  },
  {
    id: "what-computer",
    eyebrow: "Physical machine",
    title: "What is a computer, in everyday words",
    blocks: [
      {
        type: "p",
        text:
          "A computer is a machine that stores information and follows instructions very fast. You give it input (keyboard, touch, microphone), it processes with chips inside, and it shows output (screen, speakers, printer).",
      },
      {
        type: "ul",
        items: [
          "Hardware — the physical parts you can touch: screen, keyboard, phone body, chips, wires.",
          "Software — programs (apps) that tell the hardware what to do: browser, games, your code once it runs.",
        ],
      },
    ],
  },
  {
    id: "ram-storage-rom",
    eyebrow: "Memory words",
    title: "RAM, storage (disk), and ROM — what people mean",
    blocks: [
      {
        type: "p",
        text:
          "These words confuse beginners because they all involve “memory”. They are different jobs.",
      },
      {
        type: "ul",
        items: [
          "RAM (often called memory) — fast, temporary workspace while the computer is on. When you open many browser tabs, RAM fills up. Turn the power off, and that workspace is cleared.",
          "Storage (SSD or hard disk) — slower than RAM, but keeps data when power is off. Your photos, documents, and installed programs live here.",
          "ROM (read-only memory) — firmware baked into the device (boot instructions). You rarely think about it day to day; RAM and storage are what developers talk about for apps.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "Why it matters for servers",
        body:
          "A server is still a computer. It has RAM for active work and storage for databases and files. “Out of memory” usually means RAM, not disk.",
      },
    ],
  },
  {
    id: "program",
    eyebrow: "Instructions",
    title: "What is a program",
    blocks: [
      {
        type: "p",
        text:
          "A program is a list of precise instructions the computer follows. A recipe is a good analogy: steps must be in order, and small mistakes can change the result.",
      },
      {
        type: "p",
        text:
          "Apps you use (browser, chat) are programs someone wrote. Your own Go code becomes a program after you build and run it.",
      },
    ],
  },
  {
    id: "programming-language",
    eyebrow: "Why code looks odd",
    title: "What is a programming language — and why we use one",
    blocks: [
      {
        type: "p",
        text:
          "Processors do not read English. A programming language is a strict middle ground: humans can read it with practice, and tools can translate it into machine instructions.",
      },
      {
        type: "ul",
        items: [
          "We use languages so we can express logic clearly: calculations, decisions, repetition, and talking to networks.",
          "Go is one language among many; it is chosen for simple rules, speed, and building network services.",
        ],
      },
    ],
  },
  {
    id: "server",
    eyebrow: "Another computer",
    title: "What is a server",
    blocks: [
      {
        type: "p",
        text:
          "A server is a computer (often without a monitor attached) that waits for requests and sends back answers. A web server answers with pages or data. A database server stores and returns rows.",
      },
      {
        type: "p",
        text:
          "Your laptop can act as a server during development. In production, companies run servers in data centres or rent them from cloud providers (see the AWS lesson later).",
      },
    ],
  },
  {
    id: "localhost",
    eyebrow: "On your own machine",
    title: "What is localhost",
    blocks: [
      {
        type: "p",
        text:
          "Localhost means “this same computer I am typing on”. The special name `localhost` and the address `127.0.0.1` point the network traffic back to yourself — useful for testing before the world can reach you.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Try to remember",
        body:
          "If a tutorial says “open http://localhost:8080”, it means your browser talks to a program listening on port 8080 on your machine only — not the public internet.",
      },
    ],
  },
  {
    id: "internet",
    eyebrow: "Machines talking",
    title: "What is the internet, in one picture",
    blocks: [
      {
        type: "p",
        text:
          "The internet is a huge network of networks. Computers agree on rules so messages can hop across routers and cables until they reach the right destination.",
      },
      {
        type: "p",
        text:
          "When something “loads slowly”, data is travelling that path, or the server is busy, or your Wi‑Fi is weak — not magic.",
      },
    ],
  },
  {
    id: "dns",
    eyebrow: "Names to numbers",
    title: "What is DNS",
    blocks: [
      {
        type: "p",
        text:
          "Computers prefer numeric addresses (like `93.184.216.34`). Humans prefer names (like `example.com`). DNS (Domain Name System) is the phone book that translates a name into an address.",
      },
      {
        type: "ul",
        items: [
          "A domain name is the human-readable label you buy or use (`growthacademy.example`).",
          "A DNS lookup is the browser asking, “What address goes with this name?” before it can connect.",
        ],
      },
    ],
  },
  {
    id: "http-why",
    eyebrow: "Web language",
    title: "What is HTTP — and why we use it",
    blocks: [
      {
        type: "p",
        text:
          "HTTP (Hypertext Transfer Protocol) is the usual language a browser and a web server use to ask for pages and send back answers. It is text-based and structured: request → response.",
      },
      {
        type: "ul",
        items: [
          "HTTPS is HTTP wrapped in encryption (TLS). You see a padlock in the browser; the traffic is harder to read on the wire.",
          "A status code is a short number in the response (200 OK, 404 not found, 500 server error) that tells you what happened.",
        ],
      },
    ],
  },
  {
    id: "api",
    eyebrow: "Machine menu",
    title: "What is an API",
    blocks: [
      {
        type: "p",
        text:
          "An API (Application Programming Interface) is a defined way for programs to talk to each other. For web work, people often mean “HTTP endpoints that return data (often JSON) instead of a full web page”.",
      },
      {
        type: "p",
        text:
          "A human clicks buttons on a website; a mobile app calls the API behind the scenes with HTTP. Same ideas: address (URL), action (GET/POST), headers, and a body sometimes.",
      },
    ],
  },
  {
    id: "clients-servers-roundtrip",
    eyebrow: "Putting it together",
    title: "The round trip in plain English",
    blocks: [
      {
        type: "ol",
        items: [
          "You type a URL or an app triggers a request.",
          "DNS turns the hostname into an IP (unless cached).",
          "Your device opens a connection (often HTTPS on port 443).",
          "The server runs code (maybe written in Go), builds a response, and sends it back.",
        ],
      },
      {
        type: "p",
        text:
          "Later lessons show how Go’s net/http package plugs into exactly this flow.",
      },
    ],
  },
];
