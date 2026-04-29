/*
SnippetDetailsPage.tsx

Page for displaying an entire snippet
If the owner of the snippet is logged in, they can edit with modals at URL/edit/<section>
*/
import type { Snippet } from "@models";
function SnippetDetailsPage({ snippet }: { snippet: Snippet }) {
  return (
    <>
      <h1>
        {snippet.title} Details Page by {snippet.owner.username}
      </h1>
      <h2>{snippet.language}</h2>
      <h3>{snippet.description}</h3>
      <code>{snippet.code}</code>
      <h4>Created: {snippet.creation_date.toLocaleString()}</h4>
      <h4>Last Updated: {snippet.creation_date.toLocaleString()}</h4>
    </>
  );
}

export default SnippetDetailsPage;
