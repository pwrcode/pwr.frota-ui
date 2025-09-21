import { removeNonDigit } from "@/services/utils";

type propsType = {
  cadInfo: string, alterInfo: string, style?: string
}

export const CadAlterInfo = ({cadInfo, alterInfo, style}: propsType) => {
  const alteracao = removeNonDigit(alterInfo).length > 0 ? alterInfo : undefined;
  return (
    <div className={"flex flex-row gap-4 " + style}>
      {cadInfo && <div className="flex flex-col gap-1">
        <div className="text-xs text-gray-500 dark:text-foreground/50">Cadastro</div>
        <div className="text-sm text-gray-600 dark:text-foreground">{cadInfo}</div>
      </div>}
      {alteracao && (
        <div className="flex flex-col gap-1">
          <div className="text-xs text-gray-500 dark:text-foreground/50">Última alteração</div>
          <div className="text-sm text-gray-600 dark:text-foreground">{alterInfo}</div>
        </div>
      )}
    </div>
  )
}