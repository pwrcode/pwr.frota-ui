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
import { tiposPessoa, type optionType } from '@/services/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { dateDiaMesAno, dateHoraMin } from '@/services/date';
import { errorMsg } from '@/services/api';
import { DivCheckBox } from '@/ui/components/forms/DivCheckBox';
import { CheckBoxLabel } from '@/ui/components/forms/CheckBoxLabel';
import { InputMaskLabel, Masks } from '@/ui/components/forms/InputMaskLabel';
import { removeNonDigit } from '@/services/utils';
import { formatarCelular, formatarCep, formatarCpfCnpj, formatarDataParaAPI } from '@/services/formatacao';
import { addPessoa, type dadosAddEdicaoPessoaType, getPessoaPorId, updatePessoa } from '@/services/pessoa';
import { FormGrid, FormGridPair } from '@/ui/components/forms/FormGrid';
import { useEndereco } from '@/hooks/useEndereco';
import z from 'zod';
import { PlusButton } from '@/ui/components/buttons/PlusButton';
import Modal from '../Bairro/Modal';
import SelectTipoPessoa from '@/ui/selects/TipoPessoaSelect';
import SelectCategoriaCnh from '@/ui/selects/CategoriaCnhSelect';
import InputDataControl from '@/ui/components/forms/InputDataControl';
import SelectUf from '@/ui/selects/UfSelect';
import SelectMunicipio from '@/ui/selects/MunicipioSelect';
import SelectBairro from '@/ui/selects/BairroSelect';

