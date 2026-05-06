/**
 * pages/UserProfilePage.tsx
 *
 * Renders a user's profile page
 *
 * Conditional rendering for either public or private profile, depending on if user is logged in or not
 */

import { AuthContext } from "@context/AuthContext";
import type { UserPrivate, UserPublic } from "@models";
import { getUserByUsername } from "@services";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/*
How does this even work
We get username from search params
Get auth context for current user
We don't have users stored though, so it's not like i can fetch from context
But I don't think i want to do that anyway
if the currentUser.username is the same as username, then we can get current user (no need to fetch)
if the usernames are not the same, then we get user
looks like we will need a loading state then fetch
*/

function UserPublicPage({ user }: { user: UserPublic }) {
  return (
    <>
      <h1>{user.username}</h1>
      <h2>Snippets would go here</h2>
    </>
  );
}

function UserPrivatePage({ user }: { user: UserPrivate }) {
  return (
    <>
      <h1>
        {user.username} -- {user.email}
      </h1>
      <h2>Snippets would go here</h2>
    </>
  );
}

function UserProfilePage() {
  const [profile, setProfile] = useState<UserPublic | UserPrivate | null>(null);
  // Get username for path
  const { username } = useParams();
  if (!username) {
    throw new Error("No username params");
  }
  // Get auth context for current user and userloading
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("Failed to get auth context");
  }
  const currentUser = authContext.currentUser;
  const userLoading = authContext.userLoading;

  // useEffect will run every time the username in the path changes
  // It will get the user by username and set the profile state to be the found user, or null if not found
  // Also runs the effect if the current user changes since we need to potentially change the profile
  useEffect(() => {
    async function getPublicUser(username: string) {
      try {
        if (currentUser && username === currentUser.username) {
          setProfile(currentUser);
        } else {
          const user = await getUserByUsername(username);
          if (user) {
            setProfile(user);
          } else {
            setProfile(null);
          }
        }
      } catch (error) {
        const e = error as Error;
        console.error(e);
      }
    }
    getPublicUser(username);
  }, [currentUser, username]);

  if (userLoading) {
    return <h1>LOADING USER</h1>;
  }
  if (!profile) {
    return <h1>Cannot find user profile, 404</h1>;
  }

  // Getting current user profile
  if (
    currentUser &&
    profile.username.toLowerCase() === currentUser.username.toLowerCase()
  ) {
    return (
      <>
        <UserPrivatePage user={currentUser} />
      </>
    );
  }

  // Getting other user profile... but i need to fetch here
  return (
    <>
      <UserPublicPage user={profile} />
    </>
  );
}

export default UserProfilePage;
