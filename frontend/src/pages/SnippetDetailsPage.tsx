/**
 * pages/SnippetDetailsPage.tsx
 *
 * Page for displaying an entire snippet
 *
 * If the owner of the snippet is logged in, they can edit with modals at URL/edit/<section>
 *
 *
 */
import { AuthContext } from "@context/AuthContext";
import { SnippetsContext } from "@context/SnippetsContext";
import { useContext } from "react";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";

function OwnerButtons() {
  return (
    <>
      <Button variant="warning">Edit</Button>
      <Button variant="danger">Delete</Button>
    </>
  );
}

function SnippetDetailsPage() {
  const { title } = useParams();
  if (!title) {
    throw new Error("[SnippetDetails.tsx] - No params");
  }

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("Failed to get auth context");
  }
  const currentUser = authContext.currentUser;
  const userLoading = authContext.userLoading;

  // Get snippets
  const snippetsContext = useContext(SnippetsContext);
  if (!snippetsContext) {
    throw new Error("[SnippetDetails.tsx] - Failed to get snippets context");
  }
  const snippets = snippetsContext.snippets;
  const snippetsLoading = snippetsContext.snippetsLoading;
  if (snippetsLoading || userLoading) {
    return <h1>LOADING</h1>;
  }
  const snippet = snippets.find((snippet) => {
    return snippet.title.toLowerCase() === title.toLowerCase();
  });
  if (!snippet) {
    throw new Error(
      "[SnippetDetails.tsx] - Couldn't find snippet with given title",
    );
  }
  return (
    <>
      <h1>
        {snippet.title} Details Page by {snippet.owner.username}
      </h1>
      <h2>{snippet.language}</h2>
      <h3>{snippet.description}</h3>
      <code>{snippet.code}</code>
      <h4>Created: {new Date(snippet.creation_date).toLocaleTimeString()}</h4>
      <h4>
        Last Updated: {new Date(snippet.creation_date).toLocaleTimeString()}
      </h4>
      {currentUser &&
        snippet.owner.username.toLowerCase() ===
          currentUser.username.toLowerCase() && <OwnerButtons />}
    </>
  );
}

export default SnippetDetailsPage;
