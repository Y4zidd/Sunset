"use client";

import UserElement from "@/components/UserElement";
import { useUser } from "@/lib/hooks/api/user/useUser";
import { CountryCode, GameMode, UserResponse } from "@/lib/types/api";

interface ClanMemberUserElementProps {
  userId: number;
  username: string;
  country?: string | null;
}

export default function ClanMemberUserElement({ userId, username, country }: ClanMemberUserElementProps) {
  const userQuery = useUser(userId);
  const data = userQuery.data;

  const fallbackUser: UserResponse = {
    user_id: userId,
    username,
    description: null,
    country_code: (country as CountryCode) || CountryCode.XX,
    register_date: new Date().toISOString(),
    avatar_url: `https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/avatar/${userId}`,
    banner_url: `https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/banner/${userId}`,
    clan_id: 0,
    clan_priv: 0,
    last_online_time: new Date().toISOString(),
    restricted: false,
    silenced_until: null,
    default_gamemode: GameMode.STANDARD,
    badges: [],
    user_status: "offline",
  };

  return (
    <div className="w-full max-w-[480px]">
      <UserElement user={data ?? fallbackUser} includeFriendshipButton className="h-36" />
    </div>
  );
}


