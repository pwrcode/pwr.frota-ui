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
import { ativoOptions, type listType, type optionType, tiposPessoa } from '@/services/constants';
import AsyncReactSelect from '@/ui/components/forms/AsyncReactSelect';
import { BadgeAtivo } from '@/ui/components/tables/BadgeAtivo';
import { AlertExcluir } from '@/ui/components/dialogs/Alert';
import { formatarCpfCnpj } from '@/services/formatacao';
import { deletePessoa, getPessoas, type pessoaType, type postListagemPessoaType } from '@/services/pessoa';
import { getUfList } from '@/services/uf';
import { getMunicipioList } from '@/services/municipio';
import { Filters, FiltersGrid } from '@/ui/components/Filters';
import { getBairroList } from '@/services/bairro';
import InputDataLabel from '@/ui/components/forms/InputDataLabel';

const options = [
  { value: "isAjudante", label: "Ajudante" },
  { value: "isMotorista", label: "Motorista" },
  { value: "isOficina", label: "Oficina" },
];

export default function Pessoa() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [pessoas, setPessoas] = useState<pessoaType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRegisters, setTotalRegisters] = useState<number>(0);
  const [excluirId, setExcluirId] = useState<number>(0);
  const [openDialogExcluir, setOpenDialogExcluir] = useState<boolean>(false);

  // const [ufs, setUfs] = useState<listType>([]);
  const [municipios, setMunicipios] = useState<listType>([]);
  const [bairros, setBairros] = useState<listType>([]);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pesquisa, setPesquisa] = useState<string>("");
  const [tipoPessoa, setTipoPessoa] = useState<optionType>();
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const [optionsSelected, setOptionsSelected] = useState<listType>([]);
  const [status, setStatus] = useState<optionType>();
  const [uf, setUf] = useState<optionType>();
  const [municipio, setMunicipio] = useState<optionType>();
  const [bairro, setBairro] = useState<optionType>();

  const initialPostListagem: postListagemPessoaType = {
    pageSize: pageSize,
    currentPage: currentPage,
    pesquisa: "",
    dataInicio: "",
    dataFim: "",
    ativo: null,
    tipoPessoa: null,
    isAjudante: false,
    isMotorista: false,
    isOficina: false,
    idUf: null,
    idMunicipio: null,
    idBairro: null,
  };
  const [postListagem, setPostListagem] = useState(initialPostListagem);
  const [filtersOn, setFiltersOn] = useState<boolean>(false);

  const getUfs = async (pesquisa?: string) => {
    const data = await getUfList(pesquisa);
    // setUfs([...data]);
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
  }, [status]);

  useEffect(() => {
    changeListFilters(0);
  }, [tipoPessoa]);

  useEffect(() => {
    changeListFilters(0);
  }, [uf]);

  useEffect(() => {
    changeListFilters(0);
  }, [municipio]);

  useEffect(() => {
    changeListFilters(0);
  }, [bairro]);

  useEffect(() => {
    changeListFilters(0);
  }, [dataInicio]);

  useEffect(() => {
    changeListFilters(0);
  }, [dataFim]);

  useEffect(() => {
    if ((Array.isArray(optionsSelected) && optionsSelected.length > 0) || filtersOn) {
      changeListFilters(0, optionsSelected);
    }
  }, [optionsSelected]);

  const changeListFilters = (page: number, list?: listType) => {
    setFiltersOn(true);
    setPostListagem({
      pageSize: pageSize,
      currentPage: page ?? 0,
      pesquisa: pesquisa,
      dataInicio: dataInicio != "" ? dataInicio.slice(0, 11).concat("00:00:00") : "",
      dataFim: dataFim != "" ? dataFim.slice(0, 11).concat("23:59:59") : "",
      ativo: status ? status.value : null,
      tipoPessoa: tipoPessoa && tipoPessoa.value ? tipoPessoa.value : null,
      isAjudante: list?.find(l => l.value === "isAjudante") ? true : null,
      isMotorista: list?.find(l => l.value === "isMotorista") ? true : null,
      isOficina: list?.find(l => l.value === "isOficina") ? true : null,
      idUf: uf && uf.value ? uf.value : null,
      idMunicipio: municipio && municipio.value ? municipio.value : null,
      idBairro: bairro && bairro.value ? bairro.value : null,
    });
  }

  useEffect(() => {
    updateList();
  }, []);

  const updateList = async () => {
    const process = toast.loading("Carregando...");
    setLoading(true);
    try {
      const data = await getPessoas(postListagem);
      setPessoas(data.dados);
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
    navigate("/pessoa/form");
  }

  const handleClickEditar = (id: number) => {
    navigate(`/pessoa/form/${id}`);
  }

  const handleClickDeletar = (id: number) => {
    setExcluirId(id);
    setOpenDialogExcluir(true);
  }

  const deletar = async () => {
    const process = toast.loading("Excluindo item...");
    try {
      const response = await deletePessoa(excluirId);
      setOpenDialogExcluir(false);
      toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
      if (pessoas.length === 1 && currentPage > 0) changeListFilters(currentPage - 1);
      else await updateList();
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 2000 });
    }
  }

  const { isMobile, rowStyle, cellStyle, hiddenMobile } = useMobile();

  return (
    <div className="flex flex-col gap-8 mt-16 min-h-[calc(100%-4rem)]">

      <PageTitle title="Pessoa" />

      <Filters grid={FiltersGrid.sm2_md3_lg4}>
        <InputLabelValue name="pesquisa" title="Pesquisar" value={pesquisa} setValue={setPesquisa} />
        <AsyncReactSelect name="tipoPessoa" title="Tipo Pessoa" options={tiposPessoa} value={tipoPessoa} setValue={setTipoPessoa} isClearable />
        <div className="sm:col-span-2 md:col-span-3 lg:col-span-2">
          <AsyncReactSelect name="optionsSelected" title="Tipo Pessoa" options={options} value={optionsSelected} setValue={setOptionsSelected} isMulti />
        </div>
        <AsyncReactSelect name="idUF" title="UF" options={[]} value={uf} setValue={setUf} asyncFunction={getUfs} isClearable />
        <AsyncReactSelect name="idMunicipio" title="Município" options={municipios} value={municipio} setValue={setMunicipio} asyncFunction={getMunicipios} filter isClearable />
        <AsyncReactSelect name="idBairro" title="Bairro" options={bairros} value={bairro} setValue={setBairro} asyncFunction={getBairros} filter isClearable />
        <InputDataLabel name="dataInicio" title='Data Início (Validade CNH)' date={dataInicio} setDate={setDataInicio} />
        <InputDataLabel name="dataFim" title='Data Fim (Validade CNH)' date={dataFim} setDate={setDataFim} />
        <AsyncReactSelect name="ativo" title="Status" options={ativoOptions} value={status} setValue={setStatus} isClearable />
      </Filters>

      {(pessoas.length > 0) && (
        <div className="bg-white dark:bg-slate-800 py-1 rounded-md shadow-md">
          <TableTop>
            <Button type="button" variant="success" onClick={handleClickAdicionar}>Adicionar</Button>
          </TableTop>
          <hr />
          <Table>
            <TableHeader>
              <TableRow className="hidden sm:table-row">
                <TableHead className='w-16 text-center'>Id</TableHead>
                <TableHead className='w-90  '>Pessoa</TableHead>
                <TableHead className='w-60'>Tipo Pessoa</TableHead>
                <TableHead className='w-60'>CPF / CNPJ</TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pessoas.map(c => {
                return (
                  <TableRow key={c.id} className={rowStyle}>

                    <TableCardHeader title={c.nomeFantasia}>
                      <div className="flex flex-row items-center gap-1">
                        <BadgeAtivo ativo={c.ativo} />
                        <DropDownMenuItem id={c.id} handleClickEditar={handleClickEditar} handleClickDeletar={handleClickDeletar} />
                      </div>
                    </TableCardHeader>

                    <TableCell className={hiddenMobile + " text-center"}>
                      {c.id}
                    </TableCell>

                    <TableCell className={hiddenMobile}>
                      <div className="flex flex-col justify-start min-w-[100px]">
                        {/* <span className="font-semibold">#{c.id}</span> */}
                        <span className="text-nowrap">
                          <span className="text-gray-700 dark:text-white/80">Razão Social:</span> {c.razaoSocial}
                        </span>
                        <span className="text-nowrap">
                          <span className="text-gray-700 dark:text-white/80">Nome Fantasia:</span> {c.nomeFantasia}
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
                      {isMobile && "Tipo Pessoa: "}{c.tipoPessoa}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "CPF / CNPJ: "}{formatarCpfCnpj(c.documento)}
                    </TableCell>

                    <TableCell className={hiddenMobile + " sm:text-end"}>
                      <BadgeAtivo ativo={c.ativo} />
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
            lengthCurrentPage={pessoas.length}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {pessoas.length === 0 && <>
        {loading ? (
          <TableLoading />
        ) : (
          <TableEmpty icon="users" handleClickAdicionar={handleClickAdicionar} />
        )}
      </>}

      <AlertExcluir openDialog={openDialogExcluir} setOpenDialog={setOpenDialogExcluir} func={deletar} />

    </div>
  )
}