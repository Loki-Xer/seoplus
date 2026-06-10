# node-seo

Modern SEO toolkit for React and Vite applications.

node-seo gives you a complete, production-ready layer for managing metadata — from document titles and Open Graph tags to JSON-LD schemas, sitemaps, and robots.txt generation. Built on a centralized SEO Manager with provider inheritance, automatic tag deduplication, and route-aware state restoration.

```bash
npm install node-seo
```

**Peer dependencies**

```bash
npm install react react-dom
```

---

## Features

- Document title, description, keywords, author, robots, canonical
- Open Graph tags — auto-generated from `<Head />`
- Twitter Cards — auto-generated from `<Head />`
- JSON-LD structured data via `<Schema />`
- Provider-based global defaults with nested inheritance
- Imperative control via `useSEO()` hook
- Automatic metadata restoration on unmount
- Sitemap and robots.txt generation (Vite plugin)
- SSR-safe — all DOM operations are guarded
- Full TypeScript support
- ESM + CommonJS builds

---

## Quick Start

```tsx
import { Head } from "node-seo";

export default function Home() {
  return (
    <>
      <Head
        title="Home"
        description="Welcome to my website"
        canonical="https://example.com"
      />
      <h1>Hello World</h1>
    </>
  );
}
```

---

## SEOProvider

Wrap your app with `SEOProvider` to define global defaults. Every `<Head />` and `useSEO()` call inherits these automatically.

```tsx
import { SEOProvider } from "node-seo";

function App() {
  return (
    <SEOProvider
      defaults={{
        titleSuffix: " | My Website",
        locale: "en_US",
        defaultImage: "/banner.png",
      }}
    >
      <Routes />
    </SEOProvider>
  );
}
```

### Nested Providers

Providers merge with their parent — child values take precedence, unset values fall through.

```tsx
<SEOProvider defaults={{ titleSuffix: " | Site" }}>
  <SEOProvider defaults={{ locale: "en_GB" }}>
    <Blog />
    {/* Resolved: { titleSuffix: " | Site", locale: "en_GB" } */}
  </SEOProvider>
</SEOProvider>
```

---

## Head Component

The primary interface for per-page SEO. Mount it anywhere in your component tree — typically at the top of each page or route.

```tsx
import { Head } from "node-seo";

<Head
  title="Blog"
  description="Latest articles from our team"
  keywords={["react", "seo", "vite"]}
  canonical="https://example.com/blog"
  image="/cover.png"
  author="Jane Doe"
  robots="index, follow"
/>
```

Open Graph and Twitter Card tags are generated automatically from the props above. You can also override them directly:

```tsx
<Head
  title="Blog"
  description="Latest articles"
  image="/cover.png"
  openGraph={{
    type: "article",
    siteName: "My Blog",
  }}
  twitter={{
    card: "summary",
    site: "@myblog",
  }}
/>
```

### Supported Props

| Prop          | Type       | Description                                  |
| ------------- | ---------- | -------------------------------------------- |
| `title`       | `string`   | Document title (appends `titleSuffix` from provider) |
| `description` | `string`   | Meta description                             |
| `keywords`    | `string[]` | Joined as a comma-separated meta tag         |
| `author`      | `string`   | Meta author                                  |
| `robots`      | `string`   | Robots directive (e.g. `"index, follow"`)    |
| `canonical`   | `string`   | Canonical URL                                |
| `image`       | `string`   | Sets `og:image` and `twitter:image`          |
| `openGraph`   | `object`   | Open Graph overrides                         |
| `twitter`     | `object`   | Twitter Card overrides                       |
| `favicon`     | `string`   | Path to favicon                              |
| `themeColor`  | `string`   | `<meta name="theme-color">`                  |
| `lang`        | `string`   | Sets `<html lang="...">`                     |

---

## Generated Meta Tags

### Open Graph

```html
<meta property="og:title" content="Blog" />
<meta property="og:description" content="Latest articles" />
<meta property="og:image" content="https://example.com/cover.png" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="en_US" />
```

### Twitter Card

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Blog" />
<meta name="twitter:description" content="Latest articles" />
<meta name="twitter:image" content="https://example.com/cover.png" />
```

Default card type is `summary_large_image`.

---

## Schema Component

Inject JSON-LD structured data. Each `<Schema />` renders its own `<script type="application/ld+json">` tag — you can use multiple on one page.

```tsx
import { Schema } from "node-seo";

<Schema
  type="Organization"
  data={{
    name: "Acme Corp",
    url: "https://example.com",
  }}
/>
```

Generated output:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Acme Corp",
  "url": "https://example.com"
}
```

### Supported Schema Types

| Type             | Description                          |
| ---------------- | ------------------------------------ |
| `Organization`   | Company or brand                     |
| `Article`        | Blog post or news article            |
| `Product`        | E-commerce product                   |
| `Person`         | Author or individual                 |
| `WebSite`        | Site-level identity and search       |
| `FAQPage`        | FAQ structured data                  |
| `BreadcrumbList` | Breadcrumb navigation                |
| `Event`          | Scheduled event                      |

