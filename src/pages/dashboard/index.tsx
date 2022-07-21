import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useMemo } from "react";
import { InferQueryOutput, trpc } from "utils/trpc";
import { z } from "zod";
import { useZorm } from "react-zorm";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faCircleUser,
  faLayerGroup,
  faLink,
} from "@fortawesome/free-solid-svg-icons";

import { useRouter } from "next/router";

import { DashboardNavbar } from "@components/navbar/dashboard-navbar";
import ErrorLabel from "@components/error-label";
import nFormatter from "@components/analytics/nFormatter";

const Index: NextPage = () => {
  const { data: user, isLoading: userLoading } = trpc.useQuery([
    "dashboard.get-user-info",
  ]);
  const {
    data: dashboard,
    isLoading: treeLoading,
    isError: treeError,
  } = trpc.useQuery(["dashboard.get-dashboard"], {
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col">
        <div className="flex flex-col space-y-4 px-4 sm:px-8 md:px-16 lg:px-24">
          <DashboardNavbar />
          <main>
            <div className=" kard flex flex-col p-6">
              <div className="flex flex-row">
                <div className="flex flex-1 flex-row space-x-6">
                  {user?.image ? (
                    <div className="avatar h-16 w-16 sm:h-24 sm:w-24">
                      <img
                        src={user.image}
                        className="mask mask-hexagon h-auto w-auto rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="avatar placeholder">
                      <div
                        className={`mask mask-hexagon w-16 rounded-full bg-base-100 sm:w-24 ${
                          userLoading && "animate-pulse"
                        }`}
                      ></div>
                    </div>
                  )}
                  <div className="grid grid-rows-3">
                    <div className="flex items-end">Welcome back,</div>
                    <div className="text-2xl font-bold">{user?.name || ""}</div>
                    <div className="flex items-start">You look nice today!</div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <Link href="/settings/account" passHref>
                    <a
                      role="button"
                      className="btn btn-outline btn-sm gap-2 normal-case"
                    >
                      <FontAwesomeIcon icon={faCircleUser} />
                      Account
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              {dashboard && (
                <div className="flex flex-col py-6">
                  {!dashboard.tree ? (
                    <DashboardCreate />
                  ) : (
                    <div className="flex flex-row flex-wrap gap-4">
                      <DashboardTree tree={dashboard.tree} />
                      {dashboard.analytics && (
                        <DashboardAnalytics
                          analytics={dashboard.analytics}
                          withdrawEnabled={dashboard.withdraw ? true : false}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

const createTreeSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(20)
    .regex(/^@/, { message: "Must start with a @" })
    .regex(/[A-Za-z0-9!@#$%^&*()_+-=\[\]{};':"\\|,.<>?]/, {
      message: "Only alphanumeric and specials characters",
    }),
});

const DashboardCreate: React.FC = () => {
  const router = useRouter();
  const createTree = trpc.useMutation(["tree.create-tree"], {
    onSuccess: (data) => {
      router.push({
        pathname: "/dashboard/tree",
      });
    },
  });

  const checkSlug = trpc.useMutation(["tree.check-slug"]);
  const zo = useZorm("create-tree", createTreeSchema, {
    customIssues: checkSlug.data?.issues,
    onValidSubmit(e) {
      e.preventDefault();
      createTree.mutate({ slug: e.data.slug });
    },
  });
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-2xl font-bold">Create your tree first !</div>
      <form ref={zo.ref}>
        <div className="flex flex-col space-y-1">
          <label htmlFor="slug_id" className="text-xs">
            Your slug:
          </label>
          <div className="flex flex-row space-x-4">
            <input
              id="slug_id"
              type="text"
              name={zo.fields.slug()}
              placeholder="@folllow.link"
              className="input input-bordered w-full max-w-xs"
              onBlur={(event) => {
                const validateBeforeTry = z
                  .string()
                  .regex(/^@/)
                  .safeParse(event.target.value);

                if (validateBeforeTry.success) {
                  checkSlug.mutate({ slug: event.target.value });
                }
              }}
            />
            <button
              type="submit"
              className="btn normal-case"
              disabled={
                zo.validation?.success === false ||
                !!checkSlug.data?.issues.length
              }
            >
              Create
            </button>
          </div>
          {zo.errors.slug((err) => {
            return <ErrorLabel message={err.message} />;
          })}
          <div className="pt-2">
            {zo.errors.slug((err) => {
              return <ErrorLabel message={err.message} />;
            })}
          </div>
        </div>
      </form>
    </div>
  );
};

type DashboardTreeProps = Pick<
  NonNullable<InferQueryOutput<"dashboard.get-dashboard">>,
  "tree"
>;

const DashboardTree: React.FC<DashboardTreeProps> = (props) => {
  return (
    <div className=" kard flex flex-1 flex-row flex-wrap items-center gap-2 p-6 ">
      <div className="flex flex-1 flex-row items-center space-x-4">
        {props.tree?.image ? (
          <div className="avatar h-16 w-16 sm:h-24 sm:w-24">
            <img
              src={props.tree.image}
              className="h-auto w-auto rounded-full"
            />
          </div>
        ) : (
          <div className="avatar placeholder">
            <div className="w-24 rounded-full bg-base-100"></div>
          </div>
        )}
        <div>
          <Link href="/dashboard/me">
            <a className="text-xl font-bold hover:opacity-75">
              {props.tree?.slug}
            </a>
          </Link>
          <div>{props.tree?.bio || "No bio yet"}</div>
        </div>
      </div>
      <div className="flex flex-row justify-center gap-2 lg:flex-col">
        <Link href="/dashboard/tree" passHref>
          <a
            role="button"
            className="btn btn-outline btn-sm flex-nowrap justify-start gap-2 normal-case"
          >
            <FontAwesomeIcon icon={faLayerGroup} />
            Manage
          </a>
        </Link>
        <Link href="/dashboard/tree" passHref>
          <a
            role="button"
            className="btn btn-outline btn-sm flex-nowrap justify-start gap-2 normal-case"
          >
            <FontAwesomeIcon icon={faLink} />
            Link
          </a>
        </Link>
      </div>
    </div>
  );
};

type DashboardAnalytics = Pick<
  NonNullable<InferQueryOutput<"dashboard.get-dashboard">>,
  "analytics"
>;

interface DashboardAnalyticsProps {
  analytics: DashboardAnalytics["analytics"];
  withdrawEnabled: boolean;
}

const PercentChange = (originalValue: number, newValue: number) => {
  let value: number = 0;
  if (newValue > originalValue) {
    value = ((newValue - originalValue) / originalValue) * 100;
  } else {
    value = ((originalValue - newValue) / originalValue) * 100;
  }

  return value;
};

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = (props) => {
  const totalMonthClicks = useMemo(() => {
    const now = new Date();
    let filteredMonth = props.analytics?.clicks.filter(
      (click) =>
        click.created_at.getMonth() === now.getMonth() &&
        click.created_at.getFullYear() === now.getFullYear()
    );

    return filteredMonth?.length || 0;
  }, [props.analytics]);

  const totalLastMonthClicks = useMemo(() => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    let filteredMonth = props.analytics?.clicks.filter(
      (click) =>
        click.created_at.getMonth() === lastMonth.getMonth() &&
        click.created_at.getFullYear() === lastMonth.getFullYear()
    );

    return filteredMonth?.length || 0;
  }, [props.analytics]);

  const totalMonthViews = useMemo(() => {
    const now = new Date();
    let filteredMonth = props.analytics?.views.filter(
      (view) =>
        view.created_at.getMonth() === now.getMonth() &&
        view.created_at.getFullYear() === now.getFullYear()
    );
    return filteredMonth?.length || 0;
  }, [props.analytics]);

  const totalLastMonthViews = useMemo(() => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    let filteredMonth = props.analytics?.clicks.filter(
      (click) =>
        click.created_at.getMonth() === lastMonth.getMonth() &&
        click.created_at.getFullYear() === lastMonth.getFullYear()
    );

    return filteredMonth?.length || 0;
  }, [props.analytics]);

  const estimatedRevenues = useMemo(() => {
    const AdSenseEstimationPerView = 0.10404;
    const now = new Date();
    let filteredMonth = props.analytics?.views.filter(
      (view) =>
        view.created_at.getMonth() === now.getMonth() &&
        view.created_at.getFullYear() === now.getFullYear()
    );

    return (filteredMonth?.length || 0) * AdSenseEstimationPerView;
  }, [props.analytics]);

  const percentClicksThanLastMonth =
    totalLastMonthClicks === 0
      ? 0
      : PercentChange(totalLastMonthClicks, totalMonthClicks);

  const percentViewsThanLastMonth =
    totalLastMonthViews === 0
      ? 0
      : PercentChange(totalLastMonthViews, totalMonthViews);

  return (
    <div className="kard flex flex-1 flex-col space-y-2 p-2">
      <div className="stats stats-vertical bg-base-200 lg:stats-horizontal">
        <div className="stat">
          <div className="stat-title font-medium">Total Clicks</div>
          <div className="stat-value text-primary">
            {nFormatter(totalMonthClicks, 1)}
          </div>
          <div className="stat-desc">
            {percentClicksThanLastMonth > 0 && (
              <p>
                {percentClicksThanLastMonth.toFixed(2)}%{" "}
                {totalLastMonthClicks === totalMonthClicks
                  ? "Wow, the same of the last month !"
                  : totalMonthClicks > totalLastMonthClicks
                  ? "more"
                  : "less"}{" "}
                than last month
              </p>
            )}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title font-medium">Page Views</div>
          <div className="stat-value text-secondary">
            {nFormatter(totalMonthViews, 1)}
          </div>
          <div className="stat-desc">
            {percentViewsThanLastMonth > 0 && (
              <p>
                {percentViewsThanLastMonth.toFixed(2)}%{" "}
                {totalLastMonthViews === totalMonthViews
                  ? "Wow, the same of the last month !"
                  : totalMonthViews > totalLastMonthViews
                  ? "more"
                  : "less"}{" "}
                than last month
              </p>
            )}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title font-medium">Estimated Revenues</div>
          {props.withdrawEnabled ? (
            <div className="stat-value text-neutral">
              <p>{estimatedRevenues.toFixed(2)}$</p>
            </div>
          ) : (
            <div className="stat-value text-red-400 hover:underline hover:opacity-75">
              <Link href="/info/help#payment" passHref>
                <a>Disabled</a>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row-reverse">
        <Link href="/dashboard/analytics" passHref>
          <a
            role="button"
            className="btn btn-ghost btn-sm gap-2 normal-case text-primary"
          >
            <FontAwesomeIcon icon={faChartSimple} />
            Analytics
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Index;
