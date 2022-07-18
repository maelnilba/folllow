import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { prisma } from "../../server/db/client";

const Index: NextPage = () => {
  return <div></div>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) {
    return {
      redirect: {
        destination: `/sign-in`,
        permanent: false,
      },
    };
  }

  const data = await prisma.tree.findFirst({
    where: {
      userId: session?.user?.id,
    },
  });

  if (!data) {
    return {
      redirect: {
        destination: `/dashboard`,
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: `/${data.slug}`,
      permanent: false,
    },
  };
};

export default Index;
