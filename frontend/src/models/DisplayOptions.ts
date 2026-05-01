/**
 * DisplayOptions.ts
 *
 * Sorting and display options as well as the reducer state and action types
 */
export type SortingOption = 1 | -1;
export type DisplayOption = "grid" | "list";

export type DisplayOptionsState = {
  searchFilter: string;
  languageFilter: string;
  sortOption: string;
  displayOption: string;
};

export type DisplayOptionsAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_LANGUAGE"; payload: string }
  | { type: "SET_SORT"; payload: string }
  | { type: "SET_DISPLAY"; payload: string };
