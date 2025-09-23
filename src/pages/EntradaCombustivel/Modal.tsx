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
import { currency } from '@/services/currency';
import AsyncReactSelect from '@/ui/components/forms/AsyncReactSelect';
import { getPostoCombustivelList } from '@/services/postoCombustivel';
import { getProdutoAbastecimentoList } from '@/services/produtoAbastecimento';
import { InputMaskLabel, Masks } from '@/ui/components/forms/InputMaskLabel';
import { toNumber } from '@/services/utils';
import InputDataLabel from '@/ui/components/forms/InputDataLabel';
import InputLabel from '@/ui/components/forms/InputLabel';
import { getPessoaList, getPessoas } from '@/services/pessoa';
import { getPostoCombustivelTanqueList } from '@/services/postoCombustivelTanque';
import type { listType } from '@/services/constants';

type modalPropsType = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    id: number,
    updateList: (filter: boolean) => void,
    idPosto?: number,
}

const schema = z.object({
    idPostoCombustivel: z.object({
        label: z.string().optional(),
        value: z.number().optional()
    }, { message: "Selecione o posto de combustível" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o posto de combustível" }),
    idProdutoAbastecimento: z.object({
        label: z.string().optional(),
        value: z.number().optional()
    }, { message: "Selecione o produto abastecimento" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o produto abastecimento" }),
    idPessoaFornecedor: z.object({
        label: z.string().optional(),
        value: z.number().optional()
    }, { message: "Selecione um Fornecedor" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione um Fornecedor" }),
    idPostoCombustivelTanque: z.object({
        label: z.string().optional(),
        value: z.number().optional()
    }, { message: "Selecione um Tanque" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione um Tanque" }),
    quantidade: z.string().optional(),
    valorUnitario: z.string().optional(),
});

export default function Modal({ open, setOpen, id, updateList, idPosto }: modalPropsType) {

    const { register, handleSubmit, setValue, reset, setFocus, watch, getValues, control, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });
    const [loading, setLoading] = useState(false);
    const [dataRecebimento, setDataRecebimento] = useState("");

    const idPostoCombustivel = watch("idPostoCombustivel");
    const idPostoCombustivelTanque = watch("idPostoCombustivelTanque");

    const [postoCombustivelTanques, setPostoCombustivelTanques] = useState<listType>([])
    const [produtosAbastecimento, setProdutosAbastecimento] = useState<listType>([])

    const setValuesPerId = async () => {
        const process = toast.loading("Buscando item...");
        try {
            const item = await getEntradaCombustivelPorId(Number(id));
            setDataRecebimento(item.dataRecebimento);
            setValue("idPostoCombustivel", { value: item.idPostoCombustivel, label: item.razaoSocialPostoCombustivel });
            setValue("idProdutoAbastecimento", { value: item.idProdutoAbastecimento, label: item.descricaoProdutoAbastecimento });
            setValue("idPessoaFornecedor", { value: item.idPessoaFornecedor, label: item.razaoSocialPessoaFornecedor });
            setValue("idPostoCombustivelTanque", { value: item.idPostoCombustivelTanque, label: item.descricaoPostoCombustivelTanque });
            setValue("quantidade", item.quantidade.toString());
            setValue("valorUnitario", String(currency(item.valorUnitario)));
            toast.dismiss(process);
        }
        catch (error: Error | any) {
            toast.update(process, { render: errorMsg(error), type: "error", isLoading: false, autoClose: 5000 });
        }
    }

    useEffect(() => {
        setDataRecebimento("")
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

    useEffect(() => {
        const subscription = watch((_, field) => {
            if (field.name == "idPostoCombustivel")
                getPostoCombustivelTanques("");

            if (field.name == "idPostoCombustivelTanque")
                getProdutosAbastecimento("");
        });

        return () => subscription.unsubscribe();
    }, [watch]);

    const getPostosCombustivel = async (pesquisa?: string) => {
        const data = await getPostoCombustivelList(pesquisa, true, undefined, undefined, undefined);
        return data;
    }

    const getPostoCombustivelTanques = async (pesquisa?: string) => {
        if (!idPostoCombustivel) {
            setPostoCombustivelTanques([]);
            return [];
        }
        const data = await getPostoCombustivelTanqueList(pesquisa, idPostoCombustivel?.value, undefined);
        setPostoCombustivelTanques([...data]);
        return data;
    }

    const getProdutosAbastecimento = async (pesquisa?: string) => {
        if (!idPostoCombustivelTanque) {
            setProdutosAbastecimento([]);
            return [];
        }
        const data = await getProdutoAbastecimentoList(pesquisa, undefined, undefined, undefined, idPostoCombustivelTanque?.value, undefined);
        setProdutosAbastecimento([...data]);
        return data;
    }

    const getPessoasFornecedor = async (pesquisa?: string) => {
        const data = await getPessoaList(pesquisa, undefined, undefined, undefined, undefined, undefined, true, undefined, undefined, undefined);
        return data;
    }

    const submit = async (dados: dadosAddEdicaoEntradaCombustivelType) => {
        if (loading) return
        setLoading(true);
        const process = toast.loading("Salvando item...");
        try {
            const postPut: dadosAddEdicaoEntradaCombustivelType = {
                dataRecebimento: dataRecebimento ? dataRecebimento.slice(0, 11).concat("00:00:00") : "",
                idPostoCombustivel: idPosto ? +idPosto : (dados.idPostoCombustivel ?? null),
                idProdutoAbastecimento: dados.idProdutoAbastecimento ?? null,
                idPessoaFornecedor: dados.idPessoaFornecedor ?? null,
                idPostoCombustivelTanque: dados.idPostoCombustivelTanque ?? null,
                quantidade: +dados.quantidade,
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
                        <InputDataLabel title="Data Recebimento" name="dataRecebimento" date={dataRecebimento} setDate={setDataRecebimento} />
                        {!idPosto ? <AsyncReactSelect name="idPostoCombustivel" title="Posto Combustível" control={control} asyncFunction={getPostosCombustivel} options={[]} isClearable /> : <></>}
                        <AsyncReactSelect name="idPostoCombustivelTanque" title="Tanque" control={control} options={postoCombustivelTanques} asyncFunction={getPostoCombustivelTanques} filter isClearable size="w-full" />
                        <AsyncReactSelect name="idProdutoAbastecimento" title="Produto Abastecimento" control={control} options={produtosAbastecimento} asyncFunction={getProdutosAbastecimento} filter isClearable size="w-full" />
                        <AsyncReactSelect name="idPessoaFornecedor" title="Fornecedor" control={control} asyncFunction={getPessoasFornecedor} options={[]} isClearable />
                        <InputLabel name='quantidade' title='Quantidade' register={{ ...register("quantidade") }} type='number' step='0.01' />
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