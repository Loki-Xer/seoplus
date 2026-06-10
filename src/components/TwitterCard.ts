export interface TwitterCardProps {
  card?: string;
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
}

export function createTwitterMeta(
  props: TwitterCardProps = {}
) {
  let meta: Record<string, string> = {};

  if (props.card) meta.card = props.card;
  if (props.site) meta.site = props.site;
  if (props.creator) meta.creator = props.creator;
  if (props.title) meta.title = props.title;
  if (props.description) meta.description = props.description;
  if (props.image) meta.image = props.image;

  return meta;
}