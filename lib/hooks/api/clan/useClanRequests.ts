"use client";

import useSWR from "swr";
import fetcher from "@/lib/services/fetcher";

export interface ClanJoinRequestItem {
  id: number;
  userId: number;
  clanId: number;
  status: string;
  createdAt: string;
}

export interface ClanJoinRequestsResponse {
  items: ClanJoinRequestItem[];
  page?: number;
  pageSize?: number;
}

export function useClanRequests(
  clanId: number | null,
  status: string = "Pending",
  page: number = 0,
  pageSize: number = 50
) {
  const key = clanId ? `clan/${clanId}/requests?status=${status}&page=${page}&pageSize=${pageSize}` : null;
  return useSWR<ClanJoinRequestsResponse | ClanJoinRequestItem[]>(key, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateIfStale: true,
    refreshInterval: 5000,
  });
}


