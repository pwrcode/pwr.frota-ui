import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
//import { useMobile } from "@/hooks/useMobile";

type propsInterface = {
  currentPage: number,
  totalPages: number,
  pageSize: number,
  totalRegisters: number,
  lengthCurrentPage: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

export const TableRodape = ({ currentPage, totalPages, pageSize, totalRegisters, lengthCurrentPage, setCurrentPage }: propsInterface) => {

  const [minPage, setMinPage] = useState<number>(1); // para info no rodapé
  const [maxPage, setMaxPage] = useState<number>(10); // para calc em maxInfo v
  const maxInfo: number = (currentPage + 1) !== totalPages ? maxPage : maxPage - (pageSize - lengthCurrentPage); // para info no rodapé

  useEffect(() => {
    const calcMaxPage = (currentPage + 1) * pageSize;
    setMaxPage(calcMaxPage);
    setMinPage(calcMaxPage - (pageSize - 1)); // calcMaxPage - 9
  }, [currentPage, totalRegisters]);

  const first = currentPage === 0;
  const last = currentPage === (totalPages - 1);
  const previousFirst = (currentPage - 1) === 0;
  const nextLast = (currentPage + 1) === (totalPages - 1);
  const betweenFirstPrevious = currentPage >= 3;
  const betweenNextLast = (totalPages - 1) - currentPage >= 3;

  const lastPage = totalPages - 1;
  const prevPage = currentPage > 0 ? currentPage - 1 : 0;
  const nextPage = currentPage < lastPage ? currentPage + 1 : lastPage;

  const style = "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-none size-[40px] dark:border-gray-500 dark:hover:bg-slate-600";
  const styleCurrent = `${style} z-10 bg-indigo-50 border-indigo-500 text-indigo-600 dark:border-gray-500 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-600`;
  const styleMblBtn = "relative dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 dark:border-slate-800 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-500 dark:hover:bg-slate-600";

  //

  /*
  const smallRodape = document.querySelector("#small-rodape");
  const desktopRodape = document.querySelector("#desktop-rodape");

  const { checkMedium, isMedium } = useMobile();
  const [rodapeMedium, setRodapeMedium] = useState<boolean>();

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      entry.target.style.width = entry.contentBoxSize[0].inlineSize + 10 + "px";
    }
  });
  */

  return (
    <>
      <div id="small-rodape" className="flex dark:bg-slate-800 dark:border-gray-500 md:hidden flex-row justify-between my-4 gap-2 px-2">
        {!first && (
          <Button
            className={styleMblBtn + "dark:bg-slate-800 dark:text-white"}
            onClick={() => setCurrentPage(prevPage)}
          >
            Anterior
          </Button>
        )}

        <div className="w-full flex flex-row justify-left items-center dark:bg-slate-800">
          <TitleRodape minPage={minPage} maxInfo={maxInfo} totalRegisters={totalRegisters} />
        </div>

        {!last && (
          <Button
            className={styleMblBtn} 
            onClick={() => setCurrentPage(nextPage)}
          >
            Próximo
          </Button>
        )}
      </div>



      <div id="desktop-rodape" className="hidden dark:bg-slate-800 w-full md:flex flex-row justify-between px-5 py-3">
        <div className="w-1/2 flex flex-col justify-center">
          <TitleRodape minPage={minPage} maxInfo={maxInfo} totalRegisters={totalRegisters} />
        </div>

        <div className="w-1/2 flex flex-col justify-center">
          <Pagination className="flex gap-0 justify-end ">
            <PaginationContent className="flex gap-0">

              {/* Left Arrow */}
              {!first && (
                <PaginationItem
                  className={style + " border-r-0 rounded-l cursor-pointer dark:bg-slate-700"}
                  onClick={() => setCurrentPage(prevPage)}
                >
                  <div className="scale-110 -ml-2">
                    <ChevronLeft />
                  </div>
                </PaginationItem>
              )}

              {/* Primeira página */}
              <PaginationItem className={first || previousFirst ? "hidden" : ""} onClick={() => setCurrentPage(0)}>
                <PaginationLink className={style + " border-r-0 cursor-pointer dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white"}>1</PaginationLink>
              </PaginationItem>

              {/* ... */}
              <PaginationItem className={betweenFirstPrevious ? "" : "hidden"}>
                <PaginationEllipsis className={style + " border-r-0 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white"} />
              </PaginationItem>

              {/* Página anterior */}
              <PaginationItem className={first ? "hidden" : ""} onClick={() => setCurrentPage(prevPage)}>
                <PaginationLink className={style + " border-r-0 cursor-pointer dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white"}>{currentPage}</PaginationLink>
              </PaginationItem>

              {/* Página atual */}
              <PaginationItem>
                <PaginationLink className={styleCurrent}>{currentPage + 1}</PaginationLink>
              </PaginationItem>

              {/* Próxima página */}
              <PaginationItem className={last ? "hidden" : ""} onClick={() => setCurrentPage(nextPage)}>
                <PaginationLink className={style + " border-l-0 cursor-pointer dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white"}>{currentPage + 2}</PaginationLink>
              </PaginationItem>

              {/* ... */}
              <PaginationItem className={betweenNextLast ? "" : "hidden"}>
                <PaginationEllipsis className={style + " border-l-0 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white"}/>
              </PaginationItem>

              {/* Última página */}
              <PaginationItem className={last || nextLast ? "hidden" : ""} onClick={() => setCurrentPage(lastPage)}>
                <PaginationLink className={style + " border-l-0 cursor-pointer dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white"}>{totalPages}</PaginationLink>
              </PaginationItem>

              {/* Right Arrow */}
              {!last && (
                <PaginationItem
                  className={style + " border-l-0 rounded-r cursor-pointer dark:bg-slate-700"}
                  onClick={() => setCurrentPage(nextPage)}
                >
                  <div className="scale-110 -ml-2 dark:text-white">
                    <ChevronRight />
                  </div>
                </PaginationItem>
              )}

            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  )
}


type TitleRodapeType = { minPage: number, maxInfo: number, totalRegisters: number }

const TitleRodape = ({minPage, maxInfo, totalRegisters}: TitleRodapeType) => {
  return (
    <h6 className="text-sm text-gray-700 dark:text-white">
       <span className="hidden sm:inline dark:text-white">Mostrando</span> <span className="font-medium dark:text-white">{minPage}</span> até <span className="font-medium dark:text-white">{maxInfo}</span> de <span className="font-medium dark:text-white">{totalRegisters}</span> resultados
    </h6>
  )
}
