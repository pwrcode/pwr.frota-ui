import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleChart } from "./ToggleChart";
import { currency } from "@/services/currency";
import { DollarSign, Hash, TrendingUp } from "lucide-react";
import { type JSX } from "react";

type TotalizadorData = {
  total: number;
  quantidade: number;
  media: number;
  isMoney?: boolean;
}

type propsType = {
  icon?: React.ReactNode,
  title: string,
  children: React.ReactNode,
  toggle: number,
  setToggle: React.Dispatch<React.SetStateAction<number>>,
  totalizador?: TotalizadorData,
  showToggle?: boolean
}

export const CardChart = ({ icon, title, children, toggle, setToggle, totalizador, showToggle = true }: propsType) => {
  const formatValue = (value: number, isMoney: boolean = false) => {
    if (isMoney) {
      return currency(value);
    }
    return value.toLocaleString('pt-BR', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 2 
    });
  };

  return (
    <div>
      <Card className="w-full dark:bg-card">
        <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
          <div className={`
          flex-1 flex flex-row lg:flex-row ${showToggle ? 'justify-between' : 'justify-start'} items-stretch gap-1
          py-3 px-4 sm:p-4 xl:px-5 xl:py-4
        `}>
            {icon && (
              <div className="flex justify-content items-center mr-1">
                <div className="p-2 bg-blue-800 rounded-lg">
                  {icon}
                </div>
              </div>
            )}
            <CardTitle className="text-xl flex items-center">
              {title}
            </CardTitle>
            {showToggle && (
              <div className="flex-[1] flex items-center justify-end">
                <ToggleChart toggle={toggle} setToggle={setToggle} />
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-3">
          <div className="flex flex-col justify-start">
            {children}
          </div>
        </CardContent>

        {totalizador && (
          <div className="px-4 py-3 bg-gray-50 dark:bg-accent border-t rounded-b-lg">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <TotalizadorItem
                icon={<DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                title="Total"
                value={formatValue(totalizador.total, totalizador.isMoney)}
                valueColor="text-blue-600 dark:text-blue-400"
              />
              <TotalizadorItem
                icon={<Hash className="h-5 w-5 text-green-600 dark:text-green-400" />}
                title="Quantidade"
                value={formatValue(totalizador.quantidade)}
                valueColor="text-green-600 dark:text-green-400"
              />
              <TotalizadorItem
                icon={<TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
                title="Média"
                value={formatValue(totalizador.media, totalizador.isMoney)}
                valueColor="text-purple-600 dark:text-purple-400"
              />
            </div>
          </div>
        )}

      </Card>
    </div>
  )
}

const TotalizadorItem = ({icon, title, value, valueColor}: {
  icon: JSX.Element, title: string, value: any, valueColor: string
}) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {icon}
      <div className="text-center flex flex-row items-center gap-1 sm:gap-0 sm:flex-col">
        <div className="text-xs text-gray-500 dark:text-gray-400 sm:mb-1">{title}</div>
        <div className={"font-semibold " + valueColor}>
          {value}
        </div>
      </div>
    </div>
  )
}