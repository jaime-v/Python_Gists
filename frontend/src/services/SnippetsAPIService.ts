/**
 * services/SnippetsAPIService.ts
 *
 * Service module for acccessing routes to /api/snippets
 */

import type { Snippet, SnippetCreate, SnippetUpdate } from "@models";
import { getToken } from "./AuthService";

const baseURL = "http://127.0.0.1:8000/api/snippets";

export async function getSnippets(): Promise<Snippet[]> {
  // GET request
  try {
    const response = await fetch(baseURL, {
      method: "GET",
    });

    // Failed response means throw error
    if (!response.ok) {
      throw new Error("Failed to fetch snippets");
    }

    // If not failed, then parse the json into an object and return
    const data: Snippet[] = await response.json();
    return data;
  } catch (error) {
    // The service module shouldn't handle errors so bubble it up to whatever called the service
    const e = error as Error;
    console.error(e);
    throw e;
  }
}

export async function createSnippet(
  snippetData: SnippetCreate,
): Promise<Snippet> {
  // Make sure there is a logged in user when creating
  const access_token = getToken();
  if (!access_token) {
    throw new Error("No user is logged in");
  }

  try {
    const response = await fetch(baseURL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
        // There's an authorization header here
      },
      body: JSON.stringify(snippetData),
    });

    // Failed response means throw error
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Token is invalid or expired");
      }
      throw new Error("Failed to create snippet");
    }

    // If not failed, then parse the json into an object and return
    const data: Snippet = await response.json();
    return data;
  } catch (error) {
    // The service module shouldn't handle errors so bubble it up to whatever called the service
    const e = error as Error;
    console.error(e);
    throw e;
  }
}

export async function getSnippet(snippetId: number): Promise<Snippet> {
  const fullURL = `${baseURL}/${snippetId}`;
  try {
    const response = await fetch(fullURL, {
      method: "GET",
    });

    // Error check
    if (!response.ok) {
      throw new Error("Failed to get snippet");
    }

    // Parse json and return it
    const data: Snippet = await response.json();
    return data;
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw e;
  }
}

export async function updateSnippetFull(
  snippetId: number,
  updatedSnippet: SnippetCreate,
): Promise<Snippet> {
  const access_token = getToken();
  if (!access_token) {
    throw new Error("No user is logged in");
  }
  const fullURL = `${baseURL}/${snippetId}`;
  try {
    const response = await fetch(fullURL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      // Convert to object to JSON-formatted string
      body: JSON.stringify(updatedSnippet),
    });

    // Error check
    if (!response.ok) {
      throw new Error("Failed to fully update snippet");
    }

    // Parse json and return it
    const data: Snippet = await response.json();
    return data;
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw e;
  }
}

export async function updateSnippetPartial(
  snippetId: number,
  updatedSnippet: SnippetUpdate,
): Promise<Snippet> {
  const access_token = getToken();
  if (!access_token) {
    throw new Error("No user is logged in");
  }
  const fullURL = `${baseURL}/${snippetId}`;
  try {
    const response = await fetch(fullURL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      // Convert to object to JSON-formatted string
      body: JSON.stringify(updatedSnippet),
    });

    // Error check
    if (!response.ok) {
      throw new Error("Failed to partially update snippet");
    }

    // Parse json and return it
    const data: Snippet = await response.json();
    return data;
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw e;
  }
}

export async function deleteSnippet(snippetId: number): Promise<string> {
  const access_token = getToken();
  if (!access_token) {
    throw new Error("No user is logged in");
  }
  const fullURL = `${baseURL}/${snippetId}`;
  try {
    const response = await fetch(fullURL, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Error check
    if (!response.ok) {
      throw new Error("Failed to delete snippet");
    }

    // Send a message?
    return "Successfully deleted snippet";
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw e;
  }
}
