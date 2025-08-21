"use client";

import useSWR from "swr";
import fetcher from "@/lib/services/fetcher";
import { GameMode } from "@/lib/types/api";

export enum ClanLeaderboardMetricUi {
  TotalPP = "TotalPP",
  AveragePP = "AveragePP",
  RankedScore = "RankedScore",
  Accuracy = "Accuracy",
}

export interface ClanLeaderboardItem {
  clanId: number;
  name: string;
  tag: string;
  ownerId: number;
  memberCount: number;
  value: number;
  avgAcc: number;
  playCount: number;
  rank: number;
  avatarUrl: string;
  bannerUrl: string;
}

export interface GetClanLeaderboardResponse {
  items: ClanLeaderboardItem[];
  page: number;
  pageSize: number;
}

export function useClansLeaderboard(
  metric: ClanLeaderboardMetricUi,
  mode: GameMode,
  page?: number,
  pageSize?: number
) {
  const params = [
    `metric=${metric}`,
    `mode=${mode}`,
    page ? `page=${page}` : null,
    pageSize ? `pageSize=${pageSize}` : null,
  ]
    .filter(Boolean)
    .join("&");

  return useSWR<GetClanLeaderboardResponse>(
    `clan/leaderboard?${params}`,
    fetcher,
    { keepPreviousData: true }
  );
}


