import { Users, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PrettyDate from "@/components/General/PrettyDate";

interface ClanGeneralInformationProps {
  tag: string;
  createdAt: string | Date;
  memberCount: number;
}

export default function ClanGeneralInformation({ tag, createdAt, memberCount }: ClanGeneralInformationProps) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm my-1 text-muted-foreground/70 mt-3">
      <Badge
        variant="secondary"
        className="text-xs rounded-xl border-primary/30 bg-primary/5 text-primary px-3 py-1 shadow-sm"
      >
        #{tag}
      </Badge>
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4" />
        <PrettyDate className="font-semibold text-muted-foreground" time={createdAt} withTime={false} />
      </div>
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        <span className="font-semibold text-muted-foreground">{memberCount}</span>
        members
      </div>
    </div>
  );
}


