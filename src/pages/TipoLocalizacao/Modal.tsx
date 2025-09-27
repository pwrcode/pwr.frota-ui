import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { errorMsg } from '@/services/api';
import ModalFormBody from '@/ui/components/forms/ModalFormBody';
import ModalFormFooter from '@/ui/components/forms/ModalFormFooter';
import { addTipoLocalizacao, getTipoLocalizacaoPorId, updateTipoLocalizacao, type dadosAddEdicaoTipoLocalizacaoType } from '@/services/tipoLocalizacao';
import InputLabel from '@/ui/components/forms/InputLabel';
import { ButtonSubmit } from '@/ui/components/buttons/FormButtons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

type modalPropsType = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    id: number,
    updateList?: (paginaAtual?: number) => Promise<void>,
}

export default function Modal({ open, setOpen, id, updateList }: modalPropsType) {

    const schema = z.object({
        descricao: z.string().min(1, { message: "Informe a descrição" }),
        icone: z.string().optional(),
        cor: z.string().optional(),
    });

    const formFunctions = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            descricao: "",
        }
    });
    const { register, handleSubmit, reset, setFocus, formState: { errors } } = formFunctions;

    const [loading, setLoading] = useState(false);

    const setValuesPerId = async () => {
        const process = toast.loading("Buscando item...");
        try {
            const item = await getTipoLocalizacaoPorId(Number(id));
            reset({
                descricao: item.descricao,
                icone: item.icone,
                cor: item.cor
            }, { keepDefaultValues: true })
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

    const submit = async (dados: dadosAddEdicaoTipoLocalizacaoType) => {
        if (loading) return
        setLoading(true);
        const process = toast.loading("Salvando item...");
        try {
            if (id === 0) {
                const response = await addTipoLocalizacao(dados);
                toast.update(process, { render: response.mensagem, type: "success", isLoading: false, autoClose: 2000 });
            }
            else {
                const response = await updateTipoLocalizacao(id, dados);
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
                <form autoComplete='off' onSubmit={handleSubmit((data) => submit(data as dadosAddEdicaoTipoLocalizacaoType))} className='flex flex-col h-full'>
                    <SheetHeader className='p-6 rounded-t-lg border-b'>
                        <SheetTitle>{id ? `Editar TipoLocalizacao #${id}` : "Cadastrar TipoLocalizacao"}</SheetTitle>
                    </SheetHeader>

                    <ModalFormBody>
                        <InputLabel name="descricao" title="Descrição" register={{ ...register("descricao") }} disabled={loading} />
                        <InputLabel name="icone" title="icone" register={{ ...register("icone") }} disabled={loading} />
                        <InputLabel name="cor" title="Cor" register={{ ...register("cor") }} disabled={loading} />
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