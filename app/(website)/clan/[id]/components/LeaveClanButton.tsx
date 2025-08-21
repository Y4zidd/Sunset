"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useSelf from "@/lib/hooks/useSelf";
import { useLeaveClanMutation } from "@/lib/hooks/api/clan/useClanActions";
import { useState } from "react";
import { mutate } from "swr";

export default function LeaveClanButton({ clanId }: { clanId: number }) {
  const { toast } = useToast();
  const { revalidate } = useSelf();
  const [loading, setLoading] = useState(false);

  const { trigger: leaveClan } = useLeaveClanMutation();

  const leave = async () => {
    setLoading(true);
    await leaveClan()
      .then(() => {
        toast({ title: "Left clan", description: "You have left the clan." });
      })
      .catch((err: any) => {
        toast({ variant: "destructive", title: "Failed", description: err?.message ?? "Unable to leave clan" });
      });
    revalidate();
    try { localStorage.removeItem(`clanJoinPending:${clanId}`); } catch {}
    try { mutate(`clan/${clanId}/request/status`); } catch {}
    setLoading(false);
  };

  return (
    <Button onClick={leave} disabled={loading} variant="destructive">
      Leave clan
    </Button>
  );
}


