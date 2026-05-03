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

// Context for logged in user
export type AuthContextType = {
  loggedInUser: UserPrivate;
  setLoggedInUser: React.Dispatch<React.SetStateAction<UserPrivate>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