const schema = z.object({
    tipoPessoa: z.object({
        label: z.string().optional(),
        value: z.number().optional()
    }, { message: "Selecione o tipo pessoa" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o tipo pessoa" }),
    documento: z.string().optional(),
    razaoSocial: z.string().min(1, { message: "Informe a Razão Social" }),
    nomeFantasia: z.string().min(1, { message: "Informe o Nome Fantasia" }),
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
    observacao: z.string().optional().nullable(),
    isMotorista: z.boolean().optional(),
    isAjudante: z.boolean().optional(),
    isOficina: z.boolean().optional(),
    isFornecedor: z.boolean().optional(),
    cnhNumero: z.string().optional(),
    cnhCategoria: z.object({
        label: z.string().optional().nullable(),
        value: z.string().optional().nullable()
    }).optional().transform(t => t && t.value ? t.value : undefined),
    cnhValidade: z.string().optional(),
    ativo: z.boolean().optional(),
})

export default function PessoaForm() {

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

    const {
        cep, getBairros, buscarCep, loadingCep, setValuesMunicipio, setValuesBairro,
    } = useEndereco(formFunctions);

    const tipoPessoa = watch("tipoPessoa");
    const documento = watch("documento");

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
        else {
            setValue("ativo", true);
            setValue("tipoPessoa", tiposPessoa[0]); // Pessoa Fisica Padrao
        }
    }, [id]);

    const setValuesPorId = async () => {
        const process = toast.loading("Buscando item...");
        try {
            if (!id || isNaN(Number(id))) throw new Error("Não foi possível encontrar o item");
            const item = await getPessoaPorId(Number(id));
            reset({
                idUf: {
                    value: item.idUf,
                    label: item.descricaoUf
                },
                idMunicipio: {
                    value: item.idMunicipio,
                    label: item.descricaoMunicipio
                },
                idBairro: {
                    value: item.idBairro,
                    label: item.descricaoBairro
                },
                tipoPessoa: {
                    value: tiposPessoa.find(t => t.valueString == item.tipoPessoa.toString())?.value,
                    label: tiposPessoa.find(t => t.valueString === item.tipoPessoa.toString())?.label
                },
                documento: formatarCpfCnpj(removeNonDigit(item.documento)),
                razaoSocial: item.razaoSocial,
                nomeFantasia: item.nomeFantasia,
                cep: formatarCep(removeNonDigit(item.cep)),
                logradouro: item.logradouro,
                numero: item.numero,
                complemento: item.complemento,
                pontoReferencia: item.pontoReferencia,
                telefonePrincipal: formatarCelular(removeNonDigit(item.telefonePrincipal)),
                telefoneSecundario: formatarCelular(removeNonDigit(item.telefoneSecundario)),
                observacao: item.observacao,
                isMotorista: item.isMotorista,
                isAjudante: item.isAjudante,
                isOficina: item.isOficina,
                isFornecedor: item.isFornecedor,
                ativo: item.ativo,
                cnhNumero: item.cnhNumero || "",
                cnhValidade: item.cnhValidade,
                cnhCategoria: {
                    value: item.cnhCategoria,
                    label: item.cnhCategoria
                }
            }, { keepDefaultValues: true })
            setTimeout(() => {
                setValuesMunicipio(item.idMunicipio)
            }, 250);
            setTimeout(() => {
                setValuesBairro(item.idBairro)
            }, 500);
            setCadInfo(`${item.usuarioCadastro} ${dateDiaMesAno(item.dataCadastro)} ${dateHoraMin(item.dataCadastro)}`);
            setEdicaoInfo(`${item.usuarioEdicao} ${dateDiaMesAno(item.dataEdicao)} ${dateHoraMin(item.dataEdicao)}`);
            toast.dismiss(process);
        }
        catch (error: Error | any) {
            toast.update(process, { render: errorMsg(error), type: "error", isLoading: false, autoClose: 2000 });
            navigate("/pessoa");
        }
    };

    const submit = async (data: dadosAddEdicaoPessoaType) => {
        if (loading) return;
        setLoading(true);
        const process = toast.loading("Salvando item...")
        try {
            const postPut: dadosAddEdicaoPessoaType = {
                tipoPessoa: data.tipoPessoa ?? null,
                documento: removeNonDigit(data.documento),
                razaoSocial: data.razaoSocial,
                nomeFantasia: data.nomeFantasia,
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
                isMotorista: data.isMotorista ?? false,
                isAjudante: data.isAjudante ?? false,
                isOficina: data.isOficina ?? false,
                isFornecedor: data.isFornecedor ?? false,
                cnhNumero: data.cnhNumero,
                cnhCategoria: data.cnhCategoria ?? null,
                cnhValidade: formatarDataParaAPI(data.cnhValidade),
                ativo: data.ativo ?? false,
            }
            if (!id) {
                const res = await addPessoa(postPut);
                toast.update(process, { render: res, type: "success", isLoading: false, autoClose: 2000 });
            }
            else {
                const res = await updatePessoa(Number(id), postPut);
                toast.update(process, { render: res, type: "success", isLoading: false, autoClose: 2000 });
            }
            reset();
            navigate("/pessoa");
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

            <div className="w-full mt-16">
                <form autoComplete='off' className="flex-[3] flex flex-col gap-4" onSubmit={handleSubmit((data) => submit(data as dadosAddEdicaoPessoaType))}>

                    <FormContainer>
                        <FormContainerHeader title="Pessoa" />
                        <FormContainerBody>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
                                <SelectTipoPessoa control={control} />
                                {/* <AsyncReactSelect name="tipoPessoa" title="Tipo Pessoa" control={control} options={tiposPessoa} /> */}
                                <InputMaskLabel
                                    name="documento" title={tipoPessoa && tipoPessoa.value === 1 ? "CPF" : "CNPJ"}
                                    mask={tipoPessoa && tipoPessoa.value == 1 ? Masks.cpf : Masks.cnpj}
                                    register={{ ...register("documento") }} value={documento} setValue={setValue}
                                />
                                <InputLabel name="razaoSocial" title="Razão Social" register={{ ...register("razaoSocial") }} />
                                <InputLabel name="nomeFantasia" title="Nome Fantasia" register={{ ...register("nomeFantasia") }} />
                            </div>
                            <DivCheckBox style="line">
                                <CheckBoxLabel name="ativo" title="Ativo" register={{ ...register("ativo") }} />
                            </DivCheckBox>
                        </FormContainerBody>
                    </FormContainer>

                    <FormContainer>
                        <FormContainerHeader title="Dados CNH" />
                        <FormContainerBody>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">

                                <InputMaskLabel name='cnhNumero' title='CNH Número' mask={Masks.numerico} value={watch("cnhNumero")} setValue={setValue} />
                                <SelectCategoriaCnh control={control} />
                                {/* <AsyncReactSelect name="cnhCategoria" title="CNH Categoria" control={control} options={categoriasCnh} isClearable /> */}
                                <InputDataControl name='cnhValidade' title='CNH Validade' control={control} />
                                {/* <InputDataLabel name='cnhValidade' title='CNH Validade' date={dataCnhValidade} setDate={setDataCnhValidade} /> */}
                            </div>
                        </FormContainerBody>
                    </FormContainer>

                    <FormContainer>
                        <FormContainerBody>
                            <FormGrid>
                                <DivCheckBox style="micro">
                                    <CheckBoxLabel name="isAjudante" title="Ajudante" register={{ ...register("isAjudante") }} />
                                </DivCheckBox>
                                <DivCheckBox style="micro">
                                    <CheckBoxLabel name="isMotorista" title="Motorista" register={{ ...register("isMotorista") }} />
                                </DivCheckBox>
                                <DivCheckBox style="micro">
                                    <CheckBoxLabel name="isOficina" title="Oficina" register={{ ...register("isOficina") }} />
                                </DivCheckBox>
                                <DivCheckBox style="micro">
                                    <CheckBoxLabel name="isFornecedor" title="Fornecedor" register={{ ...register("isFornecedor") }} />
                                </DivCheckBox>
                            </FormGrid>
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
                                <SelectUf control={control} size='col-span-1 xl:col-span-2' />
                                {/* <AsyncReactSelect name="idUf" title="UF" control={control} options={ufs} asyncFunction={getUfs} size="col-span-1 xl:col-span-2" filter={true} isClearable /> */}
                                <span className='col-span-1 hidden lg:invisible'></span>
                                <SelectMunicipio control={control} size='col-span-1 xl:col-span-4' />
                                {/* <AsyncReactSelect name="idMunicipio" title="Município" control={control} options={municipios} asyncFunction={getMunicipios} filter={true} isClearable size="col-span-1 xl:col-span-4" /> */}
                                <div className='col-span-1 xl:col-span-4 flex justify-between items-end gap-2'>
                                    <SelectBairro control={control} size='w-full' />
                                    {/* <AsyncReactSelect name="idBairro" title="Bairro" control={control} options={bairros} asyncFunction={getBairros} filter={true} isClearable size="w-full" /> */}
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
                                    <Button variant="outline" type="button" onClick={() => navigate("/pessoa")} disabled={loading}>Cancelar</Button>
                                    <ButtonSubmit loading={loading}>
                                        Salvar
                                    </ButtonSubmit>
                                </FormLine>
                            </FormLine>
                        </FormContainerBody>
                    </FormContainer>

                </form>
            </div>
        </>
    )
}