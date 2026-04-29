/*
LoginPage.tsx

Page for logging in (if it wasn't obvious)
*/
import { Button, Form } from "react-bootstrap";
function LoginPage() {
  return (
    <>
      <h1>Login Page</h1>
      <Form>
        <Form.Group controlId="loginEmail">
          <Form.Label>Email Address</Form.Label>
          <Form.Control type="email" placeholder="Email..." />
        </Form.Group>
        <Form.Group controlId="loginPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password..." />
        </Form.Group>
        <Button variant="primary" type="submit">
          Log in
        </Button>
      </Form>
    </>
  );
}

export default LoginPage;
