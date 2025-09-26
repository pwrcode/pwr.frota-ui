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
import { InputMaskLabel, Masks } from '@/ui/components/forms/InputMaskLabel';
import { toNumber } from '@/services/utils';
import InputLabel from '@/ui/components/forms/InputLabel';
import InputDataControl from '@/ui/components/forms/InputDataControl';
import { formatarDataParaAPI } from '@/services/formatacao';
import SelectPostoCombustivel from '@/ui/selects/PostoCombustivelSelect';
import SelectPostoCombustivelTanque from '@/ui/selects/PostoCombustivelTanqueSelect';
import SelectProdutoAbastecimento from '@/ui/selects/ProdutoAbastecimentoSelect';
import SelectFornecedor from '@/ui/selects/FornecedorSelect';

type modalPropsType = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    id: number,
    updateList: (paginaAtual?: number) => Promise<void>,
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
    dataRecebimento: z.string().optional(),
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
            reset({
                idPostoCombustivel: {
                    value: item.idPostoCombustivel,
                    label: item.razaoSocialPostoCombustivel
                },
                idPessoaFornecedor: {
                    value: item.idPessoaFornecedor,
                    label: item.razaoSocialPessoaFornecedor
                },
                quantidade: item.quantidade.toString(),
                valorUnitario: String(currency(item.valorUnitario)),
                dataRecebimento: item.dataRecebimento
            }, { keepDefaultValues: true })
            setTimeout(() => {
                setValue("idPostoCombustivelTanque", { value: item.idPostoCombustivelTanque, label: item.descricaoPostoCombustivelTanque });
            }, 250);
            setTimeout(() => {
                setValue("idProdutoAbastecimento", { value: item.idProdutoAbastecimento, label: item.descricaoProdutoAbastecimento });
            }, 500);
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

    const submit = async (dados: dadosAddEdicaoEntradaCombustivelType) => {
        if (loading) return
        setLoading(true);
        const process = toast.loading("Salvando item...");
        try {
            const postPut: dadosAddEdicaoEntradaCombustivelType = {
                dataRecebimento: formatarDataParaAPI(dados.dataRecebimento),
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
                <form autoComplete='off' onSubmit={handleSubmit((data) => submit(data as unknown as dadosAddEdicaoEntradaCombustivelType))} className='flex flex-col h-full'>
                    <SheetHeader className='p-6 rounded-t-lg border-b'>
                        <SheetTitle>{id ? `Editar Entrada Combustivel #${id}` : "Cadastrar Entrada Combustivel"}</SheetTitle>
                    </SheetHeader>

                    <ModalFormBody>
                        <InputDataControl title="Data Recebimento" name="dataRecebimento" control={control} time />
                        {!idPosto ? <SelectPostoCombustivel control={control} /> : <></>}
                        <SelectPostoCombustivelTanque control={control} size='w-full' />
                        <SelectProdutoAbastecimento control={control} size='w-full' />
                        <SelectFornecedor control={control} />
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