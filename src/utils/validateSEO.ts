import type { SEOValidationResult } from "../types/validator";

function exists(value?: string | null) {
  return !!value?.trim();
}

function isAbsoluteUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateSEO(): SEOValidationResult {
  if (typeof document === "undefined") {
    return {
      score: 0,
      passed: 0,
      total: 7,
      warnings: [
        "validateSEO() requires a browser environment"
      ],
      checks: {
        title: false,
        description: false,
        canonical: false,
        ogImage: false,
        ogTitle: false,
        twitterCard: false,
        schema: false
      }
    };
  }

  let warnings: string[] = [];

  let title = document.title;

  let description =
    document
      .querySelector(
        'meta[name="description"]'
      )
      ?.getAttribute("content") || "";

  let canonical =
    document
      .querySelector(
        'link[rel="canonical"]'
      )
      ?.getAttribute("href") || "";

  let ogImage =
    document
      .querySelector(
        'meta[property="og:image"]'
      )
      ?.getAttribute("content") || "";

  let ogTitle =
    document
      .querySelector(
        'meta[property="og:title"]'
      )
      ?.getAttribute("content") || "";

  let twitterCard =
    document
      .querySelector(
        'meta[name="twitter:card"]'
      )
      ?.getAttribute("content") || "";

  let schemaCount =
    document.querySelectorAll(
      'script[type="application/ld+json"]'
    ).length;

  let checks = {
    title: false,
    description: false,
    canonical: false,
    ogImage: false,
    ogTitle: false,
    twitterCard: false,
    schema: false
  };

  // TITLE

  if (!exists(title)) {
    warnings.push(
      "Missing page title"
    );
  } else if (title.length > 60) {
    warnings.push(
      "Title exceeds 60 characters"
    );
  } else {
    checks.title = true;
  }

  // DESCRIPTION

  if (!exists(description)) {
    warnings.push(
      "Missing meta description"
    );
  } else if (
    description.length < 120 ||
    description.length > 160
  ) {
    warnings.push(
      "Description should be 120–160 characters"
    );
  } else {
    checks.description = true;
  }

  // CANONICAL

  if (!exists(canonical)) {
    warnings.push(
      "Missing canonical URL"
    );
  } else if (
    !isAbsoluteUrl(canonical)
  ) {
    warnings.push(
      "Canonical URL must be absolute"
    );
  } else {
    checks.canonical = true;
  }

  // OG IMAGE

  if (!exists(ogImage)) {
    warnings.push(
      "Missing Open Graph image"
    );
  } else {
    checks.ogImage = true;
  }

  // OG TITLE

  if (!exists(ogTitle)) {
    warnings.push(
      "Missing Open Graph title"
    );
  } else {
    checks.ogTitle = true;
  }

  // TWITTER CARD

  let validCards = [
    "summary",
    "summary_large_image",
    "app",
    "player"
  ];

  if (
    !exists(twitterCard)
  ) {
    warnings.push(
      "Missing Twitter card"
    );
  } else if (
    !validCards.includes(
      twitterCard
    )
  ) {
    warnings.push(
      "Invalid Twitter card value"
    );
  } else {
    checks.twitterCard = true;
  }

  // SCHEMA

  if (schemaCount === 0) {
    warnings.push(
      "No JSON-LD schema found"
    );
  } else {
    checks.schema = true;
  }

  let passed =
    Object.values(checks)
      .filter(Boolean)
      .length;

  let total = 7;

  let score = Math.round(
    (passed / total) * 100
  );

  return {
    score,
    passed,
    total,
    warnings,
    checks
  };
}