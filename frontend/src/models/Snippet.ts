/**
 * models/Snippet.ts
 *
 * Types regarding snippets
 */

import type { UserPrivate } from "./User";
// Base for Snippet Types
type SnippetBase = {
  title: string;
  language: string;
  description: string;
  code: string;
};

// Define the object for Snippets, these will be displayed on the frontend (also the response object)
export type Snippet = SnippetBase & {
  id: number;
  owner: UserPrivate;
  creationDate: Date;
  lastUpdatedDate: Date;
};

// Separate type for SnippetCreate, but nothing here for now since it's basically the same as the base
export type SnippetCreate = SnippetBase & {};

export type SnippetUpdate = {
  title?: string;
  language?: string;
  description?: string;
  code?: string;
};

// Snippets context, we need to pass snippets around and have the ability to modify it
// Also need to manage a loading state when we are fetching
export type SnippetsContextType = {
  snippets: Snippet[];
  setSnippets: React.Dispatch<React.SetStateAction<Snippet[]>>;
  snippetsLoading: boolean;
  setSnippetsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
