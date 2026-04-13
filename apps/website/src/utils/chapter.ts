import type { StarlightRouteData } from "@astrojs/starlight/route-data";

type SidebarEntry = StarlightRouteData["sidebar"][number];
type SidebarLink = Extract<SidebarEntry, { type: "link" }>;

function findCurrentLink(entries: SidebarEntry[]): SidebarLink | null {
  for (const entry of entries) {
    if (entry.type === "link" && entry.isCurrent) return entry;
    if (entry.type === "group") {
      const found = findCurrentLink(entry.entries);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Returns the chapter order number for the current page when it belongs to a
 * sidebar group configured with `attrs: { "data-chapter-group": true }`.
 * The number is taken from `sidebar.order` in the page's frontmatter.
 * Returns `undefined` for pages outside a chapter group.
 */
export function getChapterOrder(starlightRoute: StarlightRouteData): number | undefined {
  const currentLink = findCurrentLink(starlightRoute.sidebar);
  if (!(currentLink?.attrs as Record<string, unknown>)?.["data-chapter-group"]) return undefined;
  return (starlightRoute.entry.data as { sidebar?: { order?: number } }).sidebar?.order;
}
