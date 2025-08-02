import { Metadata } from "next";
import TopPlaysPage from "./page";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Top Plays | osu!tosume",
  openGraph: {
    title: "Top Plays | osu!tosume",
  },
};

export default function Page() {
  return (
    <Suspense>
      <TopPlaysPage />
    </Suspense>
  );
}
