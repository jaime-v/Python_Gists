/**
 * components/EditModals/SnippetDetailsEdit.tsx
 *
 * Modal for editing a snippet
 */

import { Button, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

function SnippetDetailsEdit() {
  const params = useParams();
  console.log("Params", params);
  const navigate = useNavigate();
  const handleClose = () => {
    // Navigate to previous page
    navigate(-1);
  };
  return (
    <>
      <Modal show={true} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SnippetDetailsEdit;
