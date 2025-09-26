import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { delayDebounce, useDebounce } from '@/hooks/useDebounce';
import { useMobile } from '@/hooks/useMobile';
import { errorMsg } from '@/services/api';
import { optionsFuncoes } from '@/services/constants';
import { formatarCpfCnpj } from '@/services/formatacao';
import { deletePessoa, getPessoas, type pessoaType, type postListagemPessoaType } from '@/services/pessoa';
import { AlertExcluir } from '@/ui/components/dialogs/Alert';
import DropDownMenuItem from '@/ui/components/DropDownMenuItem';
import { Filters, FiltersGrid } from '@/ui/components/Filters';
import FiltroAbas from '@/ui/components/FiltroAbas';
import InputDataControl from '@/ui/components/forms/InputDataControl';
import InputFiltroPesquisa from '@/ui/components/forms/InputFiltroPesquisa';
import ModalFormBody from '@/ui/components/forms/ModalFormBody';
import ModalFormFooter from '@/ui/components/forms/ModalFormFooter';
import PageTitle from '@/ui/components/PageTitle';
import { BadgeAtivo } from '@/ui/components/tables/BadgeAtivo';
import { TableCardHeader } from '@/ui/components/tables/TableCardHeader';
import TableEmpty from '@/ui/components/tables/TableEmpty';
import TableLoading from '@/ui/components/tables/TableLoading';
import { TableRodape } from '@/ui/components/tables/TableRodape';
import { TableTop } from '@/ui/components/tables/TableTop';
import SelectBairro from '@/ui/selects/BairroSelect';
import SelectMunicipio from '@/ui/selects/MunicipioSelect';
import SelectStatus from '@/ui/selects/StatusSelect';
import SelectTipoDataVeiculo from '@/ui/selects/TipoDataVeiculoSelect';
import SelectTipoPessoa from '@/ui/selects/TipoPessoaSelect';
import SelectUf from '@/ui/selects/UfSelect';
import { zodResolver } from '@hookform/resolvers/zod';
import { Filter, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import z from 'zod';

const schema = z.object({
  pesquisa: z.string().optional(),
  tipoPessoa: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }).optional().nullable(),
  idUf: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }).optional().nullable(),
  idMunicipio: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }).optional().nullable(),
  idBairro: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }).optional().nullable(),
  funcao: z.object({
    value: z.string().optional(),
    label: z.string().optional()
  }).optional().nullable(),
  tipoData: z.object({
    label: z.string().optional(),
    value: z.string().optional()
  }).optional().nullable(),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  ativo: z.object({
    value: z.boolean().optional(),
    label: z.string().optional(),
  }).optional().nullable()
})

export default function Pessoa() {

  const { getValues, watch, reset, control } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      pesquisa: "",
      tipoData: null,
      dataInicio: "",
      dataFim: "",
      tipoPessoa: undefined,
      idUf: undefined,
      idMunicipio: undefined,
      idBairro: undefined,
    }
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [pessoas, setPessoas] = useState<pessoaType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRegisters, setTotalRegisters] = useState<number>(0);
  const [excluirId, setExcluirId] = useState<number>(0);
  const [openDialogExcluir, setOpenDialogExcluir] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  useEffect(() => {
    updateList();
  }, []);

  useEffect(() => {
    const subscription = watch(() => {
      debounceUpdate();
      checkActiveFilters();
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const updateList = async (paginaAtual: number = currentPage) => {
    const process = toast.loading("Carregando...");
    setLoading(true);
    try {

      const filtros: postListagemPessoaType = {
        currentPage: paginaAtual,
        pageSize: pageSize,
        ativo: getValues("ativo")?.value === false ? false : getValues("ativo")?.value || null,
        tipoData: getValues("tipoData")?.value || null,
        dataInicio: getValues("dataInicio") ? getValues("dataInicio")?.slice(0, 11).concat("00:00:00") || "" : "",
        dataFim: getValues("dataFim") ? getValues("dataFim")?.slice(0, 11).concat("00:00:00") || "" : "",
        tipoPessoa: getValues("tipoPessoa")?.value || null,
        idUf: getValues("idUf")?.value || null,
        idMunicipio: getValues("idMunicipio")?.value || null,
        idBairro: getValues("idBairro")?.value || null,
        isAjudante: getValues("funcao")?.value === "isAjudante" ? true : null,
        isMotorista: getValues("funcao")?.value === "isMotorista" ? true : null,
        isOficina: getValues("funcao")?.value === "isOficina" ? true : null,
        isFornecedor: getValues("funcao")?.value === "isFornecedor" ? true : null,
        pesquisa: getValues("pesquisa") || ""
      }

      const data = await getPessoas(filtros);
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
      if (pessoas.length === 1 && currentPage > 0) debounceUpdate(currentPage - 1);
      else await updateList();
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 2000 });
    }
  }

  const clearFilters = () => {
    reset({
      "tipoData": null,
      "funcao": null,
      "ativo": null,
      "dataFim": "",
      "dataInicio": "",
      "idBairro": null,
      "idMunicipio": null,
      "idUf": null,
      "pesquisa": "",
      "tipoPessoa": null,
    });
  }

  const checkActiveFilters = () => {
    const hasFilters = Boolean(
      getValues("tipoData") ||
      getValues("tipoPessoa") ||
      getValues("idUf") ||
      getValues("idMunicipio") ||
      getValues("idBairro") ||
      getValues("dataInicio") ||
      getValues("dataFim") ||
      getValues("ativo")
    );
    setHasActiveFilters(hasFilters);
  }

  const { isMobile, rowStyle, cellStyle, hiddenMobile } = useMobile();

  const getPessoaFuncao = (pessoa: pessoaType) => {
    var listaFuncoes = [];

    if (pessoa.isAjudante) listaFuncoes.push("Ajudante");
    if (pessoa.isMotorista) listaFuncoes.push("Motorista");
    if (pessoa.isOficina) listaFuncoes.push("Oficina");
    if (pessoa.isFornecedor) listaFuncoes.push("Fornecedor");

    return listaFuncoes.join(", ");
  }

  return (
    <div className="flex flex-col gap-8 mt-16 min-h-[calc(100%-4rem)]">

      <PageTitle title="Pessoas" />

      <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
        <div className="flex-1">
          <Filters grid={FiltersGrid.sm1_md1_lg1}>
            <InputFiltroPesquisa name="pesquisa" title="Pesquisar" control={control} />
            <FiltroAbas options={optionsFuncoes} control={control} name='funcao' />
          </Filters>
        </div>

        <div className="flex items-start pt-[22px] h-full">
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
                  <SelectTipoPessoa control={control} />
                  <SelectUf control={control} />
                  <SelectMunicipio control={control} />
                  <SelectBairro control={control} />
                  <SelectStatus control={control} />
                </div>

                <div className="border-t border-border pt-6">
                  <h4 className="text-sm font-medium mb-4 text-muted-foreground">
                    Filtros por Data
                  </h4>
                  <div className="space-y-4">
                    <SelectTipoDataVeiculo control={control} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputDataControl name="dataInicio" title='Data Início' control={control} isDisabled={!getValues("tipoData") || !getValues("tipoData")?.value} />
                      <InputDataControl name="dataFim" title='Data Fim' control={control} isDisabled={!getValues("tipoData") || !getValues("tipoData")?.value} />
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