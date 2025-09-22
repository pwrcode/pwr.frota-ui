"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { currency } from "@/services/currency";
import { toNumberLabel } from "@/services/utils";

const bg = "rgba(234, 88, 12, 1)";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: bg,
  },
} satisfies ChartConfig;

type propsType = {
  data: any[],
  baseKey: string,
  valueKey: string,
  money?: boolean,
  active: boolean
}

export function HorizontalChartBar({data, baseKey, valueKey, money, active}: propsType) {  
  if(active) return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 30 }}>
        <XAxis type="number" dataKey={valueKey} minTickGap={10} hide  />
        <YAxis dataKey={baseKey} type="category" tickLine={false} interval={0} tickMargin={10} axisLine={false} tickFormatter={(value) => (
          value.split(" ")[0]
        )} tick={{ fill: "currentColor" }}
        className="text-black dark:text-foreground"
        />
        <ChartTooltip cursor={false} content={
          <ChartTooltipContent 
            className="w-fit"
            nameKey={baseKey}
            formatter={(value, name) => (
              <>
                {/* block color */}
                <div className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]" style={
                  {"--color-bg": bg} as React.CSSProperties
                }/>
                {/* key name */}
                {chartConfig[name as keyof typeof chartConfig]?.label || name}
                {/* key value */}
                <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground dark:text-foreground">
                  {money ? `${currency(Number(value))}` : toNumberLabel(Number(value))}
                </div>
              </>
            )}
          />
        }/>
        <Bar dataKey={valueKey} fill="var(--color-desktop)" maxBarSize={30} radius={5} />
      </BarChart>
    </ChartContainer>
  )
}