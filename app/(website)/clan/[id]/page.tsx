"use client";

import React, { use } from "react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import Image from "next/image";
import { Users as UsersIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import RequestJoinButton from "./components/RequestJoinButton";
import ClanGeneralInformation from "./components/ClanGeneralInformation";
import { useClan } from "@/lib/hooks/api/clan/useClan";
import useSelf from "@/lib/hooks/useSelf";
import GameModeSelector from "@/components/GameModeSelector";
import { GameMode } from "@/lib/types/api";

export default function ClanPage(props: { params: Promise<{ id: number }> }) {
  const params = use(props.params);
  const clanId = Number(params.id);

  const [activeMode, setActiveMode] = React.useState<GameMode>(GameMode.STANDARD);
  const clanQuery = useClan(clanId, activeMode);
  const clan = clanQuery.data;
  const { self } = useSelf();

  const showRequestJoin = (() => {
    if (!self || !clan) return false; // non-login: jangan tampilkan tombol
    // Jika nanti API mengembalikan informasi membership, bisa diganti cek yang benar.
    // Untuk sementara: sembunyikan jika user adalah owner
    return self.user_id !== clan.ownerId;
  })();

  return (
    <div className="flex flex-col space-y-4">
      <PrettyHeader icon={<UsersIcon />} text="Clans Info" roundBottom={true} />

      <div>
        <PrettyHeader className="border-b-0">
          <GameModeSelector
            activeMode={activeMode}
            setActiveMode={setActiveMode}
          />
        </PrettyHeader>

        <RoundedContent className="rounded-lg-b p-0 border-t-0 bg-card">
          {clan ? (
            <>
              <div className="lg:h-64 md:h-44 h-32 relative">
                {/* Banner placeholder */}
                <Image
                  src="/images/placeholder.png"
                  alt="Clan banner"
                  fill={true}
                  objectFit="cover"
                  className="bg-black rounded-t-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent flex w-full">
                  <div className="relative overflow-hidden px-4 py-2 md:p-6 flex items-end place-content-between flex-grow">
                    <div className="flex items-end space-x-4 w-3/4 ">
                      <div className="relative w-16 h-16 md:w-32 md:h-32 flex-none">
                        {/* Avatar placeholder (pakai tag) */}
                        <Avatar className="w-full h-full rounded-full border-2 md:border-4 border-secondary">
                          <AvatarFallback className="text-lg md:text-2xl font-bold">{clan.tag}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex flex-col flex-grow min-w-0">
                        <div className="flex flex-col md:flex-row flex-wrap gap-x-1">
                          <p className="md:text-3xl text-lg font-bold truncate mt-0.5">{clan.name}</p>
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
                  {showRequestJoin ? <RequestJoinButton clanId={clan.id} /> : null}
                </div>
                {/* Tabs section untuk tahap berikutnya */}
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


