/**
 * pages/SnippetCreationPage.tsx
 *
 * Page for creating a snippet
 *
 * If user tries to create a post, we should redirect to the login page
 */
import { AuthContext } from "@context/AuthContext";
import { SnippetsContext } from "@context/SnippetsContext";
import type { SnippetCreate } from "@models";
import { createSnippet, getToken } from "@services";
import { useContext } from "react";
import { Button, Form } from "react-bootstrap";
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

  // Waiting function
  const wait = (s: number) =>
    new Promise((resolve) => setTimeout(resolve, s * 1000));

  // On submitting, check if we have logged in user, create SnippetCreate object from form data,
  // send it, then... idk do something else
  const handleSnippetSubmit = async (e: {
    preventDefault: () => void;
    target: HTMLFormElement | undefined;
  }) => {
    e.preventDefault();
    // Maybe I should verify if a user is logged in?
    if (!loggedIn) {
      console.log("No one is logged in, not going to submit");
      return;
    }

    const formData: FormData = new FormData(e.target);
    // This is giving me an error even though my form is fine? Maybe I need to make it controlled and
    // it will stop complaining
    const snippetData: SnippetCreate = Object.fromEntries(formData.entries());
    setSnippetsLoading(true);
    try {
      await wait(2);
      // loginUser returns the token... but we don't really need it
      const res = await createSnippet(snippetData);
      setSnippets([...snippets, res]);
    } catch (error) {
      const e = error as Error;
      console.error(e);
    } finally {
      setSnippetsLoading(false);
    }
  };
  return (
    <>
      <h1>Snippet Creation Page</h1>
      <Form onSubmit={handleSnippetSubmit}>
        <Form.Group controlId="snippetCreateTitle">
          <Form.Label>Snippet Title</Form.Label>
          <Form.Control type="text" name="title" placeholder="Title..." />
        </Form.Group>
        <label htmlFor="snippetCreateLanguage">Snippet Language</label>
        <Form.Select id="snippetCreateLanguage" name="language">
          <option value={"Python"}>Python</option>
          <option value={"Java"}>Java</option>
          <option value={"C++"}>C++</option>
          <option value={"TypeScript/JavaScript"}>TypeScript/JavaScript</option>
          <option value={"C"}>C</option>
          <option value={"C#"}>C#</option>
          <option value={"Go"}>Go</option>
          <option value={"Rust"}>Rust</option>
        </Form.Select>
        <Form.Group controlId="snippetCreateDescription">
          <Form.Label>Snippet Description</Form.Label>
          <Form.Control
            type="text"
            name="description"
            placeholder="Description..."
          />
        </Form.Group>
        <Form.Group controlId="snippetCreateCode">
          <Form.Label>Snippet Code</Form.Label>
          <Form.Control type="text" name="code" placeholder="Code..." />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create
        </Button>
        <Button variant="secondary" type="reset">
          Reset
        </Button>
      </Form>
    </>
  );
}
export default SnippetCreationPage;
