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
import { deleteLocalizacao, getLocalizacao, type localizacaoType, type postListagemLocalizacaoType } from '@/services/localizacao';
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
import SelectUf from '@/ui/selects/UfSelect';
import SelectMunicipio from '@/ui/selects/MunicipioSelect';
import ModalFormFooter from '@/ui/components/forms/ModalFormFooter';
import SelectTiposLocalizacao from '@/ui/selects/TipoLocalizacaoSelect';
import SelectBairro from '@/ui/selects/BairroSelect';
import { formatarCelular } from '@/services/formatacao';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
    pesquisa: z.string().optional(),
    idTipoLocalizacao: z.object({
        label: z.string().nullish(),
        value: z.number().nullish()
    }).nullish(),
    idUf: z.object({
        label: z.string().nullish(),
        value: z.number().nullish()
    }).nullish(),
    idMunicipio: z.object({
        label: z.string().nullish(),
        value: z.number().nullish()
    }).nullish(),
    idBairro: z.object({
        label: z.string().nullish(),
        value: z.number().nullish()
    }).nullish(),
})

export default function Localizacao({ idPosto }: { idPosto?: number }) {

    const { getValues, watch, reset, control } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            pesquisa: "",
            idTipoLocalizacao: undefined,
            idUf: undefined,
            idMunicipio: undefined,
            idBairro: undefined,
        }
    });

    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);
    const [localizacaos, setLocalizacaos] = useState<localizacaoType[]>([]);
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
            const filtros: postListagemLocalizacaoType = {
                pageSize: pageSize,
                currentPage: paginaAtual,
                pesquisa: getValues("pesquisa") || "",
                idTipoLocalizacao: getValues("idTipoLocalizacao")?.value || null,
                idUf: getValues("idUf")?.value || null,
                idMunicipio: getValues("idMunicipio")?.value || null,
                idBairro: getValues("idBairro")?.value || null,
            }

            const data = await getLocalizacao(filtros);
            setLocalizacaos(data.dados);
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
        navigate("/localizacao/form");
    }

    const handleClickEditar = (id: number) => {
        navigate(`/localizacao/form/${id}`);
    }

    const handleClickDeletar = (id: number) => {
        setIdExcluir(id);
        setOpenDialogExcluir(true);
    }

    const deletar = async () => {
        const process = toast.loading("Excluindo item...");
        try {
            const response = await deleteLocalizacao(idExcluir);
            setOpenDialogExcluir(false);
            toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
            if (localizacaos.length === 1 && currentPage > 0) debounceUpdate(currentPage - 1);
            else await updateList();
        } catch (error: Error | any) {
            toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 2000 });
        }
    }

    const clearFilters = () => {
        reset({
            "idMunicipio": null,
            "idUf": null,
            "pesquisa": "",
            "idBairro": null,
            "idTipoLocalizacao": null,
        });
    }

    const checkActiveFilters = () => {
        const hasFilters = Boolean(
            getValues("idMunicipio") ||
            getValues("idUf") ||
            getValues("idMunicipio") ||
            getValues("idBairro") ||
            getValues("idTipoLocalizacao")
        );
        setHasActiveFilters(hasFilters);
    }

    const { isMobile, rowStyle, cellStyle, hiddenMobile } = useMobile();

    return (
        <div className={`flex flex-col gap-8 ${idPosto ? "pt-2" : "mt-16"} min-h-[calc(100%-4rem)]`}>

            <PageTitle title="Localização" />

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
                                    <SelectTiposLocalizacao control={control} />
                                    <SelectUf control={control} />
                                    <SelectMunicipio control={control} />
                                    <SelectBairro control={control} />
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

            {(localizacaos.length > 0) && (
                <div className="bg-card dark:bg-card py-1 rounded-md shadow-md dark:border">
                    <TableTop>
                        <Button type="button" variant="success" onClick={handleClickAdicionar}>Adicionar</Button>
                    </TableTop>
                    <hr />
                    <Table>
                        <TableHeader>
                            <TableRow className="hidden sm:table-row">
                                <TableHead className="w-16 text-center">Id</TableHead>
                                <TableHead className='w-50'>Descrição</TableHead>
                                <TableHead className='w-50'>Tipo Localização</TableHead>
                                <TableHead className='w-50'>UF</TableHead>
                                <TableHead className='w-50'>Município</TableHead>
                                <TableHead className='w-50'>Bairro</TableHead>
                                <TableHead className='w-50'>Raio</TableHead>
                                <TableHead className='w-50'>Telefone Principal</TableHead>
                                <TableHead className='w-50'>Telefone Secundário</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {localizacaos.map(c => {
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
                                            {isMobile && "Descrição: "}{c.descricao}
                                        </TableCell>

                                        <TableCell className={cellStyle + "sm:text-left"}>
                                            {isMobile && "Tipo Localização: "}{c.descricaoTipoLocalizacao}
                                        </TableCell>

                                        <TableCell className={cellStyle + "sm:text-left"}>
                                            {isMobile && "UF: "}{c.descricaoUf}
                                        </TableCell>

                                        <TableCell className={cellStyle + "sm:text-left"}>
                                            {isMobile && "Município: "}{c.descricaoMunicipio}
                                        </TableCell>

                                        <TableCell className={cellStyle + "sm:text-left"}>
                                            {isMobile && "Bairro: "}{c.descricaoBairro}
                                        </TableCell>

                                        <TableCell className={cellStyle + "sm:text-left"}>
                                            {isMobile && "Raio: "}{c.raio}
                                        </TableCell>

                                        <TableCell className={cellStyle + "sm:text-left"}>
                                            {isMobile && "Telefone Principal: "}{formatarCelular(c.telefonePrincipal)}
                                        </TableCell>

                                        <TableCell className={cellStyle + "sm:text-left"}>
                                            {isMobile && "Telefone Secundário: "}{formatarCelular(c.telefoneSecundario)}
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
                        lengthCurrentPage={localizacaos.length}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            )}

            {localizacaos.length === 0 && <>
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