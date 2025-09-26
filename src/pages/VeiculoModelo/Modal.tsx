import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { errorMsg } from '@/services/api';
import ModalFormBody from '@/ui/components/forms/ModalFormBody';
import ModalFormFooter from '@/ui/components/forms/ModalFormFooter';
import { addVeiculoModelo, getVeiculoModeloPorId, updateVeiculoModelo, type dadosAddEdicaoVeiculoModeloType } from '@/services/veiculoModelo';
import InputLabel from '@/ui/components/forms/InputLabel';
import { ButtonSubmit } from '@/ui/components/buttons/FormButtons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { getVeiculoMarcaPorId } from '@/services/veiculoMarca';
import type { optionType } from '@/services/constants';
import SelectVeiculoMarca from '@/ui/selects/VeiculoMarcaSelect';

type modalPropsType = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    id: number,
    updateList?: (paginaAtual?: number) => Promise<void>,
    selecionarModelo?: (modelo: optionType) => void,
    idMarca?: number,
}

const schema = z.object({
    descricao: z.string().min(1, { message: "Informe a descrição" }),
    idVeiculoMarca: z.object({
        label: z.string().optional(),
        value: z.number().optional()
    }, { message: "Selecione o veículo marca" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o veículo marca" }),
});

export default function Modal({ open, setOpen, id, updateList, selecionarModelo, idMarca }: modalPropsType) {

    const { register, handleSubmit, setValue, reset, setFocus, control, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });
    const [loading, setLoading] = useState(false);

    const setValuesPerId = async () => {
        const process = toast.loading("Buscando item...");
        try {
            const item = await getVeiculoModeloPorId(Number(id));
            setValue("descricao", item.descricao);
            if (item.idVeiculoMarca) setValue("idVeiculoMarca", { value: item.idVeiculoMarca, label: item.descricaoVeiculoMarca });
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
        if (idMarca) {
            const setMarca = async () => {
                const mar = await getVeiculoMarcaPorId(idMarca);
                setValue("idVeiculoMarca", { value: mar.id, label: mar.descricao });
            }
            setMarca();
        }
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

    const submit = async (dados: dadosAddEdicaoVeiculoModeloType) => {
        if (loading) return
        setLoading(true);
        const process = toast.loading("Salvando item...");
        try {
            const postPut: dadosAddEdicaoVeiculoModeloType = {
                descricao: dados.descricao,
                idVeiculoMarca: dados.idVeiculoMarca,
            };
            if (id === 0) {
                const response = await addVeiculoModelo(postPut);
                toast.update(process, { render: response.mensagem, type: "success", isLoading: false, autoClose: 2000 });
                if(selecionarModelo) selecionarModelo({ value: response.id, label: dados.descricao.toUpperCase()})
            }
            else {
                const response = await updateVeiculoModelo(id, postPut);
                toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
                if(selecionarModelo) selecionarModelo({ value: id, label: dados.descricao.toUpperCase()})
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
                <form autoComplete='off' onSubmit={handleSubmit((data) => submit(data as dadosAddEdicaoVeiculoModeloType))} className='flex flex-col h-full'>
                    <SheetHeader className='p-6 rounded-t-lg border-b'>
                        <SheetTitle>{id ? `Editar Veículo Modelo #${id}` : "Cadastrar Veículo Modelo"}</SheetTitle>
                    </SheetHeader>

                    <ModalFormBody>
                        <InputLabel name="descricao" title="Descrição" register={{ ...register("descricao") }} disabled={loading} />
                        <SelectVeiculoMarca control={control} />
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