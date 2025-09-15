import { TableCell } from "@/components/ui/table";

type propsType = {
  children?: React.ReactNode,
  title?: string | number
}

export const TableCardHeader = ({children, title}: propsType) => {
  return (
    <TableCell className="w-full flex flex-row justify-between items-center p-0 sm:hidden">

      {title && (
        <span className="text-base font-semibold mb-0.5">{title}</span>
      )}

      {(title && children) && (
        <div className="flex flex:row items-center gap-1">
          {children}
        </div>
      )}

      {(!title && children) && (
        <>{children}</>
      )}

    </TableCell>
  )
}
