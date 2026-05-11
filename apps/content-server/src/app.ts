import { Elysia } from "elysia";
import { syncRoutes } from "./routes/sync.js";
import { reposRoutes } from "./routes/repos.js";

export const app = new Elysia()
  .get("/health", () => ({ status: "ok" }))
  .use(syncRoutes)
  .use(reposRoutes);
