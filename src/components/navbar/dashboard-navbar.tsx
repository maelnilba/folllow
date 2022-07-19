import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export const DashboardNavbar = () => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-row items-center p-6">
      <div className="flew-row flex flex-1 items-center justify-start space-x-10">
        <div className="text-4xl font-bold">Folllow.</div>
      </div>
      <div className="flew-row flex items-center justify-start space-x-10">
        <div className="flex flex-row items-center space-x-8">
          <Link href="/info/help" passHref>
            <button className="btn btn-ghost font-bold normal-case">
              Help
            </button>
          </Link>

          <div className="dropdown-end dropdown">
            {session?.user ? (
              <label
                tabIndex={0}
                className="avatar h-12 w-12 hover:cursor-pointer "
              >
                <img
                  src={session.user.image || ""}
                  className="mask mask-hexagon h-auto w-auto"
                />
              </label>
            ) : (
              <label className="avatar placeholder h-12 w-12 hover:cursor-pointer">
                <div className="mask mask-hexagon w-24 rounded-full bg-base-200"></div>
              </label>
            )}
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
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
