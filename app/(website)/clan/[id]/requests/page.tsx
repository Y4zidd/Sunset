"use client";

import React, { use } from "react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { Users as UsersIcon, Check, X, Cog, Image as ImageIcon } from "lucide-react";
import { useClanRequests } from "@/lib/hooks/api/clan/useClanRequests";
import { Button } from "@/components/ui/button";
import fetcher from "@/lib/services/fetcher";
import {
  useApproveClanRequestMutation,
  useDenyClanRequestMutation,
} from "@/lib/hooks/api/clan/useClanActions";
import { useClan } from "@/lib/hooks/api/clan/useClan";
import useSelf from "@/lib/hooks/useSelf";
import UserElement from "@/components/UserElement";
import { UserResponse } from "@/lib/types/api";
import { useToast } from "@/hooks/use-toast";
import UploadClanImageForm from "./components/UploadClanImageForm";

export default function ClanRequestsPage(props: { params: Promise<{ id: number }> }) {
  const params = use(props.params);
  const clanId = Number(params.id);
  const { self } = useSelf();
  const clanQuery = useClan(clanId);
  const clan = clanQuery.data;
  const isOwner = self && clan && self.user_id === clan.ownerId;

  const requestsQuery = useClanRequests(isOwner ? clanId : null);
  const requests = (requestsQuery.data as any)?.items ?? (requestsQuery.data as any) ?? [];

  const [users, setUsers] = React.useState<UserResponse[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    async function loadUsers() {
      const details = await Promise.all(
        requests.map((r: any) => fetcher<UserResponse>(`user/${r.userId}`).catch(() => null))
      );
      if (!cancelled) setUsers(details.filter(Boolean) as UserResponse[]);
    }
    if (requests.length > 0) loadUsers();
    return () => {
      cancelled = true;
    };
  }, [requestsQuery.data]);

  // Show access messages instead of redirecting so users understand requirements

  const { trigger: approveTrigger } = useApproveClanRequestMutation(clanId);
  const { trigger: denyTrigger } = useDenyClanRequestMutation(clanId);
  const { toast } = useToast();

  const approve = async (requestId: number, targetUserId: number) => {
    await approveTrigger({ requestId, targetUserId })
      .then(() => {
        toast({ title: "Request approved", description: "User has been added to the clan." });
      })
      .catch((err: any) => {
        toast({ variant: "destructive", title: "Failed", description: err?.message ?? "Unable to approve request" });
      });
    requestsQuery.mutate();
  };

  const deny = async (requestId: number) => {
    await denyTrigger({ requestId })
      .then(() => {
        toast({ title: "Request denied", description: "Join request has been rejected." });
      })
      .catch((err: any) => {
        toast({ variant: "destructive", title: "Failed", description: err?.message ?? "Unable to deny request" });
      });
    requestsQuery.mutate();
  };

  if (!self) {
    return (
      <div className="flex flex-col w-full space-y-4">
        <PrettyHeader icon={<Cog className="mr-2" />} text="Manage server" roundBottom={true} />
        <RoundedContent>
          <p className="font-medium">You must be logged in to view this page.</p>
        </RoundedContent>
      </div>
    );
  }

  if (self && clan && !isOwner) {
    return (
      <div className="flex flex-col w-full space-y-4">
        <PrettyHeader icon={<Cog className="mr-2" />} text="Manage server" roundBottom={true} />
        <RoundedContent>
          <p className="font-medium">Only the clan owner can view this page.</p>
        </RoundedContent>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full space-y-4">
      <PrettyHeader icon={<Cog className="mr-2" />} text="Manage server" roundBottom={true} />

      {/* Upload clan logo */}
      <div className="space-y-0">
        <div className="bg-card rounded-t-lg p-4 flex shadow">
          <div className="flex space-x-2 items-center">
            <ImageIcon />
            <p className="font-medium">Clan logo</p>
          </div>
        </div>
        <RoundedContent>
          <UploadClanImageForm clanId={clanId} type="avatar" initialUrl={(clan as any)?.avatarUrl ? `${(clan as any).avatarUrl}?default=true` : null} clanTag={(clan as any)?.tag} />
        </RoundedContent>
      </div>

      {/* Upload clan banner */}
      <div className="space-y-0">
        <div className="bg-card rounded-t-lg p-4 flex shadow">
          <div className="flex space-x-2 items-center">
            <ImageIcon />
            <p className="font-medium">Clan banner</p>
          </div>
        </div>
        <RoundedContent>
          <UploadClanImageForm clanId={clanId} type="banner" initialUrl={(clan as any)?.bannerUrl ? `${(clan as any).bannerUrl}?default=true` : null} />
        </RoundedContent>
      </div>

      <div className="space-y-0">
        <div className="bg-card rounded-t-lg p-4 flex shadow">
          <div className="flex space-x-2 items-center">
            <UsersIcon />
            <p className="font-medium">Join requests</p>
          </div>
        </div>
        <RoundedContent>
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <UsersIcon className="w-8 h-8 mb-2 opacity-40" />
              <p className="font-medium">No pending requests</p>
              <p className="text-xs mt-1">Join requests will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.map((r: any) => {
                const user = users.find((u) => u.user_id === r.userId);
                if (!user) return null;
                return (
                  <UserElement
                    key={r.id}
                    user={user}
                    rightSlot={
                      <div
                        className="flex gap-2"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                     >
                        <Button
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            approve(r.id, r.userId);
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <Check />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deny(r.id);
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <X />
                        </Button>
                      </div>
                    }
                  />
                );
              })}
            </div>
          )}
        </RoundedContent>
      </div>
    </div>
  );
}


