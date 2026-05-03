/**
 * pages/SnippetCreationPage.tsx
 *
 * Page for creating a snippet
 *
 * If user tries to create a post, we should redirect to the login page
 */
import { Button, Form } from "react-bootstrap";
function SnippetCreationPage() {
  return (
    <>
      <h1>Snippet Creation Page</h1>
      <Form>
        <Form.Group controlId="snippetCreateTitle">
          <Form.Label>Snippet Title</Form.Label>
          <Form.Control type="text" placeholder="Title..." />
        </Form.Group>
        <Form.Group controlId="snippetCreateLanguage">
          <Form.Label>Snippet Language</Form.Label>
          <Form.Control type="text" placeholder="Language..." />
        </Form.Group>
        <Form.Group controlId="snippetCreateDescription">
          <Form.Label>Snippet Description</Form.Label>
          <Form.Control type="text" placeholder="Description..." />
        </Form.Group>
        <Form.Group controlId="snippetCreateCode">
          <Form.Label>Snippet Code</Form.Label>
          <Form.Control type="text" placeholder="Code..." />
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
