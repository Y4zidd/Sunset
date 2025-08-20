import { Metadata } from "next";
import Page from "./page";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Clans | osu!tosume",
  openGraph: {
    title: "Clans | osu!tosume",
  },
};

export default function ClanLeaderboardLayout() {
  return (
    <Suspense>
      <Page />
    </Suspense>
  );
}


