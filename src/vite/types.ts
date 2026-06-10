export interface RouteEntry {
  path: string;
  changefreq?: string;
  priority?: number;
}

export interface RobotsConfig {
  userAgent?: string;
  allow?: string[];
  disallow?: string[];
}

export interface NodeSEOPluginOptions {
  baseUrl: string;

  routes?: RouteEntry[];

  sitemap?: boolean;

  robots?: RobotsConfig;
}