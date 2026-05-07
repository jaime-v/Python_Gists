/**
 * pages/CreateUserPage.tsx
 *
 * Page for creating a user
 */

import type { UserCreate } from "@models";
import { createUser } from "@services";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";

function CreateUserPage() {
  const initialForm: UserCreate = {
    username: "",
    email: "",
    plain_password: "",
  };
  const [createUserForm, setCreateUserForm] = useState<UserCreate>(initialForm);

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
  };

  async function handleCreateUser(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(createUserForm);
    const result = await createUser(createUserForm);
    console.log(result);
  }
  return (
    <>
      <h1>CreateUserPage</h1>
      <Form onSubmit={handleCreateUser}>
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
        <Button type="submit">Create User</Button>
        <Button type="reset" onClick={handleInputReset}>
          Reset Form
        </Button>
      </Form>
    </>
  );
}

export default CreateUserPage;
