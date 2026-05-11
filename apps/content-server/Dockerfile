# syntax=docker/dockerfile:1

# ── Build stage ────────────────────────────────────────────────────────────────
FROM oven/bun:1 AS build

WORKDIR /workspace

# Copy workspace manifest files first to maximise layer cache hits.
COPY package.json pnpm-workspace.yaml ./
COPY apps/content-server/package.json ./apps/content-server/
COPY libs/types/package.json          ./libs/types/

# Install all workspace dependencies (including devDeps needed for tsc).
RUN bun install

# Copy source trees.
COPY tsconfig.json                    ./
COPY libs/types/                      ./libs/types/
COPY apps/content-server/             ./apps/content-server/

# Compile @sparkium/types — content-server depends on its dist/ output.
RUN cd libs/types && bunx tsc -p tsconfig.json

# Cross-compile the content-server binary for the target platform.
# Docker BuildKit sets TARGETARCH automatically for multi-platform builds.
ARG TARGETARCH=amd64
RUN case "$TARGETARCH" in \
      amd64) BUN_TARGET=bun-linux-x64-musl  ;; \
      arm64) BUN_TARGET=bun-linux-arm64-musl ;; \
      *)     echo "Unsupported TARGETARCH: $TARGETARCH" && exit 1 ;; \
    esac && \
    bun build apps/content-server/src/index.ts \
      --compile \
      --target="$BUN_TARGET" \
      --minify \
      --bytecode \
      --outfile /content-server

# ── Runtime stage ──────────────────────────────────────────────────────────────
# Minimal Alpine image; ca-certificates are required for HTTPS Git access.
FROM alpine:3

RUN apk add --no-cache ca-certificates

COPY --from=build /content-server /usr/local/bin/content-server

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/content-server"]
