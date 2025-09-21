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
import { getPostoCombustivelList } from '@/services/postoCombustivel';
import { getProdutoAbastecimentoList } from '@/services/produtoAbastecimento';
import AsyncReactSelect from '@/ui/components/forms/AsyncReactSelect';
import InputDataLabel from '@/ui/components/forms/InputDataLabel';
import { formatarData } from '@/services/date';
import { currency } from '@/services/currency';
import type { optionType } from '@/services/constants';

export default function EntradaCombustivel() {

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
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [postoCombustivel, setPostoCombustivel] = useState<optionType>();
    const [produtoAbastecimento, setProdutoAbastecimento] = useState<optionType>();

    const initialPostListagem: postListagemEntradaCombustivelType = {
        pageSize: pageSize,
        currentPage: currentPage,
        dataInicio: "",
        dataFim: "",
        idPostoCombustivel: null,
        idProdutoAbastecimento: null,
    };
    const [postListagem, setPostListagem] = useState(initialPostListagem);
    const [filtersOn, setFiltersOn] = useState<boolean>(false);

    useEffect(() => {
        if (currentPage > 0 || filtersOn) changeListFilters(currentPage);
    }, [currentPage]);

    useEffect(() => {
        changeListFilters();
    }, [dataInicio]);

    useEffect(() => {
        changeListFilters();
    }, [dataFim]);

    useEffect(() => {
        changeListFilters();
    }, [postoCombustivel]);

    useEffect(() => {
        changeListFilters();
    }, [produtoAbastecimento]);

    const changeListFilters = (page?: number) => {
        setFiltersOn(true);
        setPostListagem({
            pageSize: pageSize,
            currentPage: page ?? 0,
            dataInicio: dataInicio != "" ? dataInicio.slice(0, 11).concat("00:00:00") : "",
            dataFim: dataFim != "" ? dataFim.slice(0, 11).concat("23:59:59") : "",
            idPostoCombustivel: postoCombustivel && postoCombustivel.value ? postoCombustivel.value : null,
            idProdutoAbastecimento: produtoAbastecimento && produtoAbastecimento.value ? produtoAbastecimento.value : null,
        });
    }

    useEffect(() => {
        updateList();
    }, []);

    const getPostosCombustivel = async (pesquisa?: string) => {
        const data = await getPostoCombustivelList(pesquisa, true, undefined, undefined, undefined);
        return [...data];
    }

    const getProdutosAbastecimento = async (pesquisa?: string) => {
        const data = await getProdutoAbastecimentoList(pesquisa, undefined, undefined, undefined);
        return [...data];
    }

    const updateList = async () => {
        const process = toast.loading("Carregando...");
        setLoading(true);
        try {
            const data = await getEntradaCombustivels(postListagem);
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

    useEffect(() => {
        if (postListagem !== initialPostListagem) debounceUpdate();
    }, [postListagem]);

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
            if (entradaCombustivels.length === 1 && currentPage > 0) changeListFilters(currentPage - 1);
            else await updateList();
        } catch (error: Error | any) {
            toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 2000 });
        }
    }

    const { isMobile, rowStyle, cellStyle, hiddenMobile } = useMobile();

    return (
        <div className="flex flex-col mt-16 gap-8 min-h-[calc(100%-4rem)]">

            <PageTitle title="Entradas Combustível" />

            <Filters grid={FiltersGrid.sm2_md3_lg4}>
                <AsyncReactSelect name="idPostoCombustivel" title="Posto Combustível" options={[]} value={postoCombustivel} setValue={setPostoCombustivel} asyncFunction={getPostosCombustivel} isClearable />
                <AsyncReactSelect name="idProdutoAbastecimento" title='Produto Abastecimento' options={[]} value={produtoAbastecimento} setValue={setProdutoAbastecimento} asyncFunction={getProdutosAbastecimento} isClearable />
                <InputDataLabel name="dataInicio" title='Data Início' date={dataInicio} setDate={setDataInicio} />
                <InputDataLabel name="dataFim" title='Data Fim' date={dataFim} setDate={setDataFim} />
            </Filters>

            {(entradaCombustivels.length > 0) && (
                <div className="bg-card dark:bg-card py-1 rounded-md shadow-md">
                    <TableTop>
                        <Button type="button" variant="success" onClick={handleClickAdicionar}>Adicionar</Button>
                    </TableTop>
                    <hr />
                    <Table>
                        <TableHeader>
                            <TableRow className="hidden sm:table-row">
                                <TableHead className="w-16 text-center">Id</TableHead>
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
                    <TableEmpty icon="archive-restore" handleClickAdicionar={handleClickAdicionar} />
                )}
            </>}

            <Modal open={openModalForm} setOpen={setOpenModalForm} id={idEditar} updateList={updateList} />

            <AlertExcluir openDialog={openDialogExcluir} setOpenDialog={setOpenDialogExcluir} func={deletar} />

        </div>
    )
}