import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUsuario, getUsuarios, type postListagemUsuarioType, type usuarioType } from '@/services/usuario';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMobile } from '@/hooks/useMobile';
import PageTitle from '@/ui/components/PageTitle';
import { Filters, FiltersGrid } from '@/ui/components/Filters';
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
import { todosOption } from '@/services/constants';
import AsyncReactSelect from '@/ui/components/forms/AsyncReactSelect';
import { getPerfilAcessoList } from '@/services/perfilAcesso';
import { BadgeAtivo } from '@/ui/components/tables/BadgeAtivo';
import { AlertExcluir } from '@/ui/components/dialogs/Alert';
import { ImageSrc } from '@/ui/components/ImageSrc';
import ModalSenha from './ModalSenha';

export default function Usuario({ config }: any) {

  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [usuarios, setUsuarios] = useState<usuarioType[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRegisters, setTotalRegisters] = useState<number>(0);
  const [excluirId, setExcluirId] = useState<number>(0);
  const [idAlterarSenha, setIdAlterarSenha] = useState<number>(0);
  const [openDialogExcluir, setOpenDialogExcluir] = useState<boolean>(false);
  const [openModalSenha, setOpenModalSenha] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pesquisa, setPesquisa] = useState<string>("");
  const [perfilAcesso, setPerfilAcesso] = useState(todosOption);

  const initialPostListagem: postListagemUsuarioType = {
    pageSize: pageSize,
    currentPage: currentPage,
    pesquisa: "",
    idPerfilAcesso: null
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
    if (perfilAcesso.value != undefined || filtersOn) changeListFilters();
  }, [perfilAcesso]);

  const changeListFilters = (page?: number) => {
    setFiltersOn(true);
    setPostListagem({
      pageSize: pageSize,
      currentPage: page ?? 0,
      pesquisa: pesquisa,
      idPerfilAcesso: perfilAcesso.value != undefined ? perfilAcesso.value : null
    });
  }

  useEffect(() => {
    updateList();
    getPerfis();
  }, []);

  const getPerfis = async (pesquisa?: string) => {
    const data = await getPerfilAcessoList(pesquisa);
    return [todosOption, ...data];
  }

  const updateList = async () => {
    const process = toast.loading("Carregando...");
    setLoading(true);
    try {
      const data = await getUsuarios(postListagem);
      setUsuarios(data.dados);
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
    navigate("/usuario/form");
  }

  const handleClickEditar = (id: number) => {
    navigate(`/usuario/form/${id}`);
  }

  const handleClickDeletar = (id: number) => {
    setExcluirId(id);
    setOpenDialogExcluir(true);
  }

  const handleClickEditarSenha = (id: number) => {
    setIdAlterarSenha(id);
    setOpenModalSenha(true);
  }

  const deletar = async () => {
    const process = toast.loading("Excluindo item...");
    try {
      const response = await deleteUsuario(excluirId);
      setOpenDialogExcluir(false);
      toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
      if (usuarios.length === 1 && currentPage > 0) changeListFilters(currentPage - 1);
      else await updateList();
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 2000 });
    }
  }

  const { isMobile, rowStyle, cellStyle, hiddenMobile } = useMobile();

  return (
    <div className={`flex flex-col gap-8 ${config ? "" : "mt-16"} min-h-[calc(100%-4rem)]`}>

      <PageTitle title="Usuário" />

      <Filters grid={FiltersGrid.sm2_md3_lg4}>
        <InputLabelValue name="pesquisa" title="Pesquisar" value={pesquisa} setValue={setPesquisa} />
        <AsyncReactSelect
          name="perfil"
          title="Perfil de Acesso"
          options={[]}
          asyncFunction={getPerfis}
          value={perfilAcesso}
          setValue={setPerfilAcesso}
        />
      </Filters>

      {(usuarios.length > 0) && (
        <div className="bg-card dark:bg-card py-1 rounded-md shadow-md dark:border">
          <TableTop>
            <Button type="button" variant="success" onClick={handleClickAdicionar}>Adicionar</Button>
          </TableTop>
          <hr />
          <Table>
            <TableHeader>
              <TableRow className="hidden sm:table-row">
                <TableHead className='w-100'>Usuário</TableHead>
                <TableHead className='w-100'>Perfil</TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map(c => {
                return (
                  <TableRow key={c.id} className={rowStyle}>

                    <TableCardHeader>
                      <div className="flex flex-row gap-4">
                        <div className="size-[40px] flex justify-center items-center">
                          <ImageSrc idArquivo={c.idArquivoFoto ?? undefined} alt="Usuário" typeImg={1} style="h-full object-contain" />
                        </div>
                        <div className="flex flex-col justify-center min-w-[100px]">
                          <span className="font-semibold">{c.nome}</span>
                        </div>
                      </div>
                      <div className="flex flex-row gap-1 items-center">
                        <BadgeAtivo ativo={c.ativo} />
                        <DropDownMenuItem id={c.id} handleClickEditar={handleClickEditar} handleClickDeletar={handleClickDeletar} />
                      </div>
                    </TableCardHeader>

                    <TableCell className={hiddenMobile + "sm:text-center font-medium"}>
                      <div className="flex flex-row gap-4">
                        <div className="size-[40px] flex justify-center items-center">
                          <ImageSrc idArquivo={c.idArquivoFoto ?? undefined} alt="Usuário" typeImg={1} style="h-full object-contain" />
                        </div>
                        <div className="flex flex-col justify-center items-start min-w-[100px]">
                          <span className="font-semibold">{c.id} - {c.nome}</span>
                        </div>
                      </div>
                    </TableCell>

                    {isMobile && (
                      <TableCell className={cellStyle}>
                        Id: {c.id}
                      </TableCell>
                    )}

                    <TableCell className={cellStyle + " sm:text-left"}>
                      {isMobile && "Perfil: "}{c.descricaoPerfil}
                    </TableCell>

                    <TableCell className={hiddenMobile}>
                      <BadgeAtivo ativo={c.ativo} />
                    </TableCell>

                    <TableCell className={hiddenMobile + "text-right w-[100px]"}>
                      <DropDownMenuItem id={c.id} handleClickEditar={handleClickEditar} handleClickDeletar={handleClickDeletar} handleClickEditarSenha={handleClickEditarSenha} />
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
            lengthCurrentPage={usuarios.length}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {usuarios.length === 0 && <>
        {loading ? (
          <TableLoading />
        ) : (
          <TableEmpty  py='py-20' icon="user-cog" handleClickAdicionar={handleClickAdicionar} />
        )}
      </>}

      <ModalSenha open={openModalSenha} setOpen={setOpenModalSenha} id={Number(idAlterarSenha)} />

      <AlertExcluir openDialog={openDialogExcluir} setOpenDialog={setOpenDialogExcluir} func={deletar} />

    </div>
  )
}