"use client";

import useSWRMutation from "swr/mutation";
import poster from "@/lib/services/poster";

export type ClanFileUpload = "avatar" | "banner";

export function useClanUpload(clanId: number | null) {
  return useSWRMutation(clanId ? `clan/${clanId}/upload` : null, clanUpload);
}

const clanUpload = async (
  url: string,
  { arg }: { arg: { file: File; type: ClanFileUpload; clanId: number } }
) => {
  const formData = new FormData();
  formData.append("file", arg.file);

  return await poster(`clan/${arg.clanId}/upload/${arg.type}`, {
    body: formData,
  });
};


