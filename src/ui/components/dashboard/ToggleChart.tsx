import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, ShoppingCart } from "lucide-react";

type propsType = {
  toggle: number,
  setToggle: React.Dispatch<React.SetStateAction<number>>
}

export const ToggleChart = ({ toggle, setToggle }: propsType) => {

  const borderSelected = (current: boolean, t: number) => {
    if (current) return "border-gray-800 bg-muted dark:text-foreground dark:bg-accent";
    else {
      if (t === 1) return "border-gray-300 border-r-0";
      if (t === 2) return "border-gray-300 border-l-0";
    }
  }

  const styleTrigger = "py-3 px-4 rounded border dark:border-border dark:bg-card dark:active:bg-accent flex gap-2 items-center";

  return (
    <div className="flex flex-row">

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            type="button"
            className={
              `${styleTrigger} rounded-r-none ${borderSelected(toggle === 1, 1)} ` +
              `${toggle === 1 ? 'dark:bg-card' : ''}`
            }
            onClick={() => setToggle(1)}
          >
            <ShoppingCart className="size-4 dark:text-foreground" />
          </TooltipTrigger>
          <TooltipContent className="dark:bg-accent">
            Faturamento
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            type="button"
            className={
              `${styleTrigger} rounded-l-none ${borderSelected(toggle === 2, 2)} ` +
              `${toggle === 2 ? 'dark:bg-card' : ''}`
            }
            onClick={() => setToggle(2)}
          >
            <Copy className="size-4" />
          </TooltipTrigger>
          <TooltipContent className="dark:bg-accent">
            Quantidade
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

    </div>
  )
}