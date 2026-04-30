/**
 * useFetchSnippets.tsx
 *
 * Custom hook for fetching snippets on startup
 */

import type { Snippet } from "@models";
import { useEffect, useState } from "react";

function useFetchSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Read snippets from API
  useEffect(() => {
    async function readSnippets() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/snippets", {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch snippets from API");
        }
        const data: Snippet[] = await response.json();
        setSnippets(data);
      } catch (error) {
        const e = error as Error;
        console.error(e);
      }
    }
    readSnippets();
  }, []);

  return { snippets, setSnippets, loading, setLoading };
}

export default useFetchSnippets;
