import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMobile } from '@/hooks/useMobile';
import PageTitle from '@/ui/components/PageTitle';
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
import { AlertExcluir } from '@/ui/components/dialogs/Alert';
import { formatarCelular, formatarCpfCnpj } from '@/services/formatacao';
import { deletePostoCombustivel, getPostoCombustivels, type postListagemPostoCombustivelType, type postoCombustivelType } from '@/services/postoCombustivel';
import { Filters, FiltersGrid } from '@/ui/components/Filters';
import { BadgeTrueFalse } from '@/ui/components/tables/BadgeAtivo';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Filter, X } from 'lucide-react';
import ModalFormBody from '@/ui/components/forms/ModalFormBody';
import ModalFormFooter from '@/ui/components/forms/ModalFormFooter';
import SelectIsInterno from '@/ui/selects/InternoSelect';
import SelectBairro from '@/ui/selects/BairroSelect';
import SelectMunicipio from '@/ui/selects/MunicipioSelect';
import SelectUf from '@/ui/selects/UfSelect';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputFiltroPesquisa from '@/ui/components/forms/InputFiltroPesquisa';

const schema = z.object({
  pesquisa: z.string().optional(),
  idUf: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }).optional().nullable(),
  idMunicipio: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }).optional().nullable(),
  idBairro: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }).optional().nullable(),
  isInterno: z.object({
    value: z.boolean().optional(),
    label: z.string().optional(),
  }).optional().nullable()
})

export default function PostoCombustivel() {

  const { getValues, watch, reset, control } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      pesquisa: "",
      idUf: undefined,
      idMunicipio: undefined,
      idBairro: undefined,
      isInterno: undefined,
    }
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [postoCombustivels, setPostoCombustivels] = useState<postoCombustivelType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRegisters, setTotalRegisters] = useState<number>(0);
  const [excluirId, setExcluirId] = useState<number>(0);
  const [openDialogExcluir, setOpenDialogExcluir] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  useEffect(() => {
    updateList();
  }, []);

  useEffect(() => {
    const subscription = watch(() => {
      debounceUpdate();
      checkActiveFilters();
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const updateList = async (paginaAtual: number = currentPage) => {
    const process = toast.loading("Carregando...");
    setLoading(true);
    try {
      const filtros: postListagemPostoCombustivelType = {
        currentPage: paginaAtual,
        pageSize: pageSize,
        isInterno: getValues("isInterno")?.value || null,
        idUf: getValues("idUf")?.value || null,
        idMunicipio: getValues("idMunicipio")?.value || null,
        idBairro: getValues("idBairro")?.value || null,
        pesquisa: getValues("pesquisa") || ""
      }
      const data = await getPostoCombustivels(filtros);
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
      if (postoCombustivels.length === 1 && currentPage > 0) debounceUpdate(currentPage - 1);
      else await updateList();
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 2000 });
    }
  }

  const { isMobile, rowStyle, cellStyle, hiddenMobile } = useMobile();

  const clearFilters = () => {
    reset({
      "idBairro": null,
      "idMunicipio": null,
      "idUf": null,
      "pesquisa": "",
      "isInterno": null,
    });
  }

  const checkActiveFilters = () => {
    const hasFilters = Boolean(
      getValues("idUf") ||
      getValues("idMunicipio") ||
      getValues("idBairro") ||
      getValues("isInterno")
    );
    setHasActiveFilters(hasFilters);
  }

  return (
    <div className="flex flex-col gap-8 mt-16 min-h-[calc(100%-4rem)]">

      <PageTitle title="Postos Combustivel" />
      <div className="flex flex-col sm:flex-row gap-4 sm:items-end">

        <div className="flex-1">
          <Filters grid={FiltersGrid.sm1_md1_lg1}>
            <InputFiltroPesquisa name="pesquisa" title="Pesquisar" control={control} />
          </Filters>
        </div>

        <div className="flex items-end h-fit">
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className={`relative h-10 ${hasActiveFilters ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400' : ''}`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros Avançados
                {hasActiveFilters && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                    !
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className='p-0 gap-0 m-4 w-[400px] sm:w-[540px] h-[96%] rounded-lg border shadow-xl'>
              <SheetHeader className="px-6">
                <SheetTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros Avançados
                </SheetTitle>
                <SheetDescription>
                  Configure filtros específicos para encontrar os veículos desejados.
                </SheetDescription>
              </SheetHeader>

              <ModalFormBody>
                <div className="space-y-4">
                  <SelectUf control={control} />
                  <SelectMunicipio control={control} />
                  <SelectBairro control={control} />
                  <SelectIsInterno control={control} />
                </div>

              </ModalFormBody>
              <ModalFormFooter>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
                <Button
                  onClick={() => setIsFiltersOpen(false)}
                  className="flex-1"
                  variant="success"
                >
                  Aplicar Filtros
                </Button>
              </ModalFormFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {(postoCombustivels.length > 0) && (
        <div className="bg-card dark:bg-card py-1 rounded-md shadow-md dark:border">
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
          <TableEmpty py='py-20' icon="fuel" handleClickAdicionar={handleClickAdicionar} />
        )}
      </>}

      <AlertExcluir openDialog={openDialogExcluir} setOpenDialog={setOpenDialogExcluir} func={deletar} />

    </div>
  )
}