import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMobile } from '@/hooks/useMobile';
import PageTitle from '@/ui/components/PageTitle';
import TableLoading from '@/ui/components/tables/TableLoading';
import { TableCardHeader } from '@/ui/components/tables/TableCardHeader';
import DropDownMenuItem from '@/ui/components/DropDownMenuItem';
import { TableTop } from '@/ui/components/tables/TableTop';
import { Button } from '@/components/ui/button';
import TableEmpty from '@/ui/components/tables/TableEmpty';
import { deletePerfilAcesso, getPerfilAcesso, type perfilAcessoType, type postListagemPerfilAcessoType } from '@/services/perfilAcesso';
import { delayDebounce, useDebounce } from '@/hooks/useDebounce';
import { toast } from 'react-toastify';
import { errorMsg } from '@/services/api';
import { TableRodape } from '@/ui/components/tables/TableRodape';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';
import { Filters, FiltersGrid } from '@/ui/components/Filters';
import InputLabelValue from '@/ui/components/forms/InputLabelValue';
import { AlertExcluir } from '@/ui/components/dialogs/Alert';

export default function PerfilAcesso({ config }: any) {

  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [perfis, setPerfis] = useState<perfilAcessoType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRegisters, setTotalRegisters] = useState<number>(0);
  const [idEditar, setIdEditar] = useState<number>(0);
  const [idExcluir, setIdExcluir] = useState<number>(0);
  const [openModalForm, setOpenModalForm] = useState<boolean>(false);
  const [openDialogExcluir, setOpenDialogExcluir] = useState<boolean>(false);

  const [pesquisa, setPesquisa] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  const initialPostListagem: postListagemPerfilAcessoType = {
    pageSize: pageSize,
    currentPage: currentPage,
    pesquisa: pesquisa
  };
  const [postListagem, setPostListagem] = useState(initialPostListagem);
  const [filtersOn, setFiltersOn] = useState<boolean>(false);

  useEffect(() => {
    if (currentPage > 0 || filtersOn) changeListFilters(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (pesquisa.length > 0 || filtersOn) changeListFilters();
  }, [pesquisa]);

  const changeListFilters = (page?: number) => {
    setFiltersOn(true);
    setPostListagem({
      pageSize: pageSize,
      currentPage: page ?? 0,
      pesquisa: pesquisa
    });
  }

  useEffect(() => {
    updateList();
  }, []);

  const updateList = async () => {
    const process = toast.loading("Carregando...");
    setLoading(true);
    try {
      const data = await getPerfilAcesso(postListagem);
      setPerfis(data.dados);
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

  const handleClickVerPermissao = (id: number) => {
    navigate(`/perfil-acesso/permissoes/${id}`);
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
      const response = await deletePerfilAcesso(idExcluir);
      setOpenDialogExcluir(false);
      toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
      if (perfis.length === 1 && currentPage > 0) changeListFilters(currentPage - 1);
      else await updateList();
    } catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 2000 });
    }
  }

  const { isMobile, rowStyle, cellStyle, hiddenMobile } = useMobile();

  return (
    <div className={`flex flex-col gap-8 ${config ? "" : "mt-16"} min-h-[calc(100%-4rem)]`}>

      <PageTitle title="Perfil de Acesso" />

      <Filters grid={FiltersGrid.sm2_md3_lg4}>
        <InputLabelValue name="pesquisa" title="Pesquisar" value={pesquisa} setValue={setPesquisa} />
      </Filters>

      {(perfis.length > 0) && (
        <div className="bg-card dark:bg-card py-1 rounded-md shadow-md dark:border">
          <TableTop>
            <Button type="button" variant="success" onClick={handleClickAdicionar}>Adicionar</Button>
          </TableTop>
          <hr />
          <Table>
            <TableHeader>
              <TableRow className="hidden sm:table-row">
                <TableHead className="w-14 text-center">Id</TableHead>
                <TableHead className='w-80'>Descrição</TableHead>
                <TableHead>Qtd. Usuários Vinculados</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {perfis.map(c => (
                <TableRow key={c.id} className={rowStyle}>

                  <TableCardHeader title={c.descricao}>
                    <DropDownMenuItem
                      id={c.id}
                      handleClickEditar={handleClickEditar}
                      handleClickVerPermissao={handleClickVerPermissao}
                      handleClickDeletar={handleClickDeletar}
                    />
                  </TableCardHeader>

                  <TableCell className={cellStyle + "sm:text-center font-medium"}>
                    {isMobile && "Id: "}{c.id}
                  </TableCell>

                  <TableCell className={hiddenMobile + " sm:text-left"}>
                    {c.descricao}
                  </TableCell>

                  <TableCell className={cellStyle + " sm:text-left"}>
                    {isMobile && "Qtd. Usuários Vinculados: "}{c.quantidadeUsuarios}
                  </TableCell>

                  <TableCell className={hiddenMobile + "text-right"}>
                    <DropDownMenuItem
                      id={c.id}
                      handleClickEditar={handleClickEditar}
                      handleClickVerPermissao={handleClickVerPermissao}
                      handleClickDeletar={handleClickDeletar}
                    />
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
          <hr />
          <TableRodape
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalRegisters={totalRegisters}
            lengthCurrentPage={perfis.length}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {perfis.length === 0 && (<>
        {loading ? (
          <TableLoading />
        ) : (
          <TableEmpty icon="shield" handleClickAdicionar={handleClickAdicionar} />
        )}
      </>)}

      <Modal open={openModalForm} setOpen={setOpenModalForm} id={idEditar} updateList={updateList} />

      <AlertExcluir openDialog={openDialogExcluir} setOpenDialog={setOpenDialogExcluir} func={deletar} />

    </div>
  )
}