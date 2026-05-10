/**
 * components/Notification/Notification.tsx
 *
 * Notification Toast
 *
 * The way I think this should work is that the Notification is just not visible most of the time
 *
 * Then when user takes action, we call a function that sets active state to true
 */

import { NotificationContext } from "@context/NotificationContext";
import { useContext } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

function Notification({ notifActive }: { notifActive: boolean }) {
  const notifContext = useContext(NotificationContext);
  if (!notifContext) {
    throw new Error("No notif context");
  }
  const setNotifActive = notifContext.setNotifActive;
  const notifVariant = notifContext.notifVariant;
  const notifText = notifContext.notifText;
  return (
    <>
      <ToastContainer style={{ zIndex: 1 }}>
        <Toast
          onClose={() => setNotifActive(false)}
          show={notifActive}
          delay={3000}
          autohide
          bg={notifVariant}
        >
          <Toast.Header>Notification</Toast.Header>
          <Toast.Body>{notifText}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default Notification;
