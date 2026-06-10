export interface OrganizationSchema {
  name: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
}

export interface ArticleSchema {
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: {
    name: string;
  };
}

export interface ProductSchema {
  name: string;
  description?: string;
  image?: string;
  sku?: string;
  brand?: {
    name: string;
  };
}

export interface PersonSchema {
  name: string;
  url?: string;
  image?: string;
}

export interface WebsiteSchema {
  name: string;
  url: string;
}