/**
 * pages/LoginPage.tsx
 *
 * Page for logging in (if it wasn't obvious)
 */
import { Button, Form } from "react-bootstrap";
function LoginPage() {
  return (
    <>
      <h1>Login Page</h1>
      <Form>
        <Form.Group controlId="loginEmail">
          <Form.Label htmlFor="emailInput">Email Address</Form.Label>
          {/* OAuth2 apparently requires a field named username, but we are logging in with email */}
          <Form.Control
            type="email"
            id="emailInput"
            placeholder="Email..."
            name="username"
          />
        </Form.Group>
        <Form.Group controlId="loginPassword">
          <Form.Label htmlFor="passwordInput">Password</Form.Label>
          <Form.Control
            type="password"
            id="passwordInput"
            placeholder="Password..."
            name="password"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Log in
        </Button>
      </Form>
    </>
  );
}

export default LoginPage;
