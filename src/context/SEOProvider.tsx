import React, {
  createContext,
  useContext,
  ReactNode
} from "react";

export interface SEOConfig {
  title?: string;
  titleSuffix?: string;
  description?: string;
  locale?: string;
  canonical?: string;
  defaultImage?: string;
  robots?: string;
}

let SEOContext = createContext<SEOConfig>({});

export function SEOProvider({
  children,
  defaults = {}
}: {
  children: ReactNode;
  defaults?: SEOConfig;
}) {
  let parent = useContext(SEOContext);

  let value = {
    ...parent,
    ...defaults
  };

  return (
    <SEOContext.Provider value={value}>
      {children}
    </SEOContext.Provider>
  );
}

export function useSEOContext() {
  return useContext(SEOContext);
}