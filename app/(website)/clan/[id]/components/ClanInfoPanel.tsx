import { FileText } from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { ClanDetailResponse } from "@/lib/hooks/api/clan/useClan";
import PrettyDate from "@/components/General/PrettyDate";
import numberWith from "@/lib/utils/numberWith";

interface ClanInfoPanelProps {
  clan: ClanDetailResponse;
}

export default function ClanInfoPanel({ clan }: ClanInfoPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <PrettyHeader
        text="Info"
        icon={<FileText className="mr-2" />}
      />
      
      <RoundedContent className="p-4 !h-full flex-1 flex flex-col min-h-[200px]">
        <div className="space-y-4">
          <div className="flex place-content-between items-end">
            <p className="text-xs">Owner last active</p>
            <div className="text-sm font-bald">
              {clan.ownerLastActive ? (
                <PrettyDate time={clan.ownerLastActive} withTime={true} />
              ) : (
                "Unknown"
              )}
            </div>
          </div>
          
          <div className="flex place-content-between items-end">
            <p className="text-xs">Total PP</p>
            <div className="text-sm font-bald">
              {clan.totalPp ? numberWith(Math.round(clan.totalPp), ",") : "-"}
            </div>
          </div>
          
          <div className="flex place-content-between items-end">
            <p className="text-xs">Average PP</p>
            <div className="text-sm font-bald">
              {clan.averagePp ? numberWith(clan.averagePp.toFixed(2), ",") : "-"}
            </div>
          </div>
          
          <div className="flex place-content-between items-end">
            <p className="text-xs">Ranked Score</p>
            <div className="text-sm font-bald">
              {clan.rankedScore ? numberWith(Math.round(clan.rankedScore), ",") : "-"}
            </div>
          </div>
          
          <div className="flex place-content-between items-end">
            <p className="text-xs">Accuracy</p>
            <div className="text-sm font-bald">
              {clan.accuracy ? `${clan.accuracy.toFixed(2)}%` : "-"}
            </div>
          </div>
        </div>
      </RoundedContent>
    </div>
  );
}
