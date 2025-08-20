import { Users, Crown } from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import { ClanDetailResponse } from "@/lib/hooks/api/clan/useClan";
import { UsersList } from "@/app/(website)/friends/components/UsersList";
import { CountryCode, GameMode } from "@/lib/types/api";
import { useUser } from "@/lib/hooks/api/user/useUser";
import { UserResponse } from "@/lib/types/api";

interface ClanMembersPanelProps {
  clan: ClanDetailResponse;
}

export default function ClanMembersPanel({ clan }: ClanMembersPanelProps) {
  // Convert clan members to UserResponse format for UsersList
  const clanMembersAsUsers: UserResponse[] = clan.members?.map((member) => {
    const userQuery = useUser(member.id);
    const user = userQuery.data;
    
    if (user) {
      return user;
    }
    
    // Fallback user data if user query fails
    return {
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
    };
  }) || [];

  return (
    <div className="w-full">
      <PrettyHeader
        text="Clan Members"
        icon={<Users className="mr-2" />}
        className="border-b-0"
      />
      
      <div className="w-full">
        <UsersList users={clanMembersAsUsers} viewMode="grid" />
      </div>
    </div>
  );
}
