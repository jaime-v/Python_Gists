/**
 * pages/SnippetDetailsPage.tsx
 *
 * Page for displaying an entire snippet
 *
 * If the owner of the snippet is logged in, they can edit with modals at URL/edit/<section>
 *
 *
 */
import { SnippetsContext } from "@context/SnippetsContext";
import { useContext } from "react";
import { useParams } from "react-router-dom";
function SnippetDetailsPage() {
  const { title } = useParams();
  if (!title) {
    throw new Error("[SnippetDetails.tsx] - No params");
  }

  // Get snippets
  const snippetsContext = useContext(SnippetsContext);
  if (!snippetsContext) {
    throw new Error("[SnippetDetails.tsx] - Failed to get context");
  }
  const snippets = snippetsContext.snippets;
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
      <h4>Created: {snippet.creationDate.toLocaleString()}</h4>
      <h4>Last Updated: {snippet.creationDate.toLocaleString()}</h4>
    </>
  );
}

export default SnippetDetailsPage;
