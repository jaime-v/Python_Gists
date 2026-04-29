import "./App.css";

/*
Components of the frontend will be:
Header (NavBar, Website Title, Logged in User, Login/Sign out Button)
Main (Varies depending on page)
  Snippets Page (List/Grid of all snippets with sorting, filtering, searching, user's own snippets, Read Snippet)
  User Profile Page (All user information + Update user information, Update/Delete User)
  User Login Page (Login page)
  User Creation Page (Create user)
  User Public Page (Publicly available user information, Read User)
  Snippet Creation Page (Form for creating a snippet and uploading, Create Snippet)
  Snippet Modification Page (Current snippet and update snippet, Update/Delete Snippet)
  Toast/Modal for Notifications
Footer (Summary message)

Contexts:
(Things that should be available on different pages, but not passed as props)
Logged in user (basically a global thing -- i think this is context, i guess i can figure it out later)
Snippets (the data that we display on the frontend, updates on create/update/delete snippet, delete user)

Hooks:
Fetch Snippets
Really any component that uses multiple hooks should have a custom hook

Services:
Anything that interacts with backend service, creating data for backend service, etc.

Qs:
How to fetch from my own backend?
How to manage login?

*/
import {
  LoginPage,
  SnippetCreationPage,
  SnippetsPage,
  SnippetDetailsPage,
  UserPrivateProfilePage,
  UserPublicProfilePage,
} from "@pages";
import type { UserPrivate, Snippet } from "@models";

const user1: UserPrivate = {
  username: "johndoe",
  email: "johndoe@gmail.com",
  id: 1,
};

const user2: UserPrivate = {
  username: "janedoe",
  email: "janedoe@gmail.com",
  id: 2,
};

// Just some hardcoded data for snippets
const data: Snippet[] = [
  {
    title: "First snippet (hardcoded)",
    language: "Python",
    description: "The first snippet, but it's hardcoded",
    code: "print('hello world!')",
    id: 1,
    owner: user1,
    creation_date: new Date(),
    last_updated_date: new Date(),
  },
  {
    title: "Second snippet (hardcoded)",
    language: "C++",
    description: "The first snippet, but it's hardcoded",
    code: 'std::cout << "sup" << std::endl;',
    id: 2,
    owner: user2,
    creation_date: new Date(),
    last_updated_date: new Date(),
  },
];
function Header() {
  return (
    <header>
      <h1>Code Snippets App Thing</h1>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <h2>
        Full-Stack App with React TypeScript Frontend, FastAPI Python Backend,
        PostgreSQL Database
      </h2>
    </footer>
  );
}

function App() {
  return (
    <>
      <Header />
      <hr />
      <LoginPage />
      <hr />
      <SnippetCreationPage />
      <hr />
      <SnippetsPage data={data} />
      <hr />
      <SnippetDetailsPage snippet={data[0]} />
      <hr />
      <UserPrivateProfilePage user={user1}></UserPrivateProfilePage>
      <hr />
      <UserPublicProfilePage user={user2}></UserPublicProfilePage>
      <hr />
      <Footer />
    </>
  );
}

export default App;
