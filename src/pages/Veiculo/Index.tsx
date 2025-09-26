import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMobile } from '@/hooks/useMobile';
import PageTitle from '@/ui/components/PageTitle';
import { Filters, FiltersGrid } from '@/ui/components/Filters';
import TableLoading from '@/ui/components/tables/TableLoading';
import { TableCardHeader } from '@/ui/components/tables/TableCardHeader';
import DropDownMenuItem from '@/ui/components/DropDownMenuItem';
import TableEmpty from '@/ui/components/tables/TableEmpty';
import { toast } from 'react-toastify';
import { errorMsg } from '@/services/api';
import { TableRodape } from '@/ui/components/tables/TableRodape';
import { delayDebounce, useDebounce } from '@/hooks/useDebounce';
import { deleteVeiculo, getVeiculos, type postListagemVeiculoType, type veiculoType } from '@/services/veiculo';
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
import { Badge } from '@/components/ui/badge';
import { capitalizeText } from '@/services/utils';
import InputFiltroPesquisa from '@/ui/components/forms/InputFiltroPesquisa';
import SelectTiposVeiculo from '@/ui/selects/TiposVeiculoSelect';
import SelectTipoMotor from '@/ui/selects/TipoMotorSelect';
import SelectVeiculoMarca from '@/ui/selects/VeiculoMarcaSelect';
import SelectVeiculoModelo from '@/ui/selects/VeiculoModeloSelect';
import SelectStatus from '@/ui/selects/StatusSelect';
import SelectUf from '@/ui/selects/UfSelect';
import SelectMunicipio from '@/ui/selects/MunicipioSelect';
import SelectTipoDataVeiculo from '@/ui/selects/TipoDataVeiculoSelect';
import InputDataControl from '@/ui/components/forms/InputDataControl';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  pesquisa: z.string().optional(),
  idTipoVeiculo: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }).optional().nullable(),
  idTipoMotor: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }).optional().nullable(),
  idVeiculoMarca: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }).optional().nullable(),
  idVeiculoModelo: z.object({
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
  tipoData: z.object({
    label: z.string().optional(),
    value: z.string().optional()
  }).optional().nullable(),
  ativo: z.object({
    label: z.string().optional(),
    value: z.boolean().optional()
  }).optional().nullable(),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
})

export default function Veiculo() {

  const { getValues, watch, reset, control } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      pesquisa: "",
      idTipoVeiculo: null,
      idTipoMotor: null,
      idVeiculoMarca: null,
      idVeiculoModelo: null,
      idMunicipio: null,
      idUf: null,
      tipoData: null,
      dataInicio: "",
      dataFim: "",
      ativo: null
    }
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [veiculos, setVeiculos] = useState<veiculoType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRegisters, setTotalRegisters] = useState<number>(0);
  const [excluirId, setExcluirId] = useState<number>(0);
  const [openDialogExcluir, setOpenDialogExcluir] = useState<boolean>(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

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
      const filtros: postListagemVeiculoType = {
        pageSize: pageSize,
        currentPage: paginaAtual,
        pesquisa: getValues("pesquisa") || "",
        idTipoVeiculo: getValues("idTipoVeiculo")?.value || null,
        idTipoMotor: getValues("idTipoMotor")?.value || null,
        idVeiculoMarca: getValues("idVeiculoMarca")?.value || null,
        idVeiculoModelo: getValues("idVeiculoModelo")?.value || null,
        idUf: getValues("idUf")?.value || null,
        idMunicipio: getValues("idMunicipio")?.value || null,
        tipoData: getValues("tipoData")?.value || null,
        dataInicio: getValues("dataInicio") ? getValues("dataInicio")?.slice(0, 11).concat("00:00:00") || "" : "",
        dataFim: getValues("dataFim") ? getValues("dataFim")?.slice(0, 11).concat("00:00:00") || "" : "",
        ativo: getValues("ativo")?.value || null
      }
      const data = await getVeiculos(filtros);
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
      if (veiculos.length === 1 && currentPage > 0) debounceUpdate(currentPage - 1);
      else await updateList();
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 2000 });
    }
  }

  const clearFilters = () => {
    reset({
      "tipoData": null,
      "ativo": null,
      "dataFim": "",
      "dataInicio": "",
      "idTipoMotor": null,
      "idMunicipio": null,
      "idUf": null,
      "pesquisa": "",
      "idTipoVeiculo": null,
      "idVeiculoModelo": null,
      "idVeiculoMarca": null,
    });
  }

  const checkActiveFilters = () => {
    const hasFilters = Boolean(
      getValues("tipoData") ||
      getValues("ativo") ||
      getValues("idUf") ||
      getValues("idMunicipio") ||
      getValues("idVeiculoModelo") ||
      getValues("idVeiculoMarca") ||
      getValues("idTipoVeiculo") ||
      getValues("idTipoMotor") ||
      getValues("dataInicio") ||
      getValues("dataFim") ||
      getValues("ativo")
    );
    setHasActiveFilters(hasFilters);
  }

  const { isMobile, rowStyle, cellStyle, hiddenMobile } = useMobile();

  const badgeStatus = (value: string) => {
    return (
      <Badge variant={value === "ATIVO" ? "green" : value === "INATIVO" ? "red" : value === "EM MANUTENÇÃO" ? "yellow" : "blue"}>
        {capitalizeText(value)}
      </Badge>
    )
  }

  return (
    <div className="flex flex-col gap-8 mt-16 min-h-[calc(100%-4rem)]">

      <PageTitle title="Veículos" />

      <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
        <div className="flex-1">
          <Filters grid={FiltersGrid.sm1_md1_lg1}>
            <InputFiltroPesquisa name="pesquisa" title="Pesquisar" control={control} />
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
                  <SelectTiposVeiculo control={control} />
                  <SelectTipoMotor control={control} />
                  <SelectVeiculoMarca control={control} />
                  <SelectVeiculoModelo control={control} />
                  <SelectStatus control={control} />
                  <SelectUf control={control} />
                  <SelectMunicipio control={control} />
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

      {(veiculos.length > 0) && (
        <div className="bg-card dark:bg-card py-1 rounded-md shadow-md dark:border">
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
                      {isMobile && "Status: "} {badgeStatus(c.statusVeiculo)}
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
          <TableEmpty py='py-20' icon="truck" handleClickAdicionar={handleClickAdicionar} />
        )}
      </>}

      <AlertExcluir openDialog={openDialogExcluir} setOpenDialog={setOpenDialogExcluir} func={deletar} />

    </div>
  )
}