"use client";

import React, { use } from "react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Users as UsersIcon, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RequestJoinButton from "./components/RequestJoinButton";
import LeaveClanButton from "./components/LeaveClanButton";
import ClanGeneralInformation from "./components/ClanGeneralInformation";
import ClanInfoPanel from "./components/ClanInfoPanel";
import ClanPerformancePanel from "./components/ClanPerformancePanel";
import ClanMembersPanel from "./components/ClanMembersPanel";
import ClanRecentScoresPanel from "./components/ClanRecentScoresPanel";
import { useClan } from "@/lib/hooks/api/clan/useClan";
import useSelf from "@/lib/hooks/useSelf";
import GameModeSelector from "@/components/GameModeSelector";
import { GameMode } from "@/lib/types/api";
import { Button } from "@/components/ui/button";
import UserRankColor from "@/components/UserRankNumber";
import { useRouter } from "next/navigation";
import { useClanRequests } from "@/lib/hooks/api/clan/useClanRequests";

export default function ClanPage(props: { params: Promise<{ id: number }> }) {
  const params = use(props.params);
  const clanId = Number(params.id);

  const [activeMode, setActiveMode] = React.useState<GameMode>(GameMode.STANDARD);
  const clanQuery = useClan(clanId, activeMode);
  const clan = clanQuery.data;
  const topRank = clan
    ? ([
        (clan as any).rankTotalPp,
        (clan as any).rankAveragePp,
        (clan as any).rankRankedScore,
        (clan as any).rankAccuracy,
      ] as Array<number | undefined>)
        .find((v) => typeof v === "number" && v! >= 1 && v! <= 3)
    : undefined;
  const { self } = useSelf();
  const router = useRouter();

  const isOwner = !!self && !!clan && self.user_id === clan.ownerId;
  const isMember = !!self && !!clan && (clan.members || []).some((m) => m.id === self.user_id);

  const showRequestJoin = !!self && !!clan && !isOwner && !isMember;
  const showManageRequests = !!self && !!clan && self.user_id === clan.ownerId;

  const requestsQuery = useClanRequests(isOwner ? clanId : null);
  const pendingCount = Array.isArray(requestsQuery.data)
    ? requestsQuery.data.length
    : ((requestsQuery.data as any)?.items?.length ?? 0);

  return (
    <div className="flex flex-col space-y-4">
      <PrettyHeader icon={<UsersIcon />} text="Clan Info" roundBottom={true} />

      <div>
        <PrettyHeader className="border-b-0">
          <GameModeSelector activeMode={activeMode} setActiveMode={setActiveMode} />
        </PrettyHeader>

        <RoundedContent className="rounded-lg-b p-0 border-t-0 bg-card">
          {clan ? (
            <>
              <div className="lg:h-64 md:h-44 h-32 relative">
                <ImageWithFallback
                  src={`${(clan as any).bannerUrl}?default=false`}
                  alt="Clan banner"
                  fill={true}
                  objectFit="cover"
                  className="bg-black rounded-t-lg"
                  fallBackSrc="/images/placeholder.png"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent flex w-full">
                  <div className="relative overflow-hidden px-4 py-2 md:p-6 flex items-end place-content-between flex-grow">
                    <div className="flex items-end space-x-4 w-3/4 ">
                      <div className="relative w-16 h-16 md:w-32 md:h-32 flex-none">
                        <Avatar className="w-full h-full rounded-full border-2 md:border-4 border-secondary">
                          <AvatarImage src={(clan as any).avatarUrl ? `${(clan as any).avatarUrl}?default=false` : undefined} alt="Clan logo" />
                          <AvatarFallback className="text-lg md:text-2xl font-bold">{clan.tag}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex flex-col flex-grow min-w-0">
                        <div className="flex flex-col md:flex-row flex-wrap gap-x-1">
                          {typeof topRank === "number" ? (
                            <UserRankColor
                              className="md:text-3xl text-lg font-bold truncate mt-0.5"
                              variant="primary"
                              rank={topRank}
                            >
                              {clan.name}
                            </UserRankColor>
                          ) : (
                            <p className="md:text-3xl text-lg font-bold truncate mt-0.5">{clan.name}</p>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground/80">Owner: <a href={`/user/${clan.ownerId}`} className="hover:underline">{clan.owner?.name ?? "Unknown"}</a></p>
                      </div>
                    </div>
                    <div />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-card">
                <div className="flex justify-between items-start">
                  <div className="flex flex-wrap gap-2">
                    <ClanGeneralInformation tag={clan.tag} createdAt={clan.createdAt} memberCount={clan.memberCount} />
                  </div>
                  {showRequestJoin ? (
                    <RequestJoinButton clanId={clan.id} />
                  ) : isMember && !isOwner ? (
                    <LeaveClanButton clanId={clan.id} />
                  ) : null}
                  {showManageRequests ? (
                    <Button className="relative" onClick={() => router.push(`/clan/${clan.id}/requests`)}>
                      Manage Server
                      {pendingCount > 0 && (
                        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-yellow-400 text-card border border-card w-5 h-5">
                          <Bell className="w-3 h-3" />
                        </span>
                      )}
                    </Button>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4 gap-4 mt-6">
                  <div className="flex flex-col col-span-2 sm:col-span-1">
                    <ClanInfoPanel clan={clan} />
                  </div>
                  <div className="flex flex-col col-span-2">
                    <ClanPerformancePanel clan={clan} />
                  </div>
                </div>

                <div className="mt-6">
                  <ClanMembersPanel clan={clan} />
                </div>

                <div className="mt-6">
                  <ClanRecentScoresPanel clan={clan} gameMode={activeMode} />
                </div>
              </div>
            </>
          ) : (
            <div className="p-6">Loading...</div>
          )}
        </RoundedContent>
      </div>
    </div>
  );
}


