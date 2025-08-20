"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import GameModeSelector from "@/components/GameModeSelector";
import { Combobox } from "@/components/ComboBox";
import { ChartColumnIncreasing } from "lucide-react";
import { GameMode } from "@/lib/types/api";
import {
  ClanLeaderboardMetricUi,
  useClansLeaderboard,
} from "@/lib/hooks/api/clan/useClansLeaderboard";
import { ClanDataTable } from "@/app/(website)/clan/leaderboard/components/ClanDataTable";
import { getClanColumns } from "@/app/(website)/clan/leaderboard/components/ClanColumns";

export default function ClanLeaderboardPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? 0);
  const size = Number(searchParams.get("size") ?? 10);
  const mode = (searchParams.get("mode") as GameMode | null) ?? GameMode.STANDARD;
  const metric =
    (searchParams.get("metric") as ClanLeaderboardMetricUi | null) ??
    ClanLeaderboardMetricUi.TotalPP;

  const [activeMode, setActiveMode] = useState<GameMode>(mode);
  const [activeMetric, setActiveMetric] = useState<ClanLeaderboardMetricUi>(metric);
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
    window.history.pushState(null, "", pathname + "?" + createQueryString("mode", activeMode));
  }, [activeMode]);

  useEffect(() => {
    window.history.pushState(
      null,
      "",
      pathname + "?" + createQueryString("size", pagination.pageSize.toString())
    );
  }, [pagination.pageSize]);

  useEffect(() => {
    window.history.pushState(
      null,
      "",
      pathname + "?" + createQueryString("page", pagination.pageIndex.toString())
    );
  }, [pagination.pageIndex]);

  const clansQuery = useClansLeaderboard(
    activeMetric,
    activeMode,
    pagination.pageIndex,
    pagination.pageSize
  );

  const data = clansQuery.data;
  const items = data?.items ?? [];
  const total = data ? data.pageSize * (data.page + 1) + (items.length === 0 ? 0 : Math.max(0, items.length - data.pageSize)) : 0;

  return (
    <div className="flex flex-col w-full space-y-4">
      <PrettyHeader text="Clans" icon={<ChartColumnIncreasing />} roundBottom>
        <div className="place-content-end w-full gap-x-2 hidden lg:flex">
          <Button
            onClick={() => setActiveMetric(ClanLeaderboardMetricUi.TotalPP)}
            variant={activeMetric === ClanLeaderboardMetricUi.TotalPP ? "default" : "secondary"}
          >
            Total PP
          </Button>
          <Button
            onClick={() => setActiveMetric(ClanLeaderboardMetricUi.AveragePP)}
            variant={activeMetric === ClanLeaderboardMetricUi.AveragePP ? "default" : "secondary"}
          >
            Average PP
          </Button>
          <Button
            onClick={() => setActiveMetric(ClanLeaderboardMetricUi.RankedScore)}
            variant={activeMetric === ClanLeaderboardMetricUi.RankedScore ? "default" : "secondary"}
          >
            Ranked Score
          </Button>
          <Button
            onClick={() => setActiveMetric(ClanLeaderboardMetricUi.Accuracy)}
            variant={activeMetric === ClanLeaderboardMetricUi.Accuracy ? "default" : "secondary"}
          >
            Accuracy
          </Button>
        </div>

        <div className="flex lg:hidden flex-col lg:flex-row">
          <p className="text-secondary-foreground text-sm">Metric:</p>
          <Combobox
            activeValue={activeMetric}
            setActiveValue={(v: any) => setActiveMetric(v)}
            values={[
              { label: "Total PP", value: ClanLeaderboardMetricUi.TotalPP },
              { label: "Average PP", value: ClanLeaderboardMetricUi.AveragePP },
              { label: "Ranked Score", value: ClanLeaderboardMetricUi.RankedScore },
              { label: "Accuracy", value: ClanLeaderboardMetricUi.Accuracy },
            ]}
          />
        </div>
      </PrettyHeader>

      <div>
        <PrettyHeader className="border-b-0 ">
          <GameModeSelector activeMode={activeMode} setActiveMode={setActiveMode} />
        </PrettyHeader>

        <div className="rounded-b-3xl bg-card mb-4 border border-t-0 shadow">
          <RoundedContent className="rounded-t-xl border-none shadow-none">
            {clansQuery.isLoading && items.length === 0 ? (
              <div className="flex justify-center items-center min-h-36">
                <Spinner />
              </div>
            ) : (
              <ClanDataTable
                columns={getClanColumns(activeMetric)}
                data={items}
                pagination={pagination}
                totalCount={data ? (data.page + 1) * data.pageSize + (items.length === 0 ? 0 : Math.max(0, items.length - data.pageSize)) : 0}
                setPagination={setPagination}
              />
            )}
          </RoundedContent>
        </div>
      </div>
    </div>
  );
}


