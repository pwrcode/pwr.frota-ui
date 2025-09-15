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
import { ativoOptions, type listType, tiposPessoa, todosOption } from '@/services/constants';
import AsyncReactSelect from '@/ui/components/forms/AsyncReactSelect';
import { BadgeAtivo } from '@/ui/components/tables/BadgeAtivo';
import { AlertExcluir } from '@/ui/components/dialogs/Alert';
import { formatarCpfCnpj } from '@/services/formatacao';
import { deletePessoa, getPessoas, type pessoaType, type postListagemPessoaType } from '@/services/pessoa';
import { getUfList } from '@/services/uf';
import { getMunicipioList } from '@/services/municipio';
import { Filters, FiltersGrid } from '@/ui/components/Filters';

export const tiposPessoasOptions = [todosOption, ...tiposPessoa];

const options = [
  { value: "isCliente", label: "Cliente" },
  { value: "isFornecedor", label: "Fornecedor" },
  { value: "isTransportadora", label: "Transportadora" },
  { value: "isMotorista", label: "Motorista" },
  { value: "isSeguradora", label: "Seguradora" }
];

export default function Pessoa() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [pessoas, setPessoas] = useState<pessoaType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRegisters, setTotalRegisters] = useState<number>(0);
  const [excluirId, setExcluirId] = useState<number>(0);
  const [openDialogExcluir, setOpenDialogExcluir] = useState<boolean>(false);

  const [ufs, setUfs] = useState<listType>([]);
  const [municipios, setMunicipios] = useState<listType>([]);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pesquisa, setPesquisa] = useState<string>("");
  const [tipoPessoa, setTipoPessoa] = useState(todosOption);
  // const [isCliente, setIsCliente] = useState(todosOption);
  // const [isFornecedor, setIsFornecedor] = useState(todosOption);
  // const [isTransportadora, setIsTransportadora] = useState(todosOption);
  // const [isMotorista, setIsMotorista] = useState(todosOption);
  // const [isSeguradora, setIsSeguradora] = useState(todosOption);

  const [optionsSelected, setOptionsSelected] = useState<listType>([]);
  const [ativo, setAtivo] = useState(todosOption);
  const [idUF, setIdUF] = useState(todosOption);
  const [idMunicipio, setIdMunicipio] = useState(todosOption);

  const initialPostListagem: postListagemPessoaType = {
    pageSize: pageSize,
    currentPage: currentPage,
    pesquisa: "",
    ativo: null,
    tipoPessoa: null,
    isCliente: null,
    isFornecedor: null,
    isTransportadora: null,
    isMotorista: null,
    isSeguradora: null,
    idUF: null,
    idMunicipio: null
  };
  const [postListagem, setPostListagem] = useState(initialPostListagem);
  const [filtersOn, setFiltersOn] = useState<boolean>(false);

  const getUfs = async (pesquisa?: string) => {
    const data = await getUfList(pesquisa, undefined);
    setUfs([todosOption, ...data]);
    return [todosOption, ...data];
  }

  useEffect(() => {
    getMunicipios();
    setIdMunicipio(todosOption);
  }, [idUF]);

  const getMunicipios = async (pesquisa?: string) => {
    if (!idUF || !Number(idUF.value)) {
      setMunicipios([]);
      return [];
    };
    const data = await getMunicipioList(pesquisa, idUF.value ?? undefined);
    setMunicipios([todosOption, ...data]);
    return [todosOption, ...data];
  }

  useEffect(() => {
    if (currentPage > 0 || filtersOn) changeListFilters(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (pesquisa.length > 0 || filtersOn) changeListFilters(0);
  }, [pesquisa]);

  useEffect(() => {
    if (ativo.value != undefined || filtersOn) changeListFilters(0);
  }, [ativo]);

  useEffect(() => {
    if (tipoPessoa.value != undefined || filtersOn) changeListFilters(0);
  }, [tipoPessoa]);

  useEffect(() => {
    if (idUF.value != undefined || filtersOn) changeListFilters(0);
  }, [idUF]);

  useEffect(() => {
    if (idMunicipio.value != undefined || filtersOn) changeListFilters(0);
  }, [idMunicipio]);

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
      ativo: ativo.value == undefined ? null : ativo.value,
      tipoPessoa: tipoPessoa.value == undefined ? null : tipoPessoa.value,
      isCliente: list?.find(l => l.value === "isCliente") ? true : null,
      isFornecedor: list?.find(l => l.value === "isFornecedor") ? true : null,
      isTransportadora: list?.find(l => l.value === "isTransportadora") ? true : null,
      isMotorista: list?.find(l => l.value === "isMotorista") ? true : null,
      isSeguradora: list?.find(l => l.value === "isSeguradora") ? true : null,
      idUF: idUF.value == undefined ? null : idUF.value,
      idMunicipio: idMunicipio.value == undefined ? null : idMunicipio.value
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
        <AsyncReactSelect name="tipoPessoa" title="Classificação Pessoa" options={tiposPessoasOptions} value={tipoPessoa} setValue={setTipoPessoa} />
        <AsyncReactSelect name="ativo" title="Status" options={ativoOptions} value={ativo} setValue={setAtivo} />
        <AsyncReactSelect name="idUF" title="UF" options={ufs} value={idUF} setValue={setIdUF} asyncFunction={getUfs} filter={true} />
        <AsyncReactSelect name="idMunicipio" title="Município" options={municipios} value={idMunicipio} setValue={setIdMunicipio} asyncFunction={getMunicipios} filter={true} />
        <div className="sm:col-span-2 md:col-span-3 lg:col-span-2">
          <AsyncReactSelect name="optionsSelected" title="Filtragem" options={options} value={optionsSelected} setValue={setOptionsSelected} isMulti />
        </div>
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
                <TableHead>Pessoa</TableHead>
                <TableHead>Tipo Pessoa</TableHead>
                <TableHead>CPF / CNPJ</TableHead>
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

                    <TableCell className={hiddenMobile}>
                      <div className="flex flex-col justify-start min-w-[100px]">
                        <span className="font-semibold">#{c.id}</span>
                        <span className="text-nowrap">
                          <span className="text-gray-700">Razão Social:</span> {c.razaoSocial}
                        </span>
                        <span className="text-nowrap">
                          <span className="text-gray-700">Nome Fantasia:</span> {c.nomeFantasia}
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

                    <TableCell className={hiddenMobile + " sm:text-center w-[100px]"}>
                      <BadgeAtivo ativo={c.ativo} />
                    </TableCell>

                    <TableCell className={hiddenMobile + "text-right w-[100px]"}>
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