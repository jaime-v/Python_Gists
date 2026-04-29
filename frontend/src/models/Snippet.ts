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
