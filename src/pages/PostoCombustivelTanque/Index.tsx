import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMobile } from '@/hooks/useMobile';
import TableLoading from '@/ui/components/tables/TableLoading';
import { TableCardHeader } from '@/ui/components/tables/TableCardHeader';
import DropDownMenuItem from '@/ui/components/DropDownMenuItem';
import TableEmpty from '@/ui/components/tables/TableEmpty';
import { toast } from 'react-toastify';
import { errorMsg } from '@/services/api';
import { TableRodape } from '@/ui/components/tables/TableRodape';
import { delayDebounce, useDebounce } from '@/hooks/useDebounce';
import Modal from './Modal';
import { deletePostoCombustivelTanque, getPostoCombustivelTanques, type postListagemPostoCombustivelTanqueType } from '@/services/postoCombustivelTanque';
import { tiposTanque } from '@/services/constants';
import { TableTop } from '@/ui/components/tables/TableTop';
import { Button } from '@/components/ui/button';
import { AlertExcluir } from '@/ui/components/dialogs/Alert';

export default function PostoCombustivelTanque({ idPostoCombustivel, tanques, setTanques }: { idPostoCombustivel?: number, tanques: any[], setTanques: any }) {

    const [loading, setLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalRegisters, setTotalRegisters] = useState<number>(0);
    const [idEditar, setIdEditar] = useState<number>(0);
    const [idExcluir, setIdExcluir] = useState<number>(0);
    const [openModalForm, setOpenModalForm] = useState<boolean>(false);
    const [openDialogExcluir, setOpenDialogExcluir] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);

    const initialPostListagem: postListagemPostoCombustivelTanqueType = {
        pageSize: pageSize,
        currentPage: currentPage,
        pesquisa: "",
        idPostoCombustivel: idPostoCombustivel ?? null,
        idProdutoAbastecimento: null,
    };
    const [postListagem, setPostListagem] = useState(initialPostListagem);
    const [filtersOn, setFiltersOn] = useState<boolean>(false);

    useEffect(() => {
        if (currentPage > 0 || filtersOn) changeListFilters(currentPage);
    }, [currentPage]);

    const changeListFilters = (page?: number) => {
        setFiltersOn(true);
        setPostListagem({
            pageSize: pageSize,
            currentPage: page ?? 0,
            pesquisa: "",
            idPostoCombustivel: idPostoCombustivel ?? null,
            idProdutoAbastecimento: null
        });
    }

    useEffect(() => {
        updateList();
    }, []);

    const updateList = async () => {
        if (idPostoCombustivel) {
            const process = toast.loading("Carregando...");
            setLoading(true);
            try {
                const data = await getPostoCombustivelTanques(postListagem);
                setTanques(data.dados);
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
    }

    useEffect(() => {
        if (postListagem !== initialPostListagem) debounceUpdate();
    }, [postListagem]);

    const debounceUpdate = useDebounce(updateList, delayDebounce);

    const handleClickAdicionar = () => {
        setIdExcluir(0);
        setIdEditar(-1);
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
        if (!idPostoCombustivel) {
            const tan = tanques.filter((_t, index) => index !== idExcluir);
            setTanques(tan);
            return
        }
        const process = toast.loading("Excluindo item...");
        try {
            const response = await deletePostoCombustivelTanque(idExcluir);
            setOpenDialogExcluir(false);
            toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
            if (tanques?.length === 1 && currentPage > 0) changeListFilters(currentPage - 1);
            else await updateList();
        } catch (error: Error | any) {
            toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 2000 });
        }
    }

    const { isMobile, rowStyle, cellStyle, hiddenMobile } = useMobile();

    return (
        <div className={`flex flex-col gap-8`}>

            {(tanques.length > 0) && (
                <div className="bg-card dark:bg-card py-1 rounded-md shadow-md dark:border">
                    <TableTop title='Tanques'>
                        <Button type="button" variant="success" onClick={handleClickAdicionar}>Adicionar</Button>
                    </TableTop>
                    <hr />
                    <Table>
                        <TableHeader>
                            <TableRow className="hidden sm:table-row">
                                <TableHead className="w-16 text-center">Id</TableHead>
                                {idPostoCombustivel ? <TableHead className='w-60'>Descrição</TableHead> : <></>}
                                <TableHead className='w-40'>Produto Abastecimento</TableHead>
                                <TableHead className='w-40'>Capacidade Litros</TableHead>
                                <TableHead className='w-40'>Estoque Mínimo Litros</TableHead>
                                {idPostoCombustivel ? <TableHead className='w-40'>Número Tanque</TableHead> : <></>}
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tanques.map((c, index) => {
                                return (
                                    <TableRow key={c.id} className={rowStyle}>

                                        <TableCardHeader title={c.descricao}>
                                            <DropDownMenuItem
                                                id={!idPostoCombustivel ? index : c.id}
                                                handleClickEditar={handleClickEditar}
                                                handleClickDeletar={handleClickDeletar}
                                            />
                                        </TableCardHeader>

                                        <TableCell className={cellStyle + "sm:text-center"}>
                                            {isMobile && "Id: "}{!idPostoCombustivel ? (index + 1) : c.id}
                                        </TableCell>

                                        {idPostoCombustivel ? <TableCell className={hiddenMobile + "sm:text-left font-medium"}>
                                            {c.descricao}
                                        </TableCell> : <></>}

                                        <TableCell className={cellStyle + " sm:text-left"}>
                                            {isMobile && "Produto Abastecimento: "}{c.descricaoProdutoAbastecimento}
                                        </TableCell>

                                        <TableCell className={cellStyle + " sm:text-left"}>
                                            {isMobile && "Capacidade Litros: "}{c.capacidadeLitros}
                                        </TableCell>

                                        <TableCell className={cellStyle + " sm:text-left"}>
                                            {isMobile && "Estoque Mínimo Litros: "}{c.estoqueMinimoLitros}
                                        </TableCell>

                                        {idPostoCombustivel ? <TableCell className={cellStyle + " sm:text-left"}>
                                            {isMobile && "Número Tanque: "}{c.numeroTanque}
                                        </TableCell> : <></>}

                                        <TableCell className={hiddenMobile + "text-right"}>
                                            <DropDownMenuItem
                                                id={!idPostoCombustivel ? index : c.id}
                                                handleClickEditar={handleClickEditar}
                                                handleClickDeletar={handleClickDeletar}
                                            />
                                        </TableCell>

                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                    {idPostoCombustivel ? <>
                        <hr />
                        <TableRodape
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            totalRegisters={totalRegisters}
                            lengthCurrentPage={tanques.length}
                            setCurrentPage={setCurrentPage}
                        />
                    </> : <></>}
                </div>
            )}

            {tanques?.length === 0 && <>
                {loading ? (
                    <TableLoading />
                ) : (
                    <div className='bg-gray-100 dark:bg-muted border-dashed border-[2px] border-gray-300 rounded-md shadow-md'>
                        <TableEmpty py='py-20' title='Nenhum tanque encontrado' icon="search-x" handleClickAdicionar={handleClickAdicionar} />
                    </div>
                )}
            </>}

            <Modal open={openModalForm} setOpen={setOpenModalForm} id={idEditar} updateList={updateList} idPostoCombustivel={idPostoCombustivel} tanques={tanques} setTanques={setTanques} />

            <AlertExcluir openDialog={openDialogExcluir} setOpenDialog={setOpenDialogExcluir} func={deletar} />

        </div>
    )
}