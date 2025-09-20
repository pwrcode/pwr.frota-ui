import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { errorMsg } from '@/services/api';
import ModalFormBody from '@/ui/components/forms/ModalFormBody';
import ModalFormFooter from '@/ui/components/forms/ModalFormFooter';
import { addBairro, getBairroPorId, updateBairro, type dadosAddEdicaoBairroType } from '@/services/bairro';
import InputLabel from '@/ui/components/forms/InputLabel';
import AsyncReactSelect from '@/ui/components/forms/AsyncReactSelect';
import { ButtonSubmit } from '@/ui/components/buttons/FormButtons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { getMunicipioList, getMunicipioPorId } from '@/services/municipio';
import type { optionType } from '@/services/constants';

type modalPropsType = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    id: number,
    updateList?: (filter: boolean) => void,
    selecionarBairro?: (bairro: optionType) => void,
    idMunicipio?: number,
}

const schema = z.object({
    descricao: z.string().min(1, { message: "Informe a descrição" }),
    idMunicipio: z.object({
        label: z.string().optional(),
        value: z.number().optional()
    }, { message: "Selecione o munícipio" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o munícipio" }),
});

export default function Modal({ open, setOpen, id, updateList, selecionarBairro, idMunicipio }: modalPropsType) {

    const { register, handleSubmit, setValue, reset, setFocus, control, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });
    const [loading, setLoading] = useState(false);

    const setValuesPerId = async () => {
        const process = toast.loading("Buscando item...");
        try {
            const item = await getBairroPorId(Number(id));
            setValue("descricao", item.descricao);
            if (item.idMunicipio) setValue("idMunicipio", { value: item.idMunicipio, label: item.descricaoMunicipio });
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
        if (idMunicipio) {
            const setMunicipio = async () => {
                const mun = await getMunicipioPorId(idMunicipio);
                setValue("idMunicipio", { value: mun.id, label: mun.descricao });
            }
            setMunicipio();
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

    const getMunicipios = async (pesquisa?: string) => {
        const data = await getMunicipioList(pesquisa, undefined);
        return data;
    }

    const submit = async (dados: dadosAddEdicaoBairroType) => {
        if (loading) return
        setLoading(true);
        const process = toast.loading("Salvando item...");
        try {
            const postPut: dadosAddEdicaoBairroType = {
                descricao: dados.descricao,
                idMunicipio: dados.idMunicipio ?? null
            };
            if (id === 0) {
                const response = await addBairro(postPut);
                toast.update(process, { render: response.mensagem, type: "success", isLoading: false, autoClose: 2000 });
                if (selecionarBairro) selecionarBairro({ label: dados.descricao, value: response.id });
            }
            else {
                const response = await updateBairro(id, postPut);
                toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
                if (selecionarBairro) selecionarBairro({ label: dados.descricao, value: id });
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
                <form autoComplete='off' onSubmit={handleSubmit((data) => submit(data as dadosAddEdicaoBairroType))} className='flex flex-col h-full'>
                    <SheetHeader className='p-6 rounded-t-lg border-b'>
                        <SheetTitle>{id ? `Editar Bairro #${id}` : "Cadastrar Bairro"}</SheetTitle>
                    </SheetHeader>

                    <ModalFormBody>
                        <InputLabel name="descricao" title="Descrição" register={{ ...register("descricao") }} disabled={loading} />
                        <AsyncReactSelect name="idMunicipio" title="Munícipio" control={control} asyncFunction={getMunicipios} options={[]} isClearable />
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