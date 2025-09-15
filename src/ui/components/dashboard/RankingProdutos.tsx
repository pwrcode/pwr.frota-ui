import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currency } from "@/services/currencyServices";
import { rankingProdutosType } from "@/services/dashboardServices";
import { ToggleChart } from "./ToggleChart";
import { ImageSrc, TypesImg } from "../ImageSrc";
import { PackageSearch } from "lucide-react";

type rankingPropsType = {
  rankingQtd: rankingProdutosType[],
  rankingTotal: rankingProdutosType[],
  toggle: number,
  setToggle: React.Dispatch<React.SetStateAction<number>>
}

export const RankingProdutos = ({ rankingQtd, rankingTotal, toggle, setToggle }: rankingPropsType) => {
  return (
    <Card className="dark:bg-slate-800">

      <CardHeader className="border-b p-0">
        <div className={`
          flex flex-1 flex-row justify-between items-stretch gap-1
          py-3 px-4 sm:p-4 xl:px-5 xl:py-4
        `}>
          <div className="flex justify-content items-center mr-1">
            <div className="p-[6px] bg-blue-800 rounded-lg">
              <PackageSearch size={18} color="white" />
            </div>
          </div>
          <CardTitle className="text-xl lg:text-2xl flex items-center">
            {toggle === 1 && "Faturamento por produto"}
            {toggle === 2 && "Quantidade por produto"}
          </CardTitle>
          <div className="flex-[1] flex items-center justify-end">
            <ToggleChart toggle={toggle} setToggle={setToggle} />
          </div>
        </div>
      </CardHeader>


      <CardContent className="px-0">
        {toggle === 1 && (
          <TableComp data={rankingTotal} toggle={1} />
        )}
        {toggle === 2 && (
          <TableComp data={rankingQtd} toggle={2} />
        )}
      </CardContent>
    </Card>
  )
}

type tablePropsType = {
  data: rankingProdutosType[], toggle: number
}

function TableComp({ data, toggle }: tablePropsType) {
  return (
    <div className="px-0">
      {data.map((produto, index) => (

        <div key={index} className="flex items-center border-b py-2 px-4">
          <Avatar className="h-9 w-9 flex items-center justify-center rounded-lg">
            {produto.idArquivoFoto ? (
              <AvatarFallback className="rounded-none bg-transparent overflow-hidden">
                <ImageSrc
                  id={produto.idArquivoFoto}
                  alt="Foto Produto"
                  style="max-h-full"
                  typeImg={TypesImg.any}
                />
              </AvatarFallback>
            ) : (
              <AvatarFallback className="rounded-none bg-gray-200 dark:bg-slate-700">
                {produto.descricao.split(" ").map((word) => word.charAt(0)).slice(0, 2).join("").toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="ml-4"> {/* space-y-1 ?? */}
            <p className="text-sm font-medium">{produto.descricao}</p>
            <p className="text-sm text-muted-foreground">
              {toggle === 2 && currency(produto.total)}
              {toggle === 1 && produto.qtd.toLocaleString("pt-BR")}
            </p>
          </div>

          <div className="ml-auto font-medium text-left">
            {toggle === 1 && currency(produto.total)}
            {toggle === 2 && produto.qtd.toLocaleString("pt-BR")}
          </div>
        </div>

      ))}
    </div>
  );
}