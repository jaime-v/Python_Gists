/**
 * App.tsx
 *
 *

Random waiting function to test loading
  // Waiting function
  const wait = (s: number) =>
    new Promise((resolve) => setTimeout(resolve, s * 1000));

 */
import "./App.css";

import {
  LoginPage,
  SnippetCreationPage,
  SnippetsPage,
  SnippetDetailsPage,
  UserProfilePage,
  CreateUserPage,
} from "@pages";
import {
  Footer,
  Header,
  UserProfileEdit,
  SnippetDetailsEdit,
  Notification,
} from "@components";
import useInitSnippets from "@hooks/useInitSnippets";
import { SnippetsContext } from "@context/SnippetsContext";
import { Outlet, Route, Routes } from "react-router-dom";
import { AuthContext } from "@context/AuthContext";
import useAuth from "@hooks/useAuth";
import { NotificationContext } from "@context/NotificationContext";
import useNotif from "@hooks/useNotif";
import { Container } from "react-bootstrap";

function Layout({ notifActive }: { notifActive: boolean }) {
  return (
    <Container fluid className="d-flex flex-column min-vh-100">
      <Header />
      <div className="flex-grow-1">
        <Outlet />
        <Notification notifActive={notifActive} />
      </div>
      <Footer />
    </Container>
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
  const {
    notifActive,
    setNotifActive,
    notifVariant,
    setNotifVariant,
    notifText,
    setNotifText,
  } = useNotif();
  return (
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
        <NotificationContext.Provider
          value={{
            setNotifActive,
            notifVariant,
            setNotifVariant,
            notifText,
            setNotifText,
          }}
        >
          <Routes>
            <Route path="/" element={<Layout notifActive={notifActive} />}>
              <Route index element={<SnippetsPage />} />
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
              <Route path="*" element={<h1>404 Page</h1>} />
            </Route>
          </Routes>
        </NotificationContext.Provider>
      </SnippetsContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
