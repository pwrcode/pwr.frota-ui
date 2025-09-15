import { Badge } from "@/components/ui/badge"

export const BadgeAtivo = ({ativo, className} : {ativo: boolean, className?: string}) => {
  return (
    <Badge variant={ativo ? "success" : "destructive"} className={className}>
      {ativo ? "Ativo" : "Inativo"}
    </Badge>
  )
}

export const BadgeSimNao = ({value, className} : {value: boolean, className?: string}) => {
  return (
    <Badge variant={value ? "success" : "destructive"} className={className}>
      {value ? "Sim" : "Não"}
    </Badge>
  )
}

export const BadgeTrueFalse = ({value, className, t, f} : {value: boolean, className?: string, t?: string, f?: string}) => {
  return (
    <Badge variant={value ? "success" : "destructive"} className={className ?? "w-fit text-nowrap"}>
      {value ? (t ?? "Sim") : (f ?? "Não")}
    </Badge>
  )
}