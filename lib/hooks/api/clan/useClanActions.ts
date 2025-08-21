"use client";

import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import fetcher from "@/lib/services/fetcher";
import poster from "@/lib/services/poster";

interface ClanJoinRequestStatusResponse {
  pending: boolean;
}

export function useClanJoinRequestStatus(clanId: number | null) {
  const key = clanId ? `clan/${clanId}/request/status` : null;
  return useSWR<ClanJoinRequestStatusResponse>(key, fetcher);
}

export function useClanJoinRequestMutation(clanId: number) {
  const key = `clan/${clanId}/request/status`;
  return useSWRMutation(
    key,
    async () => {
      await poster("clan/request", { json: { clanId } });
      mutate(key);
    }
  );
}

export function useClanJoinRevokeMutation(clanId: number) {
  const key = `clan/${clanId}/request/status`;
  return useSWRMutation(
    key,
    async () => {
      await poster("clan/request/revoke", { json: { clanId } });
      mutate(key);
    }
  );
}

export function useLeaveClanMutation() {
  const key = `clan/leave`;
  return useSWRMutation(key, async () => {
    await poster("clan/leave");
    mutate("user/self");
  });
}

export function useApproveClanRequestMutation(clanId: number) {
  const listKey = `clan/${clanId}/requests?status=Pending&page=0&pageSize=50`;
  return useSWRMutation(listKey, async (_url: string, { arg }: { arg: { requestId: number; targetUserId: number } }) => {
    await poster("clan/requests/approve", { json: arg });
    mutate(listKey);
  });
}

export function useDenyClanRequestMutation(clanId: number) {
  const listKey = `clan/${clanId}/requests?status=Pending&page=0&pageSize=50`;
  return useSWRMutation(listKey, async (_url: string, { arg }: { arg: { requestId: number } }) => {
    await poster("clan/requests/deny", { json: arg });
    mutate(listKey);
  });
}


