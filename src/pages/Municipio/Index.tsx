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
import { getMunicipios, type municipioType, type postListagemMunicipioType } from '@/services/municipio';
import { todosOption } from '@/services/constants';
import AsyncReactSelect from '@/ui/components/forms/AsyncReactSelect';
import { getUfList } from '@/services/uf';

export default function Municipio() {

  const [loading, setLoading] = useState<boolean>(false);
  const [municipios, setMunicipios] = useState<municipioType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRegisters, setTotalRegisters] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [idVisualizar, setIdVisualizar] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pesquisa, setPesquisa] = useState<string>("");
  const [uf, setUf] = useState(todosOption);

  const getUfs = async (pesquisa?: string) => {
    const data = await getUfList(pesquisa);
    return [todosOption, ...data];
  }

  const initialPostListagem: postListagemMunicipioType = {
    pageSize: pageSize,
    currentPage: currentPage,
    pesquisa: "",
    idUf: null
  };
  const [postListagem, setPostListagem] = useState(initialPostListagem);
  const [filtersOn, setFiltersOn] = useState<boolean>(false);

  useEffect(() => {
    if(currentPage > 0 || filtersOn) changeListFilters(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if(pesquisa.length > 0 || filtersOn) changeListFilters();
  }, [pesquisa]);

  useEffect(() => {
    if(uf.value !== undefined || filtersOn) changeListFilters();
  }, [uf.value]);

  const changeListFilters = (page?: number) => {
    setFiltersOn(true);
    setPostListagem({
      pageSize: pageSize,
      currentPage: page ?? 0,
      pesquisa: pesquisa,
      idUf: uf && uf.value ? uf.value : null
    });
  }

  useEffect(() => {
    updateList();
  }, []);

  const updateList = async () => {
    const process = toast.loading("Carregando...");
    setLoading(true);
    try {
      const data = await getMunicipios(postListagem);
      setMunicipios(data.dados);
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

      <PageTitle title="Municípios" />

      <Filters grid={FiltersGrid.sm2_md3_lg4}>
        <InputLabelValue name="pesquisa" title="Pesquisar" value={pesquisa} setValue={setPesquisa} />
        <AsyncReactSelect
          name="idUf"
          title="UF"
          options={[]}
          asyncFunction={getUfs}
          value={uf}
          setValue={setUf}
        />
      </Filters>

      {(municipios.length > 0) && (
        <div className="bg-card dark:bg-card py-1 rounded-md shadow-md dark:border">
          <Table>
            <TableHeader>
              <TableRow className="hidden sm:table-row">
                <TableHead className="w-16 text-center">Id</TableHead>
                <TableHead className='w-70'>Município</TableHead>
                <TableHead>UF</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {municipios.map(c => {
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

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "UF: "}{c.descricaoUf}
                    </TableCell>

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
            lengthCurrentPage={municipios.length}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {municipios.length === 0 && <>
        {loading ? (
          <TableLoading />
        ) : (
          <TableEmpty icon="map-pin" />
        )}
      </>}

      <Modal id={idVisualizar} open={modalOpen} setOpen={setModalOpen} />

    </div>
  )
}