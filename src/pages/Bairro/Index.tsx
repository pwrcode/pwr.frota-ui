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
import { deleteBairro, getBairros, type bairroType, type postListagemBairroType } from '@/services/bairro';
import { type optionType } from '@/services/constants';
import AsyncReactSelect from '@/ui/components/forms/AsyncReactSelect';
import { getUfList } from '@/services/uf';
import { getMunicipioList } from '@/services/municipio';
import { TableTop } from '@/ui/components/tables/TableTop';
import { Button } from '@/components/ui/button';
import { AlertExcluir } from '@/ui/components/dialogs/Alert';

export default function Bairro() {

    const [loading, setLoading] = useState<boolean>(false);
    const [bairros, setBairros] = useState<bairroType[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalRegisters, setTotalRegisters] = useState<number>(0);
    const [idEditar, setIdEditar] = useState<number>(0);
    const [idExcluir, setIdExcluir] = useState<number>(0);
    const [openModalForm, setOpenModalForm] = useState<boolean>(false);
    const [openDialogExcluir, setOpenDialogExcluir] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pesquisa, setPesquisa] = useState<string>("");
    const [municipio, setMunicipio] = useState<optionType>();
    const [uf, setUf] = useState<optionType>();

    useEffect(() => {
        if (uf && uf.value) getMunicipios();
    }, [uf])


    const getMunicipios = async (pesquisa?: string) => {
        const data = await getMunicipioList(pesquisa, uf && uf.value ? uf.value : undefined);
        return [...data];
    }

    const getUfs = async (pesquisa?: string) => {
        const data = await getUfList(pesquisa);
        return [...data];
    }

    const initialPostListagem: postListagemBairroType = {
        pageSize: pageSize,
        currentPage: currentPage,
        pesquisa: "",
        idMunicipio: null,
        idUf: null
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
        changeListFilters();
    }, [municipio]);

    useEffect(() => {
        changeListFilters();
    }, [uf]);

    const changeListFilters = (page?: number) => {
        setFiltersOn(true);
        setPostListagem({
            pageSize: pageSize,
            currentPage: page ?? 0,
            pesquisa: pesquisa,
            idMunicipio: municipio && municipio.value ? municipio.value : null,
            idUf: uf && uf.value ? uf.value : null
        });
    }

    useEffect(() => {
        updateList();
    }, []);

    const updateList = async () => {
        const process = toast.loading("Carregando...");
        setLoading(true);
        try {
            const data = await getBairros(postListagem);
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
            const response = await deleteBairro(idExcluir);
            setOpenDialogExcluir(false);
            toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
            if (bairros.length === 1 && currentPage > 0) changeListFilters(currentPage - 1);
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
                <InputLabelValue
                    name="pesquisa"
                    title="Pesquisar"
                    value={pesquisa}
                    setValue={setPesquisa}
                    style='col-span-2 space-y-2'
                />
                <AsyncReactSelect
                    name="idUf"
                    title="UF"
                    options={[]}
                    asyncFunction={getUfs}
                    value={uf}
                    setValue={setUf}
                    isClearable
                />
                <AsyncReactSelect
                    name="idMunicipio"
                    title="Munícipio"
                    options={[]}
                    asyncFunction={getMunicipios}
                    value={municipio}
                    setValue={setMunicipio}
                    isClearable
                />
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
                    <TableEmpty  py='py-20' icon="map-pin" handleClickAdicionar={handleClickAdicionar} />
                )}
            </>}

            <Modal open={openModalForm} setOpen={setOpenModalForm} id={idEditar} updateList={updateList} />

            <AlertExcluir openDialog={openDialogExcluir} setOpenDialog={setOpenDialogExcluir} func={deletar} />

        </div>
    )
}