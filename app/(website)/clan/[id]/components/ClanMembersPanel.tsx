import { Users } from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { ClanDetailResponse } from "@/lib/hooks/api/clan/useClan";
import { UsersList } from "@/app/(website)/friends/components/UsersList";
import { CountryCode, GameMode, UserResponse } from "@/lib/types/api";
import { useEffect, useMemo, useState } from "react";
import fetcher from "@/lib/services/fetcher";

interface ClanMembersPanelProps {
	clan: ClanDetailResponse;
}

export default function ClanMembersPanel({ clan }: ClanMembersPanelProps) {
	const roleWeightByUserId = useMemo(() => {
		const map = new Map<number, number>();
		for (const member of clan.members || []) {
			let weight = member.rank === "Owner" ? 3 : member.rank === "Officer" ? 2 : 1;
			if ((clan as any).ownerId === member.id) weight = 4;
			map.set(member.id, weight);
		}
		return map;
	}, [clan.members]);

	const sortUsersByRole = (list: UserResponse[]) => {
		return [...list].sort((a, b) => {
			const weightA = roleWeightByUserId.get(a.user_id) ?? 0;
			const weightB = roleWeightByUserId.get(b.user_id) ?? 0;
			if (weightA === weightB) return 0;
			return weightA > weightB ? -1 : 1;
		});
	};

	const fallbackUsers = useMemo<UserResponse[]>(
		() =>
			(clan.members || []).map((member) => ({
				user_id: member.id,
				username: member.name,
				description: null,
				country_code: (member.country as CountryCode) || CountryCode.XX,
				register_date: new Date().toISOString(),
				avatar_url: `https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/avatar/${member.id}`,
				banner_url: `https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/banner/${member.id}`,
				clan_id: clan.id,
				clan_priv: 0,
				last_online_time: new Date().toISOString(),
				restricted: false,
				silenced_until: null,
				default_gamemode: GameMode.STANDARD,
				badges: [],
				user_status: "Offline",
			})),
		[clan.members]
	);

	const [users, setUsers] = useState<UserResponse[]>(sortUsersByRole(fallbackUsers));

	useEffect(() => {
		let cancelled = false;
		async function loadDetails() {
			try {
				const ids = (clan.members || []).map((m) => m.id);
				if (ids.length === 0) return;
				const results = await Promise.all(
					ids.map((id) => fetcher<UserResponse>(`user/${id}`).catch(() => null))
				);
				const detailed = results.filter(Boolean) as UserResponse[];
				if (!cancelled && detailed.length > 0) {
					setUsers(sortUsersByRole(detailed));
				}
			} catch {}
		}
		loadDetails();
		return () => {
			cancelled = true;
		};
	}, [clan.members]);

	return (
		<div className="w-full">
			<PrettyHeader text="Clan Members" icon={<Users className="mr-2" />} className="border-b-0" />
			<div className="rounded-b-3xl bg-card mb-4 border border-t-0 shadow">
				<RoundedContent className="rounded-t-xl border-none shadow-none">
					<UsersList users={sortUsersByRole(users)} viewMode="grid" includeFriendshipButton={false} />
				</RoundedContent>
			</div>
		</div>
	);
}
