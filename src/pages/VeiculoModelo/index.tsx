import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMobile } from '@/hooks/useMobile';
import PageTitle from '@/ui/components/PageTitle';
import { Filters, FiltersGrid } from '@/ui/components/Filters';
import InputLabelValue from '@/ui/components/forms/InputLabelValue';
import TableLoading from '@/ui/components/tables/TableLoading';
import { TableCardHeader } from '@/ui/components/tables/TableCardHeader';
import DropDownMenuItem from '@/ui/components/DropDownMenuItem';
import TableEmpty from '@/ui/components/tables/TableEmpty';
import { toast } from 'react-toastify';
import { errorMsg } from '@/services/api';
import { TableRodape } from '@/ui/components/tables/TableRodape';
import { delayDebounce, useDebounce } from '@/hooks/useDebounce';
import Modal from './Modal';
import { deleteVeiculoModelo, getVeiculoModelos, type veiculoModeloType, type postListagemVeiculoModeloType } from '@/services/veiculoModelo';
import { TableTop } from '@/ui/components/tables/TableTop';
import { Button } from '@/components/ui/button';
import { AlertExcluir } from '@/ui/components/dialogs/Alert';
import { todosOption } from '@/services/constants';
import AsyncReactSelect from '@/ui/components/forms/AsyncReactSelect';
import { getVeiculoMarcaList } from '@/services/veiculoMarca';

export default function VeiculoModelo() {

    const [loading, setLoading] = useState<boolean>(false);
    const [veiculoModelos, setVeiculoModelos] = useState<veiculoModeloType[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalRegisters, setTotalRegisters] = useState<number>(0);
    const [idEditar, setIdEditar] = useState<number>(0);
    const [idExcluir, setIdExcluir] = useState<number>(0);
    const [openModalForm, setOpenModalForm] = useState<boolean>(false);
    const [openDialogExcluir, setOpenDialogExcluir] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pesquisa, setPesquisa] = useState<string>("");
    const [veiculoMarca, setVeiculoMarca] = useState(todosOption);

    const initialPostListagem: postListagemVeiculoModeloType = {
        pageSize: pageSize,
        currentPage: currentPage,
        pesquisa: "",
        idVeiculoMarca: null,
    };
    const [postListagem, setPostListagem] = useState(initialPostListagem);
    const [filtersOn, setFiltersOn] = useState<boolean>(false);

    useEffect(() => {
        if (currentPage > 0 || filtersOn) changeListFilters(currentPage);
    }, [currentPage]);

    useEffect(() => {
        if (pesquisa.length > 0 || filtersOn) changeListFilters();
    }, [pesquisa]);

    useEffect(() => {
        if (veiculoMarca?.value !== undefined || filtersOn) changeListFilters();
    }, [veiculoMarca?.value]);

    const changeListFilters = (page?: number) => {
        setFiltersOn(true);
        setPostListagem({
            pageSize: pageSize,
            currentPage: page ?? 0,
            pesquisa: pesquisa,
            idVeiculoMarca: veiculoMarca && veiculoMarca.value ? veiculoMarca.value : null,
        });
    }

    useEffect(() => {
        updateList();
    }, []);

    const getVeiculoMarcas = async (pesquisa?: string) => {
        const data = await getVeiculoMarcaList(pesquisa);
        return [todosOption, ...data];
    }

    const updateList = async () => {
        const process = toast.loading("Carregando...");
        setLoading(true);
        try {
            const data = await getVeiculoModelos(postListagem);
            setVeiculoModelos(data.dados);
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
            const response = await deleteVeiculoModelo(idExcluir);
            setOpenDialogExcluir(false);
            toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
            if (veiculoModelos.length === 1 && currentPage > 0) changeListFilters(currentPage - 1);
            else await updateList();
        } catch (error: Error | any) {
            toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 2000 });
        }
    }

    const { isMobile, rowStyle, cellStyle, hiddenMobile } = useMobile();

    return (
        <div className="flex flex-col gap-8 min-h-[calc(100%-4rem)]">

            <PageTitle title="Veículo Modelo" />

            <Filters grid={FiltersGrid.sm2}>
                <InputLabelValue name="pesquisa" title="Pesquisar" value={pesquisa} setValue={setPesquisa} />
                <AsyncReactSelect name="idVeiculoMarca" title="Veiculo Marca" options={[]} asyncFunction={getVeiculoMarcas} value={veiculoMarca} setValue={setVeiculoMarca} isClearable
                />
            </Filters>

            {(veiculoModelos.length > 0) && (
                <div className="bg-card dark:bg-card py-1 rounded-md shadow-md dark:border">
                    <TableTop>
                        <Button type="button" variant="success" onClick={handleClickAdicionar}>Adicionar</Button>
                    </TableTop>
                    <hr />
                    <Table>
                        <TableHeader>
                            <TableRow className="hidden sm:table-row">
                                <TableHead className="w-16 text-center">Id</TableHead>
                                <TableHead className="w-70">Veículo Modelo</TableHead>
                                <TableHead>Veículo Marca</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {veiculoModelos.map(c => {
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

                                        <TableCell className={hiddenMobile + "sm:text-left font-medium"}>
                                            {isMobile && "Veículo Marca: "}{c.descricaoVeiculoMarca}
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
                        lengthCurrentPage={veiculoModelos.length}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            )}

            {veiculoModelos.length === 0 && <>
                {loading ? (
                    <TableLoading />
                ) : (
                    <TableEmpty  py='py-20' icon="car-front" />
                )}
            </>}

            <Modal open={openModalForm} setOpen={setOpenModalForm} id={idEditar} updateList={updateList} />

            <AlertExcluir openDialog={openDialogExcluir} setOpenDialog={setOpenDialogExcluir} func={deletar} />

        </div>
    )
}