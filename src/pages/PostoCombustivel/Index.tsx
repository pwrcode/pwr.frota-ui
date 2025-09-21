import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMobile } from '@/hooks/useMobile';
import PageTitle from '@/ui/components/PageTitle';
import InputLabelValue from '@/ui/components/forms/InputLabelValue';
import TableLoading from '@/ui/components/tables/TableLoading';
import { TableCardHeader } from '@/ui/components/tables/TableCardHeader';
import DropDownMenuItem from '@/ui/components/DropDownMenuItem';
import { TableTop } from '@/ui/components/tables/TableTop';
import { Button } from '@/components/ui/button';
import TableEmpty from '@/ui/components/tables/TableEmpty';
import { toast } from 'react-toastify';
import { errorMsg } from '@/services/api';
import { TableRodape } from '@/ui/components/tables/TableRodape';
import { delayDebounce, useDebounce } from '@/hooks/useDebounce';
import { SimNaoOptions, type listType, type optionType } from '@/services/constants';
import AsyncReactSelect from '@/ui/components/forms/AsyncReactSelect';
import { AlertExcluir } from '@/ui/components/dialogs/Alert';
import { formatarCelular, formatarCpfCnpj } from '@/services/formatacao';
import { deletePostoCombustivel, getPostoCombustivels, type postoCombustivelType, type postListagemPostoCombustivelType } from '@/services/postoCombustivel';
import { getUfList } from '@/services/uf';
import { getMunicipioList } from '@/services/municipio';
import { Filters, FiltersGrid } from '@/ui/components/Filters';
import { getBairroList } from '@/services/bairro';
import { BadgeTrueFalse } from '@/ui/components/tables/BadgeAtivo';

