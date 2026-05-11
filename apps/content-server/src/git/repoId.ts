import { createHash } from "node:crypto";

/**
 * Derives a stable, URL-safe identifier from a Git remote URL.
 * The same URL always produces the same ID. Different URLs always differ.
 */
export function deriveRepoId(repoUrl: string): string {
  return createHash("sha256").update(repoUrl).digest("base64url").slice(0, 12);
}
