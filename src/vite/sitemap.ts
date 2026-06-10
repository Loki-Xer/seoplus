import type { RouteEntry } from "./types";

export function generateSitemap(
  baseUrl: string,
  routes: RouteEntry[]
) {
  let urls = routes
    .map(route => {
      let loc =
        baseUrl.replace(/\/$/, "") +
        route.path;

      return `
  <url>
    <loc>${loc}</loc>
    <changefreq>${
      route.changefreq || "weekly"
    }</changefreq>
    <priority>${
      route.priority || 0.8
    }</priority>
  </url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}