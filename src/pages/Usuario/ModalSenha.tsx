import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ModalFormBody from '@/ui/components/forms/ModalFormBody';
import ModalFormFooter from '@/ui/components/forms/ModalFormFooter';
import { ButtonSubmit } from '@/ui/components/buttons/FormButtons';
import InputLabel from '@/ui/components/forms/InputLabel';
import { alterarSenhaUsuario, type novaSenhaType } from '@/services/usuario';
import { errorMsg } from '@/services/api';

const schema = z.object({
  novaSenha: z.string().min(1, { message: "Informe a senha" }),
  confirmacaoNovaSenha: z.string().min(1, { message: "Confirme a senha" })
});

type modalPropsType = {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  id: string | number
}

export default function ModalSenha({ open, setOpen, id }: modalPropsType) {

  const { register, handleSubmit, reset, setFocus, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Object.entries(errors).forEach(([key, error]) => {
      if (error?.message) {
        toast.error(`${error.message}`);
        // @ts-ignore
        setFocus(key);
        return
      }
    });
  }, [errors]);

  const submit = async (dados: novaSenhaType) => {
    if (loading) return
    setLoading(true);
    if (dados.novaSenha !== dados.confirmacaoNovaSenha) {
      setLoading(false);
      toast.error("A senhas não condizem", { autoClose: 4000 });
      return
    }
    const process = toast.loading("Alterando senha...");
    try {
      const put = {
        novaSenha: dados.novaSenha,
        confirmacaoNovaSenha: dados.confirmacaoNovaSenha,
      };
      const response = await alterarSenhaUsuario(Number(id), put);
      toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
      reset();
      setOpen(false);
    } catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 5000 });
    }
    setLoading(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className='p-0 gap-0 m-4 h-[96%] rounded-lg border shadow-xl'>
        <form autoComplete='off' onSubmit={handleSubmit((data) => submit(data as novaSenhaType))} className='flex flex-col h-full'>

          <SheetHeader className='p-6 rounded-t-lg border-b'>
            <SheetTitle>Alterar Senha</SheetTitle>
          </SheetHeader>

          <ModalFormBody>
            <InputLabel
              name="novaSenha" title="Senha" type="password" register={{ ...register("novaSenha") }} disabled={loading}
            />
            <InputLabel
              name="confirmacaoNovaSenha" title="Confirmar senha" type="password" register={{ ...register("confirmacaoNovaSenha") }} disabled={loading}
            />
          </ModalFormBody>

          <ModalFormFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <ButtonSubmit loading={loading}>
              Salvar
            </ButtonSubmit>
          </ModalFormFooter>

        </form>
      </SheetContent>
    </Sheet>
  )
}