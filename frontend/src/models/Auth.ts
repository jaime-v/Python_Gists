/**
 * models/Auth.ts
 *
 * Types for authentication things
 */

import type { UserPrivate } from "./User";
// User token (JWT)
export type Token = {
  access_token: string;
  token_type: string;
};

export type LoginForm = {
  username: string;
  password: string;
};

// Context for logged in user
export type AuthContextType = {
  currentUser: UserPrivate | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserPrivate | null>>;
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userLoading: boolean;
  setUserLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
