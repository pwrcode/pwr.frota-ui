import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { errorMsg } from '@/services/api';
import ModalFormBody from '@/ui/components/forms/ModalFormBody';
import ModalFormFooter from '@/ui/components/forms/ModalFormFooter';
import { addMotivoParada, getMotivoParadaPorId, updateMotivoParada, type dadosAddEdicaoMotivoParadaType } from '@/services/motivoParada';
import InputLabel from '@/ui/components/forms/InputLabel';
import { ButtonSubmit } from '@/ui/components/buttons/FormButtons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { tiposParada } from '@/services/constants';
import SelectTipoParada from '@/ui/selects/TipoParadaSelect';

type modalPropsType = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    id: number,
    updateList?: (paginaAtual?: number) => Promise<void>,
}

const schema = z.object({
    descricao: z.string().min(1, { error: "Informe a descrição" }),
    tipo: z.object({
        value: z.number().optional(),
        label: z.string().optional()
    }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { error: "Selecione o tipo parada" }),
});

export default function Modal({ open, setOpen, id, updateList }: modalPropsType) {

    const { register, handleSubmit, reset, setFocus, control, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });
    const [loading, setLoading] = useState(false);

    const setValuesPerId = async () => {
        const process = toast.loading("Buscando item...");
        try {
            const item = await getMotivoParadaPorId(Number(id));
            reset({
                descricao: item.descricao,
                tipo: {
                    value: tiposParada.find(t => t.valueLabel === item.tipo)?.value,
                    label: tiposParada.find(t => t.valueLabel === item.tipo)?.label
                }
            }, {keepDefaultValues: true})
            toast.dismiss(process);
        }
        catch (error: Error | any) {
            toast.update(process, { render: errorMsg(error), type: "error", isLoading: false, autoClose: 5000 });
        }
    }

    useEffect(() => {
        reset();
        if (!open) return
        if (id > 0) setValuesPerId();
    }, [id, open]);

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

    const submit = async (dados: dadosAddEdicaoMotivoParadaType) => {
        if (loading) return
        setLoading(true);
        const process = toast.loading("Salvando item...");
        try {
            if (id === 0) {
                const response = await addMotivoParada(dados);
                toast.update(process, { render: response.mensagem, type: "success", isLoading: false, autoClose: 2000 });
            }
            else {
                const response = await updateMotivoParada(id, dados);
                toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
            }
            if (updateList) updateList();
            reset();
            setOpen(false);
        }
        catch (error: Error | any) {
            toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 5000 });
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className='p-0 gap-0 m-4 h-[96%] rounded-lg border shadow-xl'>
                <form autoComplete='off' onSubmit={handleSubmit((data) => submit(data as dadosAddEdicaoMotivoParadaType))} className='flex flex-col h-full'>
                    <SheetHeader className='p-6 rounded-t-lg border-b'>
                        <SheetTitle>{id ? `Editar Tipo Parada #${id}` : "Cadastrar Tipo Parada"}</SheetTitle>
                    </SheetHeader>

                    <ModalFormBody>
                        <InputLabel name="descricao" title="Descrição" register={{ ...register("descricao") }} disabled={loading} />
                        <SelectTipoParada name="tipo" control={control} />
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
    )
}