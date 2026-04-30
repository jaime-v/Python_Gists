/**
 * SnippetsContext.tsx
 *
 * Context for snippets so we can pass it around the app without prop drilling
 */
import { createContext } from "react";
import type { SnippetsContextType } from "@models";
export const SnippetsContext = createContext<SnippetsContextType | null>(null);
