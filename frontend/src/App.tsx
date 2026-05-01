/**
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
 *
 */
import "./App.css";

import {
  LoginPage,
  SnippetCreationPage,
  SnippetsPage,
  SnippetDetailsPage,
  HomePage,
  UserPage,
} from "@pages";
import { Footer, Header } from "@components";
import useFetchSnippets from "@hooks/useFetchSnippets";
import { SnippetsContext } from "@context/SnippetsContext";
import { Outlet, Route, Routes } from "react-router-dom";

// const user1: UserPrivate = {
//   username: "johndoe",
//   email: "johndoe@gmail.com",
//   id: 1,
// };

// const user2: UserPrivate = {
//   username: "janedoe",
//   email: "janedoe@gmail.com",
//   id: 2,
// };

// Just some hardcoded data for snippets
// const data: Snippet[] = [
//   {
//     title: "First snippet (hardcoded)",
//     language: "Python",
//     description: "The first snippet, but it's hardcoded",
//     code: "print('hello world!')",
//     id: 1,
//     owner: user1,
//     creation_date: new Date(),
//     last_updated_date: new Date(),
//   },
//   {
//     title: "Second snippet (hardcoded)",
//     language: "C++",
//     description: "The first snippet, but it's hardcoded",
//     code: 'std::cout << "sup" << std::endl;',
//     id: 2,
//     owner: user2,
//     creation_date: new Date(),
//     last_updated_date: new Date(),
//   },
// ];

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  const { snippets, setSnippets, loading, setLoading } = useFetchSnippets();
  return (
    <>
      <SnippetsContext.Provider
        value={{ snippets, setSnippets, loading, setLoading }}
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="snippets" element={<SnippetsPage />} />
            <Route path="snippet/:title" element={<SnippetDetailsPage />} />
            <Route path="create" element={<SnippetCreationPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="user/:username" element={<UserPage />} />
          </Route>
        </Routes>
        {/*
        <Header />
        <hr />
        <LoginPage />
        <hr />
        <SnippetCreationPage />
        <hr />
        <h1>APP STUFF</h1>
        <ul>
          {snippets.map((snippet) => {
            return <li key={snippet.id}>{snippet.title}</li>;
          })}
        </ul>
        <Footer />

        */}
      </SnippetsContext.Provider>
    </>
  );
}

export default App;
