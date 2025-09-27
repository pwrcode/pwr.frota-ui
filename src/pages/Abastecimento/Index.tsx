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
import { BadgeSimNao } from '@/ui/components/tables/BadgeAtivo';
import { formatarData } from '@/services/date';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TableTop } from '@/ui/components/tables/TableTop';
import { AlertExcluir } from '@/ui/components/dialogs/Alert';
import { currency } from '@/services/currency';
import VeiculoSelect from '@/ui/selects/VeiculoSelect';
import SelectMotorista from '@/ui/selects/MotoristaSelect';
import SelectPostoCombustivel from '@/ui/selects/PostoCombustivelSelect';
import SelectProdutoAbastecimento from '@/ui/selects/ProdutoAbastecimentoSelect';
import InputDataControl from '@/ui/components/forms/InputDataControl';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const schema = z.object({
  idMotorista: z.object({
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
  idVeiculo: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }).optional(),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
});

export default function Abastecimento({ idPosto, idVeiculo }: { idPosto?: number, idVeiculo?: number }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, _] = useState(10);

  const { getValues, watch, control } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      dataInicio: "",
      dataFim: "",
      idMotorista: undefined,
      idPostoCombustivel: idPosto ? { value: idPosto } : undefined,
      idProdutoAbastecimento: undefined,
      idVeiculo: undefined,
    }
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [abastecimentos, setAbastecimentos] = useState<abastecimentoType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRegisters, setTotalRegisters] = useState<number>(0);
  const [excluirId, setExcluirId] = useState<number>(0);
  const [openDialogExcluir, setOpenDialogExcluir] = useState<boolean>(false);

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
      const filtros: postListagemAbastecimentoType = {
        pageSize: pageSize,
        currentPage: paginaAtual,
        dataInicio: getValues("dataInicio") ? getValues("dataInicio")?.slice(0, 11).concat("00:00:00") || "" : "",
        dataFim: getValues("dataFim") ? getValues("dataFim")?.slice(0, 11).concat("00:00:00") || "" : "",
        idVeiculo: getValues("idVeiculo")?.value || null,
        idMotorista: getValues("idMotorista")?.value || null,
        idPostoCombustivel: getValues("idPostoCombustivel")?.value || null,
        idProdutoAbastecimento: getValues("idProdutoAbastecimento")?.value || null,
      }

      const data = await getAbastecimentos(filtros);
      setAbastecimentos(data.dados);
      setTotalPages(data.totalPages);
      setTotalRegisters(data.totalRegisters);
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
      if (abastecimentos.length === 1 && currentPage > 0) debounceUpdate(currentPage - 1);
      else await updateList();
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 2000 });
    }
  }

  const { isMobile, rowStyle, cellStyle, hiddenMobile } = useMobile();

  return (
    <div className={`flex flex-col gap-8 ${idPosto || idVeiculo ? "pt-2" : "mt-16"} min-h-[96vh]`}>

      <PageTitle title="Abastecimentos" />

      <Filters grid={FiltersGrid.sm2_md3_lg4}>
        {!idVeiculo ? <VeiculoSelect control={control} /> : <></>}
        <SelectMotorista control={control} />
        {!idPosto ? <SelectPostoCombustivel control={control} /> : <></>}
        <SelectProdutoAbastecimento control={control} ignoreFiltros={!idPosto} />
        <InputDataControl name="dataInicio" title='Data Início' control={control} />
        <InputDataControl name="dataFim" title='Data Fim' control={control} />
      </Filters>

      {(abastecimentos.length > 0) && (
        <div className="bg-card dark:bg-card py-1 rounded-md shadow-md dark:border">
          <TableTop>
            <Button type="button" variant="success" onClick={handleClickAdicionar}>Adicionar</Button>
          </TableTop>
          <hr />
          <Table>
            <TableHeader>
              <TableRow className="hidden sm:table-row">
                <TableHead className="w-16 text-center">Id</TableHead>
                <TableHead className='w-80'>Veículo</TableHead>
                <TableHead className='w-80'>Motorista</TableHead>
                <TableHead className='w-80'>Posto Combustível</TableHead>
                <TableHead className='w-80'>Produto Abastecimento</TableHead>
                <TableHead className='w-30'>Data Abastecimento</TableHead>
                <TableHead className='w-30'>Quilometragem</TableHead>
                <TableHead className='w-30'>Quantidade Abastecida</TableHead>
                <TableHead className='w-30'>Valor Unitário</TableHead>
                <TableHead className='w-30'>Valor Total</TableHead>
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
                      {isMobile && "Veículo: "}{c.descricaoVeiculo}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Motorista: "}{c.razaoSocialPessoa}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Posto Combustível: "}{c.razaoSocialPostoCombustivel}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Produto Abastecimento: "}{c.descricaoProdutoAbastecimento}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Data Abastecimento: "}{formatarData(c.dataAbastecimento, "dd/mm/yyyy hh:mm")}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Quilomentragem: "}{c.quilometragem}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Quantidade Abastecida: "}{c.quantidadeAbastecida}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Valor Unitário: "}{currency(c.valorUnitario)}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Valor Total: "}{currency(c.valorTotal)}
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
          <TableEmpty py='py-20' icon="import" handleClickAdicionar={handleClickAdicionar} />
        )}
      </>}

      <AlertExcluir openDialog={openDialogExcluir} setOpenDialog={setOpenDialogExcluir} func={deletar} />

    </div>
  )
}