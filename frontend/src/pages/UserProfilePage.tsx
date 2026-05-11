/**
 * pages/UserProfilePage.tsx
 *
 * Renders a user's profile page
 *
 * Conditional rendering for either public or private profile, depending on if user is logged in or not
 */

import { AuthContext } from "@context/AuthContext";
import { NotificationContext } from "@context/NotificationContext";
import { SnippetsContext } from "@context/SnippetsContext";
import type { UserPublic, UserPrivate, Snippet } from "@models";
import {
  deleteUser,
  getSnippets,
  getUserByUsername,
  getUserSnippetsByUsername,
  logout,
} from "@services";
import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Outlet, useNavigate, useParams } from "react-router-dom";

function SnippetCard({ snippet }: { snippet: Snippet }) {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(`/snippet/${snippet.title}`);
  };
  return (
    <Col xs={12} className="mb-3">
      <Card>
        <Card.Body>
          <Card.Title>
            {snippet.title} -- {snippet.language}
          </Card.Title>
          <Card.Text>{snippet.description}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <Button variant="success" onClick={handleNavigate}>
            More Details
          </Button>
        </Card.Footer>
      </Card>
    </Col>
  );
}

function UserPublicPage({
  user,
  snippets,
}: {
  user: UserPublic;
  snippets: Snippet[];
}) {
  return (
    <Container className="d-flex flex-column flex-md-row">
      <div className="d-flex flex-column col-md-3 col-12 px-3">
        <Row>
          <h1>{user.username}</h1>
        </Row>
      </div>
      <div className="d-flex flex-column col-9 col-md-9 col-12 px-3">
        <Row className="mt-3">
          {snippets.map((snippet) => {
            return <SnippetCard key={snippet.id} snippet={snippet} />;
          })}
        </Row>
      </div>
      {/* Also include an outlet for the edit modal */}
      <Outlet />
    </Container>
  );
}

function UserPrivatePage({
  user,
  snippets,
}: {
  user: UserPrivate;
  snippets: Snippet[];
}) {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("Failed to get Auth Context");
  }
  const setUserLoading = authContext.setUserLoading;
  const setLoggedIn = authContext.setLoggedIn;
  const setCurrentUser = authContext.setCurrentUser;

  const notifContext = useContext(NotificationContext);
  if (!notifContext) {
    throw new Error("Failed to get Auth Context");
  }
  const setNotifVariant = notifContext.setNotifVariant;
  const setNotifText = notifContext.setNotifText;
  const setNotifActive = notifContext.setNotifActive;

  const snippetsContext = useContext(SnippetsContext);
  if (!snippetsContext) {
    throw new Error("Failed to get Snippets Context");
  }
  const setSnippetsLoading = snippetsContext.setSnippetsLoading;
  const setSnippets = snippetsContext.setSnippets;
  const handleLogout = () => {
    setUserLoading(true);
    logout();
    setNotifVariant("success");
    setNotifText("Logged out");
    setNotifActive(true);
    setLoggedIn(false);
    setCurrentUser(null);
    setUserLoading(false);
  };
  const handleDelete = async () => {
    // Deleting a user also deletes all of their snippets, so we need to fetch those again
    setUserLoading(true);
    setSnippetsLoading(true);
    await deleteUser(user.id);
    logout();
    const snippets = await getSnippets();
    setSnippets(snippets);
    setNotifVariant("success");
    setNotifText("Deleted user");
    setNotifActive(true);
    setLoggedIn(false);
    setCurrentUser(null);
    setUserLoading(false);
    setSnippetsLoading(false);
  };
  return (
    <Container className="d-flex flex-column flex-md-row">
      <div className="d-flex flex-column col-md-3 col-12 px-3">
        <Row>
          <h1>{user.username}</h1>
          <h2>{user.email}</h2>
        </Row>
        <Row>
          <Button
            variant="warning"
            onClick={() => {
              navigate(`/user/${user.username}/edit`);
            }}
          >
            Edit Profile
          </Button>
          <Button variant="primary" onClick={handleLogout}>
            Log out
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete User: {user.username}
          </Button>
        </Row>
      </div>
      <div className="d-flex flex-column col-9 col-md-9 col-12 px-3">
        <Row className="mt-3">
          {snippets.map((snippet) => {
            return <SnippetCard key={snippet.id} snippet={snippet} />;
          })}
        </Row>
      </div>
      {/* Also include an outlet for the edit modal */}
      <Outlet />
    </Container>
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
