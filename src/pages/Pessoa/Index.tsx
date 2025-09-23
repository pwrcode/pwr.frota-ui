import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMobile } from '@/hooks/useMobile';
import PageTitle from '@/ui/components/PageTitle';
import InputLabelValue from '@/ui/components/forms/InputLabelValue';
import TableLoading from '@/ui/components/tables/TableLoading';
import { TableCardHeader } from '@/ui/components/tables/TableCardHeader';
import DropDownMenuItem from '@/ui/components/DropDownMenuItem';
import { TableTop } from '@/ui/components/tables/TableTop';
import { Button } from '@/components/ui/button';
import TableEmpty from '@/ui/components/tables/TableEmpty';
import { toast } from 'react-toastify';
import { errorMsg } from '@/services/api';
import { TableRodape } from '@/ui/components/tables/TableRodape';
import { delayDebounce, useDebounce } from '@/hooks/useDebounce';
import { ativoOptions, type listType, type optionType, tiposPessoa } from '@/services/constants';
import AsyncReactSelect from '@/ui/components/forms/AsyncReactSelect';
import { BadgeAtivo } from '@/ui/components/tables/BadgeAtivo';
import { AlertExcluir } from '@/ui/components/dialogs/Alert';
import { formatarCpfCnpj } from '@/services/formatacao';
import { deletePessoa, getPessoas, type pessoaType, type postListagemPessoaType } from '@/services/pessoa';
import { getUfList } from '@/services/uf';
import { getMunicipioList } from '@/services/municipio';
import { Filters, FiltersGrid } from '@/ui/components/Filters';
import { getBairroList } from '@/services/bairro';
import InputDataLabel from '@/ui/components/forms/InputDataLabel';
import ModalFormFooter from '@/ui/components/forms/ModalFormFooter';
import ModalFormBody from '@/ui/components/forms/ModalFormBody';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter, X } from 'lucide-react';

const options = [
  { value: "isAjudante", label: "Ajudante" },
  { value: "isMotorista", label: "Motorista" },
  { value: "isOficina", label: "Oficina" },
  { value: "isFornecedor", label: "Fornecedor" },
];

