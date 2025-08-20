import { Trophy } from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { ClanDetailResponse } from "@/lib/hooks/api/clan/useClan";

interface ClanPerformancePanelProps {
  clan: ClanDetailResponse;
}

export default function ClanPerformancePanel({ clan }: ClanPerformancePanelProps) {
  const getRankDisplay = (rank: number | undefined) => {
    if (rank === undefined || rank === null) return "-";
    return `#${rank}`;
  };

  return (
    <div className="flex flex-col h-full">
      <PrettyHeader
        text="Performance"
        icon={<Trophy className="mr-2" />}
      />
      
      <RoundedContent className="!h-full flex-1 p-4 pb-3 min-h-[200px]">
        <div className="grid grid-cols-2 gap-4 p-4 h-full items-center">
          <div className="text-center">
            <div className="text-xs mb-2">Total PP Rank</div>
            <div className="text-2xl font-bold text-white">
              {getRankDisplay(clan.rankTotalPp)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xs mb-2">Average PP Rank</div>
            <div className="text-2xl font-bold text-white">
              {getRankDisplay(clan.rankAveragePp)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xs mb-2">Ranked Score Rank</div>
            <div className="text-2xl font-bold text-white">
              {getRankDisplay(clan.rankRankedScore)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xs mb-2">Accuracy Rank</div>
            <div className="text-2xl font-bold text-white">
              {getRankDisplay(clan.rankAccuracy)}
            </div>
          </div>
        </div>
      </RoundedContent>
    </div>
  );
}
