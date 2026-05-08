/**
 * hooks/useNotif.tsx
 *
 * Custom hook for using notifications because I don't know any other way to do it
 */

import { useState } from "react";

function useNotif() {
  const [notifActive, setNotifActive] = useState<boolean>(false);
  const [notifVariant, setNotifVariant] = useState<
    "success" | "danger" | "primary"
  >("primary");
  const [notifText, setNotifText] = useState<string>("");
  return {
    notifActive,
    setNotifActive,
    notifVariant,
    setNotifVariant,
    notifText,
    setNotifText,
  };
}

export default useNotif;
