import fs from "node:fs";
import git, { TREE } from "isomorphic-git";

export type ResourceType = "course" | "module" | "material";
export type SyncOp = "upsert" | "delete";

export interface SyncTask {
  op: SyncOp;
  type: ResourceType;
  /** Content path relative to CONTENT_ROOT, e.g. "bonfire/01_packing_the_essentials/01_introduction". */
  path: string;
  /** Ready-to-call endpoint URL, or null for delete operations. */
  url: string | null;
}

const MANIFEST_TO_TYPE: Record<string, ResourceType> = {
  "course.json": "course",
  "module.json": "module",
  "material.json": "material",
};

/**
 * Builds the REST URL for a content resource given its type and content path.
 * The content path is relative to CONTENT_ROOT and uses "/" as separator.
 *
 * Depth conventions (segments in path):
 *   1 segment  → course    (e.g. "bonfire")
 *   2 segments → module    (e.g. "bonfire/01_packing_the_essentials")
 *   3 segments → material  (e.g. "bonfire/01_packing_the_essentials/01_introduction")
 */
export function buildResourceUrl(repoId: string, type: ResourceType, contentPath: string): string {
  const parts = contentPath.split("/");
  const base = `/repos/${repoId}`;
  switch (type) {
    case "course":
      return `${base}/courses/${parts[0]}`;
    case "module":
      return `${base}/courses/${parts[0]}/modules/${parts[1]}`;
    case "material":
      return `${base}/courses/${parts[0]}/modules/${parts[1]}/materials/${parts[2]}`;
  }
}

/**
 * Computes the list of sync tasks between two commits.
 *
 * - When `fromCommit` is null (first sync), returns all manifest files under
 *   `contentRoot` at `toCommit` as "upsert" tasks.
 * - Otherwise, diffs `fromCommit..toCommit` and emits "upsert" for added/modified
 *   files and "delete" for removed files.
 *
 * Only files named course.json, module.json, or material.json are included.
 */
export async function computeSyncTasks(
  dir: string,
  repoId: string,
  contentRoot: string,
  fromCommit: string | null,
  toCommit: string,
): Promise<SyncTask[]> {
  const tasks: SyncTask[] = [];

  if (fromCommit === null) {
    // Full sync: walk the tree at toCommit and emit every manifest as upsert.
    await git.walk({
      fs,
      dir,
      trees: [TREE({ ref: toCommit })],
      map: async (filepath, [entry]) => {
        if (!entry || (await entry.type()) !== "blob") return;

        const filename = filepath.split("/").at(-1) ?? "";
        const resourceType = MANIFEST_TO_TYPE[filename];
        if (!resourceType) return;

        // Strip the contentRoot prefix (if any) to get the relative content path.
        const rel = stripPrefix(filepath, contentRoot);
        if (rel === null) return;

        // The content path is the directory containing the manifest.
        const contentPath = rel.split("/").slice(0, -1).join("/");
        if (!contentPath) return;

        tasks.push({
          op: "upsert",
          type: resourceType,
          path: contentPath,
          url: buildResourceUrl(repoId, resourceType, contentPath),
        });
      },
    });
    return tasks;
  }

  // Incremental sync: diff fromCommit..toCommit.
  await git.walk({
    fs,
    dir,
    trees: [TREE({ ref: fromCommit }), TREE({ ref: toCommit })],
    map: async (filepath, [before, after]) => {
      const filename = filepath.split("/").at(-1) ?? "";
      const resourceType = MANIFEST_TO_TYPE[filename];
      if (!resourceType) return;

      const rel = stripPrefix(filepath, contentRoot);
      if (rel === null) return;

      const contentPath = rel.split("/").slice(0, -1).join("/");
      if (!contentPath) return;

      const beforeOid = before ? await before.oid() : null;
      const afterOid = after ? await after.oid() : null;

      if (beforeOid === afterOid) return; // unchanged

      if (afterOid === null) {
        tasks.push({ op: "delete", type: resourceType, path: contentPath, url: null });
      } else {
        tasks.push({
          op: "upsert",
          type: resourceType,
          path: contentPath,
          url: buildResourceUrl(repoId, resourceType, contentPath),
        });
      }
    },
  });

  return tasks;
}

/**
 * Strips the contentRoot prefix from a filepath and returns the remainder,
 * or null if the filepath is not under contentRoot.
 */
function stripPrefix(filepath: string, contentRoot: string): string | null {
  if (contentRoot === ".") return filepath;
  const prefix = contentRoot.endsWith("/") ? contentRoot : `${contentRoot}/`;
  return filepath.startsWith(prefix) ? filepath.slice(prefix.length) : null;
}
