import { defineRouteMiddleware } from "@astrojs/starlight/route-data";
import type { StarlightRouteData } from "@astrojs/starlight/route-data";
import { getCollection } from "astro:content";

type SidebarEntry = StarlightRouteData["sidebar"][number];

/**
 * Module-level cache: maps normalized entry id → sidebar.order.
 * Computed once per build/dev session.
 */
let orderMapCache: Map<string, number> | null = null;

async function getOrderMap(): Promise<Map<string, number>> {
  if (orderMapCache) return orderMapCache;

  const docs = await getCollection("docs");
  orderMapCache = new Map();

  for (const doc of docs) {
    const order = (doc.data as { sidebar?: { order?: number } }).sidebar?.order;
    if (order !== undefined) {
      orderMapCache.set(doc.id.replace(/^\/|\/$/g, ""), order);
    }
  }

  return orderMapCache;
}

/** Strip protocol+host from absolute URLs, then strip leading/trailing slashes. */
function normalizeHref(href: string): string {
  return href.replace(/^https?:\/\/[^/]+/, "").replace(/^\/|\/$/g, "");
}

function prependChapterNumbers(entries: SidebarEntry[], map: Map<string, number>): void {
  for (const entry of entries) {
    if (entry.type === "link" && (entry.attrs as Record<string, unknown>)["data-chapter-group"]) {
      const order = map.get(normalizeHref(entry.href));
      if (order !== undefined) {
        entry.label = `${order}. ${entry.label}`;
      }
    } else if (entry.type === "group") {
      prependChapterNumbers(entry.entries, map);
    }
  }
}

/**
 * Route middleware that prepends chapter numbers to sidebar link labels for
 * links in groups configured with `attrs: { "data-chapter-group": true }`.
 * The number comes from each page's `sidebar.order` frontmatter field.
 *
 * Starlight deep-clones the sidebar before passing it to route data,
 * so mutating entries here is safe.
 */
export const onRequest = defineRouteMiddleware(async (context) => {
  const map = await getOrderMap();
  const { sidebar } = context.locals.starlightRoute;
  prependChapterNumbers(sidebar, map);
});
