"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface ChartDataFormat {
  date: string;
  appointments: number;
  admission: number;
}

const chartConfig = {
  appointments: {
    label: "Appointments",
    color: "#0891b2",
  },
  admission: {
    label: "Admission",
    color: "#155e75",
  },
} satisfies ChartConfig;

interface Props {
  optionValue: string;
  setOptionValue: React.Dispatch<React.SetStateAction<string>>;
}

export function ChartBarInteractive({ optionValue }: Props) {
  type ChartKey = "appointments" | "admission";

  const [activeChart, setActiveChart] = useState<ChartKey>("appointments");
  const [chartData, setChartData] = useState<ChartDataFormat[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactionData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "/api/dashboard/admin/dashboardTransaction",
        {
          params: { transaction_option: optionValue },
        }
      );

      if (res.data?.success) {
        setChartData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionData();
  }, [optionValue]);

  const total = useMemo(() => {
    return {
      appointments: chartData.reduce((a, c) => a + c.appointments, 0),
      admission: chartData.reduce((a, c) => a + c.admission, 0),
    };
  }, [chartData]);

  return (
    <Card>
      <CardHeader className="border-b p-0 sm:flex-row flex-col flex">
        <div className="px-6 py-4 flex-1">
          <CardTitle>Appointments vs Admission</CardTitle>
          <CardDescription>
            Based on selected time range
          </CardDescription>
        </div>

        <div className="flex">
          {(["appointments", "admission"] as const).map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              onClick={() => setActiveChart(key)}
              className="px-6 py-4 text-left border-l data-[active=true]:bg-muted/50"
            >
              <p className="text-xs text-muted-foreground">
                {chartConfig[key].label}
              </p>
              <p className="text-xl font-bold">
                {total[key]}
              </p>
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="w-full h-[220px] sm:h-[260px] md:h-[320px]"
        >
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
              }
            />

            <Bar
              dataKey={activeChart}
              fill={chartConfig[activeChart].color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>

        {loading && (
          <p className="text-center text-sm mt-2 text-muted-foreground">
            Loading...
          </p>
        )}
      </CardContent>
    </Card>
  );
}
