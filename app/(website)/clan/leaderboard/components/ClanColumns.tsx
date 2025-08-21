"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, SortAsc, SortDesc, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ClanLeaderboardItem, ClanLeaderboardMetricUi } from "@/lib/hooks/api/clan/useClansLeaderboard";
import UserRankColor from "@/components/UserRankNumber";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import numberWith from "@/lib/utils/numberWith";

export function getClanColumns(metric: ClanLeaderboardMetricUi): ColumnDef<ClanLeaderboardItem>[] {
  return [
  {
    accessorKey: "rank",
    size: 96,
    header: ({ column }) => (
      <div className="w-24 ml-1 flex justify-end">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="justify-end text-sm w-full px-0"
        >
          Rank
          {column.getIsSorted() === "asc" ? (
            <SortAsc />
          ) : column.getIsSorted() === "desc" ? (
            <SortDesc />
          ) : null}
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const value = row.original.rank;
      const textSize =
        value === 1 ? "text-2xl" : value === 2 ? "text-lg" : value === 3 ? "text-base" : "text-ms";
      return (
        <UserRankColor
          rank={value}
          variant="primary"
          className={`w-24 text-center font-bold whitespace-nowrap ${textSize}`}
        >
          # {value}
        </UserRankColor>
      );
    },
    sortingFn: (a, b) => (a.original.rank ?? 0) - (b.original.rank ?? 0),
  },
  {
    id: "flag-placeholder",
    size: 40,
    header: "",
    cell: () => <div className="w-[26px] h-[26px]" />,
  },
  {
    id: "clan",
    size: 380,
    header: "",
    cell: ({ row }) => {
      const { clanId, name, tag, avatarUrl } = row.original as any;
      return (
        <div className="p-3 relative flex flex-row items-center space-x-2">
          <Avatar className="border-2 border-white">
            <Suspense fallback={<AvatarFallback className="text-[11px] font-bold">{tag}</AvatarFallback>}>
              <Image src={avatarUrl} alt="logo" width={50} height={50} />
            </Suspense>
          </Avatar>
          <Link href={`/clan/${clanId}`} className="hover:underline cursor-pointer smooth-transition">
            <UserRankColor
              rank={row.original.rank}
              variant="primary"
              className="text-lg font-bold"
            >
              {name}
            </UserRankColor>
          </Link>
        </div>
      );
    },
  },
  {
    id: "metric-value",
    size: 180,
    header: () => (
      <div className="w-48 text-right text-base font-bold text-foreground">
        {metric === ClanLeaderboardMetricUi.TotalPP
          ? "PP (Total)"
          : metric === ClanLeaderboardMetricUi.AveragePP
          ? "PP (Average)"
          : metric === ClanLeaderboardMetricUi.RankedScore
          ? "Ranked Score"
          : "Accuracy"}
      </div>
    ),
    cell: ({ row }) => {
      if (metric === ClanLeaderboardMetricUi.Accuracy) {
        return (
          <div className="w-48 text-right font-medium text-muted-foreground">{row.original.avgAcc.toFixed(2)}%</div>
        );
      }
      const formatted =
        metric === ClanLeaderboardMetricUi.RankedScore
          ? numberWith(Math.round(row.original.value), ",")
          : numberWith(row.original.value.toFixed(2), ",");
      return <div className="w-48 text-right font-bold text-foreground">{formatted}</div>;
    },
  },
  {
    accessorKey: "memberCount",
    size: 120,
    header: () => (
      <div className="w-32 text-right pr-2 font-medium text-foreground">Members</div>
    ),
    cell: ({ row }) => (
      <div className="w-32 flex items-center gap-2 justify-end pr-2">
        <Users className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{row.original.memberCount}</span>
      </div>
    ),
  },
  {
    id: "actions",
    size: 60,
    cell: ({ row }) => {
      const { clanId } = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/clan/${clanId}`}>View clan detail</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  ];
}


