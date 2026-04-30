import type { UserPrivate } from "./User";
// Base for Snippet Types
type SnippetBase = {
  title: string;
  language: string;
  description: string;
  code: string;
};

// Define the object for Snippets, these will be displayed on the frontend
export type Snippet = SnippetBase & {
  id: number;
  owner: UserPrivate;
  creation_date: Date;
  last_updated_date: Date;
};

// Separate type for SnippetCreate, but nothing here for now since it's basically the same as the base
export type SnippetCreate = SnippetBase & {};

// Snippets context, we need to pass snippets around and have the ability to modify it
// Also need to manage a loading state when we are fetching
export type SnippetsContextType = {
  snippets: Snippet[];
  setSnippets: React.Dispatch<React.SetStateAction<Snippet[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
