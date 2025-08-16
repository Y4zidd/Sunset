"use client";

import { ChartColumnIncreasing } from "lucide-react";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { useCallback, useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import GameModeSelector from "@/components/GameModeSelector";
import { Button } from "@/components/ui/button";
import { usePathname, useSearchParams } from "next/navigation";
import { isInstance, tryParseNumber } from "@/lib/utils/type.util";
import { Combobox } from "@/components/ComboBox";
import { GameMode } from "@/lib/types/api";
import { useClansLeaderboard } from "@/lib/hooks/api/clan/useClansLeaderboard";
import { ClanDataTable } from "../leaderboard/clans/components/ClanDataTable";
import { createClanColumns } from "../leaderboard/clans/components/ClanColumns";

export default function Clans() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = tryParseNumber(searchParams.get("page")) ?? 0;
  const size = tryParseNumber(searchParams.get("size")) ?? 10;
  const mode = searchParams.get("mode") ?? GameMode.STANDARD;
  const metric = searchParams.get("metric") ?? "TotalPP";

  const [activeMode, setActiveMode] = useState(
    isInstance(mode, GameMode) ? (mode as GameMode) : GameMode.STANDARD
  );
  const [activeMetric, setActiveMetric] = useState(metric);
  const [pagination, setPagination] = useState({ pageIndex: page, pageSize: size });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    window.history.pushState(null, "", pathname + "?" + createQueryString("metric", activeMetric));
  }, [activeMetric]);

  useEffect(() => {
    window.history.pushState(null, "", pathname + "?" + createQueryString("mode", activeMode.toString()));
  }, [activeMode]);

  useEffect(() => {
    window.history.pushState(null, "", pathname + "?" + createQueryString("size", pagination.pageSize.toString()));
  }, [pagination.pageSize]);

  useEffect(() => {
    window.history.pushState(null, "", pathname + "?" + createQueryString("page", pagination.pageIndex.toString()));
  }, [pagination.pageIndex]);

  const clansLeaderboardQuery = useClansLeaderboard(
    activeMetric,
    activeMode,
    pagination.pageIndex,
    pagination.pageSize
  );

  const data = clansLeaderboardQuery.data;
  const items = data?.items ?? [];

  const valueLabel =
    activeMetric === "TotalPP"
      ? "PP (Total)"
      : activeMetric === "AveragePP"
      ? "PP (Average)"
      : activeMetric === "RankedScore"
      ? "Ranked Score"
      : "Accuracy";

  return (
    <div className="flex flex-col w-full space-y-4">
      <PrettyHeader text="Clans" icon={<ChartColumnIncreasing />} roundBottom={true}>
        <div className="place-content-end w-full gap-x-2 hidden lg:flex">
          <Button onClick={() => setActiveMetric("TotalPP")} variant={activeMetric == "TotalPP" ? "default" : "secondary"}>Total PP</Button>
          <Button onClick={() => setActiveMetric("AveragePP")} variant={activeMetric == "AveragePP" ? "default" : "secondary"}>Average PP</Button>
          <Button onClick={() => setActiveMetric("RankedScore")} variant={activeMetric == "RankedScore" ? "default" : "secondary"}>Ranked Score</Button>
          <Button onClick={() => setActiveMetric("Accuracy")} variant={activeMetric == "Accuracy" ? "default" : "secondary"}>Accuracy</Button>
        </div>
        <div className="flex lg:hidden flex-col lg:flex-row">
          <p className="text-secondary-foreground text-sm">Sort by:</p>
          <Combobox
            activeValue={activeMetric}
            setActiveValue={(val: any) => setActiveMetric(val)}
            values={[{ label: "Total PP", value: "TotalPP" }, { label: "Average PP", value: "AveragePP" }, { label: "Ranked Score", value: "RankedScore" }, { label: "Accuracy", value: "Accuracy" }]}
          />
        </div>
      </PrettyHeader>

      <div>
        <PrettyHeader className="border-b-0 ">
          <GameModeSelector activeMode={activeMode} setActiveMode={setActiveMode} />
        </PrettyHeader>

        <div className="rounded-b-3xl bg-card mb-4 border border-t-0 shadow">
          <RoundedContent className="rounded-t-xl border-none shadow-none">
            {clansLeaderboardQuery.isLoading && items.length === 0 ? (
              <div className="flex justify-center items-center min-h-36"><Spinner /></div>
            ) : (
              <ClanDataTable
                columns={createClanColumns(valueLabel)}
                data={items}
                pagination={pagination}
                totalCount={items.length}
                setPagination={setPagination}
              />
            )}
          </RoundedContent>
        </div>
      </div>
    </div>
  );
}
