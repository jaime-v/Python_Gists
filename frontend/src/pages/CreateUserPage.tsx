/**
 * pages/CreateUserPage.tsx
 *
 * Page for creating a user
 */

import { NotificationContext } from "@context/NotificationContext";
import type { UserCreate } from "@models";
import { createUser } from "@services";
import { useContext, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function CreateUserPage() {
  const initialForm: UserCreate = {
    username: "",
    email: "",
    plain_password: "",
  };
  const [createUserForm, setCreateUserForm] = useState<UserCreate>(initialForm);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    // Shorthand way of setting state with all text inputs using name and value (From React Docs)
    setCreateUserForm({
      ...createUserForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputReset = () => {
    setCreateUserForm(initialForm);
    setNotifVariant("primary");
    setNotifText("Reset form");
    setNotifActive(true);
  };

  async function handleCreateUser(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(createUserForm);
    try {
      await createUser(createUserForm);
      setNotifVariant("success");
      setNotifText("Registered new user");
      navigateHome();
    } catch (error) {
      const e = error as Error;
      console.error(e);
      setNotifVariant("danger");
      setNotifText("Failed to register new user");
    } finally {
      setNotifActive(true);
    }
  }
  return (
    <Container>
      <h1>Create User Page</h1>
      <Form onSubmit={handleCreateUser}>
        <Row>
          <Col>
            <Form.Group controlId="userCreateUsername">
              <Form.Label>Enter Username:</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Username..."
                onChange={handleInputChange}
                value={createUserForm.username}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="userCreateEmail">
              <Form.Label>Enter Email:</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Email..."
                onChange={handleInputChange}
                value={createUserForm.email}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="userCreatePassword">
              <Form.Label>Enter Password:</Form.Label>
              <Form.Control
                type="password"
                name="plain_password"
                placeholder="Password..."
                onChange={handleInputChange}
                value={createUserForm.plain_password}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-3">
          <Button type="submit">Create User</Button>
          <Button variant="warning" type="reset" onClick={handleInputReset}>
            Reset Form
          </Button>
        </Row>
      </Form>
    </Container>
  );
}

export default CreateUserPage;
