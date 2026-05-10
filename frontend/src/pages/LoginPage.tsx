/**
 * pages/LoginPage.tsx
 *
 * Page for logging in (if it wasn't obvious)
 */
import { AuthContext } from "@context/AuthContext";
import { NotificationContext } from "@context/NotificationContext";
import type { LoginForm } from "@models";
import { getCurrentUser, loginUser, logout } from "@services";
import { useContext, useState } from "react";
import { Button, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
function LoginPage() {
  // I feel like there is definitely a way to do this better
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("Failed to get Auth Context");
  }
  const setCurrentUser = authContext.setCurrentUser;
  const userLoading = authContext.userLoading;
  const setUserLoading = authContext.setUserLoading;
  const loggedIn = authContext.loggedIn;
  const setLoggedIn = authContext.setLoggedIn;

  const notifContext = useContext(NotificationContext);
  if (!notifContext) {
    throw new Error("Failed to get Notif Context");
  }
  const setNotifActive = notifContext.setNotifActive;
  const setNotifVariant = notifContext.setNotifVariant;
  const setNotifText = notifContext.setNotifText;

  const navigate = useNavigate();

  // On submitting login information, we want to setUserLoading to true, attempt login, then setUserLoading to false
  // If login is successful, then we can set currentUser and loggedIn
  // If there is already a logged in user, then we shouldn't even display this page
  // Inferred types from vscode prompt because I have no clue why it's not accepting the event
  const handleSubmitLogin = async (e: {
    preventDefault: () => void;
    target: HTMLFormElement | undefined;
  }) => {
    e.preventDefault();
    // If a user is logged in already, prevent login
    if (loggedIn) {
      console.log("Another user is logged in");
      return;
    }
    const formData: FormData = new FormData(e.target);
    setUserLoading(true);
    try {
      // loginUser returns the token... but we don't really need it
      await loginUser(formData);
      setLoggedIn(true);
      setCurrentUser(await getCurrentUser());
      navigate("/");
      setNotifVariant("success");
      setNotifText("Logged in");
    } catch (error) {
      const e = error as Error;
      console.error(e);
      setNotifVariant("danger");
      setNotifText("Failed to log in");
    } finally {
      setNotifActive(true);
      setUserLoading(false);
    }
  };

  const handleLogout = () => {
    setUserLoading(true);
    logout();
    setNotifVariant("primary");
    setNotifText("Logged out");
    setNotifActive(true);
    setLoggedIn(false);
    setCurrentUser(null);
    setUserLoading(false);
  };
  const initialForm: LoginForm = {
    username: "",
    password: "",
  };
  const [loginForm, setLoginForm] = useState<LoginForm>(initialForm);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputReset = () => {
    setLoginForm(initialForm);
    setNotifVariant("primary");
    setNotifText("Reset form");
    setNotifActive(true);
  };

  return (
    <Container>
      <h1>Login Page</h1>
      {userLoading && <h2>LOADING</h2>}
      <Form onSubmit={handleSubmitLogin}>
        <Row>
          {/* Don't need htmlfor and id because controlId does that already */}
          <Form.Group controlId="loginEmail">
            <Form.Label>Email Address</Form.Label>
            {/* OAuth2 apparently requires a field named username, but we are logging in with email */}
            <Form.Control
              type="email"
              placeholder="Email..."
              name="username"
              value={loginForm.username}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group controlId="loginPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password..."
              name="password"
              value={loginForm.password}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Row>
        <Row className="mt-3">
          <Button variant="primary" type="submit">
            Log in
          </Button>
          {loggedIn && (
            <Button variant="secondary" onClick={handleLogout}>
              Log out
            </Button>
          )}
          <Button variant="warning" onClick={handleInputReset}>
            Reset form
          </Button>
        </Row>
      </Form>
    </Container>
  );
}

export default LoginPage;
