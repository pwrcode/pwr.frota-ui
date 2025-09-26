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
import Modal from './Modal';
import { deleteBairro, getBairros, type bairroType, type postListagemBairroType } from '@/services/bairro';
import { TableTop } from '@/ui/components/tables/TableTop';
import { Button } from '@/components/ui/button';
import { AlertExcluir } from '@/ui/components/dialogs/Alert';
import SelectUf from '@/ui/selects/UfSelect';
import z from 'zod';
import SelectMunicipio from '@/ui/selects/MunicipioSelect';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputFiltroPesquisa from '@/ui/components/forms/InputFiltroPesquisa';

export const schema = z.object({
    idUf: z.object({
        label: z.string().optional(),
        value: z.number().optional()
    }).optional(),
    idMunicipio: z.object({
        label: z.string().optional(),
        value: z.number().optional()
    }).optional(),
    pesquisa: z.string().optional(),
});

export default function Bairro() {

    const { getValues, watch, control } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            pesquisa: "",
            idUf: undefined,
            idMunicipio: undefined,
        }
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [bairros, setBairros] = useState<bairroType[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalRegisters, setTotalRegisters] = useState<number>(0);
    const [idEditar, setIdEditar] = useState<number>(0);
    const [idExcluir, setIdExcluir] = useState<number>(0);
    const [openModalForm, setOpenModalForm] = useState<boolean>(false);
    const [openDialogExcluir, setOpenDialogExcluir] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        updateList();
    }, []);

    useEffect(() => {
        const subscription = watch(() => {
            debounceUpdate();
        });

        return () => subscription.unsubscribe();
    }, [watch]);

    const updateList = async (paginaAtual: number = currentPage) => {
        const process = toast.loading("Carregando...");
        setLoading(true);
        try {
            const filtros: postListagemBairroType = {
                pageSize: pageSize,
                currentPage: paginaAtual,
                pesquisa: getValues("pesquisa") || "",
                idUf: getValues("idUf")?.value || null,
                idMunicipio: getValues("idMunicipio")?.value || null,
            }

            const data = await getBairros(filtros);
            setBairros(data.dados);
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
        setIdExcluir(0);
        setIdEditar(0);
        setOpenModalForm(true);
    }

    const handleClickEditar = (id: number) => {
        setIdExcluir(0);
        setIdEditar(id);
        setOpenModalForm(true);
    }

    const handleClickDeletar = (id: number) => {
        setIdExcluir(id);
        setIdEditar(0);
        setOpenDialogExcluir(true);
    }

    const deletar = async () => {
        const process = toast.loading("Excluindo item...");
        try {
            const response = await deleteBairro(idExcluir);
            setOpenDialogExcluir(false);
            toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
            if (bairros.length === 1 && currentPage > 0) debounceUpdate(currentPage - 1);
            else await updateList();
        } catch (error: Error | any) {
            toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 2000 });
        }
    }

    const { isMobile, rowStyle, cellStyle, hiddenMobile } = useMobile();

    return (
        <div className="flex flex-col gap-8 min-h-[calc(100%-4rem)]">

            <PageTitle title="Bairros" />

            <Filters grid={FiltersGrid.sm2_md3_lg4}>
                <InputFiltroPesquisa
                    name="pesquisa"
                    title="Pesquisar"
                    control={control}
                    style='sm:col-span-2 md:col-span-3 lg:col-span-2 space-y-2'
                />
                <SelectUf control={control} />
                <SelectMunicipio control={control} size='md:col-span-2 lg:col-span-1' />
            </Filters>

            {(bairros.length > 0) && (
                <div className="bg-card dark:bg-card py-1 rounded-md shadow-md dark:border">
                    <TableTop>
                        <Button type="button" variant="success" onClick={handleClickAdicionar}>Adicionar</Button>
                    </TableTop>
                    <hr />
                    <Table>
                        <TableHeader>
                            <TableRow className="hidden sm:table-row">
                                <TableHead className="w-16 text-center">Id</TableHead>
                                <TableHead className='w-70'>Bairro</TableHead>
                                <TableHead className='w-70'>Munícipio</TableHead>
                                <TableHead>UF</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bairros.map(c => {
                                return (
                                    <TableRow key={c.id} className={rowStyle}>

                                        <TableCardHeader title={c.descricao}>
                                            <DropDownMenuItem
                                                id={c.id}
                                                handleClickEditar={handleClickEditar}
                                                handleClickDeletar={handleClickDeletar}
                                            />
                                        </TableCardHeader>

                                        <TableCell className={cellStyle + "sm:text-center"}>
                                            {isMobile && "Id: "}{c.id}
                                        </TableCell>

                                        <TableCell className={hiddenMobile + "sm:text-left font-medium"}>
                                            {c.descricao}
                                        </TableCell>

                                        <TableCell className={cellStyle + " sm:text-left"}>
                                            {isMobile && "Munícipio: "}{c.descricaoMunicipio}
                                        </TableCell>

                                        <TableCell className={cellStyle + " sm:text-left"}>
                                            {isMobile && "UF: "}{c.siglaUf}
                                        </TableCell>

                                        <TableCell className={hiddenMobile + "text-right w-[100px]"}>
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
                        lengthCurrentPage={bairros.length}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            )}

            {bairros.length === 0 && <>
                {loading ? (
                    <TableLoading />
                ) : (
                    <TableEmpty py='py-20' icon="map-pin" handleClickAdicionar={handleClickAdicionar} />
                )}
            </>}

            <Modal open={openModalForm} setOpen={setOpenModalForm} id={idEditar} updateList={updateList} />

            <AlertExcluir openDialog={openDialogExcluir} setOpenDialog={setOpenDialogExcluir} func={deletar} />

        </div>
    )
}