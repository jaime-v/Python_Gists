/**
 * NavBar.tsx
 *
 * NavBar for the app, goes to all main pages
 */
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to={`/`}>
          Snippets Home Page
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to={`/`}>
            Link 1
          </Nav.Link>
          <Nav.Link as={Link} to={`/`}>
            Link 2
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;
