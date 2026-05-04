/**
 * hooks/useAuth.tsx
 *
 * Custom hook for getting the logged in user and checking authentication/authorization
 */

import type { UserPrivate } from "@models";
import { getCurrentUser } from "@services";
import { useEffect, useState } from "react";

function useAuth() {
  const [currentUser, setCurrentUser] = useState<UserPrivate | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [userLoading, setUserLoading] = useState<boolean>(true);

  // Set logged in user on mount if there is one
  useEffect(() => {
    async function getSavedUser() {
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setLoggedIn(true);
        }
      } catch (error) {
        const e = error as Error;
        console.error(e);
        throw e;
      } finally {
        setUserLoading(false);
      }
    }
    getSavedUser();
  }, []);

  // We return the states of currentUser and loggedIn, as well as how to set them
  return {
    currentUser,
    setCurrentUser,
    loggedIn,
    setLoggedIn,
    userLoading,
    setUserLoading,
  };
}

export default useAuth;
