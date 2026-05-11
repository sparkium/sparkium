import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { Value } from "@sinclair/typebox/value";
import { CourseSchema, ModuleSchema, MaterialSchema, type Course, type Module, type Material } from "@sparkium/types";

export interface CourseEntry {
  /** Content path relative to CONTENT_ROOT, e.g. "bonfire". */
  id: string;
  data: Course;
}

export interface ModuleEntry {
  /** Full content path, e.g. "bonfire/01_packing_the_essentials". */
  id: string;
  courseId: string;
  data: Module;
}

export interface MaterialEntry {
  /** Full content path, e.g. "bonfire/01_packing_the_essentials/01_introduction". */
  id: string;
  courseId: string;
  moduleId: string;
  data: Material;
}

/** Parses and validates a JSON file against a TypeBox schema. Returns null on failure. */
async function parseManifest<T>(filePath: string, schema: Parameters<typeof Value.Check>[0]): Promise<T | null> {
  try {
    const raw = await readFile(filePath, "utf-8");
    const json: unknown = JSON.parse(raw);
    if (!Value.Check(schema, json)) return null;
    return json as T;
  } catch {
    return null;
  }
}

/** Reads a single course manifest from the cache. */
export async function readCourse(
  cacheDir: string,
  contentRoot: string,
  courseName: string,
): Promise<CourseEntry | null> {
  const dir = join(cacheDir, contentRoot === "." ? "" : contentRoot, courseName);
  const data = await parseManifest<Course>(join(dir, "course.json"), CourseSchema);
  if (!data) return null;
  return { id: courseName, data };
}

/** Lists all course manifests found directly under CONTENT_ROOT. */
export async function listCourses(cacheDir: string, contentRoot: string): Promise<CourseEntry[]> {
  const root = join(cacheDir, contentRoot === "." ? "" : contentRoot);
  let entries: string[];
  try {
    entries = await readdir(root);
  } catch {
    return [];
  }

  const results = await Promise.all(entries.map((name) => readCourse(cacheDir, contentRoot, name)));
  return results.filter((e): e is CourseEntry => e !== null);
}

/** Reads a single module manifest. */
export async function readModule(
  cacheDir: string,
  contentRoot: string,
  courseName: string,
  moduleName: string,
): Promise<ModuleEntry | null> {
  const dir = join(cacheDir, contentRoot === "." ? "" : contentRoot, courseName, moduleName);
  const data = await parseManifest<Module>(join(dir, "module.json"), ModuleSchema);
  if (!data) return null;
  return {
    id: `${courseName}/${moduleName}`,
    courseId: courseName,
    data,
  };
}

/** Lists all module manifests under a given course. */
export async function listModules(cacheDir: string, contentRoot: string, courseName: string): Promise<ModuleEntry[]> {
  const courseDir = join(cacheDir, contentRoot === "." ? "" : contentRoot, courseName);
  let entries: string[];
  try {
    entries = await readdir(courseDir);
  } catch {
    return [];
  }

  const results = await Promise.all(entries.map((name) => readModule(cacheDir, contentRoot, courseName, name)));
  return results.filter((e): e is ModuleEntry => e !== null);
}

/** Reads a single material manifest. */
export async function readMaterial(
  cacheDir: string,
  contentRoot: string,
  courseName: string,
  moduleName: string,
  materialName: string,
): Promise<MaterialEntry | null> {
  const dir = join(cacheDir, contentRoot === "." ? "" : contentRoot, courseName, moduleName, materialName);
  const data = await parseManifest<Material>(join(dir, "material.json"), MaterialSchema);
  if (!data) return null;
  return {
    id: `${courseName}/${moduleName}/${materialName}`,
    courseId: courseName,
    moduleId: `${courseName}/${moduleName}`,
    data,
  };
}

/** Lists all material manifests under a given module. */
export async function listMaterials(
  cacheDir: string,
  contentRoot: string,
  courseName: string,
  moduleName: string,
): Promise<MaterialEntry[]> {
  const moduleDir = join(cacheDir, contentRoot === "." ? "" : contentRoot, courseName, moduleName);
  let entries: string[];
  try {
    entries = await readdir(moduleDir);
  } catch {
    return [];
  }

  const results = await Promise.all(
    entries.map((name) => readMaterial(cacheDir, contentRoot, courseName, moduleName, name)),
  );
  return results.filter((e): e is MaterialEntry => e !== null);
}
