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
import { deleteAbastecimento, getAbastecimentos, type postListagemAbastecimentoType, type abastecimentoType } from '@/services/abastecimento';
import { type optionType } from '@/services/constants';
import AsyncReactSelect from '@/ui/components/forms/AsyncReactSelect';
import InputDataLabel from '@/ui/components/forms/InputDataLabel';
import { BadgeSimNao } from '@/ui/components/tables/BadgeAtivo';
import { formatarData } from '@/services/date';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TableTop } from '@/ui/components/tables/TableTop';
import { AlertExcluir } from '@/ui/components/dialogs/Alert';
import { getPessoaList } from '@/services/pessoa';
import { getPostoCombustivelList } from '@/services/postoCombustivel';
import { getProdutoAbastecimentoList } from '@/services/produtoAbastecimento';
import { getVeiculoList } from '@/services/veiculo';
import { currency } from '@/services/currency';

export default function Abastecimento({ idPosto, idVeiculo }: { idPosto?: number, idVeiculo?: number }) {

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [abastecimentos, setAbastecimentos] = useState<abastecimentoType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRegisters, setTotalRegisters] = useState<number>(0);
  const [excluirId, setExcluirId] = useState<number>(0);
  const [openDialogExcluir, setOpenDialogExcluir] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [motorista, setMotorista] = useState<optionType>();
  const [postoCombustivel, setPostoCombustivel] = useState<optionType>();
  const [produtoAbastecimento, setProdutoAbastecimento] = useState<optionType>();
  const [veiculo, setVeiculo] = useState<optionType>();
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const initialPostListagem: postListagemAbastecimentoType = {
    pageSize: pageSize,
    currentPage: currentPage,
    dataInicio: "",
    dataFim: "",
    idMotorista: null,
    idPostoCombustivel: idPosto ?? null,
    idProdutoAbastecimento: null,
    idVeiculo: idVeiculo ?? null,
  };
  const [postListagem, setPostListagem] = useState(initialPostListagem);
  const [filtersOn, setFiltersOn] = useState<boolean>(false);

  useEffect(() => {
    if (currentPage > 0 || filtersOn) changeListFilters(currentPage);
  }, [currentPage]);

  useEffect(() => {
    changeListFilters();
  }, [motorista]);

  useEffect(() => {
    changeListFilters();
  }, [postoCombustivel]);

  useEffect(() => {
    changeListFilters();
  }, [produtoAbastecimento]);

  useEffect(() => {
    changeListFilters();
  }, [veiculo]);

  useEffect(() => {
    changeListFilters();
  }, [dataInicio]);

  useEffect(() => {
    changeListFilters();
  }, [dataFim]);

  const changeListFilters = (page?: number) => {
    setFiltersOn(true);
    setPostListagem({
      pageSize: pageSize,
      currentPage: page ?? 0,
      dataInicio: dataInicio != "" ? dataInicio.slice(0, 11).concat("00:00:00") : "",
      dataFim: dataFim != "" ? dataFim.slice(0, 11).concat("23:59:59") : "",
      idMotorista: motorista && motorista.value ? motorista.value : null,
      idPostoCombustivel: idPosto ?? (postoCombustivel && postoCombustivel.value ? postoCombustivel.value : null),
      idProdutoAbastecimento: produtoAbastecimento && produtoAbastecimento.value ? produtoAbastecimento.value : null,
      idVeiculo: idVeiculo ?? (veiculo && veiculo.value ? veiculo.value : null),
    });
  }

  useEffect(() => {
    updateList();
  }, []);

  const getMotoristas = async (pesquisa?: string) => {
    const data = await getPessoaList(pesquisa, undefined, undefined, undefined, true, undefined, undefined, undefined, undefined);
    return [...data];
  }

  const getPostosCombustivel = async (pesquisa?: string) => {
    const data = await getPostoCombustivelList(pesquisa, undefined, undefined, undefined, undefined);
    return [...data];
  }

  const getProdutosAbastecimento = async (pesquisa?: string) => {
    const data = await getProdutoAbastecimentoList(pesquisa, undefined, undefined, undefined);
    return [...data];
  }

  const getVeiculos = async (pesquisa?: string) => {
    const data = await getVeiculoList(pesquisa, undefined, undefined, undefined);
    return [...data];
  }

  const updateList = async () => {
    const process = toast.loading("Carregando...");
    setLoading(true);
    try {
      const data = await getAbastecimentos(postListagem);
      setAbastecimentos(data.dados);
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
    navigate(`/abastecimento/form${idPosto ? `?idPosto=${idPosto}` : ""}${idVeiculo ? `?idVeiculo=${idVeiculo}` : ""}`);
  }

  const handleClickEditar = (id: number) => {
    navigate(`/abastecimento/form/${id}${idPosto ? `?idPosto=${idPosto}` : ""}${idVeiculo ? `?idVeiculo=${idVeiculo}` : ""}`);
  }

  const handleClickDeletar = (id: number) => {
    setExcluirId(id);
    setOpenDialogExcluir(true);
  }

  const deletar = async () => {
    const process = toast.loading("Excluindo item...");
    try {
      const response = await deleteAbastecimento(excluirId);
      setOpenDialogExcluir(false);
      toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
      if (abastecimentos.length === 1 && currentPage > 0) changeListFilters(currentPage - 1);
      else await updateList();
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 2000 });
    }
  }

  const { isMobile, rowStyle, cellStyle, hiddenMobile } = useMobile();

  return (
    <div className={`flex flex-col gap-8 ${!idPosto ? "mt-16" : "p-5"} min-h-[calc(100%-4rem)]`}>

      <PageTitle title="Abastecimentos" />

      <Filters grid={FiltersGrid.sm2_md3_lg4}>
        {!idVeiculo ? <AsyncReactSelect name="idVeiculo" title='Veículo' options={[]} asyncFunction={getVeiculos} value={veiculo} setValue={setVeiculo} isClearable /> : <></>}
        <AsyncReactSelect name="idMotorista" title='Motorista' options={[]} asyncFunction={getMotoristas} value={motorista} setValue={setMotorista} isClearable />
        {!idPosto ? <AsyncReactSelect name="idPostoCombustivel" title="Posto Combustível" options={[]} value={postoCombustivel} setValue={setPostoCombustivel} asyncFunction={getPostosCombustivel} isClearable /> : <></>}
        <AsyncReactSelect name="idProdutoAbastecimento" title='Produto Abastecimento' options={[]} value={produtoAbastecimento} setValue={setProdutoAbastecimento} asyncFunction={getProdutosAbastecimento} isClearable />
        <InputDataLabel name="dataInicio" title='Data Início' date={dataInicio} setDate={setDataInicio} />
        <InputDataLabel name="dataFim" title='Data Fim' date={dataFim} setDate={setDataFim} />
      </Filters>

      {(abastecimentos.length > 0) && (
        <div className="bg-card dark:bg-card py-1 rounded-md shadow-md">
          <TableTop>
            <Button type="button" variant="success" onClick={handleClickAdicionar}>Adicionar</Button>
          </TableTop>
          <hr />
          <Table>
            <TableHeader>
              <TableRow className="hidden sm:table-row">
                <TableHead className="w-16 text-center">Id</TableHead>
                <TableHead className='w-50'>Quantidade Abastecida</TableHead>
                <TableHead className='w-50'>Valor Unitário</TableHead>
                <TableHead className='w-50'>Data Abastecimento</TableHead>
                <TableHead className='w-30'>Tanque Cheio</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {abastecimentos.map(c => {
                return (
                  <TableRow key={c.id} className={rowStyle}>

                    <TableCardHeader title={c.id}>
                      <DropDownMenuItem id={c.id} handleClickEditar={handleClickEditar} handleClickDeletar={handleClickDeletar} />
                    </TableCardHeader>

                    <TableCell className={hiddenMobile + "sm:text-center"}>
                      {c.id}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Quantidade Abastecida: "}{c.quantidadeAbastecida}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Valor Unitário: "}{currency(c.valorUnitario)}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Data Abastecimento: "}{formatarData(c.dataAbastecimento)}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Tanque Cheio: "}<BadgeSimNao value={c.tanqueCheio ?? false} />
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
            lengthCurrentPage={abastecimentos.length}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {abastecimentos.length === 0 && <>
        {loading ? (
          <TableLoading />
        ) : (
          <TableEmpty icon="import" handleClickAdicionar={handleClickAdicionar} />
        )}
      </>}

      <AlertExcluir openDialog={openDialogExcluir} setOpenDialog={setOpenDialogExcluir} func={deletar} />

    </div>
  )
}