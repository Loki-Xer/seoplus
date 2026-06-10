import fs from "node:fs";
import path from "node:path";

import type { Plugin } from "vite";

import type {
  NodeSEOPluginOptions,
  RouteEntry
} from "./types";

import { discoverRoutes } from "./routes";
import { generateSitemap } from "./sitemap";
import { generateRobots } from "./robots";

export default function seo(
  options: NodeSEOPluginOptions
): Plugin {
  return {
    name: "node-seo",

    closeBundle() {
      let routes: RouteEntry[] =
        options.routes ??
        discoverRoutes();

      routes = routes.filter(
        (route: RouteEntry) =>
          !route.path.includes(":")
      );

      if (options.sitemap !== false) {
        let sitemap = generateSitemap(
          options.baseUrl,
          routes
        );

        fs.writeFileSync(
          path.resolve(
            process.cwd(),
            "dist/sitemap.xml"
          ),
          sitemap,
          "utf8"
        );
      }

      let robots = generateRobots(
        options.robots || {},
        `${options.baseUrl.replace(/\/$/, "")}/sitemap.xml`
      );

      fs.writeFileSync(
        path.resolve(
          process.cwd(),
          "dist/robots.txt"
        ),
        robots,
        "utf8"
      );

      console.log(
        "✓ node-seo generated sitemap.xml and robots.txt"
      );
    }
  };
}