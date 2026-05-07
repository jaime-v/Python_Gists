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
  UserProfilePage,
  CreateUserPage,
} from "@pages";
import {
  Footer,
  Header,
  UserProfileEdit,
  SnippetDetailsEdit,
} from "@components";
import useInitSnippets from "@hooks/useInitSnippets";
import { SnippetsContext } from "@context/SnippetsContext";
import { Outlet, Route, Routes } from "react-router-dom";
import { AuthContext } from "@context/AuthContext";
import useAuth from "@hooks/useAuth";

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
  const { snippets, setSnippets, snippetsLoading, setSnippetsLoading } =
    useInitSnippets();
  const {
    currentUser,
    setCurrentUser,
    loggedIn,
    setLoggedIn,
    userLoading,
    setUserLoading,
  } = useAuth();
  return (
    <>
      <AuthContext.Provider
        value={{
          currentUser,
          setCurrentUser,
          loggedIn,
          setLoggedIn,
          userLoading,
          setUserLoading,
        }}
      >
        <SnippetsContext.Provider
          value={{
            snippets,
            setSnippets,
            snippetsLoading,
            setSnippetsLoading,
          }}
        >
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="snippets" element={<SnippetsPage />} />
              <Route path="snippet/:title" element={<SnippetDetailsPage />}>
                <Route path="edit" element={<SnippetDetailsEdit />} />
              </Route>
              <Route path="create" element={<SnippetCreationPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<CreateUserPage />} />
              <Route path="user/:username" element={<UserProfilePage />}>
                <Route path="edit" element={<UserProfileEdit />} />
              </Route>
            </Route>
          </Routes>
        </SnippetsContext.Provider>
      </AuthContext.Provider>
    </>
  );
}

export default App;
