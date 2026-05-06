/**
 * services/UsersAPIService.ts
 *
 * Service module for acccessing routes to /api/users
 */

import type {
  Snippet,
  UserCreate,
  UserPrivate,
  UserPublic,
  UserUpdate,
} from "@models";
import { getToken } from "./AuthService";

const baseURL = "http://127.0.0.1:8000/api/users";

export async function getAllUsers(): Promise<UserPublic[]> {
  // GET request
  try {
    const response = await fetch(baseURL, {
      method: "GET",
    });

    // Failed response means throw error
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    // If not failed, then parse the json into an object and return
    const data: UserPublic[] = await response.json();
    return data;
  } catch (error) {
    // The service module shouldn't handle errors so bubble it up to whatever called the service
    const e = error as Error;
    console.error(e);
    throw e;
  }
}

export async function createUser(userData: UserCreate): Promise<UserPrivate> {
  // POST request
  try {
    const response = await fetch(baseURL, {
      method: "POST",
      headers: {
        // I'm not sure what the accept header is, but I see it in the cURL command on FastAPI docs page for my app
        accept: "application/json",
        "Content-Type": "application/json",
      },
      // Convert to object to JSON-formatted string
      body: JSON.stringify(userData),
    });

    // Error check
    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    // Parse json and return it
    const data: UserPrivate = await response.json();
    return data;
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw e;
  }
}

export async function getUser(userId: number): Promise<UserPublic> {
  const fullURL = `${baseURL}/${userId}`;
  try {
    const response = await fetch(fullURL, {
      method: "GET",
    });

    // Error check
    if (!response.ok) {
      throw new Error("Failed to get user");
    }

    // Parse json and return it
    const data: UserPublic = await response.json();
    return data;
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw e;
  }
}

export async function getUserByUsername(username: string): Promise<UserPublic> {
  const fullURL = `${baseURL}/username/${username}`;
  try {
    const response = await fetch(fullURL, {
      method: "GET",
    });

    // Error check
    if (!response.ok) {
      throw new Error("Failed to get user");
    }

    // Parse json and return it
    const data: UserPublic = await response.json();
    return data;
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw e;
  }
}

export async function getUserSnippetsByUsername(
  username: string,
): Promise<Snippet[]> {
  const user = await getUserByUsername(username);
  const snippets = await getUserSnippets(user.id);
  return snippets;
}

export async function updateUser(
  userId: number,
  updatedUser: UserUpdate,
): Promise<UserPrivate> {
  const access_token = getToken();
  if (!access_token) {
    throw new Error("No user is logged in");
  }
  const fullURL = `${baseURL}/${userId}`;
  try {
    const response = await fetch(fullURL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      // Convert to object to JSON-formatted string
      body: JSON.stringify(updatedUser),
    });

    // Error check
    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    // Parse json and return it
    const data: UserPrivate = await response.json();
    return data;
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw e;
  }
}

export async function deleteUser(userId: number): Promise<string> {
  const access_token = getToken();
  if (!access_token) {
    throw new Error("No user is logged in");
  }
  const fullURL = `${baseURL}/${userId}`;
  try {
    const response = await fetch(fullURL, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Error check
    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    // Send a message?
    return "Successfully deleted user";
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw e;
  }
}

export async function getUserSnippets(userId: number): Promise<Snippet[]> {
  const fullURL = `${baseURL}/${userId}/snippets`;
  try {
    const response = await fetch(fullURL, {
      method: "GET",
    });

    // Error check
    if (!response.ok) {
      throw new Error("Failed to get user snippets");
    }

    // Parse json and return it
    const data: Snippet[] = await response.json();
    return data;
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw e;
  }
}
