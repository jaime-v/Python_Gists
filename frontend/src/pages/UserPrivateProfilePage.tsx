/*
UserPrivateProfilePage.tsx

Page for displaying a user profile that is logged in
Edits can be made with a modal using URL/edit/<section>
*/
import type { UserPrivate } from "@models";

function UserPrivateProfilePage({ user }: { user: UserPrivate }) {
  return (
    <>
      <h1>{user.username} Private Page</h1>
      <h2>
        More content here supposedly, we need to grab all the snippets the user
        owns
      </h2>
      <h3>Email: {user.email}</h3>
      <h4>ID: {user.id}</h4>
    </>
  );
}

export default UserPrivateProfilePage;
