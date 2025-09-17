import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMobile } from '@/hooks/useMobile';
import PageTitle from '@/ui/components/PageTitle';
import { Filters, FiltersGrid } from '@/ui/components/Filters';
import InputLabelValue from '@/ui/components/forms/InputLabelValue';
import TableLoading from '@/ui/components/tables/TableLoading';
import { TableCardHeader } from '@/ui/components/tables/TableCardHeader';
import DropDownMenuItem from '@/ui/components/DropDownMenuItem';
import TableEmpty from '@/ui/components/tables/TableEmpty';
import { toast } from 'react-toastify';
import { errorMsg } from '@/services/api';
import { TableRodape } from '@/ui/components/tables/TableRodape';
import { delayDebounce, useDebounce } from '@/hooks/useDebounce';
import Modal from './Modal';
import { getUfs, type postListagemUfType, type ufType } from '@/services/uf';

export default function Uf() {

  const [loading, setLoading] = useState<boolean>(false);
  const [ufs, setUfs] = useState<ufType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRegisters, setTotalRegisters] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [idVisualizar, setIdVisualizar] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pesquisa, setPesquisa] = useState<string>("");

  const initialPostListagem: postListagemUfType = {
    pageSize: pageSize,
    currentPage: currentPage,
    pesquisa: ""
  };
  const [postListagem, setPostListagem] = useState(initialPostListagem);
  const [filtersOn, setFiltersOn] = useState<boolean>(false);

  useEffect(() => {
    if(currentPage > 0 || filtersOn) changeListFilters(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if(pesquisa.length > 0 || filtersOn) changeListFilters();
  }, [pesquisa]);

  const changeListFilters = (page?: number) => {
    setFiltersOn(true);
    setPostListagem({
      pageSize: pageSize,
      currentPage: page ?? 0,
      pesquisa: pesquisa
    });
  }

  useEffect(() => {
    updateList();
  }, []);

  const updateList = async () => {
    const process = toast.loading("Carregando...");
    setLoading(true);
    try {
      const data = await getUfs(postListagem);
      setUfs(data.dados);
      setTotalPages(data.totalPages);
      setPageSize(data.pageSize);
      setTotalRegisters(data.totalRegisters);
      setCurrentPage(data.currentPage);
      toast.dismiss(process);
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 2000 });
    }
    finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    if(postListagem !== initialPostListagem) debounceUpdate();
  }, [postListagem]);

  const debounceUpdate = useDebounce(updateList, delayDebounce);

  const handleClickVisualizar = (id: number) => {
    setIdVisualizar(id);
    setModalOpen(true);
  }
  
  const { isMobile, rowStyle, cellStyle, hiddenMobile } = useMobile();

  return (
    <div className="flex flex-col gap-8 mt-16 min-h-[calc(100%-4rem)]">

      <PageTitle title="UF" />

      <Filters grid={FiltersGrid.sm2_md3_lg4}>
        <InputLabelValue name="pesquisa" title="Pesquisar" value={pesquisa} setValue={setPesquisa} size="flex-[5]" />
      </Filters>

      {(ufs.length > 0) && (
        <div className="bg-white dark:bg-slate-800 py-1 rounded-md shadow-md">
          <Table>
            <TableHeader>
              <TableRow className="hidden sm:table-row">
                <TableHead className="w-16 text-center">Id</TableHead>
                <TableHead>UF</TableHead>
                {/* <TableHead>País</TableHead> */}
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ufs.map(c => {
                return (
                  <TableRow key={c.id} className={rowStyle}>

                    <TableCardHeader title={c.descricao}>
                      <DropDownMenuItem id={c.id} handleClickVisualizar={handleClickVisualizar} />
                    </TableCardHeader>

                    <TableCell className={cellStyle + "sm:text-center"}>
                      {isMobile && "Id: "}{c.id}
                    </TableCell>

                    <TableCell className={hiddenMobile + "sm:text-left font-medium"}>
                      {c.descricao}
                    </TableCell>

                    {/* <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "País: "}{c.descricaoPais}
                    </TableCell> */}

                    <TableCell className={hiddenMobile + "text-right w-[100px]"}>
                      <DropDownMenuItem id={c.id} handleClickVisualizar={handleClickVisualizar} />
                    </TableCell>

                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <hr />
          <TableRodape
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalRegisters={totalRegisters}
            lengthCurrentPage={ufs.length}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {ufs.length === 0 && <>
        {loading ? (
          <TableLoading />
        ) : (
          <TableEmpty icon="map" />
        )}
      </>}

      <Modal id={idVisualizar} open={modalOpen} setOpen={setModalOpen} />

    </div>
  )
}