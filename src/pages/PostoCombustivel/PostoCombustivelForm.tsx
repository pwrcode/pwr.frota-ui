import InputLabel from '@/ui/components/forms/InputLabel';
import { Button } from '@/components/ui/button';
import FormContainer from '@/ui/components/forms/FormContainer';
import FormContainerHeader from '@/ui/components/forms/FormContainerHeader';
import FormContainerBody from '@/ui/components/forms/FormContainerBody';
import FormLine from '@/ui/components/forms/FormLine';
import { ButtonSubmit, SearchButton } from '@/ui/components/buttons/FormButtons';
import { CadAlterInfo } from '@/ui/components/forms/CadAlterInfo';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { dateDiaMesAno, dateHoraMin } from '@/services/date';
import { errorMsg } from '@/services/api';
import AsyncReactSelect from '@/ui/components/forms/AsyncReactSelect';
import { DivCheckBox } from '@/ui/components/forms/DivCheckBox';
import { CheckBoxLabel } from '@/ui/components/forms/CheckBoxLabel';
import { InputMaskLabel, Masks } from '@/ui/components/forms/InputMaskLabel';
import { removeNonDigit } from '@/services/utils';
import { formatarCelular, formatarCep, formatarCpfCnpj } from '@/services/formatacao';
import { addPostoCombustivel, type dadosAddEdicaoPostoCombustivelType, getPostoCombustivelPorId, updatePostoCombustivel } from '@/services/postoCombustivel';
import { FormGridPair } from '@/ui/components/forms/FormGrid';
import { useEndereco } from '@/hooks/useEndereco';
import z from 'zod';
import TextareaLabel from '@/ui/components/forms/TextareaLabel';
import { PlusButton } from '@/ui/components/buttons/PlusButton';
import Modal from '../Bairro/Modal';
import type { optionType } from '@/services/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Abastecimento from '../Abastecimento/Index';
import EntradaCombustivel from '../EntradaCombustivel';

