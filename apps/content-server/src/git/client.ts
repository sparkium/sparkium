import git from "isomorphic-git";
import http from "isomorphic-git/http/web";
import fs from "node:fs";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

import { config } from "../config.js";
import { deriveRepoId } from "./repoId.js";

/**
 * Ensures the given repo is cloned and up to date in the local cache.
 * On first call for a URL: performs a full clone.
 * On subsequent calls: fetches the latest changes from the remote.
 *
 * TODO: handle concurrent calls for the same repoUrl (mutex/lock).
 */
export async function ensureRepo(repoUrl: string): Promise<{ dir: string; repoId: string }> {
  const repoId = deriveRepoId(repoUrl);
  const dir = join(config.CACHE_DIR, repoId);

  if (existsSync(join(dir, ".git"))) {
    await git.fetch({ fs, http, dir });
    // TODO: fast-forward the working tree to FETCH_HEAD after fetch.
  } else {
    await mkdir(dir, { recursive: true });
    await git.clone({ fs, http, dir, url: repoUrl, singleBranch: true });
  }

  return { dir, repoId };
}

/** Returns the full SHA-1 hash of HEAD in the given repo directory. */
export async function resolveHead(dir: string): Promise<string> {
  return git.resolveRef({ fs, dir, ref: "HEAD" });
}
