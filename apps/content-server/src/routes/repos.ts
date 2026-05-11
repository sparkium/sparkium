import { Elysia } from "elysia";
import { join } from "node:path";
import { config } from "../config.js";
import { listCourses, readCourse, listModules, readModule, listMaterials, readMaterial } from "../git/reader.js";

/**
 * Resolves the local cache directory for a given repoId.
 * The directory may not exist if the repo has never been synced via POST /sync/plan.
 */
function repoCacheDir(repoId: string): string {
  return join(config.CACHE_DIR, repoId);
}

export const reposRoutes = new Elysia()
  // --- Courses ---
  .get("/repos/:repoId/courses", async ({ params }) => {
    const dir = repoCacheDir(params.repoId);
    return listCourses(dir, config.CONTENT_ROOT);
  })
  .get("/repos/:repoId/courses/:course", async ({ params, set }) => {
    const dir = repoCacheDir(params.repoId);
    const entry = await readCourse(dir, config.CONTENT_ROOT, params.course);
    if (!entry) {
      set.status = 404;
      return { message: "Course not found." };
    }
    return entry;
  })

  // --- Modules ---
  .get("/repos/:repoId/courses/:course/modules", async ({ params }) => {
    const dir = repoCacheDir(params.repoId);
    return listModules(dir, config.CONTENT_ROOT, params.course);
  })
  .get("/repos/:repoId/courses/:course/modules/:module", async ({ params, set }) => {
    const dir = repoCacheDir(params.repoId);
    const entry = await readModule(dir, config.CONTENT_ROOT, params.course, params.module);
    if (!entry) {
      set.status = 404;
      return { message: "Module not found." };
    }
    return entry;
  })

  // --- Materials ---
  .get("/repos/:repoId/courses/:course/modules/:module/materials", async ({ params }) => {
    const dir = repoCacheDir(params.repoId);
    return listMaterials(dir, config.CONTENT_ROOT, params.course, params.module);
  })
  .get("/repos/:repoId/courses/:course/modules/:module/materials/:material", async ({ params, set }) => {
    const dir = repoCacheDir(params.repoId);
    const entry = await readMaterial(dir, config.CONTENT_ROOT, params.course, params.module, params.material);
    if (!entry) {
      set.status = 404;
      return { message: "Material not found." };
    }
    return entry;
  });
