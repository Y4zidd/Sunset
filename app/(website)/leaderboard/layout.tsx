import { Metadata } from "next";
import PageLeaderboard from "./page";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Leaderboard | osu!tosume",
  openGraph: {
    title: "Leaderboard | osu!tosume",
  },
};

export default function Page() {
  return (
    <Suspense>
      <PageLeaderboard />
    </Suspense>
  );
}