export default function PostoCombustivel() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [postoCombustivels, setPostoCombustivels] = useState<postoCombustivelType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRegisters, setTotalRegisters] = useState<number>(0);
  const [excluirId, setExcluirId] = useState<number>(0);
  const [openDialogExcluir, setOpenDialogExcluir] = useState<boolean>(false);

  const [municipios, setMunicipios] = useState<listType>([]);
  const [bairros, setBairros] = useState<listType>([]);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pesquisa, setPesquisa] = useState<string>("");

  const [isInterno, setIsInterno] = useState<optionType>();
  const [uf, setUf] = useState<optionType>();
  const [municipio, setMunicipio] = useState<optionType>();
  const [bairro, setBairro] = useState<optionType>();

  const initialPostListagem: postListagemPostoCombustivelType = {
    pageSize: pageSize,
    currentPage: currentPage,
    pesquisa: "",
    idUf: null,
    idMunicipio: null,
    idBairro: null,
    isInterno: null,
  };
  const [postListagem, setPostListagem] = useState(initialPostListagem);
  const [filtersOn, setFiltersOn] = useState<boolean>(false);

  const getUfs = async (pesquisa?: string) => {
    const data = await getUfList(pesquisa);
    return [...data];
  }

  useEffect(() => {
    getMunicipios();
  }, [uf]);

  useEffect(() => {
    getBairros();
  }, [municipio]);

  const getMunicipios = async (pesquisa?: string) => {
    if (!uf) {
      setMunicipios([]);
      setMunicipio(undefined);
      return [];
    };
    const data = await getMunicipioList(pesquisa, uf ? uf.value : undefined);
    setMunicipios([...data]);
    return [...data];
  }

  const getBairros = async (pesquisa?: string) => {
    if (!municipio) {
      setBairros([]);
      setBairro(undefined);
      return [];
    };
    const data = await getBairroList(pesquisa, municipio ? municipio.value : undefined);
    setBairros([...data]);
    return [...data];
  }

  useEffect(() => {
    if (currentPage > 0 || filtersOn) changeListFilters(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (pesquisa.length > 0 || filtersOn) changeListFilters(0);
  }, [pesquisa]);

  useEffect(() => {
    changeListFilters(0);
  }, [isInterno]);

  useEffect(() => {
    changeListFilters(0);
  }, [uf]);

  useEffect(() => {
    changeListFilters(0);
  }, [municipio]);

  useEffect(() => {
    changeListFilters(0);
  }, [bairro]);

  const changeListFilters = (page: number) => {
    setFiltersOn(true);
    setPostListagem({
      pageSize: pageSize,
      currentPage: page ?? 0,
      pesquisa: pesquisa,
      idUf: uf && uf.value ? uf.value : null,
      idMunicipio: municipio && municipio.value ? municipio.value : null,
      idBairro: bairro && bairro.value ? bairro.value : null,
      isInterno: isInterno ? isInterno.value : null,
    });
  }

  useEffect(() => {
    updateList();
  }, []);

  const updateList = async () => {
    const process = toast.loading("Carregando...");
    setLoading(true);
    try {
      const data = await getPostoCombustivels(postListagem);
      setPostoCombustivels(data.dados);
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
    navigate("/posto-combustivel/form");
  }

  const handleClickEditar = (id: number) => {
    navigate(`/posto-combustivel/form/${id}`);
  }

  const handleClickDeletar = (id: number) => {
    setExcluirId(id);
    setOpenDialogExcluir(true);
  }

  const deletar = async () => {
    const process = toast.loading("Excluindo item...");
    try {
      const response = await deletePostoCombustivel(excluirId);
      setOpenDialogExcluir(false);
      toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
      if (postoCombustivels.length === 1 && currentPage > 0) changeListFilters(currentPage - 1);
      else await updateList();
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 2000 });
    }
  }

  const { isMobile, rowStyle, cellStyle, hiddenMobile } = useMobile();

  return (
    <div className="flex flex-col gap-8 mt-16 min-h-[calc(100%-4rem)]">

      <PageTitle title="Posto Combustivel" />

      <Filters grid={FiltersGrid.sm2_md3_lg4}>
        <InputLabelValue name="pesquisa" title="Pesquisar" value={pesquisa} setValue={setPesquisa} />
        <AsyncReactSelect name="idUF" title="UF" options={[]} value={uf} setValue={setUf} asyncFunction={getUfs} isClearable />
        <AsyncReactSelect name="idMunicipio" title="Município" options={municipios} value={municipio} setValue={setMunicipio} asyncFunction={getMunicipios} filter isClearable />
        <AsyncReactSelect name="idBairro" title="Bairro" options={bairros} value={bairro} setValue={setBairro} asyncFunction={getBairros} filter isClearable />
        <AsyncReactSelect name="isInterno" title="Interno" options={SimNaoOptions} value={isInterno} setValue={setIsInterno} isClearable />
      </Filters>

      {(postoCombustivels.length > 0) && (
        <div className="bg-card dark:bg-card py-1 rounded-md shadow-md">
          <TableTop>
            <Button type="button" variant="success" onClick={handleClickAdicionar}>Adicionar</Button>
          </TableTop>
          <hr />
          <Table>
            <TableHeader>
              <TableRow className="hidden sm:table-row">
                <TableHead className='w-16 text-center'>Id</TableHead>
                <TableHead className='w-90  '>Posto Combustivel</TableHead>
                <TableHead className='w-60'>CNPJ</TableHead>
                <TableHead className='w-60'>Telefone Principal</TableHead>
                <TableHead className='w-60'>Telefone Secundário</TableHead>
                <TableHead className='w-60'>Interno</TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {postoCombustivels.map(c => {
                return (
                  <TableRow key={c.id} className={rowStyle}>

                    <TableCardHeader title={c.nomeFantasia}>
                      <DropDownMenuItem id={c.id} handleClickEditar={handleClickEditar} handleClickDeletar={handleClickDeletar} />
                    </TableCardHeader>

                    <TableCell className={hiddenMobile + " text-center"}>
                      {c.id}
                    </TableCell>

                    <TableCell className={hiddenMobile}>
                      <div className="flex flex-col justify-start min-w-[100px]">
                        {/* <span className="font-semibold">#{c.id}</span> */}
                        <span className="text-nowrap">
                          <span className="text-gray-700 dark:text-foreground/80">Razão Social:</span> {c.razaoSocial}
                        </span>
                        <span className="text-nowrap">
                          <span className="text-gray-700 dark:text-foreground/80">Nome Fantasia:</span> {c.nomeFantasia}
                        </span>
                      </div>
                    </TableCell>

                    {isMobile && <TableCell className={cellStyle}>
                      Id: {c.id}
                    </TableCell>}

                    {isMobile && <TableCell className={cellStyle}>
                      Razão Social: {c.razaoSocial}
                    </TableCell>}

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "CNPJ: "}{formatarCpfCnpj(c.cnpj)}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Telefone Principal: "}{formatarCelular(c.telefonePrincipal)}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Telefone Secundário: "}{formatarCelular(c.telefoneSecundario)}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-start"}>
                      {isMobile && "Interno: "}<BadgeTrueFalse value={c.isInterno ?? false} />
                    </TableCell>

                    <TableCell className={hiddenMobile + "text-right"}>
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
            lengthCurrentPage={postoCombustivels.length}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {postoCombustivels.length === 0 && <>
        {loading ? (
          <TableLoading />
        ) : (
          <TableEmpty icon="fuel" handleClickAdicionar={handleClickAdicionar} />
        )}
      </>}

      <AlertExcluir openDialog={openDialogExcluir} setOpenDialog={setOpenDialogExcluir} func={deletar} />

    </div>
  )
}