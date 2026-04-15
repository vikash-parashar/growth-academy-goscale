# Multi-stage build for Go API (Render / Railway / Fly.io / etc.)
FROM golang:1.22-alpine AS builder
WORKDIR /src
RUN apk add --no-cache ca-certificates git
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /out/server ./cmd/server

FROM alpine:3.19
RUN apk add --no-cache ca-certificates tzdata
WORKDIR /app
COPY --from=builder /out/server /app/server
# Render/Railway set PORT; uploads on ephemeral disk (free tiers may reset on redeploy)
ENV PORT=8080
ENV UPLOAD_DIR=/tmp/goscale-uploads
EXPOSE 8080
CMD ["/app/server"]
