/**
 * pages/SnippetCreationPage.tsx
 *
 * Page for creating a snippet
 *
 * If user tries to create a post, we should redirect to the login page
 */
import { AuthContext } from "@context/AuthContext";
import { NotificationContext } from "@context/NotificationContext";
import { SnippetsContext } from "@context/SnippetsContext";
import type { SnippetCreate } from "@models";
import { createSnippet, getToken } from "@services";
import { useContext, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
function SnippetCreationPage() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("Failed to get Auth Context");
  }
  const currentUser = authContext.currentUser;
  const loggedIn = authContext.loggedIn;
  const token = getToken();
  if (currentUser && !token) {
    console.log("Did you really remove the stored token bro");
  }

  const snippetsContext = useContext(SnippetsContext);
  if (!snippetsContext) {
    throw new Error("Failed to get Snippets Context");
  }
  const snippets = snippetsContext.snippets;
  const setSnippets = snippetsContext.setSnippets;
  const setSnippetsLoading = snippetsContext.setSnippetsLoading;

  const notifContext = useContext(NotificationContext);
  if (!notifContext) {
    throw new Error("Failed to get Notif Context");
  }
  const setNotifActive = notifContext.setNotifActive;
  const setNotifVariant = notifContext.setNotifVariant;
  const setNotifText = notifContext.setNotifText;

  const navigate = useNavigate();
  const navigateHome = () => {
    navigate("/snippets");
  };

  const initialForm: SnippetCreate = {
    title: "",
    language: "Python",
    description: "",
    code: "",
  };
  const [createSnippetForm, setCreateSnippetForm] =
    useState<SnippetCreate>(initialForm);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    // Shorthand way of setting state with all text inputs using name and value (From React Docs)
    setCreateSnippetForm({
      ...createSnippetForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    // Shorthand way of setting state with all text inputs using name and value (From React Docs)
    setCreateSnippetForm({
      ...createSnippetForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputReset = () => {
    setCreateSnippetForm(initialForm);
    setNotifVariant("primary");
    setNotifText("Reset form");
    setNotifActive(true);
  };

  // On submitting, check if we have logged in user, create SnippetCreate object from form data,
  // send it, then... idk do something else
  const handleSnippetSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Maybe I should verify if a user is logged in?
    if (!loggedIn) {
      console.log("No one is logged in, not going to submit");
      return;
    }
    setSnippetsLoading(true);
    try {
      // loginUser returns the token... but we don't really need it
      const res = await createSnippet(createSnippetForm);
      setSnippets([...snippets, res]);
      setNotifVariant("success");
      setNotifText("Created snippet");
      navigateHome();
    } catch (error) {
      const e = error as Error;
      console.error(e);
      setNotifVariant("danger");
      setNotifText("Failed to create snippet");
    } finally {
      setNotifActive(true);
      setSnippetsLoading(false);
    }
  };
  return (
    <Container>
      <h1>Snippet Creation Page</h1>
      <Form onSubmit={handleSnippetSubmit}>
        <Form.Group controlId="snippetCreateTitle">
          <Form.Label>Snippet Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            placeholder="Title..."
            value={createSnippetForm.title}
            onChange={handleInputChange}
          />
        </Form.Group>
        <label htmlFor="snippetCreateLanguage">Snippet Language</label>
        <Form.Select
          id="snippetCreateLanguage"
          name="language"
          value={createSnippetForm.language}
          onChange={handleSelectChange}
        >
          <option value={"Python"}>Python</option>
          <option value={"Java"}>Java</option>
          <option value={"C++"}>C++</option>
          <option value={"TypeScript/JavaScript"}>TypeScript/JavaScript</option>
          <option value={"C"}>C</option>
          <option value={"C#"}>C#</option>
          <option value={"Go"}>Go</option>
          <option value={"Rust"}>Rust</option>
          <option value={"Other"}>Other</option>
        </Form.Select>
        <Form.Group controlId="snippetCreateDescription">
          <Form.Label>Snippet Description</Form.Label>
          <Form.Control
            type="text"
            name="description"
            placeholder="Description..."
            value={createSnippetForm.description}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="snippetCreateCode">
          <Form.Label>Snippet Code</Form.Label>
          <Form.Control
            type="text"
            name="code"
            placeholder="Code..."
            value={createSnippetForm.code}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create
        </Button>
        <Button variant="secondary" onClick={handleInputReset}>
          Reset
        </Button>
      </Form>
    </Container>
  );
}
export default SnippetCreationPage;
