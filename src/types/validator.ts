export interface SEOValidationResult {
  score: number;
  passed: number;
  total: number;

  warnings: string[];

  checks: {
    title: boolean;
    description: boolean;
    canonical: boolean;
    ogImage: boolean;
    ogTitle: boolean;
    twitterCard: boolean;
    schema: boolean;
  };
}