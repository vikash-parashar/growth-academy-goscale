/**
 * Learning hub — CI/CD fundamentals.
 */
import type { GuideSection } from "@/data/deployment-guide-sections";

export const CICD_SECTIONS: GuideSection[] = [
  {
    id: "what-pipeline",
    eyebrow: "Definition",
    title: "What CI and CD mean",
    blocks: [
      {
        type: "ul",
        items: [
          "Continuous Integration — every merge or PR runs automated build, tests, and lint in a clean environment so main stays shippable.",
          "Continuous Delivery — main is always deployable; release may be manual approval.",
          "Continuous Deployment — passing main automatically goes to production (only with strong tests and monitoring).",
        ],
      },
      {
        type: "p",
        text:
          "A pipeline is a DAG of steps: checkout → install deps → static checks → unit tests → build artifact → integration tests → deploy. Fail fast on the cheapest step.",
      },
    ],
  },
  {
    id: "github-actions",
    eyebrow: "Example",
    title: "GitHub Actions workflow skeleton",
    blocks: [
      {
        type: "p",
        text:
          "Workflows live in `.github/workflows/*.yml`. Triggers (`on`) can be push, pull_request, PR labels, or cron. Use matrix builds to test multiple Go/Node versions.",
      },
      {
        type: "code",
        text: `name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: "1.22.x"
      - name: Test
        run: go test ./...`,
      },
    ],
  },
  {
    id: "secrets-artifacts",
    eyebrow: "Operations",
    title: "Secrets, environments, and artifacts",
    blocks: [
      {
        type: "ul",
        items: [
          "Store tokens in GitHub Secrets / cloud KMS — reference them as env vars in workflows, never echo them in logs.",
          "Use environment protection (required reviewers) for production deploy jobs.",
          "Upload build artifacts (binaries, coverage reports) between jobs with `actions/upload-artifact`.",
        ],
      },
    ],
  },
  {
    id: "deploy-hooks",
    eyebrow: "Shipping",
    title: "Deploy patterns",
    blocks: [
      {
        type: "p",
        text:
          "Common patterns: push container to registry then rolling update Kubernetes; or `vercel deploy` / platform API for frontend; or SSH + systemd for a VPS. Tag releases (`v1.2.3`) for traceability and rollbacks.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Same image everywhere",
        body:
          "Build once, promote the same container digest from staging to prod. Recreating from source at deploy time invites 'works on CI' drift.",
      },
    ],
  },
];
