/**
 * services/AuthService.ts
 *
 * Service module for authentication routes
 *
 * Taken from Corey Schafer tutorial
 */

// Current confusion is how and why I would use an auth context, I thought it would be a good idea,
// but idk how it would work with this... Maybe I need to move the cached values to the context and
// have the service set the context?

// These are used for caching, so we don't make redundant API calls
// Similar to when we have a useRef for true/false if we have already fetched in a component
let currentUser: UserPrivate | null = null;
let fetchPromise: Promise<UserPrivate | null> | null = null;

const baseURL = "http://127.0.0.1:8000/api/users";

import type { Token, UserPrivate } from "@models";

export async function loginUser(
  /*userData: UserLogin*/ /*loginForm: HTMLFormElement */ userFormData: FormData,
): Promise<Token> {
  // Okay apparently i can do this with json still, but the fastapi docs shows me the
  // x-www-form-urlencoded one
  // Corey also uses form data, so I will go with that one
  const fullURL = `${baseURL}/token`;

  // new FormData() requires a Form Element
  // So I need a form, which is structured for UserLogin (email and password)
  // Pass the form or form data into this function
  // Send the form data
  // const formData = userFormData;
  try {
    const response = await fetch(fullURL, {
      method: "POST",
      // headers: {
      // Apparently OAuth2 expects form data
      // "Content-Type": "application/x-www-form-urlencoded",
      // },
      // Body is formdata
      body: userFormData,
    });

    // Error check
    if (!response.ok) {
      throw new Error("Failed to login user");
    }

    // Parse json and return it
    const data: Token = await response.json();

    // For now, just set token to localStorage (this is a vulnerability to XSS attacks, because malicious scripts
    // can read the token from storage, so we need to make sure we have good user input sanitization and also limit
    // how long a token is valid
    // Supposedly, we can use "HTTP Only cookies" which are safer, so it might be worth looking into
    localStorage.setItem("access_token", data.access_token);

    // If we are setting it in local storage we might not want to return the token data itself
    return data;
  } catch (error) {
    const e = error as Error;
    console.error(e);
    throw e;
  }
}

export async function getCurrentUser(): Promise<UserPrivate | null> {
  // If we have current user already, or are fetching already, simply return that
  // so we don't call the API redundantly
  if (currentUser) {
    return currentUser;
  }
  if (fetchPromise) {
    return fetchPromise;
  }
  const token = localStorage.getItem("access_token");
  if (!token) {
    return null;
  }
  const fullURL = `${baseURL}/me`;
  fetchPromise = (async () => {
    try {
      const response = await fetch(fullURL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Error check and remove access token
      if (!response.ok) {
        localStorage.removeItem("access_token");
        throw new Error("Failed to get current user");
      }

      // Parse json and return it
      currentUser = await response.json();
      return currentUser;
    } catch (error) {
      const e = error as Error;
      console.error(e);
      throw e;
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

export function logout() {
  localStorage.removeItem("access_token");
  currentUser = null;
}

export function getToken() {
  return localStorage.getItem("access_token");
}

export function setToken(token: Token) {
  localStorage.setItem("access_token", token.access_token);
}

export function clearUserCache() {
  currentUser = null;
}
