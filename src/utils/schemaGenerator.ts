export function schemaGenerator(
  type?: string,
  data: Record<string, any> = {}
) {
  if (!type) {
    return data;
  }

  return {
    "@context": "https://schema.org",
    "@type": type,
    ...data
  };
}