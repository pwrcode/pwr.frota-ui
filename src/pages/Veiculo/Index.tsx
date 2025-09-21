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
import { deleteVeiculo, getVeiculos, type postListagemVeiculoType, type veiculoType } from '@/services/veiculo';
import { ativoOptions, tiposDataVeiculo, type listType, type optionType } from '@/services/constants';
import AsyncReactSelect from '@/ui/components/forms/AsyncReactSelect';
import { getVeiculoModeloList } from '@/services/veiculoModelo';
import { getVeiculoMarcaList } from '@/services/veiculoMarca';
import { getTipoVeiculoList } from '@/services/tipoVeiculo';
import InputDataLabel from '@/ui/components/forms/InputDataLabel';
import { BadgeAtivo } from '@/ui/components/tables/BadgeAtivo';
import { formatarData } from '@/services/date';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TableTop } from '@/ui/components/tables/TableTop';
import { AlertExcluir } from '@/ui/components/dialogs/Alert';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter, X } from 'lucide-react';
import ModalFormBody from '@/ui/components/forms/ModalFormBody';
import ModalFormFooter from '@/ui/components/forms/ModalFormFooter';

export default function Veiculo() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [veiculos, setVeiculos] = useState<veiculoType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [veiculoModelos, setVeiculoModelos] = useState<listType>([]);
  const [totalRegisters, setTotalRegisters] = useState<number>(0);
  const [excluirId, setExcluirId] = useState<number>(0);
  const [openDialogExcluir, setOpenDialogExcluir] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pesquisa, setPesquisa] = useState<string>("");
  const [tipoVeiculo, setTipoVeiculo] = useState<optionType | null>();
  const [veiculoMarca, setVeiculoMarca] = useState<optionType  | null>();
  const [veiculoModelo, setVeiculoModelo] = useState<optionType | null>();
  const [tipoData, setTipoData] = useState<optionType  | null>();
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [status, setStatus] = useState<optionType  | null>();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const initialPostListagem: postListagemVeiculoType = {
    pageSize: pageSize,
    currentPage: currentPage,
    pesquisa: "",
    tipoData: null,
    dataInicio: "",
    dataFim: "",
    idTipoVeiculo: null,
    idVeiculoMarca: null,
    idVeiculoModelo: null,
    ativo: null,
  };
  const [postListagem, setPostListagem] = useState(initialPostListagem);
  const [filtersOn, setFiltersOn] = useState<boolean>(false);

  useEffect(() => {
    if (currentPage > 0 || filtersOn) changeListFilters(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (pesquisa.length > 0 || filtersOn) changeListFilters();
  }, [pesquisa]);

  useEffect(() => {
    changeListFilters();
  }, [tipoVeiculo]);

  useEffect(() => {
    changeListFilters();
  }, [veiculoMarca]);

  useEffect(() => {
    changeListFilters();
  }, [veiculoModelo]);

  useEffect(() => {
    if (!tipoData || !tipoData.value) {
      setDataInicio("");
      setDataFim("");
    }
    changeListFilters();
  }, [tipoData]);

  useEffect(() => {
    changeListFilters();
  }, [dataInicio]);

  useEffect(() => {
    changeListFilters();
  }, [dataFim]);

  useEffect(() => {
    changeListFilters();
  }, [status]);

  const changeListFilters = (page?: number) => {
    setFiltersOn(true);
    setPostListagem({
      pageSize: pageSize,
      currentPage: page ?? 0,
      pesquisa: pesquisa,
      tipoData: tipoData && tipoData.value ? tipoData.value : null,
      dataInicio: dataInicio != "" ? dataInicio.slice(0, 11).concat("00:00:00") : "",
      dataFim: dataFim != "" ? dataFim.slice(0, 11).concat("23:59:59") : "",
      idTipoVeiculo: tipoVeiculo && tipoVeiculo.value ? tipoVeiculo.value : null,
      idVeiculoMarca: veiculoMarca && veiculoMarca.value ? veiculoMarca.value : null,
      idVeiculoModelo: veiculoModelo && veiculoModelo.value ? veiculoModelo.value : null,
      ativo: status ? status.value : null,
    });
  }

  useEffect(() => {
    updateList();
  }, []);

  useEffect(() => {
    getVeiculosModelo();
  }, [veiculoMarca]);

  const getVeiculosModelo = async (pesquisa?: string) => {
    if (!veiculoMarca) {
      setVeiculoModelos([]);
      setVeiculoModelo(null);
      return [];
    };
    const data = await getVeiculoModeloList(pesquisa, veiculoMarca ? veiculoMarca.value : undefined);
    setVeiculoModelos([...data]);
    return [...data];
  }

  const getTipoVeiculos = async (pesquisa?: string) => {
    const data = await getTipoVeiculoList(pesquisa, undefined);
    return [...data];
  }

  const getVeiculoMarcas = async (pesquisa?: string) => {
    const data = await getVeiculoMarcaList(pesquisa);
    return [...data];
  }

  const updateList = async () => {
    const process = toast.loading("Carregando...");
    setLoading(true);
    try {
      const data = await getVeiculos(postListagem);
      setVeiculos(data.dados);
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
    if (postListagem !== initialPostListagem) debounceUpdate();
  }, [postListagem]);

  const debounceUpdate = useDebounce(updateList, delayDebounce);

  const handleClickAdicionar = () => {
    navigate("/veiculo/form");
  }

  const handleClickEditar = (id: number) => {
    navigate(`/veiculo/form/${id}`);
  }

  const handleClickDeletar = (id: number) => {
    setExcluirId(id);
    setOpenDialogExcluir(true);
  }

  const deletar = async () => {
    const process = toast.loading("Excluindo item...");
    try {
      const response = await deleteVeiculo(excluirId);
      setOpenDialogExcluir(false);
      toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
      if (veiculos.length === 1 && currentPage > 0) changeListFilters(currentPage - 1);
      else await updateList();
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 2000 });
    }
  }

  const clearFilters = () => {
    setTipoVeiculo(null);
    setVeiculoMarca(null);
    setVeiculoModelo(null);
    setTipoData(null);
    setDataInicio("");
    setDataFim("");
    setStatus(null);
  }

  const checkActiveFilters = () => {
    const hasFilters = Boolean(
      tipoVeiculo ||
      veiculoMarca ||
      veiculoModelo ||
      tipoData ||
      dataInicio ||
      dataFim ||
      status
    );
    setHasActiveFilters(hasFilters);
  }

  useEffect(() => {
    checkActiveFilters();
  }, [tipoVeiculo, veiculoMarca, veiculoModelo, tipoData, dataInicio, dataFim, status]);

  const { isMobile, rowStyle, cellStyle, hiddenMobile } = useMobile();

  return (
    <div className="flex flex-col gap-8 mt-16 min-h-[calc(100%-4rem)]">

      <PageTitle title="Veículos" />

      <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
        <div className="flex-1">
          <Filters grid={FiltersGrid.sm1_md1_lg1}>
            <InputLabelValue name="pesquisa" title="Pesquisar" value={pesquisa} setValue={setPesquisa} />
          </Filters>
        </div>

        <div className="flex items-end h-fit">
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className={`relative h-10 ${hasActiveFilters ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400' : ''}`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros Avançados
                {hasActiveFilters && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                    !
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className='p-0 gap-0 m-4 w-[400px] sm:w-[540px] h-[96%] rounded-lg border shadow-xl'>
              <SheetHeader className="px-6">
                <SheetTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros Avançados
                </SheetTitle>
                <SheetDescription>
                  Configure filtros específicos para encontrar os veículos desejados.
                </SheetDescription>
              </SheetHeader>

              <ModalFormBody>
                <div className="space-y-4">
                  <AsyncReactSelect
                    name="tipoVeiculo"
                    title='Tipo Veículo'
                    options={[]}
                    asyncFunction={getTipoVeiculos}
                    value={tipoVeiculo}
                    setValue={setTipoVeiculo}
                    isClearable
                  />

                  <AsyncReactSelect
                    name="veiculoMarca"
                    title='Marca'
                    options={[]}
                    asyncFunction={getVeiculoMarcas}
                    value={veiculoMarca}
                    setValue={setVeiculoMarca}
                    isClearable
                  />

                  <AsyncReactSelect
                    name="veiculoModelo"
                    title="Modelo"
                    options={veiculoModelos}
                    value={veiculoModelo}
                    setValue={setVeiculoModelo}
                    asyncFunction={getVeiculosModelo}
                    filter
                    isClearable
                  />

                  <AsyncReactSelect
                    name="ativo"
                    title='Status'
                    options={ativoOptions}
                    value={status}
                    setValue={setStatus}
                    isClearable
                  />
                </div>

                <div className="border-t border-border pt-6">
                  <h4 className="text-sm font-medium mb-4 text-muted-foreground">
                    Filtros por Data
                  </h4>
                  <div className="space-y-4">
                    <AsyncReactSelect
                      name="tipoData"
                      title='Tipo Data'
                      options={tiposDataVeiculo}
                      value={tipoData}
                      setValue={setTipoData}
                      isClearable
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputDataLabel
                        name="dataInicio"
                        title='Data Início'
                        date={dataInicio}
                        setDate={setDataInicio}
                        isDisabled={!tipoData || !tipoData.value}
                      />
                      <InputDataLabel
                        name="dataFim"
                        title='Data Fim'
                        date={dataFim}
                        setDate={setDataFim}
                        isDisabled={!tipoData || !tipoData.value}
                      />
                    </div>
                  </div>
                </div>

              </ModalFormBody>
              <ModalFormFooter>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
                <Button
                  onClick={() => setIsFiltersOpen(false)}
                  className="flex-1"
                  variant="success"
                >
                  Aplicar Filtros
                </Button>
              </ModalFormFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {(veiculos.length > 0) && (
        <div className="bg-card dark:bg-card py-1 rounded-md shadow-md">
          <TableTop>
            <Button type="button" variant="success" onClick={handleClickAdicionar}>Adicionar</Button>
          </TableTop>
          <hr />
          <Table>
            <TableHeader>
              <TableRow className="hidden sm:table-row">
                <TableHead className="w-16 text-center">Id</TableHead>
                <TableHead className='w-50'>Veículo</TableHead>
                <TableHead className='w-50'>Tipo Veículo</TableHead>
                <TableHead className='w-30'>Marca</TableHead>
                <TableHead className='w-30'>Modelo</TableHead>
                <TableHead className='w-30'>Placa</TableHead>
                <TableHead className='w-30'>Data Aquisição</TableHead>
                <TableHead className='w-30'>Data Venda</TableHead>
                <TableHead className='w-30'>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {veiculos.map(c => {
                return (
                  <TableRow key={c.id} className={rowStyle}>

                    <TableCardHeader title={c.descricao}>
                      <DropDownMenuItem id={c.id} handleClickEditar={handleClickEditar} handleClickDeletar={handleClickDeletar} />
                    </TableCardHeader>

                    <TableCell className={cellStyle + "sm:text-center"}>
                      {isMobile && "Id: "}{c.id}
                    </TableCell>

                    <TableCell className={hiddenMobile + "sm:text-left font-medium"}>
                      {c.descricao}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Tipo Veículo: "}{c.descricaoTipoVeiculo}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Marca: "}{c.descricaoVeiculoMarca}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Modelo: "}{c.descricaoVeiculoModelo}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Placa: "}{c.placa}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Data Aquisição: "}{formatarData(c.dataAquisicao)}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Data Venda: "}{formatarData(c.dataVenda)}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Status: "}<BadgeAtivo ativo={c.ativo} />
                    </TableCell>

                    <TableCell className={hiddenMobile + "text-right w-[100px]"}>
                      <DropDownMenuItem id={c.id} handleClickEditar={handleClickEditar} handleClickDeletar={handleClickDeletar} />
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
            lengthCurrentPage={veiculos.length}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {veiculos.length === 0 && <>
        {loading ? (
          <TableLoading />
        ) : (
          <TableEmpty icon="truck" handleClickAdicionar={handleClickAdicionar} />
        )}
      </>}

      <AlertExcluir openDialog={openDialogExcluir} setOpenDialog={setOpenDialogExcluir} func={deletar} />

    </div>
  )
}