export interface OpenGraphProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  locale?: string;
}

export function createOpenGraphMeta(
  props: OpenGraphProps = {}
) {
  let meta: Record<string, string> = {};

  if (props.title) meta.title = props.title;
  if (props.description) meta.description = props.description;
  if (props.image) meta.image = props.image;
  if (props.url) meta.url = props.url;
  if (props.type) meta.type = props.type;
  if (props.siteName) meta.site_name = props.siteName;
  if (props.locale) meta.locale = props.locale;

  return meta;
}