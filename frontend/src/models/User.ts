// Base for User types
type UserBase = {
  username: string;
};

// Type for displaying public user information
export type UserPublic = UserBase & {};

// Type for displaying all user information
export type UserPrivate = UserPublic & {
  email: string;
  id: number;
};

// Type for user creation
export type UserCreate = UserBase & {
  plain_password: string;
};
