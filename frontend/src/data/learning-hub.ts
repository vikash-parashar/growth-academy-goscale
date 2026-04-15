/**
 * Learning hub registry — topic metadata and section content (English).
 */
import type { GuideSection } from "@/data/deployment-guide-sections";
import { AWS_SECTIONS } from "@/data/learning-topics/aws-basics";
import { CICD_SECTIONS } from "@/data/learning-topics/cicd-basics";
import { DOCKER_SECTIONS } from "@/data/learning-topics/docker-basics";
import { GO_ADVANCED_SECTIONS } from "@/data/learning-topics/go-advanced";
import { GO_BASICS_SECTIONS } from "@/data/learning-topics/go-basics";
import { GO_QUALITY_SECTIONS } from "@/data/learning-topics/go-quality";
import { HTTP_SECTIONS } from "@/data/learning-topics/http-in-depth";
import { INTERNET_SECTIONS } from "@/data/learning-topics/internet-fundamentals";
import { START_HERE_SECTIONS } from "@/data/learning-topics/start-here";

export type LearningTopic = {
  slug: string;
  /** Short label for the sub-navigation tabs */
  navLabel: string;
  /** Page title + metadata title */
  title: string;
  /** SEO / social description */
  description: string;
  /** Intro paragraph under H1 */
  intro: string;
  sections: GuideSection[];
};

export const LEARNING_TOPICS: LearningTopic[] = [
  {
    slug: "start-here",
    navLabel: "Start here",
    title: "Start here — computers, internet, HTTP, APIs, DNS, localhost",
    description:
      "Plain-language foundations for beginners: what a computer and program are, RAM and storage, servers, localhost, DNS, HTTP, and APIs — before writing Go.",
    intro:
      "If tech is brand new to you, read this tab first. It explains the words every later lesson uses, in simple sentences without assuming prior study.",
    sections: START_HERE_SECTIONS,
  },
  {
    slug: "go-basics",
    navLabel: "Go basics",
    title: "Go basics — packages, types, slices, maps, fmt, loops",
    description:
      "First Go code: package and import, scope, functions, variables and constants, arrays, slices (including package slices), maps, range, Printf verbs, Sprint family, structs, errors.",
    intro:
      "Walks through core syntax slowly: how to print, format text (including %s and %g), loop with range, use maps, and build strings without printing yet.",
    sections: GO_BASICS_SECTIONS,
  },
  {
    slug: "go-advanced",
    navLabel: "Go advanced",
    title: "Go advanced — concurrency, interfaces, net/http, APIs, cookies, tokens",
    description:
      "Composition instead of inheritance, interfaces, type conversion, goroutines and channels, net/http servers, routes, handlers, JSON APIs, cookies, and tokens.",
    intro:
      "Connects the language to real web work: what a server and handler are, how routes match, plus how JSON, cookies, and bearer-style tokens fit together.",
    sections: GO_ADVANCED_SECTIONS,
  },
  {
    slug: "go-quality",
    navLabel: "Lint & testing",
    title: "Go format, lint, and testing",
    description:
      "gofmt, go and vet, table-driven tests, httptest, benchmarks, and the race detector — quality gates for real teams.",
    intro:
      "Shipping reliable Go means automation: formatters, linters, and tests that run in CI on every change. This page ties practices to concrete commands and snippets.",
    sections: GO_QUALITY_SECTIONS,
  },
  {
    slug: "http",
    navLabel: "HTTP",
    title: "HTTP for developers — requests, responses, TLS",
    description:
      "How HTTP request/response works, status codes, headers, cookies, TLS, and minimal Go server/client examples.",
    intro:
      "Whether you build REST APIs or debug proxies, HTTP semantics are the contract between browsers, mobile apps, and services.",
    sections: HTTP_SECTIONS,
  },
  {
    slug: "internet",
    navLabel: "Internet",
    title: "How the internet works — DNS, TCP, routing, CDNs",
    description:
      "Layered mental model: DNS, TCP/IP, NAT, and why CDNs reduce latency — the context behind timeouts and outages.",
    intro:
      "You do not need to be a network engineer, but understanding names, packets, and caching explains most 'it works on my Wi‑Fi' mysteries.",
    sections: INTERNET_SECTIONS,
  },
  {
    slug: "docker",
    navLabel: "Docker",
    title: "Docker basics — images, Dockerfile, Compose",
    description:
      "Images versus containers, multi-stage builds for Go, Compose for local stacks, volumes, networks, and secret hygiene.",
    intro:
      "Containers package your app with predictable runtimes — essential for local parity with production and for modern CI/CD.",
    sections: DOCKER_SECTIONS,
  },
  {
    slug: "cicd",
    navLabel: "CI/CD",
    title: "CI/CD pipelines — GitHub Actions and shipping safely",
    description:
      "Continuous integration and delivery, workflow structure, secrets, artifacts, and deploy patterns that avoid drift.",
    intro:
      "Automate build, test, and deploy so every merge keeps main releasable — with gates that match your team's risk tolerance.",
    sections: CICD_SECTIONS,
  },
  {
    slug: "aws",
    navLabel: "AWS",
    title: "AWS essentials for application developers",
    description:
      "Regions and AZs, IAM, EC2 vs Lambda vs S3, RDS, VPC basics, billing alarms, and operational mindset.",
    intro:
      "Cloud accounts are production infrastructure: identity, networking, data, and cost visibility are as important as application code.",
    sections: AWS_SECTIONS,
  },
];

const bySlug = new Map(LEARNING_TOPICS.map((t) => [t.slug, t]));

export function getLearningTopic(slug: string): LearningTopic | undefined {
  return bySlug.get(slug);
}

export function getAllLearningSlugs(): string[] {
  return LEARNING_TOPICS.map((t) => t.slug);
}
