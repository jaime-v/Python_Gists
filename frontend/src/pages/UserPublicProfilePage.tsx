/*
UserPublicProfilePage.tsx

Page for displaying a user profile that is not the logged in user
*/
import type { UserPublic } from "@models";

function UserPublicProfilePage({ user }: { user: UserPublic }) {
  return (
    <>
      <h1>{user.username} Public Page</h1>
      <h2>
        More content here supposedly, we need to grab all the snippets the user
        owns
      </h2>
    </>
  );
}

export default UserPublicProfilePage;
