/**
 * models/User.ts
 *
 * Types regarding users
 *
 * Some of these seem really redundant though
 */

// Base for User types
type UserBase = {
  username: string;
};

// Type for displaying public user information -- can also be the response object
export type UserPublic = UserBase & {};

// Type for displaying all user information
export type UserPrivate = UserPublic & {
  email: string;
  id: number;
};

// Type for user creation
export type UserCreate = UserBase & {
  email: string;
  plain_password: string;
};

export type UserUpdate = {
  username?: string;
  email?: string;
  plain_password?: string;
};

// Type for user login
export type UserLogin = {
  email: string;
  plain_password: string;
};
