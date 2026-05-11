/**
 * pages/SnippetsPage.tsx
 *
 * Page responsible for displaying all snippet previews, searching/filtering/sorting them, and possibly going to
 * a snippet's details page
 */

import { SnippetsHeader, SnippetsMain } from "@components";
import { useReducer } from "react";
import type { DisplayOptionsState, DisplayOptionsAction } from "@models";
import { Container } from "react-bootstrap";

const initialDisplayState: DisplayOptionsState = {
  searchFilter: "",
  languageFilter: "All",
  sortOption: "Newest",
  displayOption: "grid",
};

function displayReducer(
  state: DisplayOptionsState,
  action: DisplayOptionsAction,
) {
  // I feel like this is inefficient
  const { type, payload } = action;
  switch (type) {
    case "SET_SEARCH":
      return { ...state, searchFilter: payload };
    case "SET_LANGUAGE":
      return { ...state, languageFilter: payload };
    case "SET_SORT":
      return { ...state, sortOption: payload };
    case "SET_DISPLAY":
      return { ...state, displayOption: payload };
    default:
      return state;
  }
}

function SnippetsPage() {
  const [displayState, displayDispatch] = useReducer(
    displayReducer,
    initialDisplayState,
  );
  return (
    <>
      <h1>Snippets Library</h1>
      <Container fluid>
        <SnippetsHeader displayDispatch={displayDispatch} />
      </Container>
      <Container>
        <SnippetsMain displayState={displayState} />
      </Container>
    </>
  );
}

export default SnippetsPage;
