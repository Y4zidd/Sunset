"use client";

import useSWR from "swr";
import { GameMode } from "@/lib/types/api";

export interface ClanMemberItem {
  id: number;
  name: string;
  country?: string;
  rank?: string | null;
}

export interface ClanDetailResponse {
  id: number;
  tag: string;
  name: string;
  ownerId: number;
  createdAt: string;
  memberCount: number;
  members: ClanMemberItem[];
  owner?: { id: number; name: string } | null;
  ownerLastActive?: string | null;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  rankTotalPp?: number;
  rankAveragePp?: number;
  rankRankedScore?: number;
  rankAccuracy?: number;
  totalPp?: number;
  averagePp?: number;
  rankedScore?: number;
  accuracy?: number;
}

export function useClan(id: number | null, mode?: GameMode | null) {
  const key = id
    ? `clan/${id}${mode != null ? `?mode=${mode}` : ""}`
    : null;
  return useSWR<ClanDetailResponse>(key);
}


