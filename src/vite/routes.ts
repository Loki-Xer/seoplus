import fs from "node:fs";
import path from "node:path";

import type { RouteEntry } from "./types";

export function discoverRoutes(): RouteEntry[] {
  let candidates = [
    "src/pages",
    "src/routes"
  ];

  let routes: RouteEntry[] = [];

  for (let dir of candidates) {
    if (!fs.existsSync(dir)) continue;

    scan(dir, "", routes);
  }

  return routes;
}

function scan(
  dir: string,
  prefix: string,
  routes: RouteEntry[]
): void {
  let files = fs.readdirSync(dir);

  for (let file of files) {
    let full = path.join(dir, file);

    if (fs.statSync(full).isDirectory()) {
      scan(
        full,
        `${prefix}/${file}`,
        routes
      );

      continue;
    }

    if (!/\.(tsx|jsx|ts|js)$/.test(file)) {
      continue;
    }

    let name = file.replace(
      /\.(tsx|jsx|ts|js)$/,
      ""
    );

    if (name === "index") {
      routes.push({
        path: prefix || "/"
      });

      continue;
    }

    routes.push({
      path: `${prefix}/${name}`
    });
  }
}