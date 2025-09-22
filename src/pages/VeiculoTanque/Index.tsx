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
import { deleteVeiculoTanque, getVeiculoTanques, type postListagemVeiculoTanqueType } from '@/services/veiculoTanque';
import { tiposTanque } from '@/services/constants';
import { TableTop } from '@/ui/components/tables/TableTop';
import { Button } from '@/components/ui/button';
import { AlertExcluir } from '@/ui/components/dialogs/Alert';

export default function VeiculoTanque({ idVeiculo, tanques, setTanques }: { idVeiculo?: number, tanques: any[], setTanques: any }) {

    const [loading, setLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalRegisters, setTotalRegisters] = useState<number>(0);
    const [idEditar, setIdEditar] = useState<number>(0);
    const [idExcluir, setIdExcluir] = useState<number>(0);
    const [openModalForm, setOpenModalForm] = useState<boolean>(false);
    const [openDialogExcluir, setOpenDialogExcluir] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);

    const initialPostListagem: postListagemVeiculoTanqueType = {
        pageSize: pageSize,
        currentPage: currentPage,
        pesquisa: "",
        idVeiculo: idVeiculo ?? null,
        tipoTanque: null
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
            idVeiculo: idVeiculo ?? null,
            tipoTanque: null
        });
    }

    useEffect(() => {
        updateList();
    }, []);

    const updateList = async () => {
        if (idVeiculo) {
            const process = toast.loading("Carregando...");
            setLoading(true);
            try {
                const data = await getVeiculoTanques(postListagem);
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
        if (!idVeiculo) {
            console.log("oi")
            const tan = tanques.filter((_t, index) => index !== idExcluir);
            setTanques(tan);
            return
        }
        const process = toast.loading("Excluindo item...");
        try {
            const response = await deleteVeiculoTanque(idExcluir);
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
                <div className="bg-card dark:bg-card py-1 rounded-md shadow-md">
                    <TableTop title='Tanques'>
                        <Button type="button" variant="success" onClick={handleClickAdicionar}>Adicionar</Button>
                    </TableTop>
                    <hr />
                    <Table>
                        <TableHeader>
                            <TableRow className="hidden sm:table-row">
                                <TableHead className="w-16 text-center">Id</TableHead>
                                {idVeiculo ? <TableHead className='w-60'>Descrição</TableHead> : <></>}
                                <TableHead className='w-40'>Tipo</TableHead>
                                <TableHead className='w-40'>Capacidade</TableHead>
                                {idVeiculo ? <TableHead className='w-40'>Número Tanque</TableHead> : <></>}
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tanques.map((c, index) => {
                                return (
                                    <TableRow key={c.id} className={rowStyle}>

                                        <TableCardHeader title={c.descricao}>
                                            <DropDownMenuItem
                                                id={!idVeiculo ? index : c.id}
                                                handleClickEditar={handleClickEditar}
                                                handleClickDeletar={handleClickDeletar}
                                            />
                                        </TableCardHeader>

                                        <TableCell className={cellStyle + "sm:text-center"}>
                                            {isMobile && "Id: "}{!idVeiculo ? (index + 1) : c.id}
                                        </TableCell>

                                        {idVeiculo ? <TableCell className={hiddenMobile + "sm:text-left font-medium"}>
                                            {c.descricao}
                                        </TableCell> : <></>}

                                        <TableCell className={cellStyle + " sm:text-left"}>
                                            {isMobile && "Tipo: "}{idVeiculo ? c.tipoTanque : tiposTanque.find(t=> t.value === c.tipoTanque)?.label}
                                        </TableCell>

                                        <TableCell className={cellStyle + " sm:text-left"}>
                                            {isMobile && "Capacidade: "}{c.capacidade}
                                        </TableCell>

                                        {idVeiculo ? <TableCell className={cellStyle + " sm:text-left"}>
                                            {isMobile && "Número Tanque: "}{c.numeroTanque}
                                        </TableCell> : <></>}

                                        <TableCell className={hiddenMobile + "text-right"}>
                                            <DropDownMenuItem
                                                id={!idVeiculo ? index : c.id}
                                                handleClickEditar={handleClickEditar}
                                                handleClickDeletar={handleClickDeletar}
                                            />
                                        </TableCell>

                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                    {idVeiculo ? <>
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
                    <TableEmpty title='Nenhum tanque encontrado' icon="search-x" handleClickAdicionar={handleClickAdicionar} py='py-20'/>
                )}
            </>}

            <Modal open={openModalForm} setOpen={setOpenModalForm} id={idEditar} updateList={updateList} idVeiculo={idVeiculo} tanques={tanques} setTanques={setTanques} />

            <AlertExcluir openDialog={openDialogExcluir} setOpenDialog={setOpenDialogExcluir} func={deletar} />

        </div>
    )
}