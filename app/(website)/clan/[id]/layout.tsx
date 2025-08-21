import { Metadata } from "next";
import { notFound } from "next/navigation";
import fetcher from "@/lib/services/fetcher";

interface ClanDetailResponse {
  id: number;
  tag: string;
  name: string;
}

export const revalidate = 60;

export async function generateMetadata(props: {
  params: Promise<{ id: number }>;
}): Promise<Metadata> {
  const params = await props.params;
  const clan = await fetcher<ClanDetailResponse>(`clan/${params.id}`);

  if (!clan) {
    return notFound();
  }

  return {
    title: `${clan.name} · Clan | osu!tosume`,
    description: `Details for clan ${clan.name} [${clan.tag}]`,
    openGraph: {
      siteName: "osu!tosume",
      title: `${clan.name} · Clan | osu!tosume`,
      description: `Details for clan ${clan.name} [${clan.tag}]`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}



