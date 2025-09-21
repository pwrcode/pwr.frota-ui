import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { errorMsg } from '@/services/api';
import ModalFormBody from '@/ui/components/forms/ModalFormBody';
import ModalFormFooter from '@/ui/components/forms/ModalFormFooter';
import { addEntradaCombustivel, getEntradaCombustivelPorId, updateEntradaCombustivel, type dadosAddEdicaoEntradaCombustivelType } from '@/services/entradaCombustivel';
import { ButtonSubmit } from '@/ui/components/buttons/FormButtons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { formatarData } from '@/services/date';
import { currency } from '@/services/currency';
import AsyncReactSelect from '@/ui/components/forms/AsyncReactSelect';
import { getPostoCombustivelList } from '@/services/postoCombustivel';
import { getProdutoAbastecimentoList } from '@/services/produtoAbastecimento';
import { InputMaskLabel, Masks } from '@/ui/components/forms/InputMaskLabel';
import InputDataAno from '@/ui/components/forms/InputDataAno';
import { toNumber } from '@/services/utils';

type modalPropsType = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    id: number,
    updateList: (filter: boolean) => void,
    idPosto?: number,
}

const schema = z.object({
    dataRecebimento: z.string().optional(),
    idPostoCombustivel: z.object({
        label: z.string().optional(),
        value: z.number().optional()
    }, { message: "Selecione o posto de combustível" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o posto de combustível" }),
    idProdutoAbastecimento: z.object({
        label: z.string().optional(),
        value: z.number().optional()
    }, { message: "Selecione o produto abastecimento" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o produto abastecimento" }),
    quantidade: z.string().optional(),
    valorUnitario: z.string().optional(),
});

export default function Modal({ open, setOpen, id, updateList, idPosto }: modalPropsType) {

    const { register, handleSubmit, setValue, reset, setFocus, watch, control, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });
    const [loading, setLoading] = useState(false);

    const setValuesPerId = async () => {
        const process = toast.loading("Buscando item...");
        try {
            const item = await getEntradaCombustivelPorId(Number(id));
            setValue("dataRecebimento", formatarData(item.dataRecebimento, "yyyy-mm-dd"));
            setValue("idPostoCombustivel", { value: item.idPostoCombustivel, label: item.razaoSocialPostoCombustivel });
            setValue("idProdutoAbastecimento", { value: item.idProdutoAbastecimento, label: item.descricaoProdutoAbastecimento });
            setValue("quantidade", item.quantidade.toString());
            setValue("valorUnitario", String(currency(item.valorUnitario)));
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

    const getPostosCombustivel = async (pesquisa?: string) => {
        const data = await getPostoCombustivelList(pesquisa, undefined, undefined, undefined, undefined);
        return data;
    }

    const getProdutosAbastecimento = async (pesquisa?: string) => {
        const data = await getProdutoAbastecimentoList(pesquisa, undefined, undefined, undefined);
        return data;
    }

    const submit = async (dados: dadosAddEdicaoEntradaCombustivelType) => {
        if (loading) return
        setLoading(true);
        const process = toast.loading("Salvando item...");
        try {
            const postPut: dadosAddEdicaoEntradaCombustivelType = {
                dataRecebimento: dados.dataRecebimento ? dados.dataRecebimento.slice(0, 11).concat("T00:00:00") : "",
                idPostoCombustivel: Number(idPosto) ?? (dados.idPostoCombustivel ?? null),
                idProdutoAbastecimento: dados.idProdutoAbastecimento ?? null,
                quantidade: dados.quantidade,
                valorUnitario: toNumber(dados.valorUnitario) ?? 0,
            };
            if (id === 0) {
                const response = await addEntradaCombustivel(postPut);
                toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
            }
            else {
                const response = await updateEntradaCombustivel(id, postPut);
                toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
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
                <form autoComplete='off' onSubmit={handleSubmit((data) => submit(data as unknown as dadosAddEdicaoEntradaCombustivelType))} className='flex flex-col h-full'>
                    <SheetHeader className='p-6 rounded-t-lg border-b'>
                        <SheetTitle>{id ? `Editar Entrada Combustivel #${id}` : "Cadastrar Entrada Combustivel"}</SheetTitle>
                    </SheetHeader>

                    <ModalFormBody>
                        <InputDataAno title="Data Recebimento" id="dataRecebimento" register={{ ...register("dataRecebimento") }} />
                        {!idPosto ? <AsyncReactSelect name="idPostoCombustivel" title="Posto Combustível" control={control} asyncFunction={getPostosCombustivel} options={[]} isClearable /> : <></>}
                        <AsyncReactSelect name="idProdutoAbastecimento" title="Produto Abastecimento" control={control} asyncFunction={getProdutosAbastecimento} options={[]} isClearable />
                        <InputMaskLabel name='quantidade' title='Quantidade' mask={Masks.numerico} setValue={setValue} value={watch("quantidade")} />
                        <InputMaskLabel name='valorUnitario' title='Valor Unitário' mask={Masks.dinheiro} setValue={setValue} value={watch("valorUnitario")} />
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