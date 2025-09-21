import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { errorMsg } from "@/services/api";
import { getPerfilAcessoPorId } from "@/services/perfilAcesso";
import { type acessoItemType, bloquearTodosAcessos, liberarTodosAcessos, listarAcessosPerfil } from "@/services/perfilAcessoItem";
import { Filters } from "@/ui/components/Filters";
import Header from "@/ui/components/PageTitle";
import { ChevronRight, Lock, LockOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AlertAcessos from "./AlertAcessos";
import ModalAcesso from "./ModalAcesso";
import { useMobile } from "@/hooks/useMobile";
import { TableCardHeader } from "@/ui/components/tables/TableCardHeader";

export default function PerfilAcessoPermissoes() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [liberando, setLiberando] = useState(false);
  const [bloqueando, setBloqueando] = useState(false);
  const [idFuncionalidade, setIdFuncionalidade] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [acessos, setAcessos] = useState<acessoItemType[]>([]);
  const [descricaoPerfil, setDescricaoPerfil] = useState<string>("");

  useEffect(() => {
    if (isNaN(Number(id))) {
      navigate("/perfil-acesso");
      return
    }
    getDescricaoPerfil();
    getAcessos();
  }, [id]);

  const getDescricaoPerfil = async () => {
    try {
      const data = await getPerfilAcessoPorId(Number(id));
      setDescricaoPerfil(data.descricao);
    } catch (error: any) {
      toast.error(errorMsg(error, null), { autoClose: 4000 });
    }
  }

  const getAcessos = async () => {
    setAcessos([]);
    const process = toast.loading("Carregando acessos...");
    try {
      const data = await listarAcessosPerfil(Number(id));
      setAcessos(data);
      toast.dismiss(process);
    } catch (error: any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const openModal = (id: number) => {
    setIdFuncionalidade(id);
    setModalOpen(true);
  };

  const liberarAcessos = async (idPerfil: number) => {
    if (liberando) return
    setLiberando(true);
    const process = toast.loading("Liberando todos os itens...");
    try {
      const response = await liberarTodosAcessos(idPerfil);
      toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
      getAcessos();
    } catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 5000 });
    }
    setLiberando(false);
  }

  const bloquearAcessos = async (idPerfil: number) => {
    if (bloqueando) return
    setBloqueando(true);
    const process = toast.loading("Bloquear todos os itens...");
    try {
      const response = await bloquearTodosAcessos(idPerfil);
      toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
      getAcessos();
    } catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 5000 });
    }
    setBloqueando(false);
  }

  const [openDialogFechar, setOpenDialogFechar] = useState<boolean>(false);
  const [modalTexto, setModalTexto] = useState<string>("");
  const [acaoModal, setAcaoModal] = useState<() => void>(() => () => { });
  const [cor, setCor] = useState<string>("");

  const confirmarLiberacao = (idPerfil: number) => {
    setModalTexto("Deseja realmente liberar todos os acessos?");
    setCor("bg-green-600 hover:bg-green-600")
    setAcaoModal(() => () => liberarAcessos(idPerfil));
    setOpenDialogFechar(true);
  };

  const confirmarBloqueio = (idPerfil: number) => {
    setModalTexto("Deseja realmente bloquear todos os acessos?");
    setCor("bg-red-600 hover:bg-red-600")
    setAcaoModal(() => () => bloquearAcessos(idPerfil));
    setOpenDialogFechar(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SEM ACESSO":
        return "bg-red-100 hover:bg-red-100 text-red-700 dark:bg-red-500 dark:hover:bg-red-500 dark:text-foreground";
      case "ACESSO PARCIAL":
        return "bg-yellow-100 hover:bg-yellow-100 text-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-500 dark:text-foreground";
      case "ACESSO TOTAL":
        return "bg-green-100 hover:bg-green-100 text-green-700 dark:bg-green-500 dark:hover:bg-green-500 dark:text-foreground";
      default:
        return "bg-gray-100 hover:bg-gray-100 text-black dark:bg-gray-500 dark:hover:bg-gray-500 dark:text-foreground";
    }
  };

  const { isMobile, hiddenMobile, rowStyle, cellStyle } = useMobile();

  return (
    <div className="w-full mt-16 flex flex-col gap-4">

      <Header title="Perfil de Acesso" />

      <Filters>
      <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <p className="font-semibold">{descricaoPerfil.charAt(0).toUpperCase() + descricaoPerfil.slice(1)}</p>
        {id ? (
          <div className="flex justify-between gap-2">
            <Button
              onClick={() => confirmarLiberacao(Number(id))}
              className="w-1/2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 dark:text-foreground text-white"
              disabled={liberando || bloqueando}
            >
              <LockOpen />
              Liberar Todos
            </Button>

            <Button
              onClick={() => confirmarBloqueio(Number(id))}
              className="w-1/2 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 dark:text-foreground text-white"
              disabled={liberando || bloqueando}
            >
              <Lock />
              Bloquear Todos
            </Button>
          </div>
        ) : <></>
        }
      </div>
      </Filters>

      <div className="bg-white rounded-md shadow-md dark:bg-card">
        {acessos.length > 0 && <>
          <Table>
            <TableHeader>
              <TableRow className="hidden sm:table-row">
                <TableHead className="w-[80px] text-center">Id</TableHead>
                <TableHead className="text-left">Descrição</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {acessos.map((acesso) => (
                <TableRow key={acesso.idFuncionalidade} onClick={() => openModal(acesso.idFuncionalidade)} className={rowStyle + "cursor-pointer"}>

                  <TableCardHeader title={acesso.descricaoFuncionalidade}>
                    <button className="m-2" onClick={() => openModal(acesso.idFuncionalidade)} disabled={liberando || bloqueando} >
                      <ChevronRight size={20} />
                    </button>
                  </TableCardHeader>

                  <TableCell className={cellStyle}>
                    <div className="sm:m-4">{isMobile && "Id: "} {acesso.idFuncionalidade}</div>
                  </TableCell>

                  <TableCell className={hiddenMobile}>
                    {acesso.descricaoFuncionalidade}
                  </TableCell>

                  <TableCell className={cellStyle + "text-left w-[100px]"}>
                    <Badge className={getStatusColor(acesso.status) + " text-nowrap"}>
                      {acesso.status}
                    </Badge>
                  </TableCell>

                  <TableCell className={hiddenMobile + "text-right w-[100px]"}>
                    <button className="mr-4" onClick={() => openModal(acesso.id)} disabled={liberando || bloqueando} >
                      <ChevronRight size={20} />
                    </button>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>}
      </div>

      {idFuncionalidade && (
        <ModalAcesso
          open={modalOpen}
          setOpen={setModalOpen}
          idPerfil={Number(id)}
          idFuncionalidade={idFuncionalidade}
          fetchAcessos={getAcessos}
        />
      )}

      <AlertAcessos
        openDialogFechar={openDialogFechar}
        setOpenDialogFechar={setOpenDialogFechar}
        acesso={() => {
          acaoModal();
          setOpenDialogFechar(false);
        }}
        texto={modalTexto}
        cor={cor}
      />

    </div>
  )
}