import { PieChart, Pie } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { faturamentoType } from "@/services/dashboardServices";
import { currency } from "@/services/currencyServices";
import { toNumberLabel } from "@/services/utils";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleChart } from "./ToggleChart";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp } from "lucide-react";

type propsType = {
  faturamentoPorZona: faturamentoType[],
  icon?: any,
  title?: string,
  valueKey: string,
  money?: boolean,
  active: boolean
  toggle: number,
  setToggle: any,
}

export const DonutChart = ({ faturamentoPorZona, valueKey, money, active, icon, title, toggle, setToggle }: propsType) => {

  const [data, setData] = useState<faturamentoType[]>([])
  const [openPopover, setOpenPopover] = useState(false);

  useEffect(() => {
    const resumo = faturamentoPorZona.slice(0, 5);
    const outros = {
      descricao: "Outros",
      qtd: faturamentoPorZona.slice(5).reduce((acc, item) => acc + item.qtd, 0),
      total: faturamentoPorZona.slice(5).reduce((acc, item) => acc + item.total, 0)
    };
    if (outros.qtd > 0) resumo.push(outros);
    setData(resumo);
  }, [faturamentoPorZona])

  const COLORS = [
    '#ef4444', // red-500
    '#f59e0b', // amber-500
    '#0ea5e9', // sky-500
    '#10b981', // emerald-500
    '#eab308', // yellow-500
    '#6366f1', // indigo-500
    '#ec4899', // pink-500
    '#14b8a6', // teal-500
    '#a855f7', // purple-500
    '#3b82f6', // blue-500
  ];

  const dados = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  if (active) return (
    <div>
      <Card className="w-full rounded-b-none border-b-0 dark:bg-slate-800">
        <CardHeader className="flex flex-col items-stretch p-0">
          <div className={`
          flex-1 flex flex-row lg:flex-row justify-between items-stretch gap-1
          py-3 px-4 sm:p-4 xl:px-5 xl:py-4 border-b
        `}>
            {icon && (
              <div className="flex justify-content items-center mr-1">
                <div className="p-[6px] bg-blue-800 rounded-lg">
                  {icon}
                </div>
              </div>
            )}
            <CardTitle className="text-xl md:text-xl lg:text-2xl flex items-center">
              {title}
            </CardTitle>
            <div className="flex-[1] flex items-center justify-end">
              <ToggleChart toggle={toggle} setToggle={setToggle} />
            </div>
          </div>
          <CardDescription className={`px-6 pt-2 w-full max-w-full h-fit flex gap-3 ${dados.length <= 3 ? "justify-center" : "flex-wrap gap-y-0 justify-between w-[400px]"} sm:mx-auto`}>
            {dados.map((dados: any, index) => {
              return (
                <div key={index} className="flex w-fit h-fit gap-1 items-center dark:text-white">
                  <span style={{ backgroundColor: dados.fill }} className={`h-3 w-6`}></span>
                  {dados.descricao}
                </div>
              )
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            title="Browser Usage (Donut Chart)"
            config={{
              users: {
                label: "Users",
              },
            }}
            className="flex flex-row justify-center items-start"
          >
            <PieChart className="h-full w-full p-0" margin={{ left: 30, right: 30, top: 0, bottom: 0 }}>
              <ChartTooltip content={
                <ChartTooltipContent
                  className="w-fit"
                  nameKey="descricao"
                  formatter={(value, name, item) => (
                    <>
                      {/* block color */}
                      <div className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                        style={{ backgroundColor: dados.find(d => d.descricao === item.name)?.fill || 'transparent' }}
                      />
                      {/* key name */}
                      {name}
                      {/* key value */}
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground dark:text-white">
                        {money ? `${currency(Number(value))}` : toNumberLabel(Number(value))}
                      </div>
                    </>
                  )}
                />
              } />
              <Pie
                data={dados}
                dataKey={valueKey}
                nameKey="descricao"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                innerRadius="50%"
                // label={(entry) => entry.descricao}
                labelLine={false}
                startAngle={450} // Começa do lado direito (90° no sentido horário)
                endAngle={90}
                paddingAngle={2}
                cornerRadius={8}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <div className="bg-gray-50 dark:bg-slate-700 dark:border-slate-800 rounded-b-xl border-b border-x">
        <Button onClick={() => setOpenPopover(!openPopover)} className="w-full dark:hover:bg-slate-600 dark:text-white flex justify-between text-lg text-neutral-600" variant={"ghost"}>Lista Completa {openPopover ? <ChevronUp /> : <ChevronDown />}</Button>
        {openPopover && <ScrollArea className={`h-64 w-full p-4`}>
          <div className="space-y-1">
            {data.map((dados, index) => (
              <div key={index} className="text-base flex justify-between rounded-md bg-white dark:bg-slate-800 dark:text-white p-3">
                <p>{dados.descricao}</p>
                {valueKey === "qtd" ?
                  <p>{dados.qtd}</p>
                  :
                  <p>{currency(dados.total)}</p>}
              </div>
            ))}
          </div>
        </ScrollArea>}
      </div>
    </div>
  )
}