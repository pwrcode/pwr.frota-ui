import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock, LockOpen } from "lucide-react";
import { toast } from "react-toastify";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import ModalFormBody from "@/ui/components/forms/ModalFormBody";
import { ButtonSubmit } from "@/ui/components/buttons/FormButtons";
import ModalFormFooter from "@/ui/components/forms/ModalFormFooter";
import { errorMsg } from "@/services/api";
import { addPerfilAcessoItem, type dadosAcessoItemType, type permissao, getFuncionalidade } from "@/services/perfilAcessoItem";


type ModalAcessoProps = {
  open: boolean,
  setOpen: (open: boolean) => void,
  idPerfil: number,
  idFuncionalidade: number,
  fetchAcessos: () => void
};

export default function ModalAcesso({ open, setOpen, idPerfil, idFuncionalidade, fetchAcessos }: ModalAcessoProps) {

  const { handleSubmit, reset, setFocus, formState: { errors } } = useForm<dadosAcessoItemType>();
  const [loading, setLoading] = useState(false);
  const [descricaoFuncionalidade, setDescricaoFuncionalidade] = useState<string>("");
  const [permissoes, setPermissoes] = useState<permissao[]>([]);

  useEffect(() => {
    if (open && idPerfil && idFuncionalidade) {
      carregarPermissoes(idPerfil, idFuncionalidade);
    }
  }, [open, idPerfil, idFuncionalidade]);

  const carregarPermissoes = async (idPerfil: number, idFuncionalidade: number) => {
    const process = toast.loading("Carregando acessos da função...");
    try {
      const data = await getFuncionalidade(idPerfil, idFuncionalidade);
      setDescricaoFuncionalidade(data.descricaoFuncionalidade ?? "");
      setPermissoes(data.permissoes || []);
      toast.dismiss(process);
    } catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const atualizarAcesso = (index: number, checked: boolean) => {
    setPermissoes((prevPermissoes) =>
      prevPermissoes.map((funcao, i) =>
        i === index ? { ...funcao, liberado: checked } : funcao
      )
    );
  };

  const marcarTodos = () => {
    setPermissoes((prev) => prev.map((funcao) => ({ ...funcao, liberado: true })));
  };

  const desmarcarTodos = () => {
    setPermissoes((prev) => prev.map((funcao) => ({ ...funcao, liberado: false })));
  };

  useEffect(() => {
    Object.entries(errors).forEach(([key, error]) => {
      if (error?.message) {
        toast.error(`${error.message}`);
        setFocus(key as "idPerfil" | "idFuncionalidade" | "acessos" | `acessos.${number}`);
        return
      }
    });
  }, [errors]);

  const submit = async () => {
    if (loading) return
    setLoading(true);
    const process = toast.loading("Salvando item...");
    try {
      const acessosMarcados = permissoes.filter((f) => f.liberado).map((f) => f.descricao);
      const post = {
        idPerfil: idPerfil,
        idFuncionalidade: idFuncionalidade,
        acessos: JSON.stringify(acessosMarcados)
      };
      const response = await addPerfilAcessoItem(post);
      toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
      reset();
      fetchAcessos();
      setOpen(false);
    } catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 5000 });
    }
    setLoading(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className='p-0 gap-0 m-4 h-[96%] rounded-lg border shadow-xl'>
        <form autoComplete='off' onSubmit={handleSubmit(submit)} className='flex flex-col h-full'>
          <SheetHeader className='p-6 rounded-t-lg border-b'>
            <SheetTitle>Permissões de Acesso</SheetTitle>
          </SheetHeader>

          <ModalFormBody>

            <span className="font-semibold size-md">{descricaoFuncionalidade}</span>

            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <Button type="button" onClick={marcarTodos} variant="outline" className="w-1/2 text-green-700 font-semibold hover:text-green-700 dark:bg-green-600 dark:hover:bg-green-700 dark:text-foreground">
                <LockOpen />
                Liberar Todos
              </Button>
              <Button type="button" onClick={desmarcarTodos} variant="outline" className="w-1/2 text-red-700 font-semibold hover:text-red-700 dark:bg-red-600 dark:hover:bg-red-700 dark:text-foreground">
                <Lock />
                Bloquear Todos
              </Button>
            </div>

            <div className="space-y-4">
              {permissoes.map((funcao, index) => (
                <div key={funcao.descricao} className="flex items-center justify-between">
                  <span>{funcao.descricao}</span>
                  <Switch
                    className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                    checked={funcao.liberado}
                    onCheckedChange={(checked) => atualizarAcesso(index, Boolean(checked))}
                    disabled={loading}
                  />
                </div>
              ))}
            </div>
          </ModalFormBody>

          <ModalFormFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)} disabled={loading}>Cancelar</Button>
            <ButtonSubmit loading={loading}>
              Salvar
            </ButtonSubmit>
          </ModalFormFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
