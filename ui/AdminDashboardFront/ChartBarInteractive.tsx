"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useState, useEffect, useMemo } from "react"
import axios from "axios"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "An interactive bar chart"

interface ChartDataFormat {
  date: string
  appointments: number
  admission: number
}

const chartConfig = {
  views: { label: "Patients" },
  appointments: {
    label: "Appointments",
    color: "#0891b2",
  },
  admission: {
    label: "Admission",
    color: "#155e75",
  },
} satisfies ChartConfig


interface PropTypes {
  optionValue: string
  setOptionValue: React.Dispatch<React.SetStateAction<string>>
}

export function ChartBarInteractive({ optionValue }: PropTypes) {
    type ChartKey = "appointments" | "admission"

    const [activeChart, setActiveChart] =
      useState<ChartKey>("appointments")

  const [chartData, setChartData] = useState<ChartDataFormat[]>([])
  const [loading, setLoading] = useState(false)

  /* ---------------- FETCH DATA ---------------- */
  const fetchTransactionData = async () => {
    try {
      setLoading(true)
      const res = await axios.get(
        "/api/dashboard/admin/dashboardTransaction",
        {
          params: { transaction_option: optionValue },
        }
      )

      if (res.data?.success) {
        setChartData(res.data.data)
      }
    } catch (err) {
      console.error("Failed to fetch chart data", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (optionValue) fetchTransactionData()
  }, [optionValue])

  /* ---------------- TOTAL COUNTS ---------------- */
  const total = useMemo(() => {
    return {
      appointments: chartData.reduce(
        (acc, curr) => acc + curr.appointments,
        0
      ),
      admission: chartData.reduce(
        (acc, curr) => acc + curr.admission,
        0
      ),
    }
  }, [chartData])

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Appointments-Admission Dataflow</CardTitle>
          <CardDescription>
            Showing data based on selected time range
          </CardDescription>
        </div>

        <div className="flex">
          {(["appointments", "admission"] as const).map((chart) => (
            <button
              key={chart}
              data-active={activeChart === chart}
              className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveChart(chart)}
            >
              <span className="text-muted-foreground text-xs">
                {chartConfig[chart].label}
              </span>
              <span className="text-lg leading-none font-bold sm:text-3xl">
                {total[chart].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
            
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
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
                  className="w-[150px]"
                  nameKey="views"
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
            />

          </BarChart>
        </ChartContainer>

        {loading && (
          <p className="text-center text-sm text-muted-foreground mt-2">
            Loading data...
          </p>
        )}
      </CardContent>
    </Card>
  )
}
