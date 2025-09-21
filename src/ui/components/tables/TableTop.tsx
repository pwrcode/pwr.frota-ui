
import { type LucideIcon } from "lucide-react";

type propsType = {
  children?: React.ReactNode,
  title?: string,
  icon?: LucideIcon
}

export const TableTop = ({children, title, icon: Icon}: propsType) => {
  return (
    <div className={`w-full dark:bg-card dark:text-foreground gap-2 flex ${title ? "justify-between" : "justify-end"} p-4 pt-3 px-6 items-center`}>
      {title && (
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 bg-blue-800 rounded-lg">
              <Icon className="w-5 h-5 text-white" />
            </div>
          )}
          <h1 className="text-md font-semibold md:text-lg">{title}</h1>
        </div>
      )}
      {children}
    </div>
  )
}