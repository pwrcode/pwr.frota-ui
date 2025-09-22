"use client"
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, LabelList, ReferenceLine, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { currency } from "@/services/currency";
import { toNumberLabel } from "@/services/utils";

type propsType = {
  icon?: React.ReactNode,
  title?: string,
  data: any[],
  dataName: string,
  nameIsDate?: boolean,
  dataKey: string,
  money?: boolean,
  active: boolean,
  toolTipName?: string,
  bgColor?: string
}

export function VerticalChartBar({icon, title, data, dataName, nameIsDate, dataKey, money, active, toolTipName, bgColor}: propsType) {

  const bg = bgColor ?? "#3b82f6"; // Azul moderno mais suave

  // Calcular a média apenas dos valores maiores que zero
  const validData = data.filter(item => (item[dataKey] as number) > 0);
  const average = validData.length > 0 
    ? validData.reduce((sum, item) => sum + (item[dataKey] as number || 0), 0) / validData.length
    : 0;

  const parseDate = (dateValue: string) => {
    if (dateValue.includes('T')) {
      return new Date(dateValue);
    }
    return new Date(dateValue + 'T00:00:00');
  };

  const chartConfig = {
    views: {
      label: "Page Views",
    },
    desktop: {
      label: "Desktop",
      color: bg,
    }
  } satisfies ChartConfig;

  // @ts-ignore
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("desktop");

  if (active) return (
    <CardBar title={title} icon={icon}>
      <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full" >
        <BarChart accessibilityLayer data={data} margin={{ left: 12, right: 60, top: 40, bottom: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey={dataName} tickLine={false} axisLine={false} interval="preserveStartEnd" tickMargin={8} minTickGap={32} tickFormatter={(value) => {
              if (nameIsDate) {
                const date = parseDate(value);
                return date.toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                })
              }
              else return value
            }}
              tick={{ fill: "currentColor" }}
              className="text-black dark:text-foreground"
          />
          <ChartTooltip content={
            <ChartTooltipContent
              className="w-fit dark:bg-accent"
              nameKey={dataKey}
              labelFormatter={(value) => {
                if (nameIsDate) {
                  return parseDate(value).toLocaleDateString("pt-BR", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                }
                else return value
              }}
              formatter={(value, name) => {
                // Calcular a cor correta baseada na média
                const itemValue = Number(value);
                const color = itemValue >= average ? bg : "#f97316";
                
                return (
                  <>
                    {/* block color */}
                    <div className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={
                      {backgroundColor: color} as React.CSSProperties
                    }/>
                    {/* key name */}
                    {toolTipName || chartConfig[name as keyof typeof chartConfig]?.label || name}
                    {/* key value */}
                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground dark:text-foreground">
                      {money ? `${currency(Number(value))}` : toNumberLabel(Number(value))}
                    </div>
                  </>
                )
              }}
            />
          }/>
          <Bar dataKey={dataKey} radius={4}>
            {data.map((entry, index) => {
              const value = entry[dataKey] as number;
              const color = value >= average ? bg : "#f97316"; // Cor original para acima/igual média, laranja moderno para abaixo
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
            <LabelList
              dataKey={dataKey}
              position="top"
              offset={5}
              className="fill-foreground"
              fontSize={10}
              formatter={(value: number) => {
                if (value === 0) return '';
                if (money) {
                  // Para valores monetários, mostrar versão compacta sem centavos e sem R$
                  if (value >= 1000000) {
                    return `${(value / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}M`;
                  } else if (value >= 1000) {
                    return `${(value / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}K`;
                  }
                  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;
                } else {
                  // Para quantidade, versão compacta também
                  if (value >= 1000000) {
                    return `${(value / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}M`;
                  } else if (value >= 1000) {
                    return `${(value / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}K`;
                  }
                  return toNumberLabel(value);
                }
              }}
            />
          </Bar>
          {average > 0 && (
            <ReferenceLine 
              y={average} 
              stroke="#f59e0b" 
              strokeWidth={1}
              strokeDasharray="3 3"
              strokeOpacity={0.7}
            />
          )}
        </BarChart>
      </ChartContainer>
    </CardBar>
  )
}

const CardBar = ({icon, title, children}: {icon?: React.ReactNode, title?: string, children: React.ReactNode}) => {
  if (title) return (
    <Card className="dark:bg-card">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">        
        <div className="flex flex-1 flex-row justify-start items-center gap-1 px-5 py-5 sm:py-6">
          {icon && (
            <div className="flex justify-content items-center mr-1">
              <div className="p-2 bg-blue-800 rounded-lg">
                {icon}
              </div>
            </div>
          )}
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="py-2 px-1">
        {children}
      </CardContent>
    </Card>
  )
  return (
    <>{children}</>
  )
}