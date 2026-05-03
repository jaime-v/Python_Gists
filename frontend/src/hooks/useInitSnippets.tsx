/**
 * hooks/useInitSnippets.tsx
 *
 * Custom hook for fetching snippets on startup
 */

import type { Snippet } from "@models";
import { getSnippets } from "@services";
import { useEffect, useState } from "react";

function useInitSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Read snippets from API on mount
  useEffect(() => {
    async function initSnippets() {
      try {
        const foundSnippets = await getSnippets();
        setSnippets(foundSnippets);
      } catch (error) {
        // On init error, just set snippets to empty
        const e = error as Error;
        console.error(e);
        setSnippets([]);
      } finally {
        setLoading(false);
      }
    }
    initSnippets();
  }, []);

  return { snippets, setSnippets, loading, setLoading };
}

export default useInitSnippets;
