import { Users, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/Tooltip";
import { timeSince } from "@/lib/utils/timeSince";

interface ClanGeneralInformationProps {
  tag: string;
  createdAt: string | Date;
  memberCount: number;
}

export default function ClanGeneralInformation({ tag, createdAt, memberCount }: ClanGeneralInformationProps) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm my-1 text-muted-foreground/70 mt-3">
      <Badge
        variant="secondary"
        className="text-xs rounded-xl border-primary/30 bg-primary/5 text-primary px-3 py-1 shadow-sm uppercase"
      >
        #{tag}
      </Badge>
      <div className="flex items-center gap-1">
        <CalendarDays className="h-4 w-4" />
        <span>
          Created {" "}
          <span className="font-bold">
            <Tooltip content={new Date(createdAt).toLocaleString()}>
              <p className="text-md text-muted-foreground font-bald">
                {timeSince(createdAt)}
              </p>
            </Tooltip>
          </span>
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Users className="h-4 w-4" />
  <span className="font-bold text-muted-foreground">{memberCount}</span>
  Members
      </div>
    </div>
  );
}


