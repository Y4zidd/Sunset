"use client";

import fetcher from "@/lib/services/fetcher";
import useSWR from "swr";

export type ClanLeaderboardItem = {
  clanId: number;
  name: string;
  tag: string;
  ownerId: number;
  memberCount: number;
  value: number;
  rank: number;
};

export type ClanLeaderboardResponse = {
  items: ClanLeaderboardItem[];
  page: number;
  pageSize: number;
};

export function useClansLeaderboard(
  metric: string,
  mode: string,
  page?: number,
  pageSize?: number
) {
  return useSWR<ClanLeaderboardResponse>(
    `clan/leaderboard?metric=${metric}&mode=${mode}${page ? `&page=${page}` : ""}${
      pageSize ? `&pageSize=${pageSize}` : ""
    }`,
    fetcher,
    { keepPreviousData: true }
  );
}
