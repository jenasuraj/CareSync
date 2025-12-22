"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Pie, PieChart, Tooltip, Cell } from "recharts";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface PieData {
  type: string;
  value: number;
  percent: number;
}


const COLOR_MAP: Record<string, string> = {
  appointment: "#3B82F6", // blue
  admit: "#22C55E",       // green
  heart: "#EF4444",       // red
  kidney: "#F97316",      // orange
  eye: "#A855F7",         // purple
  health: "#14B8A6",      // teal
};


const chartConfig = {
  value: {
    label: "Transactions",
  },
  appointment: { label: "Appointment", color: "#3B82F6" },
  admit: { label: "Admit", color: "#22C55E" },
  heart: { label: "Heart", color: "#EF4444" },
  kidney: { label: "Kidney", color: "#F97316" },
  eye: { label: "Eye", color: "#A855F7" },
  health: { label: "Health", color: "#14B8A6" },
} satisfies ChartConfig;


export function ChartPieLegend({
  optionValue,
}: {
  optionValue: string;
}) {
  const [data, setData] = useState<PieData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;

    async function fetchPieData() {
      try {
        setLoading(true);
        const res = await axios.get("/api/dashboard/admin/PieChart", {
          params: { transaction_option: optionValue },
        });

        if (!ignore && res.data?.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Pie chart fetch error:", err);
        setData([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchPieData();

    return () => {
      ignore = true;
    };
  }, [optionValue]);

  return (
    <Card className="w-full">
      <CardHeader className="items-center">
        <CardTitle>Transaction Distribution</CardTitle>
        <CardDescription>
          Percentage based on {optionValue}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
  {loading ? (
    <p className="text-center text-sm text-muted-foreground">
      Loading...
    </p>
  ) : data.length === 0 ? (
    <p className="text-center text-sm text-muted-foreground">
      No data available
    </p>
  ) : (
    <>

      {/* 🔹 Pie Chart */}
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square w-full max-w-[260px]"
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="type"
            label={({ percent }) => `${percent}%`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLOR_MAP[entry.type] ?? "#64748B"}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ChartContainer>

      {/* 🔹 Detailed Legend / Breakdown */}
      <div className="grid grid-cols-2 gap-3">
        {data.map((item) => (
          <div
            key={item.type}
            className="flex items-center gap-3 rounded-sm border p-2 hover:bg-gray-50 duration-500 cursor-pointer"
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor:
                  COLOR_MAP[item.type] ?? "#64748B",
              }}
            />
            <div className="flex-1">
              <p className="text-sm font-medium capitalize">
                {item.type}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.value} ({item.percent}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  )}
</CardContent>

    </Card>
  );
}
