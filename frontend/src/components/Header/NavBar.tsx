/**
 * components/Header/NavBar.tsx
 *
 * NavBar for the app, goes to all main pages
 */
import { AuthContext } from "@context/AuthContext";
import { NotificationContext } from "@context/NotificationContext";
import { logout } from "@services";
import { useContext } from "react";
import { Container, Navbar, Nav, Spinner, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

function NavBar() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("Failed to get auth context");
  }
  const currentUser = authContext.currentUser;
  const userLoading = authContext.userLoading;
  const setUserLoading = authContext.setUserLoading;
  const setCurrentUser = authContext.setCurrentUser;
  const setLoggedIn = authContext.setLoggedIn;

  const notifContext = useContext(NotificationContext);
  if (!notifContext) {
    throw new Error("Failed to get auth context");
  }
  const setNotifVariant = notifContext.setNotifVariant;
  const setNotifText = notifContext.setNotifText;
  const setNotifActive = notifContext.setNotifActive;

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
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand as={Link} to={`/`}>
          Snippets Home Page
        </Navbar.Brand>
        {userLoading ? (
          <Spinner />
        ) : (
          <Nav className="me-auto">
            <Nav.Link as={Link} to={`/snippets`}>
              Snippets
            </Nav.Link>
            <Nav.Link as={Link} to={`/register`}>
              Create user
            </Nav.Link>
            {currentUser && (
              <Nav.Link as={Link} to={`/create`}>
                Create a Snippet
              </Nav.Link>
            )}
          </Nav>
        )}
        {currentUser ? (
          <NavDropdown
            title={`${currentUser.username}`}
            id="profile-dropdown"
            align={"end"}
          >
            <NavDropdown.Item as={Link} to={`/user/${currentUser.username}`}>
              {currentUser.username} Profile
            </NavDropdown.Item>
            <NavDropdown.Item onClick={handleLogout}>Log out</NavDropdown.Item>
          </NavDropdown>
        ) : (
          <Nav.Link as={Link} to={`/login`}>
            Login
          </Nav.Link>
        )}
      </Container>
    </Navbar>
  );
}

export default NavBar;
