"use client";

import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ApprovePendingButtonProps {
  className?: string;
  onApprove?: () => void;
  onDeny?: () => void;
}

// Placeholder UI: wiring ke API akan ditambahkan setelah endpoint join-requests diintegrasikan ke frontend
export default function ApprovePendingButton({ className, onApprove, onDeny }: ApprovePendingButtonProps) {
  return (
    <div className={`flex gap-2 ${className ?? ""}`}>
      <Button onClick={onApprove} className="w-9 md:w-auto" variant="default">
        <Check className="w-4 h-4" />
        <span className="hidden md:inline ml-2">Approve pending</span>
      </Button>
      <Button onClick={onDeny} className="w-9 md:w-auto" variant="destructive">
        <X className="w-4 h-4" />
        <span className="hidden md:inline ml-2">Deny</span>
      </Button>
    </div>
  );
}


