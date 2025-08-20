import { Users, Crown } from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { ClanDetailResponse } from "@/lib/hooks/api/clan/useClan";
import UserElement from "@/components/UserElement";
import { CountryCode, GameMode } from "@/lib/types/api";
import { useUser } from "@/lib/hooks/api/user/useUser";

interface ClanMembersPanelProps {
  clan: ClanDetailResponse;
}

export default function ClanMembersPanel({ clan }: ClanMembersPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <PrettyHeader
        text="Clan Members"
        icon={<Users className="mr-2" />}
      />
      
      <RoundedContent className="!h-full flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clan.members && clan.members.length > 0 ? (
            clan.members.map((member) => {
              const userQuery = useUser(member.id);
              const user = userQuery.data;
              const isOwner = member.id === clan.ownerId;
              
              if (!user) {
                return (
                  <div key={member.id} className="relative">
                    <UserElement
                      user={{
                        user_id: member.id,
                        username: member.name,
                        description: null,
                        country_code: (member.country as CountryCode) || CountryCode.XX,
                        register_date: new Date().toISOString(),
                        avatar_url: `https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/avatar/${member.id}`,
                        banner_url: `https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/banner/${member.id}`,
                        last_online_time: new Date().toISOString(),
                        restricted: false,
                        silenced_until: null,
                        default_gamemode: GameMode.STANDARD,
                        badges: [],
                        user_status: 'offline'
                      }}
                      includeFriendshipButton={false}
                      className={`h-32 ${isOwner ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}`}
                    />
                    
                    {/* Owner Crown */}
                    {isOwner && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-1 shadow-lg animate-pulse">
                          <Crown className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              
              return (
                <div key={member.id} className="relative">
                  <UserElement
                    user={user}
                    includeFriendshipButton={false}
                    className={`h-32 ${isOwner ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}`}
                  />
                  
                  {/* Owner Crown */}
                  {isOwner && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-1 shadow-lg animate-pulse">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-gray-500 py-8">
              <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No members found</p>
            </div>
          )}
        </div>
      </RoundedContent>
    </div>
  );
}
