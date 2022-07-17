import type { Prisma } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
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

const Index: NextPage<ServerSideProps> = ({ tree }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <pre className="max-w-lg ">{JSON.stringify(tree, null, 2)}</pre>
    </div>
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

  return {
    props: {
      tree,
    },
  };
};

export default Index;
