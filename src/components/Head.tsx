import { useEffect, useRef } from "react";

import manager from "../utils/manager";
import { useSEOContext } from "../context/SEOProvider";
import { createOpenGraphMeta } from "./OpenGraph";
import { createTwitterMeta } from "./TwitterCard";

export interface HeadProps {
  title?: string;
  description?: string;

  keywords?: string[];

  author?: string;
  robots?: string;

  canonical?: string;

  image?: string;

  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    siteName?: string;
    locale?: string;
  };

  twitter?: {
    card?: string;
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    image?: string;
  };
}

export function Head(props: HeadProps) {
  let defaults = useSEOContext();

  let entryId = useRef<number | null>(null);

  useEffect(() => {
    let title = props.title;

    if (title && defaults.titleSuffix) {
      title = `${title}${defaults.titleSuffix}`;
    }

    let openGraph = createOpenGraphMeta({
      title,
      description: props.description,
      image:
        props.openGraph?.image ||
        props.image ||
        defaults.defaultImage,
      url: props.canonical,
      locale: defaults.locale,
      ...props.openGraph
    });

    let twitter = createTwitterMeta({
      title,
      description: props.description,
      card: "summary_large_image",
      image:
        props.twitter?.image ||
        props.image ||
        defaults.defaultImage,
      ...props.twitter
    });

    let data = {
      title,
      description:
        props.description ??
        defaults.description,

      keywords: props.keywords?.join(", "),

      author: props.author,
      robots:
        props.robots ??
        defaults.robots,

      canonical:
        props.canonical ??
        defaults.canonical,

      og: openGraph,
      twitter
    };

    if (entryId.current === null) {
      entryId.current = manager.register(data);
    } else {
      manager.update(entryId.current, data);
    }

    return () => {
      if (entryId.current !== null) {
        manager.unregister(entryId.current);
      }
    };
  }, [
    props.title,
    props.description,
    props.author,
    props.robots,
    props.canonical,
    props.image,
    props.keywords,
    props.openGraph,
    props.twitter,
    defaults
  ]);

  return null;
}

export default Head;