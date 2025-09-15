"use client"
import { Bar, BarChart, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const bg = "rgba(234, 88, 12, 1)";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: bg,
  },
} satisfies ChartConfig;

import { faturamentoDiaType } from "@/services/dashboardServices";
import { useState } from "react";
import { currency } from "@/services/currencyServices";
import { toNumberLabel } from "@/services/utils";

type propsType = {
  title: string,
  data: faturamentoDiaType[],
  baseKey: string,
  valueKey: string,
  money?: boolean
}

// @ts-ignore
export function ChartBar({title, data, baseKey, valueKey, money}: propsType) {

  // @ts-ignore
  const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>("desktop");

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>


      <CardContent className="p-2">

        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <XAxis
              dataKey={baseKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              interval="preserveStartEnd"
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip cursor={false} content={
              <ChartTooltipContent 
                className="w-fit"
                nameKey={baseKey}
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString("pt-BR", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                }}
                formatter={(value, name) => (
                  <>
                    {/* block color */}
                    <div className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]" style={
                      {"--color-bg": bg} as React.CSSProperties
                    }/>
                    {/* key name */}
                    {chartConfig[name as keyof typeof chartConfig]?.label || name}
                    {/* key value */}
                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                      {money ? `${currency(Number(value))}` : toNumberLabel(Number(value))}
                    </div>
                  </>
                )}
              />
            }/>
            <Bar dataKey={valueKey} fill="var(--color-desktop)" radius={4} />
          </BarChart>
        </ChartContainer>

      </CardContent>
    </Card>
  )
}
