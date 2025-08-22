"use client";

import { Button } from "@/components/ui/button";
import poster from "@/lib/services/poster";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import {
  useClanJoinRequestMutation,
  useClanJoinRevokeMutation,
  useClanJoinRequestStatus,
} from "@/lib/hooks/api/clan/useClanActions";

interface RequestJoinButtonProps {
  clanId: number;
}

export default function RequestJoinButton({ clanId }: RequestJoinButtonProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [pending, setPending] = useState<boolean>(false);

  const { data: statusData, mutate: revalidateStatus } = useClanJoinRequestStatus(clanId);
  const { trigger: sendRequest } = useClanJoinRequestMutation(clanId);
  const { trigger: revokeRequestMutation } = useClanJoinRevokeMutation(clanId);

  useEffect(() => {
    let mounted = true;
    if (typeof window !== "undefined") {
      try {
        if (localStorage.getItem(`clanJoinPending:${clanId}`) === "1") {
          setPending(true);
        }
      } catch {}
    }
    if (statusData) {
      const nextPending = !!statusData.pending;
      setPending(nextPending);
      try {
        if (nextPending) localStorage.setItem(`clanJoinPending:${clanId}`, "1");
        else localStorage.removeItem(`clanJoinPending:${clanId}`);
      } catch {}
    }
    return () => { mounted = false; };
  }, [clanId, statusData]);

  const requestJoin = async () => {
    setSubmitting(true);
    setPending(true);
    try { localStorage.setItem(`clanJoinPending:${clanId}`, "1"); } catch {}
    await sendRequest()
      .then(() => {
        toast({ title: "Request sent", description: "Your join request has been submitted." });
        try { revalidateStatus(); } catch {}
      })
      .catch((err: any) => {
        setPending(false);
        try { localStorage.removeItem(`clanJoinPending:${clanId}`); } catch {}
        toast({ variant: "destructive", title: "Failed", description: err?.message ?? "Unable to request join" });
      });
    setSubmitting(false);
  };

  const revokeRequest = async () => {
    setSubmitting(true);
    setPending(false);
    try { localStorage.removeItem(`clanJoinPending:${clanId}`); } catch {}
    await revokeRequestMutation()
      .then(() => {
        toast({ title: "Request canceled", description: "Your join request has been revoked." });
        try { revalidateStatus(); } catch {}
      })
      .catch((err: any) => {
        setPending(true);
        try { localStorage.setItem(`clanJoinPending:${clanId}`, "1"); } catch {}
        toast({ variant: "destructive", title: "Failed", description: err?.message ?? "Unable to revoke join request" });
      });
    setSubmitting(false);
  };

  return (
    <Button
      disabled={submitting}
      onClick={pending ? revokeRequest : requestJoin}
      className="w-9 md:w-auto"
      variant={pending ? "destructive" : undefined}
    >
      {pending ? (
        <>
          <span className="hidden md:inline">Cancel request</span>
          <span className="md:hidden">Cancel</span>
        </>
      ) : (
        <>
          <span className="hidden md:inline">Request join</span>
          <span className="md:hidden">Join</span>
        </>
      )}
    </Button>
  );
}



