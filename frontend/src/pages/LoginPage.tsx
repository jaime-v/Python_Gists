/**
 * pages/LoginPage.tsx
 *
 * Page for logging in (if it wasn't obvious)
 */
import { AuthContext } from "@context/AuthContext";
import { NotificationContext } from "@context/NotificationContext";
import { getCurrentUser, loginUser, logout } from "@services";
import { useContext } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
function LoginPage() {
  // I feel like there is definitely a way to do this better
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("Failed to get Auth Context");
  }
  const currentUser = authContext.currentUser;
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
    } catch (error) {
      const e = error as Error;
      console.error(e);
      setNotifVariant("danger");
    } finally {
      setNotifActive(true);
      setUserLoading(false);
    }
  };

  const handleLogout = () => {
    setUserLoading(true);
    logout();
    setLoggedIn(false);
    setCurrentUser(null);
    setUserLoading(false);
  };

  return (
    <>
      <h1>Login Page</h1>
      {userLoading && <h2>LOADING</h2>}
      {loggedIn ? (
        <h2>Current User: {currentUser?.username}</h2>
      ) : (
        <h2>No user right now</h2>
      )}
      <Form onSubmit={handleSubmitLogin}>
        {/* Don't need htmlfor and id because controlId does that already */}
        <Form.Group controlId="loginEmail">
          <Form.Label>Email Address</Form.Label>
          {/* OAuth2 apparently requires a field named username, but we are logging in with email */}
          <Form.Control type="email" placeholder="Email..." name="username" />
        </Form.Group>
        <Form.Group controlId="loginPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password..."
            name="password"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Log in
        </Button>
        {loggedIn && (
          <Button variant="secondary" onClick={handleLogout}>
            Log out
          </Button>
        )}
        <Button variant="warning" type="reset">
          Reset form
        </Button>
      </Form>
    </>
  );
}

export default LoginPage;
