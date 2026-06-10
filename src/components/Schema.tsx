import { useEffect, useRef } from "react";
import { schemaGenerator } from "../utils/schemaGenerator";

export interface SchemaProps {
  type?: string;
  data: Record<string, any>;
}

export function Schema({
  type,
  data
}: SchemaProps) {
  let scriptRef = useRef<HTMLScriptElement | null>(
    null
  );

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    let script =
      scriptRef.current ??
      document.createElement("script");

    script.type = "application/ld+json";

    script.textContent = JSON.stringify(
      schemaGenerator(type, data)
    );

    if (!scriptRef.current) {
      document.head.appendChild(script);
      scriptRef.current = script;
    }

    return () => {
      script.remove();
    };
  }, [type, data]);

  return null;
}