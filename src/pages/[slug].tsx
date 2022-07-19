import { SocialMediaComponent } from "@components/social-medias-components";
import type { Prisma } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useMemo } from "react";
import type { SocialMediaLink } from "utils/shared";
import { prisma } from "../server/db/client";

interface ServerSideProps {
  tree: {
    slug: string;
    links: Prisma.JsonValue;
    bio: string | null;
    theme: string;
    image: string | null;
    ads_enabled: boolean;
  };
}

function parsePrisma<T>(json: Prisma.JsonValue): T {
  if (typeof json === "string") {
    return JSON.parse(json);
  } else return JSON.parse(JSON.stringify(json));
}

const Index: NextPage<ServerSideProps> = ({ tree }) => {
  const links = useMemo(
    () =>
      tree?.links
        ? parsePrisma<SocialMediaLink[]>(tree?.links)
        : ([] as SocialMediaLink[]),
    [tree]
  );
  return (
    <>
      <Head>
        <title>{`${tree.slug} | Folllow.link`}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div data-theme={tree.theme}>
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-base-100 to-base-300">
          <div className="flex w-full max-w-[760px] flex-col items-center space-y-4 p-10">
            {tree?.image ? (
              <div className="avatar h-24 w-24 drop-shadow-2xl">
                <img src={tree.image} className="h-auto w-auto rounded-full" />
              </div>
            ) : (
              <div className="avatar placeholder drop-shadow-2xl">
                <div className="w-24 rounded-full bg-base-100"></div>
              </div>
            )}
            <h1 className="text-lg font-bold">{tree.slug}</h1>
            {tree.bio && <h2 className="text-md text-justify">{tree.bio}</h2>}
            <div className="flex w-full flex-col items-center space-y-2 py-4 ">
              {links.map((link) => (
                <a
                  className="btn btn-lg flex w-full normal-case"
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <SocialMediaComponent
                    media={link.media}
                    className="flew-row relative flex w-full items-center justify-center font-light"
                    iconClassName="absolute left-0 text-2xl"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    query: { slug },
  } = context;

  if (!slug || typeof slug !== "string") {
    return {
      notFound: true,
    };
  }

  if (!slug.startsWith("@")) {
    return {
      redirect: {
        destination: `@${slug}`,
        permanent: true,
      },
    };
  }

  const tree = await prisma.tree.findUnique({
    where: {
      slug: slug,
    },
    select: {
      links: true,
      bio: true,
      theme: true,
      image: true,
      ads_enabled: true,
      slug: true,
    },
  });

  if (!tree) {
    return {
      notFound: true,
    };
  }

  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  return {
    props: {
      tree,
    },
  };
};

export default Index;
