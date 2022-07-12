import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export const DashboardNavbar = () => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-row p-6 items-center">
      <div className="flex flew-row flex-1 items-center justify-start space-x-10">
        <div className="text-4xl font-bold">Folllow.</div>
      </div>
      <div className="flex flew-row items-center justify-start space-x-10">
        <div className="flex flex-row space-x-8 items-center">
          <Link href="/info/help" passHref>
            <button className="btn btn-ghost normal-case font-bold">
              Help
            </button>
          </Link>

          <div className="dropdown dropdown-end">
            {session?.user ? (
              <label tabIndex={0} className="avatar w-12 hover:cursor-pointer ">
                <img
                  src={session.user.image || ""}
                  className="w-auto h-auto mask mask-hexagon"
                />
              </label>
            ) : (
              <label className="avatar placeholder w-12 hover:cursor-pointer">
                <div className="bg-base-200 rounded-full w-24 mask mask-hexagon"></div>
              </label>
            )}
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li role="button">
                <a>Settings</a>
              </li>
              <li
                role="button"
                onClick={() =>
                  signOut({
                    callbackUrl: "/",
                  })
                }
              >
                <a>Log out</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
