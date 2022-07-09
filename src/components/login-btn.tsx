import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();
  if (!session) {
    return (
      <>
        Not signed in <br />
        <button className="bg-blue-300 p-2 rounded-md" onClick={() => signIn()}>
          Sign in
        </button>
      </>
    );
  }
  return (
    <>
      Signed in as {session.user?.email} <br />
      <button className="bg-blue-300 p-2 rounded-md" onClick={() => signOut()}>
        Sign out
      </button>
    </>
  );
}
