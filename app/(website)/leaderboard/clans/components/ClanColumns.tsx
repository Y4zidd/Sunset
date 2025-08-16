"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, SortAsc, SortDesc, Users } from "lucide-react";
import numberWith from "@/lib/utils/numberWith";
import { twMerge } from "tailwind-merge";
import { ClanTableContext } from "./ClanDataTable";
import { ClanLeaderboardItem } from "@/lib/hooks/api/clan/useClansLeaderboard";

export function createClanColumns(valueLabel: string): ColumnDef<ClanLeaderboardItem, unknown>[] {
  return [
    {
      id: "rank",
      header: () => <div className="text-center text-sm font-bold w-16">Rank</div>,
      cell: ({ row }) => {
        const table = useContext(ClanTableContext);
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        const value = row.index + pageIndex * pageSize + 1;
        const textSize = value === 1 ? "text-2xl" : value === 2 ? "text-lg" : value === 3 ? "text-base" : "text-sm";
        return <div className={twMerge("text-center font-bold whitespace-nowrap w-16", textSize)}># {value}</div>;
      },
    },
    {
      id: "avatar",
      header: () => <div className="sr-only">Avatar</div>,
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold mx-1">
            {c.tag?.slice(0, 3).toUpperCase()}
          </div>
        );
      },
    },
    {
      id: "clan",
      header: () => <div className="text-left text-sm font-bold">Clan</div>,
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="p-3 relative flex flex-row items-center gap-4">
            <Link href={`/clan/${c.clanId}`} className="hover:underline text-lg font-bold">
              {c.name}
            </Link>
          </div>
        );
      },
    },
    {
      id: "value",
      accessorKey: "value",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="justify-end text-sm w-full px-0"
        >
          {valueLabel}
          {column.getIsSorted() === "asc" ? <SortAsc /> : column.getIsSorted() === "desc" ? <SortDesc /> : null}
        </Button>
      ),
      cell: ({ row }) => {
        const formatted = numberWith((row.original.value ?? 0).toFixed(2), ",");
        return <div className="text-right font-bold text-foreground">{formatted}</div>;
      },
    },
    {
      id: "members",
      accessorKey: "memberCount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="justify-end text-sm w-full px-0"
        >
          Members
          {column.getIsSorted() === "asc" ? <SortAsc /> : column.getIsSorted() === "desc" ? <SortDesc /> : null}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span className="text-sm">{numberWith(row.original.memberCount ?? 0, ",")}</span>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const clanId = row.original.clanId;
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
                <Link href={`/clan/${clanId}`}>View clan</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
