/**
 * SnippetsHeader.tsx
 *
 * Header for the SnippetsPage
 *
 * Used for interacting with display settings such as searching, sorting, filtering all snippets
 */

import { Form } from "react-bootstrap";
import type { DisplayOptionsAction } from "@models";

function SnippetsHeader({
  displayDispatch,
}: {
  displayDispatch: React.ActionDispatch<[action: DisplayOptionsAction]>;
}) {
  return (
    <header>
      <Form>
        {/* Search Bar - Filters by typing*/}
        <Form.Group controlId="snippetHeaderSearchFilter">
          <Form.Label>Search</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by title..."
            onChange={(e) => {
              e.preventDefault();
              displayDispatch({ type: "SET_SEARCH", payload: e.target.value });
            }}
          />
        </Form.Group>

        {/* Language Filter - Filters by language */}
        <Form.Group controlId="snippetHeaderLanguageFilter">
          <Form.Label>Language</Form.Label>
          <Form.Select
            onChange={(e) => {
              e.preventDefault();
              displayDispatch({
                type: "SET_LANGUAGE",
                payload: e.target.value,
              });
            }}
          >
            <option value={"All"}>All</option>
            <option value={"Python"}>Python</option>
            <option value={"C++"}>C++</option>
            <option value={"Java"}>Java</option>
            <option value={"TypeScript/JavaScript"}>
              TypeScript/JavaScript
            </option>
          </Form.Select>
        </Form.Group>

        {/* Sorting Option - Sort by newest or oldest */}
        <Form.Group controlId="snippetHeaderSortOption">
          <Form.Label>Sort Order</Form.Label>
          <Form.Select
            onChange={(e) => {
              e.preventDefault();
              displayDispatch({
                type: "SET_SORT",
                payload: e.target.value,
              });
            }}
          >
            <option value={"Newest"}>Newest</option>
            <option value={"Oldest"}>Oldest</option>
            <option value={"Most Recently Updated"}>
              Most Recently Updated
            </option>
            <option value={"Least Recently Updated"}>
              Least Recently Updated
            </option>
          </Form.Select>
        </Form.Group>

        {/* Display Option - Display as bootstrap cards in a grid, or bootstrap accordion items */}
        <Form.Group controlId="snippetHeaderDisplayOption">
          <Form.Label>Display Option</Form.Label>
          <Form.Select
            onChange={(e) => {
              e.preventDefault();
              displayDispatch({ type: "SET_DISPLAY", payload: e.target.value });
            }}
          >
            <option value={"grid"}>Grid</option>
            <option value={"list"}>List</option>
          </Form.Select>
        </Form.Group>
      </Form>
    </header>
  );
}
export default SnippetsHeader;