const schema = z.object({
    cnpj: z.string().optional(),
    razaoSocial: z.string().min(1, { message: "Informe a Razão Social" }),
    nomeFantasia: z.string().min(1, { message: "Informe o Nome Fantasia" }),
    bandeira: z.string().optional(),
    cep: z.string().optional(),
    idUf: z.object({
        label: z.string().optional(),
        value: z.number().optional()
    }, { message: "Selecione o UF" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o UF" }),
    idMunicipio: z.object({
        label: z.string().optional(),
        value: z.number().optional()
    }, { message: "Selecione o município" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o município" }),
    idBairro: z.object({
        label: z.string().optional(),
        value: z.number().optional()
    }, { message: "Selecione o bairro" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o bairro" }).optional(),
    logradouro: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    pontoReferencia: z.string().optional(),
    telefonePrincipal: z.string().optional(),
    telefoneSecundario: z.string().optional(),
    observacao: z.string().optional(),
    isInterno: z.boolean().optional(),
})

export default function PostoCombustivelForm() {

    const formFunctions = useForm({
        resolver: zodResolver(schema)
    });
    const { register, handleSubmit, reset, setValue, watch, control, setFocus, formState: { errors } } = formFunctions;

    const { id } = useParams();
    const navigate = useNavigate();
    const idBairro = watch("idBairro.value");
    const idMunicipio = watch("idMunicipio.value");

    const [loading, setLoading] = useState(false);
    const [cadInfo, setCadInfo] = useState<string>("");
    const [edicaoInfo, setEdicaoInfo] = useState<string>("");
    const [openModalFormBairro, setOpenModalFormBairro] = useState(false);

    const [isDropDownTabsOpen, setIsDropDownTabsOpen] = useState(false);
    const [tabNameMobile, setTabNameMobile] = useState("Posto Combustível");

    const {
        cep,
        getUfs, getMunicipios, getBairros, buscarCep, loadingCep,
        ufs, municipios, bairros,
        setIdUf, setIdMunicipio,
        setValuesUf, setValuesMunicipio, setValuesBairro
    } = useEndereco(formFunctions);

    const documento = watch("cnpj");

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
        if (id) setValuesPorId();
    }, [id]);

    const setValuesPorId = async () => {
        const process = toast.loading("Buscando item...");
        try {
            if (!id || isNaN(Number(id))) throw new Error("Não foi possível encontrar o item");
            const item = await getPostoCombustivelPorId(Number(id));
            if (item.idUf) setIdUf(item.idUf);
            if (item.idMunicipio) setIdMunicipio(item.idMunicipio);
            setValue("cnpj", formatarCpfCnpj(removeNonDigit(item.cnpj)));
            setValue("razaoSocial", item.razaoSocial);
            setValue("nomeFantasia", item.nomeFantasia);
            setValue("bandeira", item.bandeira);
            setValue("cep", formatarCep(item.cep));
            setValue("logradouro", item.logradouro);
            setValue("numero", item.numero);
            setValue("complemento", item.complemento);
            setValue("pontoReferencia", item.pontoReferencia);
            setValue("telefonePrincipal", formatarCelular(item.telefonePrincipal));
            setValue("telefoneSecundario", formatarCelular(item.telefoneSecundario));
            setValue("observacao", item.observacao);
            setValue("isInterno", item.isInterno ? true : false);
            setValuesUf(item.idUf); // useEndereco
            setValuesMunicipio(item.idMunicipio); // useEndereco
            setValuesBairro(item.idBairro)
            setCadInfo(`${item.usuarioCadastro} ${dateDiaMesAno(item.dataCadastro)} ${dateHoraMin(item.dataCadastro)}`);
            setEdicaoInfo(`${item.usuarioEdicao} ${dateDiaMesAno(item.dataEdicao)} ${dateHoraMin(item.dataEdicao)}`);
            toast.dismiss(process);
        }
        catch (error: Error | any) {
            toast.update(process, { render: errorMsg(error), type: "error", isLoading: false, autoClose: 2000 });
            navigate("/postoCombustivel");
        }
    };

    const submit = async (data: dadosAddEdicaoPostoCombustivelType) => {
        if (loading) return;
        setLoading(true);
        const process = toast.loading("Salvando item...")
        try {
            const postPut: dadosAddEdicaoPostoCombustivelType = {
                cnpj: removeNonDigit(data.cnpj),
                razaoSocial: data.razaoSocial,
                nomeFantasia: data.nomeFantasia,
                bandeira: data.bandeira,
                cep: removeNonDigit(data.cep),
                idUf: data.idUf ?? null,
                idMunicipio: data.idMunicipio ?? null,
                idBairro: data.idBairro ?? null,
                logradouro: data.logradouro,
                numero: data.numero,
                complemento: data.complemento,
                pontoReferencia: data.pontoReferencia,
                telefonePrincipal: removeNonDigit(data.telefonePrincipal),
                telefoneSecundario: removeNonDigit(data.telefoneSecundario),
                observacao: data.observacao,
                isInterno: data.isInterno ?? false,
            }
            if (!id) {
                const res = await addPostoCombustivel(postPut);
                toast.update(process, { render: res, type: "success", isLoading: false, autoClose: 2000 });
            }
            else {
                const res = await updatePostoCombustivel(Number(id), postPut);
                toast.update(process, { render: res, type: "success", isLoading: false, autoClose: 2000 });
            }
            reset();
            navigate("/posto-combustivel");
        }
        catch (error: Error | any) {
            toast.update(process, { render: errorMsg(error), type: "error", isLoading: false, autoClose: 2000 });
        }
        finally {
            setLoading(false);
        }
    }

    const handleClickAdicionarBairro = () => {
        setOpenModalFormBairro(true);
    }

    const selecionarBairro = (bairro: optionType) => {
        setValue("idBairro", bairro);
        getBairros();
    }

    return (
        <>
            <Modal open={openModalFormBairro} setOpen={setOpenModalFormBairro} id={idBairro ?? 0} selecionarBairro={selecionarBairro} idMunicipio={idMunicipio} />


            <Tabs defaultValue='postoCombustivel' className='w-full mt-16 flex flex-col gap-2'>

                <TabsList className='w-fit h-min hidden md:flex justify-start gap-1 p-0'>
                    <TabsTrigger value='postoCombustivel' onClick={() => setTabNameMobile("Posto Combustível")}>
                        Posto Combustível
                    </TabsTrigger>
                    {id ? <>
                        <TabsTrigger value='abastecimento' onClick={() => setTabNameMobile("Abastecimentos")}>
                            Abastecimentos
                        </TabsTrigger>
                        <TabsTrigger value='entrada' onClick={() => setTabNameMobile("Entradas")}>
                            Entradas
                        </TabsTrigger>
                    </> : <></>}
                </TabsList>

                <DropdownMenu onOpenChange={(open) => setIsDropDownTabsOpen(open)} open={id ? isDropDownTabsOpen : false}>
                    <TabsList className='flex w-min px-0 md:hidden'>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"ghost"} className='text-black dark:text-white flex justify-between items-center gap-2 py-2'>
                                {tabNameMobile} {id ? <div className='ml-4'>{isDropDownTabsOpen ? <ChevronUp /> : <ChevronDown />}</div> : <></>}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='md:hidden'>
                            <DropdownMenuItem className='p-0 flex flex-col'>
                                <TabsTrigger value='postoCombustivel' onClick={() => setTabNameMobile("Posto Combustível")} className='py-2'>
                                    Posto Combustível
                                </TabsTrigger>
                                <TabsTrigger value='abastecimento' onClick={() => setTabNameMobile("Abastecimentos")} className='py-2'>
                                    Posto Combustível
                                </TabsTrigger>
                                <TabsTrigger value='entrada' onClick={() => setTabNameMobile("Entradas")} className='py-2'>
                                    Entradas
                                </TabsTrigger>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </TabsList>
                </DropdownMenu>

                <TabsContent value="postoCombustivel">
                    <form autoComplete='off' className="flex-[3] flex flex-col gap-4" onSubmit={handleSubmit((data) => submit(data as dadosAddEdicaoPostoCombustivelType))}>

                        <FormContainer>
                            <FormContainerHeader title="Posto Combustivel" />
                            <FormContainerBody>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
                                    <InputMaskLabel
                                        name="cnpj" title="CNPJ"
                                        mask={Masks.cnpj}
                                        register={{ ...register("cnpj") }} value={documento} setValue={setValue}
                                    />
                                    <InputLabel name="razaoSocial" title="Razão Social" register={{ ...register("razaoSocial") }} />
                                    <InputLabel name="nomeFantasia" title="Nome Fantasia" register={{ ...register("nomeFantasia") }} />
                                    <InputMaskLabel name='bandeira' title='Bandeira' mask={Masks.numerico} value={watch("bandeira")} setValue={setValue} />
                                    <div className='lg:col-span-2'>
                                        <TextareaLabel title="Observação" name="observacao" register={{ ...register("observacao") }} />
                                    </div>
                                </div>
                                <DivCheckBox style="micro">
                                    <CheckBoxLabel name="isInterno" title="Interno" register={{ ...register("isInterno") }} />
                                </DivCheckBox>
                            </FormContainerBody>
                        </FormContainer>

                        <FormContainer>
                            <FormContainerHeader title="Contato" />
                            <FormContainerBody>
                                <FormGridPair>
                                    <InputMaskLabel
                                        name="telefonePrincipal"
                                        title="Telefone Principal"
                                        mask={Masks.celular}
                                        register={{ ...register("telefonePrincipal") }}
                                        value={watch("telefonePrincipal")}
                                        setValue={setValue}
                                    />
                                    <InputMaskLabel
                                        name="telefoneSecundario"
                                        title="Telefone Secundário"
                                        mask={Masks.celular}
                                        register={{ ...register("telefoneSecundario") }}
                                        value={watch("telefoneSecundario")}
                                        setValue={setValue}
                                    />
                                </FormGridPair>
                            </FormContainerBody>
                        </FormContainer>

                        <FormContainer>
                            <FormContainerHeader title="Endereço" />
                            <FormContainerBody>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-8 gap-2">
                                    {/* CEP e Buscar */}
                                    <div className="col-span-1 xl:col-span-2 flex flex-row items-end gap-1">
                                        <InputMaskLabel name="cep" title="CEP" mask={Masks.cep} register={{ ...register("cep") }} value={cep} setValue={setValue} />
                                        <SearchButton func={buscarCep} disabled={loadingCep} />
                                    </div>
                                    <AsyncReactSelect name="idUf" title="UF" control={control} options={ufs} asyncFunction={getUfs} size="col-span-1 xl:col-span-2" filter={true} isClearable />
                                    <span className='col-span-1 hidden lg:invisible'></span>
                                    <AsyncReactSelect name="idMunicipio" title="Município" control={control} options={municipios} asyncFunction={getMunicipios} filter={true} isClearable size="col-span-1 xl:col-span-4" />
                                    <div className='col-span-1 xl:col-span-4 flex justify-between items-end gap-2'>
                                        <AsyncReactSelect name="idBairro" title="Bairro" control={control} options={bairros} asyncFunction={getBairros} filter={true} isClearable size="w-full" />
                                        <PlusButton loading={loading} func={handleClickAdicionarBairro} />
                                    </div>
                                    {/* Bairro e Add */}
                                    <InputLabel name="logradouro" title="Logradouro" register={{ ...register("logradouro") }} size="xl:col-span-3" />
                                    <InputLabel name="numero" title="Número" register={{ ...register("numero") }} size="xl:col-span-1" />
                                    <InputLabel name="complemento" title="Complemento" register={{ ...register("complemento") }} size="xl:col-span-2" />
                                    <InputLabel name="pontoReferencia" title="Ponto Referência" register={{ ...register("pontoReferencia") }} size="xl:col-span-2" />
                                </div>
                            </FormContainerBody>
                        </FormContainer>

                        <FormContainer>
                            <FormContainerBody>
                                <FormLine>
                                    <FormLine justify="start">
                                        <CadAlterInfo cadInfo={cadInfo} alterInfo={edicaoInfo} />
                                    </FormLine>
                                    <FormLine justify="end">
                                        <Button variant="outline" type="button" onClick={() => navigate("/posto-combustivel")} disabled={loading}>Cancelar</Button>
                                        <ButtonSubmit loading={loading}>
                                            Salvar
                                        </ButtonSubmit>
                                    </FormLine>
                                </FormLine>
                            </FormContainerBody>
                        </FormContainer>

                    </form>
                </TabsContent>

                <TabsContent value='abastecimento'>
                    <Abastecimento idPosto={Number(id)} />
                </TabsContent>

                <TabsContent value='entrada'>
                    <EntradaCombustivel idPosto={Number(id)}/>
                </TabsContent>

            </Tabs >

        </>
    )
}