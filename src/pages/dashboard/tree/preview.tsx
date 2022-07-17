import { NextPage } from "next";
import { useSyncExternalStore } from "react";
import { SocialMedia } from "utils/shared";

interface treeLocalStorage {
  slug?: string | null;
  bio?: string | null;
  theme?: string | null;
  image?: string | null;
  ads_enabled?: boolean;
  links?: {
    id: string;
    position: number;
    media: SocialMedia;
    url: string;
  }[];
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
  };
}

function useTreeLocalStorage() {
  return useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem("tree"),
    () => null
  );
}

const Index: NextPage = () => {
  const treeLocalStorage = useTreeLocalStorage();
  const tree: treeLocalStorage | null = treeLocalStorage
    ? JSON.parse(treeLocalStorage)
    : null;
  if (!tree) return <div>not tree dude</div>;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <pre className="max-w-lg ">{JSON.stringify(tree, null, 2)}</pre>
    </div>
  );
};

export default Index;
