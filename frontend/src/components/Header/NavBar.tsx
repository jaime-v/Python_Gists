/**
 * components/Header/NavBar.tsx
 *
 * NavBar for the app, goes to all main pages
 */
import { AuthContext } from "@context/AuthContext";
import { useContext } from "react";
import { Container, Navbar, Nav, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

function NavBar() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("Failed to get auth context");
  }
  const currentUser = authContext.currentUser;
  const userLoading = authContext.userLoading;
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
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
            {currentUser ? (
              <Nav.Link as={Link} to={`/user/${currentUser.username}`}>
                {currentUser.username}
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to={`/login`}>
                Login
              </Nav.Link>
            )}
          </Nav>
        )}
      </Container>
    </Navbar>
  );
}

export default NavBar;
