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
import { deleteMulta, getMulta, type multaType, type postListagemMultaType } from '@/services/multa';
import { TableTop } from '@/ui/components/tables/TableTop';
import { Button } from '@/components/ui/button';
import { AlertExcluir } from '@/ui/components/dialogs/Alert';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputFiltroPesquisa from '@/ui/components/forms/InputFiltroPesquisa';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter, X } from 'lucide-react';
import ModalFormBody from '@/ui/components/forms/ModalFormBody';
import ModalFormFooter from '@/ui/components/forms/ModalFormFooter';
import { formatarDataParaAPI } from '@/services/formatacao';
import { useNavigate } from 'react-router-dom';
import InputDataControl from '@/ui/components/forms/InputDataControl';
import SelectTipoDataMulta from '@/ui/selects/TipoDataMultaSelect';
import SelectVeiculo from '@/ui/selects/VeiculoSelect';
import SelectMotorista from '@/ui/selects/MotoristaSelect';
import SelectTipoInfracao from '@/ui/selects/TipoInfracaoSelect';
import { formatarData } from '@/services/date';
import { currency } from '@/services/currency';

const schema = z.object({
    pesquisa: z.string().optional(),
    tipoData: z.object({
        label: z.string().nullish(),
        value: z.string().nullish()
    }).nullish(),
    idVeiculo: z.object({
        label: z.string().nullish(),
        value: z.number().nullish()
    }).nullish(),
    idMotorista: z.object({
        label: z.string().nullish(),
        value: z.number().nullish()
    }).nullish(),
    tipoInfracao: z.object({
        label: z.string().nullish(),
        value: z.number().nullish()
    }).nullish(),
    dataInicio: z.string().nullish(),
    dataFim: z.string().nullish(),
})

