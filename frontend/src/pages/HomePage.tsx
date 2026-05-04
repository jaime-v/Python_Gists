/**
 * pages/HomePage.tsx
 *
 * Home Page if you couldn't tell
 */
import { AuthContext } from "@context/AuthContext";
import { SnippetsContext } from "@context/SnippetsContext";
import type {
  SnippetCreate,
  SnippetUpdate,
  UserCreate,
  UserUpdate,
} from "@models";
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getUserSnippets,
  getSnippets,
  createSnippet,
  getSnippet,
  updateSnippetFull,
  updateSnippetPartial,
  deleteSnippet,
  loginUser,
  getCurrentUser,
  logout,
  getToken,
  setToken,
  clearUserCache,
} from "@services";
import { useContext } from "react";
import { Button } from "react-bootstrap";

const user1: UserCreate = {
  username: "johndoe",
  email: "johndoe@gmail.com",
  plain_password: "testpassword1!",
};

const user2: UserCreate = {
  username: "janedoe",
  email: "janedoe@gmail.com",
  plain_password: "error?",
};

const updatedUser1: UserUpdate = {
  username: "foobar",
  email: "foobar@gmail.com",
  plain_password: "foobarpass1",
};

// Just some hardcoded data for snippet creation
const data: SnippetCreate[] = [
  {
    title: "First snippet (hardcoded)",
    language: "Python",
    description: "The first snippet, but it's hardcoded",
    code: "print('hello world!')",
  },
  {
    title: "Second snippet (hardcoded)",
    language: "C++",
    description: "The first snippet, but it's hardcoded",
    code: 'std::cout << "sup" << std::endl;',
  },
];

const updatedSnippet1: SnippetCreate = {
  title: "Updated snippet (hardcoded)",
  language: "Java",
  description: "The snippet is now Java! woah!!",
  code: 'System.out.println("hello world!")',
};

const updatedSnippet2: SnippetUpdate = {
  description: "We only updated the description this time!",
};

const tempLogin = new FormData();
// tempLogin.append("username", "user@example.com");
// tempLogin.append("password", "testpass1");
tempLogin.append("username", "foobar@gmail.com");
tempLogin.append("password", "foobarpass1");
const secondLogin = new FormData();
secondLogin.append("username", "johndoe@gmail.com");
secondLogin.append("password", "testpassword1!");

function HomePage() {
  const snippetsContext = useContext(SnippetsContext);
  if (!snippetsContext) {
    throw new Error("Failed to get snippets context");
  }
  const snippets = snippetsContext.snippets;
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("Failed to get auth context");
  }
  const currentUser = authContext.currentUser;
  return (
    <>
      <h1>Homepage</h1>
      <h2>Testing out services module functions</h2>
      {currentUser && (
        <h3>There is a logged in user! {currentUser.username}</h3>
      )}
      <h3>AuthService</h3>
      <Button onClick={async () => console.log(await loginUser(tempLogin))}>
        Log in user 2
      </Button>
      <Button onClick={async () => console.log(await loginUser(secondLogin))}>
        Log in user 3
      </Button>
      <Button onClick={async () => console.log(await getCurrentUser())}>
        Get current user
      </Button>
      <Button onClick={() => console.log(logout())}>Log out</Button>
      <Button onClick={() => console.log(getToken())}>Get token</Button>
      <Button
        onClick={() =>
          console.log(
            setToken({ access_token: "blargh", token_type: "blargh" }),
          )
        }
      >
        Set token to invalid
      </Button>
      <Button onClick={() => console.log(clearUserCache())}>
        Clear user cache
      </Button>

      <h3>SnippetsAPIService</h3>
      <Button onClick={async () => console.log(await getSnippets())}>
        Get snippets
      </Button>
      <Button onClick={async () => console.log(await createSnippet(data[0]))}>
        Create snippet 1
      </Button>
      <Button onClick={async () => console.log(await createSnippet(data[1]))}>
        Create snippet 2
      </Button>
      <Button onClick={async () => console.log(await getSnippet(2))}>
        Get snippet 2
      </Button>
      <Button
        onClick={async () =>
          console.log(await updateSnippetFull(2, updatedSnippet1))
        }
      >
        Update snippet 2 (full)
      </Button>
      <Button
        onClick={async () =>
          console.log(await updateSnippetPartial(2, updatedSnippet2))
        }
      >
        Update snippet 2 (partial)
      </Button>
      <Button onClick={async () => console.log(await deleteSnippet(2))}>
        Delete snippet 2
      </Button>

      <h3>UsersAPIService</h3>
      <Button onClick={async () => console.log(await getAllUsers())}>
        Get all users
      </Button>
      <Button onClick={async () => console.log(await createUser(user1))}>
        Create user 1
      </Button>
      <Button onClick={async () => console.log(await createUser(user2))}>
        Create user 2 (should error)
      </Button>
      <Button onClick={async () => console.log(await getUser(2))}>
        Get user 2
      </Button>
      <Button
        onClick={async () => console.log(await updateUser(2, updatedUser1))}
      >
        Update user 2
      </Button>
      <Button onClick={async () => console.log(await deleteUser(2))}>
        Delete user 2
      </Button>
      <Button onClick={async () => console.log(await getUserSnippets(2))}>
        Get user 2 snippets
      </Button>
      <h3>Snippets in DB</h3>
      <ul>
        {snippets.map((snippet) => {
          return <li key={snippet.id}>{snippet.title}</li>;
        })}
      </ul>
    </>
  );
}

export default HomePage;
