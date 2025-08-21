import { LucideHistory, ChevronDown } from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { ClanDetailResponse } from "@/lib/hooks/api/clan/useClan";
import UserScoreMinimal from "@/app/(website)/topplays/components/UserScoreMinimal";
import { useUserScores } from "@/lib/hooks/api/user/useUserScores";
import { GameMode, ScoreTableType } from "@/lib/types/api";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";

interface ClanRecentScoresPanelProps {
    clan: ClanDetailResponse;
    gameMode: GameMode;
}

export default function ClanRecentScoresPanel({ clan, gameMode }: ClanRecentScoresPanelProps) {
    const PAGE_SIZE = 10;
    const MAX_TOTAL = 100;

    const [page, setPage] = useState(1);

    const allScores: any[] = [];

    if (clan.members && clan.members.length > 0) {
        clan.members.forEach((member) => {
            const userScoresQuery = useUserScores(
                member.id,
                gameMode,
                ScoreTableType.BEST,
                MAX_TOTAL
            );
            const scores = userScoresQuery.data?.flatMap((item) => item.scores) || [];
            allScores.push(...scores);
        });
    }

    const sortedScores = useMemo(() => {
        return allScores
            .slice()
            .sort((a, b) => {
                if (b.performance_points !== a.performance_points) {
                    return b.performance_points - a.performance_points;
                }
                return new Date(b.when_played).getTime() - new Date(a.when_played).getTime();
            });
    }, [allScores]);

    const limitedScores = sortedScores.slice(0, Math.min(sortedScores.length, MAX_TOTAL));
    const visibleCount = Math.min(limitedScores.length, page * PAGE_SIZE);
    const visibleScores = limitedScores.slice(0, visibleCount);

    return (
        <div className="flex flex-col h-full">
            <PrettyHeader
                text="Clan Top Plays"
                icon={<LucideHistory className="mr-2" />}
            />

            <RoundedContent className="!h-full flex-1 p-4">
                {visibleScores.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        <LucideHistory className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">No top plays from clan members</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {visibleScores.map((score) => (
                                <div key={`score-${score.id}`} className="mb-2">
                                    <UserScoreMinimal
                                        score={score}
                                        showUser={true}
                                    />
                                </div>
                            ))}
                        </div>

                        {visibleCount < limitedScores.length && (
                            <div className="flex justify-center mt-6">
                                <Button
                                    onClick={() => setPage(page + 1)}
                                    variant="secondary"
                                    className="w-full md:w-1/2 flex items-center justify-center"
                                >
                                    <ChevronDown className="mr-2" />
                                    Show more
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </RoundedContent>
        </div>
    );
}
