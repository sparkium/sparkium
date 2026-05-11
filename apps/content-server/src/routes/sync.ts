import { Elysia, t } from "elysia";
import { ensureRepo, resolveHead } from "../git/client.js";
import { computeSyncTasks } from "../git/diff.js";
import { config } from "../config.js";

const SyncPlanBody = t.Object({
  repoUrl: t.String({ description: "Git remote URL of the content repository." }),
  lastCommit: t.Nullable(
    t.String({
      description: "Full SHA-1 commit hash of the last successful sync. Pass null for an initial full sync.",
    }),
  ),
});

const SyncTask = t.Object({
  op: t.Union([t.Literal("upsert"), t.Literal("delete")]),
  type: t.Union([t.Literal("course"), t.Literal("module"), t.Literal("material")]),
  path: t.String({ description: "Content path relative to CONTENT_ROOT." }),
  url: t.Nullable(t.String({ description: "Ready-to-call endpoint URL, or null for delete tasks." })),
});

const SyncPlanResponse = t.Object({
  repoId: t.String({ description: "Stable identifier for this repo. Store alongside lastCommit." }),
  headCommit: t.String({ description: "SHA-1 of HEAD after sync. Use as lastCommit in the next call." }),
  tasks: t.Array(SyncTask),
});

export const syncRoutes = new Elysia().post(
  "/sync/plan",
  async ({ body }) => {
    const { repoUrl, lastCommit } = body;
    const { dir, repoId } = await ensureRepo(repoUrl);
    const headCommit = await resolveHead(dir);
    const tasks = await computeSyncTasks(dir, repoId, config.CONTENT_ROOT, lastCommit, headCommit);
    return { repoId, headCommit, tasks };
  },
  {
    body: SyncPlanBody,
    response: SyncPlanResponse,
  },
);
