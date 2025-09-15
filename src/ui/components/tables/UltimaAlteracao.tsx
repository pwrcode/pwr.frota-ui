import { Badge } from "@/components/ui/badge"
import { dateDiaMesAno, dateHoraMin} from "@/services/date";

type propsType = {
  user: string | undefined | null,
  date: string | undefined | null,
  userCad?: string,
  dateCad?: string
}

export const UltimaAlteracao = ({user, date, userCad, dateCad}: propsType) => {

  const usuario = user ?? userCad;
  const dataUltimaAlteracao = date && dateDiaMesAno(date) || dateDiaMesAno(dateCad ?? null);
  const horaUltimaAlteracao = date && dateHoraMin(date) || dateHoraMin(dateCad ?? null);

  return (
    <Badge variant="blue">
      {usuario} {`${dataUltimaAlteracao} ${horaUltimaAlteracao}`}
    </Badge>
  )
}