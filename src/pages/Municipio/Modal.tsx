import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { errorMsg } from '@/services/api';
import ModalFormBody from '@/ui/components/forms/ModalFormBody';
import ModalFormFooter from '@/ui/components/forms/ModalFormFooter';
import InputLabelValue from '@/ui/components/forms/InputLabelValue';
import { getMunicipioPorId } from '@/services/municipio';

type modalPropsType = {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  id: number
}

export default function Modal({ open, setOpen, id }: modalPropsType) {

  const [descricao, setDescricao] = useState<string>("");
  const [descricaoUf, setDescricaoUf] = useState<string>("");

  const setValuesPerId = async () => {
    const process = toast.loading("Buscando item...");
    try {
      const item = await getMunicipioPorId(Number(id));
      setDescricao(item.descricao);
      setDescricaoUf(item.descricaoUf);
      toast.dismiss(process);
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error), type: "error", isLoading: false, autoClose: 5000 });
    }
  }

  useEffect(() => {
    if (!open) return
    if (id > 0) setValuesPerId();
    else setOpen(false);
  }, [id, open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className='p-0 gap-0 m-4 h-[96%] rounded-lg border shadow-xl'>

        <div className='flex flex-col h-full'>
          <SheetHeader className='p-6 rounded-t-lg border-b'>
            <SheetTitle>Município #{id}</SheetTitle>
          </SheetHeader>
          
          <ModalFormBody>
            <InputLabelValue name="descricaoUf" title="UF" value={descricaoUf} readOnly />
            <InputLabelValue name="descricao" title="Descrição" value={descricao} readOnly />
          </ModalFormBody>

          <ModalFormFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Fechar</Button>
          </ModalFormFooter>
        </div>

      </SheetContent>
    </Sheet>
  )
}