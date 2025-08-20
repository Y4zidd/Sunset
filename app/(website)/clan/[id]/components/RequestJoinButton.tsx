"use client";

import { Button } from "@/components/ui/button";
import poster from "@/lib/services/poster";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface RequestJoinButtonProps {
  clanId: number;
}

export default function RequestJoinButton({ clanId }: RequestJoinButtonProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const onClick = async () => {
    try {
      setSubmitting(true);
      await poster<{ message: string }>("clan/request", {
        json: { clanId },
      });
      toast({ title: "Request sent", description: "Your join request has been submitted." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Failed", description: err?.message ?? "Unable to request join" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Button disabled={submitting} onClick={onClick} className="w-9 md:w-auto">
      <span className="hidden md:inline">Request join</span>
      <span className="md:hidden">Join</span>
    </Button>
  );
}