### Multiple Schemas

```tsx
<>
  <Schema type="Organization" data={{ name: "Acme Corp" }} />
  <Schema type="WebSite" data={{ name: "Acme", url: "https://example.com" }} />
</>
```

### Raw Schema

Pass any custom JSON-LD by omitting `type`. The `data` object is rendered as-is.

```tsx
<Schema
  data={{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://example.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://example.com/blog" },
    ],
  }}
/>
```

---

## useSEO Hook

For imperative control — useful in effects, async callbacks, or outside of JSX.

```tsx
import { useSEO } from "node-seo";

function Blog() {
  const seo = useSEO();

  useEffect(() => {
    seo.setTitle("Blog");
    seo.setDescription("The latest from our team");
    seo.setCanonical("https://example.com/blog");
  }, []);

  return <div>Blog</div>;
}
```

### Available Methods

| Method                    | Description                              |
| ------------------------- | ---------------------------------------- |
| `seo.setTitle(value)`     | Update document title                    |
| `seo.setDescription(value)` | Update meta description                |
| `seo.setCanonical(url)`   | Set canonical URL                        |
| `seo.setImage(url)`       | Set og:image and twitter:image           |
| `seo.setRobots(value)`    | Update robots directive                  |
| `seo.setSchema(data)`     | Inject a JSON-LD block                   |
| `seo.reset()`             | Restore previous SEO state               |

---

## Vite Plugin

Generate `sitemap.xml` and `robots.txt` automatically at build time.

```ts
// vite.config.ts
import { defineConfig } from "vite";
import seo from "node-seo/vite-plugin";

export default defineConfig({
  plugins: [
    seo({
      baseUrl: "https://example.com",
    }),
  ],
});
```

Both files are written to your build output directory after the bundle is complete.

### Sitemap Generation

```ts
seo({
  baseUrl: "https://example.com",
  routes: [
    { path: "/", priority: 1.0, changefreq: "daily" },
    { path: "/about", priority: 0.8 },
    { path: "/blog", priority: 0.9, changefreq: "weekly" },
  ],
});
```

Output:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <priority>1.0</priority>
    <changefreq>daily</changefreq>
  </url>
  <url>
    <loc>https://example.com/blog</loc>
    <priority>0.9</priority>
    <changefreq>weekly</changefreq>
  </url>
</urlset>
```

### Route Discovery

If no `routes` are provided, the plugin scans your source directory automatically.

```
src/pages/
├── index.tsx     →  /
├── about.tsx     →  /about
└── blog/
    └── index.tsx →  /blog
```

Scanned directories (configurable):

```ts
seo({
  baseUrl: "https://example.com",
  pagesDir: "src/pages", // default
});
```

### robots.txt Generation

```ts
seo({
  baseUrl: "https://example.com",
  robots: {
    allow: ["/"],
    disallow: ["/admin", "/private"],
  },
});
```

Output:

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /private

Sitemap: https://example.com/sitemap.xml
```

### Full Plugin Options

| Option        | Type       | Description                                          |
| ------------- | ---------- | ---------------------------------------------------- |
| `baseUrl`     | `string`   | Required. Base URL prepended to all sitemap entries  |
| `routes`      | `array`    | Explicit route list with optional metadata           |
| `pagesDir`    | `string`   | Directory to scan when `routes` is omitted           |
| `robots`      | `object`   | `allow` and `disallow` arrays for robots.txt         |
| `outDir`      | `string`   | Output directory (defaults to Vite's `build.outDir`) |

---

## SEO Validator

Inspect the current page's SEO health at runtime.

```ts
import { validateSEO } from "node-seo";

const result = validateSEO();

console.log(result);
// {
//   score: 86,
//   passed: false,
//   warnings: ["og:image is missing", "Twitter card not set"]
// }
```

### Checks Performed

| Check              | Points |
| ------------------ | ------ |
| Title exists       | 15     |
| Description exists | 15     |
| Canonical set      | 15     |
| `og:title` set     | 10     |
| `og:image` set     | 15     |
| Twitter card set   | 15     |
| Schema present     | 15     |

Score is 0–100. `passed` is `true` when score is 100 with no warnings.

---

## SSR Safety

All DOM access is guarded behind a `typeof document !== "undefined"` check. This makes node-seo safe to use in:

- React with server-side rendering
- Vite SSR mode
- Static site generation
- Edge runtimes

---

## TypeScript

node-seo ships with full type definitions. All component props, hook return types, schema data shapes, and plugin options are typed.

```tsx
import type { HeadProps, SchemaType, SEODefaults } from "node-seo";
```

---

## License

MIT

---

Built with 🤍 for modern React and Vite application.