export default function Multa({ idPosto }: { idPosto?: number }) {

    const { getValues, watch, reset, control } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            pesquisa: "",
            dataInicio: "",
            dataFim: "",
            idVeiculo: undefined,
            idMotorista: undefined,
            tipoData: undefined,
            tipoInfracao: undefined,
        }
    });

    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);
    const [multas, setMultas] = useState<multaType[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalRegisters, setTotalRegisters] = useState<number>(0);
    const [idExcluir, setIdExcluir] = useState<number>(0);
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
            const filtros: postListagemMultaType = {
                pageSize: pageSize,
                currentPage: paginaAtual,
                pesquisa: getValues("pesquisa") || "",
                dataInicio: formatarDataParaAPI(getValues("dataInicio")),
                dataFim: formatarDataParaAPI(getValues("dataFim")),
                idVeiculo: getValues("idVeiculo")?.value || null,
                idMotorista: getValues("idMotorista")?.value || null,
                tipoData: getValues("tipoData")?.value || null,
                tipoInfracao: getValues("tipoInfracao")?.value || null,
            }

            const data = await getMulta(filtros);
            setMultas(data.dados);
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
        navigate("/multa/form");
    }

    const handleClickEditar = (id: number) => {
        navigate(`/multa/form/${id}`);
    }

    const handleClickDeletar = (id: number) => {
        setIdExcluir(id);
        setOpenDialogExcluir(true);
    }

    const deletar = async () => {
        const process = toast.loading("Excluindo item...");
        try {
            const response = await deleteMulta(idExcluir);
            setOpenDialogExcluir(false);
            toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
            if (multas.length === 1 && currentPage > 0) debounceUpdate(currentPage - 1);
            else await updateList();
        } catch (error: Error | any) {
            toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 2000 });
        }
    }

    const clearFilters = () => {
        reset({
            "idVeiculo": null,
            "idMotorista": null,
            "pesquisa": "",
            "dataFim": "",
            "dataInicio": "",
            "tipoData": null,
            "tipoInfracao": null,
        });
    }

    const checkActiveFilters = () => {
        const hasFilters = Boolean(
            getValues("idVeiculo") ||
            getValues("idMotorista") ||
            getValues("tipoData") ||
            getValues("tipoInfracao") ||
            getValues("dataInicio") ||
            getValues("dataFim")
        );
        setHasActiveFilters(hasFilters);
    }

    const { isMobile, rowStyle, cellStyle, hiddenMobile } = useMobile();

    return (
        <div className={`flex flex-col gap-8 ${idPosto ? "pt-2" : "mt-16"} min-h-[calc(100%-4rem)]`}>

            <PageTitle title="Multa" />

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
                                    <SelectTipoInfracao control={control} />
                                    <SelectVeiculo control={control} />
                                    <SelectMotorista control={control} />
                                </div>

                                <div className="border-t border-border pt-6">
                                    <h4 className="text-sm font-medium mb-4 text-muted-foreground">
                                        Filtros por Data
                                    </h4>
                                    <div className="space-y-4">
                                        <SelectTipoDataMulta control={control} />

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

            {(multas.length > 0) && (
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
                                <TableHead className='w-50'>Motorista</TableHead>
                                <TableHead className='w-50'>Data Infração</TableHead>
                                <TableHead className='w-50'>Tipo Infração</TableHead>
                                <TableHead className='w-50'>Pontos</TableHead>
                                <TableHead className='w-50'>Valor Multa</TableHead>
                                <TableHead className='w-50'>Data Pagamento</TableHead>
                                <TableHead className='w-50'>Data Vencimento</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {multas.map(c => {
                                return (
                                    <TableRow key={c.id} className={rowStyle}>

                                        <TableCardHeader title={c.id}>
                                            <DropDownMenuItem
                                                id={c.id}
                                                handleClickEditar={handleClickEditar}
                                                handleClickDeletar={handleClickDeletar}
                                            />
                                        </TableCardHeader>

                                        <TableCell className={hiddenMobile + "sm:text-center font-medium"}>
                                            {c.id}
                                        </TableCell>

                                        <TableCell className={cellStyle + "sm:text-left"}>
                                            {isMobile && "Veículo: "}{c.descricaoVeiculo}
                                        </TableCell>

                                        <TableCell className={cellStyle + "sm:text-left"}>
                                            {isMobile && "Motorista: "}{c.razaoSocialMotorista}
                                        </TableCell>

                                        <TableCell className={cellStyle + "sm:text-left"}>
                                            {isMobile && "Data Infração: "}{formatarData(c.dataInfracao)}
                                        </TableCell>

                                        <TableCell className={cellStyle + "sm:text-left"}>
                                            {isMobile && "Tipo Infração: "}{c.tipoInfracao}
                                        </TableCell>

                                        <TableCell className={cellStyle + "sm:text-left"}>
                                            {isMobile && "Pontos: "}{c.pontosCnh}
                                        </TableCell>

                                        <TableCell className={cellStyle + "sm:text-left"}>
                                            {isMobile && "Valor Multa: "}{currency(c.valorMulta)}
                                        </TableCell>

                                        <TableCell className={cellStyle + "sm:text-left"}>
                                            {isMobile && "Data Pagamento: "}{formatarData(c.dataPagamento)}
                                        </TableCell>

                                        <TableCell className={cellStyle + "sm:text-left"}>
                                            {isMobile && "Data Vencimento: "}{formatarData(c.dataVencimento)}
                                        </TableCell>

                                        <TableCell className={hiddenMobile + "text-right"}>
                                            <DropDownMenuItem
                                                id={c.id}
                                                handleClickEditar={handleClickEditar}
                                                handleClickDeletar={handleClickDeletar}
                                            />
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
                        lengthCurrentPage={multas.length}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            )}

            {multas.length === 0 && <>
                {loading ? (
                    <TableLoading />
                ) : (
                    <TableEmpty py='py-20' icon="archive-restore" handleClickAdicionar={handleClickAdicionar} />
                )}
            </>}

            <AlertExcluir openDialog={openDialogExcluir} setOpenDialog={setOpenDialogExcluir} func={deletar} />

        </div>
    )
}