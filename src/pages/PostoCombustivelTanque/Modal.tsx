import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { errorMsg } from '@/services/api';
import ModalFormBody from '@/ui/components/forms/ModalFormBody';
import ModalFormFooter from '@/ui/components/forms/ModalFormFooter';
import { addPostoCombustivelTanque, getPostoCombustivelTanquePorId, updatePostoCombustivelTanque, type dadosAddEdicaoPostoCombustivelTanqueType } from '@/services/postoCombustivelTanque';
import { ButtonSubmit } from '@/ui/components/buttons/FormButtons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import AsyncReactSelect from '@/ui/components/forms/AsyncReactSelect';
import { tiposTanque, type optionType } from '@/services/constants';
import InputLabel from '@/ui/components/forms/InputLabel';
import { getProdutoAbastecimentoList } from '@/services/produtoAbastecimento';

type modalPropsType = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    id: number,
    updateList?: (filter: boolean) => void,
    idPostoCombustivel?: number,
    tanques?: dadosAddEdicaoPostoCombustivelTanqueType[],
    setTanques?: any,
    selecionarTanque?: (tanque: optionType) => void,
}

const schema = z.object({
    idPostoCombustivel: z.object({
        label: z.string().optional(),
        value: z.number().optional().nullable()
    }).optional().transform(t => t && t.value ? t.value : undefined),
    idProdutoAbastecimento: z.object({
        label: z.string().optional(),
        value: z.number().optional()
    }, { message: "Selecione o tipo tanque" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o tipo tanque" }),
    capacidade: z.string().optional(),
    capacidadeLitros: z.string().optional(),
    estoqueMinimoLitros: z.string().optional(),
});

export default function Modal({ open, setOpen, id, updateList, idPostoCombustivel, tanques, setTanques, selecionarTanque }: modalPropsType) {

    const { handleSubmit, setValue, reset, setFocus, register, control, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });
    const [loading, setLoading] = useState(false);

    const setValuesPerId = async () => {
        if (!idPostoCombustivel) {
            if (tanques) setValue("idProdutoAbastecimento", { value: tiposTanque.find(t => t.value === tanques[id].idProdutoAbastecimento)?.value, label: tiposTanque.find(t => t.value === tanques[id].idProdutoAbastecimento)?.label });
            if (tanques) setValue("capacidadeLitros", tanques[id].capacidadeLitros.toString());
            if (tanques) setValue("estoqueMinimoLitros", tanques[id].estoqueMinimoLitros.toString());
            return
        }
        const process = toast.loading("Buscando item...");
        try {
            if (id === 0) return
            const item = await getPostoCombustivelTanquePorId(Number(id));
            if (idPostoCombustivel) setValue("idPostoCombustivel", { value: item.idPostoCombustivel, label: item.descricaoPostoCombustivel });
            setValue("idProdutoAbastecimento", { value: item.idProdutoAbastecimento || undefined, label: item.descricaoProdutoAbastecimento });
            setValue("capacidadeLitros", item.capacidadeLitros.toString());
            setValue("estoqueMinimoLitros", item.estoqueMinimoLitros.toString());
            toast.dismiss(process);
        }
        catch (error: Error | any) {
            toast.update(process, { render: errorMsg(error), type: "error", isLoading: false, autoClose: 5000 });
        }
    }

    const getProdutosAbastecimento = async (pesquisa?: string) => {
        const data = await getProdutoAbastecimentoList(pesquisa, undefined, undefined, undefined);
        return data;
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

    const submit = async (dados: dadosAddEdicaoPostoCombustivelTanqueType) => {
        if (loading) return
        if (!idPostoCombustivel) {
            if (id === -1) {
                let tan = tanques;
                if (tan) tan.push(dados)
                setTanques(tan);
            }
            else {
                let tan = tanques;
                if (tan) tan[id] = dados;
                setTanques(tan);
            }
            reset();
            setOpen(false);
            return
        }
        setLoading(true);
        const process = toast.loading("Salvando item...");
        try {
            const postPut: dadosAddEdicaoPostoCombustivelTanqueType = {
                idPostoCombustivel: Number(idPostoCombustivel) ?? (dados.idPostoCombustivel ?? null),
                idProdutoAbastecimento: dados.idProdutoAbastecimento ?? null,
                capacidadeLitros: +dados.capacidadeLitros,
                estoqueMinimoLitros: +dados.estoqueMinimoLitros,
            };
            if (id === -1) {
                const response = await addPostoCombustivelTanque(postPut);
                toast.update(process, { render: response.mensagem, type: "success", isLoading: false, autoClose: 2000 });
                const tan = await getPostoCombustivelTanquePorId(response.id)
                if (selecionarTanque) selecionarTanque({ label: tan.descricao, value: response.id });
            }
            else {
                const response = await updatePostoCombustivelTanque(id, postPut);
                toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
                const tan = await getPostoCombustivelTanquePorId(id)
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
                        <AsyncReactSelect name="idProdutoAbastecimento" title="Produto Abastecimento" control={control} asyncFunction={getProdutosAbastecimento} options={[]} isClearable />
                        <InputLabel name='capacidade' title='Capacidade' register={{ ...register("capacidade") }} type='number' step='0.01' />
                        <InputLabel name='capacidadeLitros' title='Capacidade Litros' register={{ ...register("capacidadeLitros") }} type='number' step='0.01' />
                        <InputLabel name='estoqueMinimoLitros' title='Estoque Mínimo Litros' register={{ ...register("estoqueMinimoLitros") }} type='number' step='0.01' />
                    </ModalFormBody>

                    <ModalFormFooter>
                        <Button variant="outline" type="button" onClick={() => setOpen(false)} disabled={loading}>Cancelar</Button>
                        <ButtonSubmit loading={loading} onClick={handleSubmit((data) => submit(data as unknown as dadosAddEdicaoPostoCombustivelTanqueType))}>
                            Salvar
                        </ButtonSubmit>
                    </ModalFormFooter>
                </form>

            </SheetContent>
        </Sheet>
    )
}