export default function Pessoa() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [pessoas, setPessoas] = useState<pessoaType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRegisters, setTotalRegisters] = useState<number>(0);
  const [excluirId, setExcluirId] = useState<number>(0);
  const [openDialogExcluir, setOpenDialogExcluir] = useState<boolean>(false);

  // const [ufs, setUfs] = useState<listType>([]);
  const [municipios, setMunicipios] = useState<listType>([]);
  const [bairros, setBairros] = useState<listType>([]);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pesquisa, setPesquisa] = useState<string>("");
  const [tipoPessoa, setTipoPessoa] = useState<optionType | null>();
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const [optionsSelected, setOptionsSelected] = useState<listType>([]);
  const [status, setStatus] = useState<optionType | null>();
  const [uf, setUf] = useState<optionType | null>();
  const [municipio, setMunicipio] = useState<optionType | null>();
  const [bairro, setBairro] = useState<optionType | null>();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const initialPostListagem: postListagemPessoaType = {
    pageSize: pageSize,
    currentPage: currentPage,
    pesquisa: "",
    dataInicio: "",
    dataFim: "",
    ativo: null,
    tipoPessoa: null,
    isAjudante: false,
    isMotorista: false,
    isOficina: false,
    isFornecedor: false,
    idUf: null,
    idMunicipio: null,
    idBairro: null,
  };
  const [postListagem, setPostListagem] = useState(initialPostListagem);
  const [filtersOn, setFiltersOn] = useState<boolean>(false);

  const getUfs = async (pesquisa?: string) => {
    const data = await getUfList(pesquisa);
    // setUfs([...data]);
    return [...data];
  }

  useEffect(() => {
    getMunicipios();
  }, [uf]);

  useEffect(() => {
    getBairros();
  }, [municipio]);

  const getMunicipios = async (pesquisa?: string) => {
    if (!uf) {
      setMunicipios([]);
      setMunicipio(null);
      return [];
    };
    const data = await getMunicipioList(pesquisa, uf ? uf.value : undefined);
    setMunicipios([...data]);
    return [...data];
  }

  const getBairros = async (pesquisa?: string) => {
    if (!municipio) {
      setBairros([]);
      setBairro(null);
      return [];
    };
    const data = await getBairroList(pesquisa, municipio ? municipio.value : undefined);
    setBairros([...data]);
    return [...data];
  }

  useEffect(() => {
    if (currentPage > 0 || filtersOn) changeListFilters(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (pesquisa.length > 0 || filtersOn) changeListFilters(0);
  }, [pesquisa]);

  useEffect(() => {
    changeListFilters(0);
  }, [status]);

  useEffect(() => {
    changeListFilters(0);
  }, [tipoPessoa]);

  useEffect(() => {
    changeListFilters(0);
  }, [uf]);

  useEffect(() => {
    changeListFilters(0);
  }, [municipio]);

  useEffect(() => {
    changeListFilters(0);
  }, [bairro]);

  useEffect(() => {
    changeListFilters(0);
  }, [dataInicio]);

  useEffect(() => {
    changeListFilters(0);
  }, [dataFim]);

  useEffect(() => {
    if ((Array.isArray(optionsSelected) && optionsSelected.length > 0) || filtersOn) {
      changeListFilters(0, optionsSelected);
    }
  }, [optionsSelected]);

  const changeListFilters = (page: number, list?: listType) => {
    setFiltersOn(true);
    setPostListagem({
      pageSize: pageSize,
      currentPage: page ?? 0,
      pesquisa: pesquisa,
      dataInicio: dataInicio != "" ? dataInicio.slice(0, 11).concat("00:00:00") : "",
      dataFim: dataFim != "" ? dataFim.slice(0, 11).concat("23:59:59") : "",
      ativo: status ? status.value : null,
      tipoPessoa: tipoPessoa && tipoPessoa.value ? tipoPessoa.value : null,
      isAjudante: list?.find(l => l.value === "isAjudante") ? true : null,
      isMotorista: list?.find(l => l.value === "isMotorista") ? true : null,
      isOficina: list?.find(l => l.value === "isOficina") ? true : null,
      isFornecedor: list?.find(l => l.value === "isFornecedor") ? true : null,
      idUf: uf && uf.value ? uf.value : null,
      idMunicipio: municipio && municipio.value ? municipio.value : null,
      idBairro: bairro && bairro.value ? bairro.value : null,
    });
  }

  useEffect(() => {
    updateList();
  }, []);

  const updateList = async () => {
    const process = toast.loading("Carregando...");
    setLoading(true);
    try {
      const data = await getPessoas(postListagem);
      setPessoas(data.dados);
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
    navigate("/pessoa/form");
  }

  const handleClickEditar = (id: number) => {
    navigate(`/pessoa/form/${id}`);
  }

  const handleClickDeletar = (id: number) => {
    setExcluirId(id);
    setOpenDialogExcluir(true);
  }

  const deletar = async () => {
    const process = toast.loading("Excluindo item...");
    try {
      const response = await deletePessoa(excluirId);
      setOpenDialogExcluir(false);
      toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
      if (pessoas.length === 1 && currentPage > 0) changeListFilters(currentPage - 1);
      else await updateList();
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 2000 });
    }
  }

  const clearFilters = () => {
    setTipoPessoa(null);
    setOptionsSelected([]);
    setUf(null);
    setMunicipio(null);
    setBairro(null);
    setDataInicio("");
    setDataFim("");
    setStatus(null);
  }

  const checkActiveFilters = () => {
    const hasFilters = Boolean(
      tipoPessoa ||
      optionsSelected.length > 0 ||
      uf ||
      municipio ||
      bairro ||
      dataInicio ||
      dataFim ||
      status
    );
    setHasActiveFilters(hasFilters);
  }

  useEffect(() => {
    checkActiveFilters();
  }, [tipoPessoa, optionsSelected, uf, municipio, bairro, dataInicio, dataFim, status]);

  const { isMobile, rowStyle, cellStyle, hiddenMobile } = useMobile();

  const getPessoaFuncao = (pessoa: pessoaType) => {
    if (pessoa.isAjudante) return "Ajudante";
    if (pessoa.isMotorista) return "Motorista";
    if (pessoa.isOficina) return "Oficina";

    return "Fornecedor";
  }

  return (
    <div className="flex flex-col gap-8 mt-16 min-h-[calc(100%-4rem)]">

      <PageTitle title="Pessoas" />

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
                  <AsyncReactSelect name="tipoPessoa" title="Tipo Pessoa" options={tiposPessoa} value={tipoPessoa} setValue={setTipoPessoa} isClearable />
                  <div className="sm:col-span-2 md:col-span-3 lg:col-span-2">
                    <AsyncReactSelect name="optionsSelected" title="Função" options={options} value={optionsSelected} setValue={setOptionsSelected} isMulti />
                  </div>
                  <AsyncReactSelect name="idUF" title="UF" options={[]} value={uf} setValue={setUf} asyncFunction={getUfs} isClearable />
                  <AsyncReactSelect name="idMunicipio" title="Município" options={municipios} value={municipio} setValue={setMunicipio} asyncFunction={getMunicipios} filter isClearable />
                  <AsyncReactSelect name="idBairro" title="Bairro" options={bairros} value={bairro} setValue={setBairro} asyncFunction={getBairros} filter isClearable />
                  <AsyncReactSelect name="ativo" title="Status" options={ativoOptions} value={status} setValue={setStatus} isClearable />
                </div>

                <div className="border-t border-border pt-6">
                  <h4 className="text-sm font-medium mb-4 text-muted-foreground">
                    Filtros por Data
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <InputDataLabel name="dataInicio" title='Data Início (Validade CNH)' date={dataInicio} setDate={setDataInicio} />
                    <InputDataLabel name="dataFim" title='Data Fim (Validade CNH)' date={dataFim} setDate={setDataFim} />
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

      {(pessoas.length > 0) && (
        <div className="bg-card dark:bg-card py-1 rounded-md shadow-md dark:border">
          <TableTop>
            <Button type="button" variant="success" onClick={handleClickAdicionar}>Adicionar</Button>
          </TableTop>
          <hr />
          <Table>
            <TableHeader>
              <TableRow className="hidden sm:table-row">
                <TableHead className='w-16 text-center'>Id</TableHead>
                <TableHead className='w-90  '>Pessoa</TableHead>
                <TableHead className='w-60'>Tipo Pessoa</TableHead>
                <TableHead className='w-60'>CPF / CNPJ</TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pessoas.map(c => {
                return (
                  <TableRow key={c.id} className={rowStyle}>

                    <TableCardHeader title={c.nomeFantasia}>
                      <div className="flex flex-row items-center gap-1">
                        <BadgeAtivo ativo={c.ativo} />
                        <DropDownMenuItem id={c.id} handleClickEditar={handleClickEditar} handleClickDeletar={handleClickDeletar} />
                      </div>
                    </TableCardHeader>

                    <TableCell className={hiddenMobile + " text-center"}>
                      {c.id}
                    </TableCell>

                    <TableCell className={hiddenMobile}>
                      <div className="flex flex-col justify-start min-w-[100px]">
                        {/* <span className="font-semibold">#{c.id}</span> */}
                        <span className="text-nowrap">
                          <span className="text-gray-700 dark:text-foreground/80">Razão Social:</span> {c.razaoSocial}
                        </span>
                        <span className="text-nowrap">
                          <span className="text-gray-700 dark:text-foreground/80">Nome Fantasia:</span> {c.nomeFantasia}
                        </span>
                      </div>
                    </TableCell>

                    {isMobile && <TableCell className={cellStyle}>
                      Id: {c.id}
                    </TableCell>}

                    {isMobile && <TableCell className={cellStyle}>
                      Razão Social: {c.razaoSocial}
                    </TableCell>}

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Tipo Pessoa: "}{c.tipoPessoa} <span className='text-xs'>({getPessoaFuncao(c).toUpperCase()})</span>
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "CPF / CNPJ: "}{formatarCpfCnpj(c.documento)}
                    </TableCell>

                    <TableCell className={hiddenMobile + " sm:text-end"}>
                      <BadgeAtivo ativo={c.ativo} />
                    </TableCell>

                    <TableCell className={hiddenMobile + "text-right"}>
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
            lengthCurrentPage={pessoas.length}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {pessoas.length === 0 && <>
        {loading ? (
          <TableLoading />
        ) : (
          <TableEmpty py='py-20' icon="users" handleClickAdicionar={handleClickAdicionar} />
        )}
      </>}

      <AlertExcluir openDialog={openDialogExcluir} setOpenDialog={setOpenDialogExcluir} func={deletar} />

    </div>
  )
}