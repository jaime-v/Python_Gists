/**
 * components/EditModals/SnippetDetailsEdit.tsx
 *
 * Modal for editing a snippet
 */

import { NotificationContext } from "@context/NotificationContext";
import type { Snippet, SnippetUpdate, UserPrivate } from "@models";
import { getSnippets, updateSnippetPartial } from "@services";
import { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

function SnippetDetailsEdit() {
  const { snippets, setSnippets, setSnippetsLoading, currentUser } =
    useOutletContext<{
      snippets: Snippet[];
      setSnippets: React.Dispatch<React.SetStateAction<Snippet[]>>;
      currentUser: UserPrivate;
      setSnippetsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    }>();
  const { title } = useParams();
  if (!title) {
    throw new Error("Theres no title");
  }
  const snippet = snippets.find((snippet) => {
    return snippet.title.toLowerCase() === title.toLowerCase();
  });
  if (!snippet) {
    throw new Error(
      "[SnippetDetails.tsx] - Couldn't find snippet with given title",
    );
  }

  const notifContext = useContext(NotificationContext);
  if (!notifContext) {
    throw new Error("Failed to get Notif Context");
  }
  const setNotifActive = notifContext.setNotifActive;
  const setNotifVariant = notifContext.setNotifVariant;
  const setNotifText = notifContext.setNotifText;

  const initialData: SnippetUpdate = {
    title: snippet.title,
    language: snippet.language,
    description: snippet.description,
    code: snippet.code,
  };
  const [updatedData, setUpdatedData] = useState<SnippetUpdate>(initialData);
  const navigate = useNavigate();
  const handleClose = () => {
    // Navigate to user Data
    navigate(`/snippet/${title}`);
  };
  const handleUpdatedClose = () => {
    navigate("/snippets");
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    // Shorthand way of setting state with all text inputs using name and value (From React Docs)
    setUpdatedData({
      ...updatedData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    console.log(e.target.value);
    // Shorthand way of setting state with all text inputs using name and value (From React Docs)
    setUpdatedData({
      ...updatedData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputReset = () => {
    setUpdatedData(initialData);
  };

  const handleUpdateSnippet = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(updatedData);
    if (!currentUser) {
      throw new Error("No current user");
    }
    try {
      // Empty fields should keep the previous state
      const updateData: SnippetUpdate = {
        title: updatedData.title,
        language: updatedData.language,
        description: updatedData.description,
        code: updatedData.code,
      };
      if (updateData.title === "") {
        delete updateData.title;
      }
      if (updateData.description === "") {
        delete updateData.description;
      }
      if (updateData.code === "") {
        delete updateData.code;
      }
      // Need to re-fetch snippets on update but it's so awkward to have logic here randomly
      setSnippetsLoading(true);
      await updateSnippetPartial(snippet.id, updateData);
      const res = await getSnippets();
      setSnippets(res);
      setSnippetsLoading(false);
      setNotifVariant("success");
      setNotifText("Updated snippet, redirecting back to snippets page");
      handleUpdatedClose();
    } catch (error) {
      const e = error as Error;
      console.error(e);
      setNotifVariant("danger");
      setNotifText("Failed to update snippet");
      throw e;
    } finally {
      setNotifActive(true);
    }
  };

  return (
    <>
      <Modal show={true} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit {title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateSnippet}>
            <Form.Group controlId="snippetUpdateTitle">
              <Form.Label>Snippet Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Title..."
                value={updatedData.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <label htmlFor="snippetUpdateLanguage">Snippet Language</label>
            <Form.Select
              id="snippetUpdateLanguage"
              name="language"
              value={updatedData.language}
              onChange={handleSelectChange}
            >
              <option value={"Python"}>Python</option>
              <option value={"Java"}>Java</option>
              <option value={"C++"}>C++</option>
              <option value={"TypeScript/JavaScript"}>
                TypeScript/JavaScript
              </option>
              <option value={"C"}>C</option>
              <option value={"C#"}>C#</option>
              <option value={"Go"}>Go</option>
              <option value={"Rust"}>Rust</option>
              <option value={"Other"}>Other</option>
            </Form.Select>
            <Form.Group controlId="snippetUpdateDescription">
              <Form.Label>Snippet Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                placeholder="Description..."
                value={updatedData.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="snippetUpdateCode">
              <Form.Label>Snippet Code</Form.Label>
              <Form.Control
                as={"textarea"}
                rows={3}
                name="code"
                placeholder="Code..."
                value={updatedData.code}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button onClick={handleInputReset}>Reset</Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SnippetDetailsEdit;
