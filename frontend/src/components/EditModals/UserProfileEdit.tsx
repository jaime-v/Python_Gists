/**
 * components/EditModals/UserProfileEdit.tsx
 *
 * Modal for editing a user profile
 */

import { AuthContext } from "@context/AuthContext";
import type { UserUpdate } from "@models";
import { updateUser } from "@services";
import { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

function UserProfileEdit() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("Failed to get auth context");
  }
  const currentUser = authContext.currentUser;
  const setCurrentUser = authContext.setCurrentUser;
  if (!currentUser) {
    throw new Error("No current user, but we are on user page? should be 401");
  }
  const initialProfile: UserUpdate = {
    username: currentUser.username,
    email: currentUser.email,
    plain_password: "",
  };
  const [updatedProfile, setUpdatedProfile] =
    useState<UserUpdate>(initialProfile);
  const params = useParams();
  if (!params.username) {
    throw new Error("No username param");
  }
  if (currentUser.username != params.username) {
    throw new Error("Hey you're not allowed to be here");
  }
  const navigate = useNavigate();
  const handleClose = () => {
    // Navigate to user profile
    navigate(`/user/${params.username}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    // Shorthand way of setting state with all text inputs using name and value (From React Docs)
    setUpdatedProfile({
      ...updatedProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputReset = () => {
    setUpdatedProfile(initialProfile);
  };

  async function handleUpdateUser(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(updatedProfile);
    if (!currentUser) {
      throw new Error("No current user");
    }
    try {
      const result = await updateUser(currentUser.id, updatedProfile);
      console.log(result);
      setCurrentUser(result);
    } catch (error) {
      const e = error as Error;
      console.error(e);
      throw e;
    }
    handleClose();
  }
  return (
    <>
      <Modal show={true} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit {currentUser.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateUser}>
            <Form.Group controlId="updatedUsername">
              <Form.Label>New Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={updatedProfile.username}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="updatedEmail">
              <Form.Label>New Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={updatedProfile.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="updatedPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="plain_password"
                value={updatedProfile.plain_password}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button onClick={handleInputReset}>Reset</Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UserProfileEdit;
