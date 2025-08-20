import { Users } from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { ClanDetailResponse } from "@/lib/hooks/api/clan/useClan";
import ClanMemberUserElement from "./ClanMemberUserElement";

interface ClanMembersPanelProps {
	clan: ClanDetailResponse;
}

export default function ClanMembersPanel({ clan }: ClanMembersPanelProps) {
	return (
		<div className="w-full">
			<PrettyHeader text="Clan Members" icon={<Users className="mr-2" />} className="border-b-0" />
			<div className="rounded-b-3xl bg-card mb-4 border border-t-0 shadow">
				<RoundedContent className="rounded-t-xl border-none shadow-none">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{(clan.members || []).map((m) => (
							<ClanMemberUserElement key={m.id} userId={m.id} username={m.name} country={m.country} />
						))}
					</div>
				</RoundedContent>
			</div>
		</div>
	);
}
