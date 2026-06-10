import type { RobotsConfig } from "./types";

export function generateRobots(
  config: RobotsConfig,
  sitemapUrl: string
) {
  let lines: string[] = [];

  lines.push(
    `User-agent: ${
      config.userAgent || "*"
    }`
  );

  for (let item of config.allow || []) {
    lines.push(`Allow: ${item}`);
  }

  for (let item of config.disallow || []) {
    lines.push(`Disallow: ${item}`);
  }

  lines.push("");
  lines.push(`Sitemap: ${sitemapUrl}`);

  return lines.join("\n");
}