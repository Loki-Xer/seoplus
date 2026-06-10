import { useCallback } from "react";
import manager from "../utils/manager";
import { useSEOContext } from "../context/SEOProvider";

export function useSEO() {
  let defaults = useSEOContext();

  let set = useCallback((data: any) => {
    manager.set({
      ...defaults,
      ...data
    });
  }, [defaults]);

  let setTitle = useCallback((title: string) => {
  let finalTitle = defaults.titleSuffix
    ? `${title}${defaults.titleSuffix}`
    : title;

  manager.set({
    ...defaults,
    title: finalTitle
  });
}, [defaults]);

  let setDescription = useCallback((description: string) => {
    manager.set({
      ...defaults,
      description
    });
  }, [defaults]);

  let reset = useCallback(() => {
    manager.reset();
  }, []);

  return {
    state: manager.get(),

    set,
    setTitle,
    setDescription,
    reset,

    get: () => manager.get()
  };
}