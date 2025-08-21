"use client";

import ImageSelect from "@/components/General/ImageSelect";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { useClanUpload } from "@/lib/hooks/api/clan/useClanUpload";
import { mutate } from "swr";
import { CloudUpload } from "lucide-react";

type Props = {
  clanId: number;
  type: "avatar" | "banner";
  initialUrl?: string | null;
  clanTag?: string;
};

export default function UploadClanImageForm({ clanId, type, initialUrl, clanTag }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarBroken, setAvatarBroken] = useState(false);
  const { toast } = useToast();
  const { trigger } = useClanUpload(clanId);
  
  // Preload only for banner (avatar uses tag fallback; no default image)
  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (type !== "banner" || !initialUrl || file) return;
      try {
        const res = await fetch(initialUrl);
        if (!res.ok) return;
        const blob = await res.blob();
        if (!cancelled) setFile(new File([blob], "file.png"));
      } catch {}
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [initialUrl, type]);

  const upload = async () => {
    if (!file) {
      toast({ title: "No file selected" });
      return;
    }
    setIsUploading(true);
    await trigger({ file, type, clanId })
      .then(() => {
        toast({ title: `Clan ${type} updated` });
        // Revalidate clan data on this page
        try { mutate(`clan/${clanId}`); } catch {}
      })
      .catch((err: any) => {
        toast({ variant: "destructive", title: "Failed", description: err?.message ?? `Unable to upload ${type}` });
      })
      .finally(() => setIsUploading(false));
  };

  return (
    <div className="flex flex-col w-11/12 mx-auto">
      {type === "avatar" ? (
        <label className="cursor-pointer w-fit">
          <input
            type="file"
            accept=".png, .jpg, .jpeg, .gif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              if (!f) return;
              if (f.size > 5 * 1024 * 1024) {
                toast({ title: "Selected image is too big!", variant: "destructive" });
                return;
              }
              setFile(f);
            }}
          />
          <div className="w-40 h-40 rounded-lg overflow-hidden border border-border flex items-center justify-center bg-muted">
            {file ? (
              <img src={URL.createObjectURL(file)} alt="clan logo" className="w-full h-full object-cover" />
            ) : initialUrl && !avatarBroken ? (
              <img
                src={initialUrl}
                alt="clan logo"
                className="w-full h-full object-cover"
                onError={() => setAvatarBroken(true)}
              />
            ) : (
              <div className="text-xl font-bold">{clanTag ?? "TAG"}</div>
            )}
          </div>
        </label>
      ) : (
        <ImageSelect setFile={setFile} file={file} isWide={type === "banner"} maxFileSizeBytes={5 * 1024 * 1024} />
      )}
      <Button
        isLoading={isUploading}
        onClick={upload}
        className="mt-2 w-40 text-sm"
        variant="secondary"
      >
        <CloudUpload />
        Upload {type}
      </Button>
      <label className="text-xs mt-2 capitalize">* Note: {type}s are limited to 5MB in size</label>
    </div>
  );
}


