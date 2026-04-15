/**
 * Learning hub — Docker fundamentals.
 */
import type { GuideSection } from "@/data/deployment-guide-sections";

export const DOCKER_SECTIONS: GuideSection[] = [
  {
    id: "images-containers",
    eyebrow: "Core ideas",
    title: "Images vs containers",
    blocks: [
      {
        type: "p",
        text:
          "An image is a read-only template (filesystem layers + metadata). A container is a running instance of an image — writable thin layer on top, isolated process namespace, its own network interface by default.",
      },
      {
        type: "ul",
        items: [
          "Build an image from a Dockerfile (recipe) or pull from a registry (Docker Hub, ECR, GHCR).",
          "`docker run` creates and starts a container; `docker ps` lists running containers.",
          "Stopping a container is not deleting it — `docker rm` cleans up.",
        ],
      },
    ],
  },
  {
    id: "dockerfile",
    eyebrow: "Recipe",
    title: "A practical Dockerfile (multi-stage for Go)",
    blocks: [
      {
        type: "p",
        text:
          "Multi-stage builds compile in a full toolchain image, then copy only the binary into a tiny runtime image — smaller attack surface and faster pulls.",
      },
      {
        type: "code",
        text: `# build stage
FROM golang:1.22-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /bin/server ./cmd/server

# run stage
FROM alpine:3.19
WORKDIR /
COPY --from=build /bin/server /server
EXPOSE 8080
USER 65532:65532
ENTRYPOINT ["/server"]`,
      },
    ],
  },
  {
    id: "compose",
    eyebrow: "Local stacks",
    title: "Docker Compose for app + database",
    blocks: [
      {
        type: "p",
        text:
          "Compose declares multiple services, networks, and volumes in YAML — one command brings up Postgres, Redis, and your API together for local development.",
      },
      {
        type: "code",
        text: `services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: postgres://db:5432/app
    depends_on:
      - db
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: devpassword
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:`,
      },
    ],
  },
  {
    id: "volumes-networks",
    eyebrow: "Persistence",
    title: "Volumes, networks, and gotchas",
    blocks: [
      {
        type: "ul",
        items: [
          "Bind-mount source code for hot reload in dev; use named volumes for database files.",
          "Services in the same Compose network resolve each other by service name as DNS.",
          "Containers are ephemeral — design apps so state lives in databases or object storage, not the container filesystem.",
        ],
      },
      {
        type: "callout",
        variant: "caution",
        title: "Secrets",
        body:
          "Do not bake passwords into images. Use env vars from orchestrators, secret managers, or runtime injection — and never commit `.env` with production credentials.",
      },
    ],
  },
];
