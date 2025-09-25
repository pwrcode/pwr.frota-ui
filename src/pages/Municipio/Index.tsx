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
import Modal from './Modal';
import { getMunicipios, type municipioType, type postListagemMunicipioType } from '@/services/municipio';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import SelectUf from '@/ui/selects/UfSelect';
import InputFiltroPesquisa from '@/ui/components/forms/InputFiltroPesquisa';

const schema = z.object({
  idUf: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }).optional(),
  pesquisa: z.string().optional(),
})

export default function Municipio() {

  const { getValues, watch, control } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      idUf: undefined,
      pesquisa: ""
    }
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [municipios, setMunicipios] = useState<municipioType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRegisters, setTotalRegisters] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [idVisualizar, setIdVisualizar] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

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

      const filtros: postListagemMunicipioType = {
        pageSize: pageSize,
        currentPage: paginaAtual,
        pesquisa: getValues("pesquisa") || "",
        idUf: getValues("idUf")?.value || null,
      }

      const data = await getMunicipios(filtros);
      setMunicipios(data.dados);
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

  const handleClickVisualizar = (id: number) => {
    setIdVisualizar(id);
    setModalOpen(true);
  }

  const { isMobile, rowStyle, cellStyle, hiddenMobile } = useMobile();

  return (
    <div className="flex flex-col gap-8 mt-16 min-h-[calc(100%-4rem)]">

      <PageTitle title="Municípios" />

      <Filters grid={FiltersGrid.sm2_md3_lg4}>
        <InputFiltroPesquisa name="pesquisa" title="Pesquisar" control={control} />
        <SelectUf control={control} />
      </Filters>

      {(municipios.length > 0) && (
        <div className="bg-card dark:bg-card py-1 rounded-md shadow-md dark:border">
          <Table>
            <TableHeader>
              <TableRow className="hidden sm:table-row">
                <TableHead className="w-16 text-center">Id</TableHead>
                <TableHead className='w-70'>Município</TableHead>
                <TableHead>UF</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {municipios.map(c => {
                return (
                  <TableRow key={c.id} className={rowStyle}>

                    <TableCardHeader title={c.descricao}>
                      <DropDownMenuItem id={c.id} handleClickVisualizar={handleClickVisualizar} />
                    </TableCardHeader>

                    <TableCell className={cellStyle + "sm:text-center"}>
                      {isMobile && "Id: "}{c.id}
                    </TableCell>

                    <TableCell className={hiddenMobile + "sm:text-left font-medium"}>
                      {c.descricao}
                    </TableCell>

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "UF: "}{c.descricaoUf}
                    </TableCell>

                    <TableCell className={hiddenMobile + "text-right w-[100px]"}>
                      <DropDownMenuItem id={c.id} handleClickVisualizar={handleClickVisualizar} />
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
            lengthCurrentPage={municipios.length}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {municipios.length === 0 && <>
        {loading ? (
          <TableLoading />
        ) : (
          <TableEmpty py='py-20' icon="map-pin" />
        )}
      </>}

      <Modal id={idVisualizar} open={modalOpen} setOpen={setModalOpen} />

    </div>
  )
}