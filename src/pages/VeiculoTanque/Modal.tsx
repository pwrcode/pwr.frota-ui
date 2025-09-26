import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { errorMsg } from '@/services/api';
import ModalFormBody from '@/ui/components/forms/ModalFormBody';
import ModalFormFooter from '@/ui/components/forms/ModalFormFooter';
import { addVeiculoTanque, getVeiculoTanquePorId, updateVeiculoTanque, type dadosAddEdicaoVeiculoTanqueType } from '@/services/veiculoTanque';
import { ButtonSubmit } from '@/ui/components/buttons/FormButtons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { tiposTanque, type optionType } from '@/services/constants';
import InputLabel from '@/ui/components/forms/InputLabel';
import SelectTipoTanque from '@/ui/selects/TipoTanqueSelect';

type modalPropsType = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    id: number,
    updateList?: (filter: boolean) => void,
    idVeiculo?: number,
    tanques?: dadosAddEdicaoVeiculoTanqueType[],
    setTanques?: any,
    selecionarTanque?: (tanque: optionType) => void,
}

const schema = z.object({
    idVeiculo: z.object({
        label: z.string().optional(),
        value: z.number().optional().nullable()
    }).optional().transform(t => t && t.value ? t.value : undefined),
    tipoTanque: z.object({
        label: z.string().optional(),
        value: z.number().optional()
    }, { message: "Selecione o tipo tanque" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o tipo tanque" }),
    capacidade: z.string().optional(),
});

export default function Modal({ open, setOpen, id, updateList, idVeiculo, tanques, setTanques, selecionarTanque }: modalPropsType) {

    const { handleSubmit, setValue, reset, setFocus, register, control, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });
    const [loading, setLoading] = useState(false);

    const setValuesPerId = async () => {
        if (!idVeiculo) {
            if(tanques) setValue("tipoTanque", { value: tiposTanque.find(t => t.value === tanques[id].tipoTanque)?.value, label: tiposTanque.find(t => t.value === tanques[id].tipoTanque)?.label });
            if(tanques) setValue("capacidade", tanques[id].capacidade.toString());
            return
        }
        const process = toast.loading("Buscando item...");
        try {
            if (id === 0) return
            const item = await getVeiculoTanquePorId(Number(id));
            if (idVeiculo) setValue("idVeiculo", { value: item.idVeiculo, label: item.descricaoVeiculo });
            setValue("tipoTanque", { value: tiposTanque.find(t => t.valueLabel === item.tipoTanque)?.value, label: tiposTanque.find(t => t.valueLabel === item.tipoTanque)?.label });
            setValue("capacidade", item.capacidade.toString());
            toast.dismiss(process);
        }
        catch (error: Error | any) {
            toast.update(process, { render: errorMsg(error), type: "error", isLoading: false, autoClose: 5000 });
        }
    }

    useEffect(() => {
        reset();
        if (!open) return
        if (id >= 0) setValuesPerId();
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

    const submit = async (dados: dadosAddEdicaoVeiculoTanqueType) => {
        if (loading) return
        if (!idVeiculo) {
            if (id === -1) {
                let tan = tanques;
                if(tan) tan.push(dados)
                setTanques(tan);
            }
            else {
                let tan = tanques;
                if(tan) tan[id] = dados;
                setTanques(tan);
            }
            reset();
            setOpen(false);
            return
        }
        setLoading(true);
        const process = toast.loading("Salvando item...");
        try {
            const postPut: dadosAddEdicaoVeiculoTanqueType = {
                idVeiculo: Number(idVeiculo) ?? (dados.idVeiculo ?? null),
                tipoTanque: (dados.tipoTanque ?? null),
                capacidade: +dados.capacidade,
            };
            if (id === -1) {
                const response = await addVeiculoTanque(postPut);
                toast.update(process, { render: response.mensagem, type: "success", isLoading: false, autoClose: 2000 });
                const tan = await getVeiculoTanquePorId(response.id)
                if (selecionarTanque) selecionarTanque({ label: tan.descricao, value: response.id });
            }
            else {
                const response = await updateVeiculoTanque(id, postPut);
                toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
                const tan = await getVeiculoTanquePorId(id)
                if (selecionarTanque) selecionarTanque({ label: tan.descricao, value: id });
            }
            if (updateList) updateList(true);
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
                <form autoComplete='off' className='flex flex-col h-full'>
                    <SheetHeader className='p-6 rounded-t-lg border-b'>
                        <SheetTitle>{id && id != -1 ? `Editar Tanque #${id}` : "Cadastrar Tanque"}</SheetTitle>
                    </SheetHeader>

                    <ModalFormBody>
                        <SelectTipoTanque control={control} />
                        <InputLabel name='capacidade' title='Capacidade' register={{...register("capacidade")}}  type='number' step='0.01'/>
                    </ModalFormBody>

                    <ModalFormFooter>
                        <Button variant="outline" type="button" onClick={() => setOpen(false)} disabled={loading}>Cancelar</Button>
                        <ButtonSubmit loading={loading} onClick={handleSubmit((data) => submit(data as unknown as dadosAddEdicaoVeiculoTanqueType))}>
                            Salvar
                        </ButtonSubmit>
                    </ModalFormFooter>
                </form>

            </SheetContent>
        </Sheet>
    )
}