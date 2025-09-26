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
import { deleteEntradaCombustivel, getEntradaCombustivels, type entradaCombustivelType, type postListagemEntradaCombustivelType } from '@/services/entradaCombustivel';
import { TableTop } from '@/ui/components/tables/TableTop';
import { Button } from '@/components/ui/button';
import { AlertExcluir } from '@/ui/components/dialogs/Alert';
import { formatarData } from '@/services/date';
import { currency } from '@/services/currency';
import InputDataControl from '@/ui/components/forms/InputDataControl';
import SelectPostoCombustivel from '@/ui/selects/PostoCombustivelSelect';
import SelectPostoCombustivelTanque from '@/ui/selects/PostoCombustivelTanqueSelect';
import SelectProdutoAbastecimento from '@/ui/selects/ProdutoAbastecimentoSelect';
import SelectFornecedor from '@/ui/selects/FornecedorSelect';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    idPessoaFornecedor: z.object({
        label: z.string().optional(),
        value: z.number().optional()
    }).optional(),
    idPostoCombustivel: z.object({
        label: z.string().optional(),
        value: z.number().optional()
    }).optional(),
    idProdutoAbastecimento: z.object({
        label: z.string().optional(),
        value: z.number().optional()
    }).optional(),
    idPostoCombustivelTanque: z.object({
        label: z.string().optional(),
        value: z.number().optional()
    }).optional(),
    dataInicio: z.string().optional(),
    dataFim: z.string().optional(),
})

export default function EntradaCombustivel({ idPosto }: { idPosto?: number }) {

    const { getValues, watch, control } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            dataInicio: "",
            dataFim: "",
            idPessoaFornecedor: undefined,
            idPostoCombustivel: undefined,
            idProdutoAbastecimento: undefined,
            idPostoCombustivelTanque: undefined,
        }
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [entradaCombustivels, setEntradaCombustivels] = useState<entradaCombustivelType[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalRegisters, setTotalRegisters] = useState<number>(0);
    const [idEditar, setIdEditar] = useState<number>(0);
    const [idExcluir, setIdExcluir] = useState<number>(0);
    const [openModalForm, setOpenModalForm] = useState<boolean>(false);
    const [openDialogExcluir, setOpenDialogExcluir] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);

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
            const filtros: postListagemEntradaCombustivelType = {
                pageSize: pageSize,
                currentPage: paginaAtual,
                dataInicio: getValues("dataInicio") ? getValues("dataInicio")?.slice(0, 11).concat("00:00:00") || "" : "",
                dataFim: getValues("dataFim") ? getValues("dataFim")?.slice(0, 11).concat("00:00:00") || "" : "",
                idPessoaFornecedor: getValues("idPessoaFornecedor")?.value || null,
                idPostoCombustivelTanque: getValues("idPostoCombustivelTanque")?.value || null,
                idPostoCombustivel: getValues("idPostoCombustivel")?.value || null,
                idProdutoAbastecimento: getValues("idProdutoAbastecimento")?.value || null,
            }

            const data = await getEntradaCombustivels(filtros);
            setEntradaCombustivels(data.dados);
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
            const response = await deleteEntradaCombustivel(idExcluir);
            setOpenDialogExcluir(false);
            toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
            if (entradaCombustivels.length === 1 && currentPage > 0) debounceUpdate(currentPage - 1);
            else await updateList();
        } catch (error: Error | any) {
            toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 2000 });
        }
    }

    const { isMobile, rowStyle, cellStyle, hiddenMobile } = useMobile();

    return (
        <div className={`flex flex-col gap-8 ${idPosto ? "pt-2" : "mt-16"} min-h-[calc(100%-4rem)]`}>

            <PageTitle title="Entradas Combustível" />

            <Filters grid={FiltersGrid.sm2_md3}>
                {!idPosto ? <SelectPostoCombustivel control={control} /> : <></>}
                <SelectPostoCombustivelTanque control={control} ignoreFiltros />
                {!idPosto ? <SelectProdutoAbastecimento control={control} ignoreFiltros /> : <></>}
                <SelectFornecedor control={control} />
                <InputDataControl name="dataInicio" title='Data Início' control={control} />
                <InputDataControl name="dataFim" title='Data Fim' control={control} />
            </Filters>

            {(entradaCombustivels.length > 0) && (
                <div className="bg-card dark:bg-card py-1 rounded-md shadow-md dark:border">
                    <TableTop>
                        <Button type="button" variant="success" onClick={handleClickAdicionar}>Adicionar</Button>
                    </TableTop>
                    <hr />
                    <Table>
                        <TableHeader>
                            <TableRow className="hidden sm:table-row">
                                <TableHead className="w-16 text-center">Id</TableHead>
                                <TableHead className='w-100'>Posto Combustível</TableHead>
                                <TableHead className='w-50'>Produto Abastecimento</TableHead>
                                <TableHead className='w-50'>Fornecedor</TableHead>
                                <TableHead className='w-50'>Tanque</TableHead>
                                <TableHead className='w-50'>Data Recebimento</TableHead>
                                <TableHead className='w-50'>Quantidade</TableHead>
                                <TableHead className='w-50'>Valor Unitário</TableHead>
                                <TableHead className='w-50'>Valor Total</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {entradaCombustivels.map(c => {
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
                                            {isMobile && "Posto Combustível: "}{c.razaoSocialPostoCombustivel}
                                        </TableCell>

                                        <TableCell className={cellStyle + "sm:text-left"}>
                                            {isMobile && "Produto Abastecimento: "}{c.descricaoProdutoAbastecimento}
                                        </TableCell>

                                        <TableCell className={cellStyle + "sm:text-left"}>
                                            {isMobile && "Fornecedor: "}{c.razaoSocialPessoaFornecedor}
                                        </TableCell>

                                        <TableCell className={cellStyle + "sm:text-left"}>
                                            {isMobile && "Tanque: "}{c.descricaoPostoCombustivelTanque}
                                        </TableCell>

                                        <TableCell className={cellStyle + "sm:text-left"}>
                                            {isMobile && "Data Recebimento: "}{formatarData(c.dataRecebimento)}
                                        </TableCell>

                                        <TableCell className={cellStyle + "sm:text-left"}>
                                            {isMobile && "Quantidade: "}{c.quantidade}
                                        </TableCell>

                                        <TableCell className={cellStyle + "sm:text-left"}>
                                            {isMobile && "Valor Total: "}{currency(c.valorUnitario)}
                                        </TableCell>

                                        <TableCell className={cellStyle + "sm:text-left"}>
                                            {isMobile && "Valor Total: "}{currency(c.valorTotal)}
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
                        lengthCurrentPage={entradaCombustivels.length}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            )}

            {entradaCombustivels.length === 0 && <>
                {loading ? (
                    <TableLoading />
                ) : (
                    <TableEmpty py='py-20' icon="archive-restore" handleClickAdicionar={handleClickAdicionar} />
                )}
            </>}

            <Modal open={openModalForm} setOpen={setOpenModalForm} id={idEditar} updateList={updateList} idPosto={idPosto ?? undefined} />

            <AlertExcluir openDialog={openDialogExcluir} setOpenDialog={setOpenDialogExcluir} func={deletar} />

        </div>
    )
}