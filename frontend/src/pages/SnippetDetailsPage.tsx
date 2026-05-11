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
import { NotificationContext } from "@context/NotificationContext";
import { SnippetsContext } from "@context/SnippetsContext";
import type { Snippet } from "@models";
import { deleteSnippet, getSnippets } from "@services";
import { useContext } from "react";
import { Button, Container, Row } from "react-bootstrap";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

function OwnerButtons({
  snippet,
  setSnippets,
  setSnippetsLoading,
}: {
  snippet: Snippet;
  setSnippets: React.Dispatch<React.SetStateAction<Snippet[]>>;
  setSnippetsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const notifContext = useContext(NotificationContext);
  if (!notifContext) {
    throw new Error("Failed to get Notif Context");
  }
  const setNotifActive = notifContext.setNotifActive;
  const setNotifVariant = notifContext.setNotifVariant;
  const setNotifText = notifContext.setNotifText;
  const navigate = useNavigate();
  const handleUpdatedClose = () => {
    navigate("/snippets");
  };
  const handleEditPopup = () => {
    navigate(`/snippet/${snippet.title}/edit`);
  };
  const handleDelete = async () => {
    setSnippetsLoading(true);
    try {
      // Delete snippet, fetch snippets, set snippets
      await deleteSnippet(snippet.id);
      const snippets = await getSnippets();
      setSnippets(snippets);
      setNotifVariant("success");
      setNotifText(`Deleted Snippet: "${snippet.title}"`);
      handleUpdatedClose();
    } catch (error) {
      const e = error as Error;
      console.error(e);
      setNotifVariant("danger");
      setNotifText(e.message);
    } finally {
      setNotifActive(true);
      setSnippetsLoading(false);
    }
  };
  return (
    <Row>
      <Button variant="warning" onClick={handleEditPopup}>
        Edit
      </Button>
      <Button variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </Row>
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
  const setSnippets = snippetsContext.setSnippets;
  const snippetsLoading = snippetsContext.snippetsLoading;
  const setSnippetsLoading = snippetsContext.setSnippetsLoading;
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
    <Container>
      <h1>
        {snippet.title} Details Page by{" "}
        <Link to={`/user/${snippet.owner.username}`}>
          {snippet.owner.username}
        </Link>
      </h1>
      <h2>{snippet.language}</h2>
      <h3>{snippet.description}</h3>
      <pre>{snippet.code}</pre>
      <h4>Created: {new Date(snippet.creation_date).toLocaleString()}</h4>
      <h4>
        Last Updated: {new Date(snippet.last_updated_date).toLocaleString()}
      </h4>
      {currentUser &&
        snippet.owner.username.toLowerCase() ===
          currentUser.username.toLowerCase() && (
          <OwnerButtons
            snippet={snippet}
            setSnippets={setSnippets}
            setSnippetsLoading={setSnippetsLoading}
          />
        )}
      {/* Outlet for the edit modal */}
      <Outlet
        context={{ snippets, setSnippets, setSnippetsLoading, currentUser }}
      />
    </Container>
  );
}

export default SnippetDetailsPage;
