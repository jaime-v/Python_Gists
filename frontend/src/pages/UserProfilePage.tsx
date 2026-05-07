/**
 * pages/UserProfilePage.tsx
 *
 * Renders a user's profile page
 *
 * Conditional rendering for either public or private profile, depending on if user is logged in or not
 */

import { AuthContext } from "@context/AuthContext";
import type { UserPublic, UserPrivate, Snippet } from "@models";
import { getUserByUsername, getUserSnippetsByUsername } from "@services";
import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link, Outlet, useParams } from "react-router-dom";

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

function UserPublicPage({
  user,
  snippets,
}: {
  user: UserPublic;
  snippets: Snippet[];
}) {
  return (
    <>
      <h1>{user.username}</h1>
      <h2>Snippets would go here</h2>
      <ul>
        {snippets.map((snippet) => {
          return <li key={snippet.id}>{snippet.title}</li>;
        })}
      </ul>
    </>
  );
}

function UserPrivatePage({
  user,
  snippets,
}: {
  user: UserPrivate;
  snippets: Snippet[];
}) {
  return (
    <>
      <h1>
        {user.username} -- {user.email}
      </h1>
      <h2>Snippets would go here</h2>
      <Button variant="warning">
        <Link to={`/user/${user.username}/edit`}>Edit Profile</Link>
      </Button>
      <ul>
        {snippets.map((snippet) => {
          return <li key={snippet.id}>{snippet.title}</li>;
        })}
      </ul>
      {/* Also include an outlet for the edit modal */}
      <Outlet />
    </>
  );
}

function UserProfilePage() {
  const [profile, setProfile] = useState<UserPublic | UserPrivate | null>(null);
  const [profileSnippets, setProfileSnippets] = useState<Snippet[]>([]);
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
  // Currently a bug when currentUser changes because we will try to fetch the name again, but if that name doesn't exist it will error
  // Doesn't affect anything I don't think, but it's a wasted API call
  useEffect(() => {
    async function getPublicUser(username: string) {
      try {
        if (currentUser && username === currentUser.username) {
          setProfile(currentUser);
          setProfileSnippets(
            await getUserSnippetsByUsername(currentUser.username),
          );
        } else {
          const user = await getUserByUsername(username);
          if (user) {
            setProfile(user);
            setProfileSnippets(await getUserSnippetsByUsername(username));
          } else {
            setProfile(null);
            setProfileSnippets([]);
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
        <UserPrivatePage user={currentUser} snippets={profileSnippets} />
      </>
    );
  }

  // Getting other user profile... but i need to fetch here
  return (
    <>
      <UserPublicPage user={profile} snippets={profileSnippets} />
    </>
  );
}

export default UserProfilePage;
