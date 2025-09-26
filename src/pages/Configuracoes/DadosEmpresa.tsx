import { tiposPessoa, type optionType } from '@/services/constants';
import { formatarCelular, formatarCep, formatarCpfCnpj } from '@/services/formatacao';
import { InputMaskLabel, Masks } from '@/ui/components/forms/InputMaskLabel';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../Bairro/Modal';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import FormContainer from '@/ui/components/forms/FormContainer';
import FormContainerHeader from '@/ui/components/forms/FormContainerHeader';
import FormContainerBody from '@/ui/components/forms/FormContainerBody';
import AsyncReactSelect from '@/ui/components/forms/AsyncReactSelect';
import { useEndereco } from '@/hooks/useEndereco';
import { getEmpresa, updateEmpresa, type dadosAddEdicaoEmpresaType } from '@/services/empresa';
import { removeNonDigit } from '@/services/utils';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@/ui/components/forms/InputLabel';
import { FormGridPair } from '@/ui/components/forms/FormGrid';
import { ButtonSubmit, SearchButton } from '@/ui/components/buttons/FormButtons';
import { PlusButton } from '@/ui/components/buttons/PlusButton';
import FormLine from '@/ui/components/forms/FormLine';
import { CadAlterInfo } from '@/ui/components/forms/CadAlterInfo';
import { Button } from '@/components/ui/button';
import { errorMsg } from '@/services/api';
import { UploadFoto } from '@/ui/components/forms/UploadFoto';
import TextareaLabel from '@/ui/components/forms/TextareaLabel';
import { dateDiaMesAno, dateHoraMin } from '@/services/date';

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
})

export default function DadosEmpresa() {
    const navigate = useNavigate();

    const formFunctions = useForm({
        resolver: zodResolver(schema)
    });

    const { register, handleSubmit, reset, setValue, watch, control } = formFunctions;

    const {
        cep,
        getUfs, getMunicipios, getBairros, buscarCep, loadingCep,
        ufs, municipios, bairros,
    } = useEndereco(formFunctions);

    const [loading, setLoading] = useState(false);
    const [cadInfo, setCadInfo] = useState<string>("");
    const [edicaoInfo, setEdicaoInfo] = useState<string>("");

    const idBairro = watch("idBairro.value");
    const idMunicipio = watch("idMunicipio.value");

    const tipoPessoa = watch("tipoPessoa");
    const documento = watch("documento");

    const [idArquivoFotoEmpresa, setIdArquivoFotoEmpresa] = useState<number>(0);

    const [bairroModalOpen, setBairroModalOpen] = useState<boolean>(false);

    useEffect(() => {
        carregaDadosEmpresa();
    }, []);

    const carregaDadosEmpresa = async () => {
        try {
            const data = await getEmpresa();
            reset({
                tipoPessoa: {
                    value: tiposPessoa.find(t => t.valueString == data.tipoPessoa.toString())?.value,
                    label: tiposPessoa.find(t => t.valueString === data.tipoPessoa.toString())?.label
                },
                documento: formatarCpfCnpj(removeNonDigit(data.documento)),
                razaoSocial: data.razaoSocial,
                nomeFantasia: data.nomeFantasia,
                cep: formatarCep(data.cep),
                idUf: {
                    value: data.idUf,
                    label: data.descricaoUf
                },
                idMunicipio: {
                    value: data.idMunicipio,
                    label: data.descricaoMunicipio
                },
                idBairro: {
                    value: data.idBairro,
                    label: data.descricaoBairro
                },
                logradouro: data.logradouro,
                numero: data.numero,
                complemento: data.complemento,
                pontoReferencia: data.pontoReferencia,
                telefonePrincipal: formatarCelular(data.telefonePrincipal || ""),
                telefoneSecundario: formatarCelular(data.telefoneSecundario || ""),
                observacao: data.observacao,
            });

            if (data.idArquivoFoto)
                setIdArquivoFotoEmpresa(data.idArquivoFoto);

            setCadInfo(`${data.usuarioCadastro} ${dateDiaMesAno(data.dataCadastro)} ${dateHoraMin(data.dataCadastro)}`);
            setEdicaoInfo(`${data.usuarioEdicao} ${dateDiaMesAno(data.dataEdicao)} ${dateHoraMin(data.dataEdicao)}`);
        } catch (ex) { }
    }

    const submit = async (data: dadosAddEdicaoEmpresaType) => {
        if (loading) return;
        setLoading(true);
        const process = toast.loading("Salvando item...")
        try {
            const postPut: dadosAddEdicaoEmpresaType = {
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
                telefonePrincipal: data.telefonePrincipal ? removeNonDigit(data.telefonePrincipal) : "",
                telefoneSecundario: data.telefoneSecundario ? removeNonDigit(data.telefoneSecundario) : "",
                observacao: data.observacao,
                idArquivoFoto: idArquivoFotoEmpresa,
            }

            const res = await updateEmpresa(postPut);
            toast.update(process, { render: res, type: "success", isLoading: false, autoClose: 2000 });
        }
        catch (error: Error | any) {
            toast.update(process, { render: errorMsg(error), type: "error", isLoading: false, autoClose: 2000 });
        }
        finally {
            setLoading(false);
        }
    }

    const handleClickAdicionarBairro = () => {
        setBairroModalOpen(true);
    }

    const selecionarBairro = (bairro: optionType) => {
        setValue("idBairro", bairro);
        getBairros();
    }

    return (
        <>
            <Modal open={bairroModalOpen} setOpen={setBairroModalOpen} id={idBairro ?? 0} selecionarBairro={selecionarBairro} idMunicipio={idMunicipio} />

            <div className="w-full mt-16">
                <form autoComplete='off' className="flex-[3] flex flex-col gap-4" onSubmit={handleSubmit((data) => submit(data as dadosAddEdicaoEmpresaType))}>

                    <div className="flex-1">
                        <UploadFoto referenciaTipo="Empresa" idArquivo={idArquivoFotoEmpresa} changeIdArquivo={setIdArquivoFotoEmpresa} alt="Foto Empresa" isDisabled={loading} />
                    </div>
                    <FormContainer>
                        <FormContainerHeader title="Pessoa" />
                        <FormContainerBody>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
                                <AsyncReactSelect name="tipoPessoa" title="Tipo Pessoa" control={control} options={tiposPessoa} />
                                <InputMaskLabel
                                    name="documento" title={tipoPessoa && tipoPessoa.value === 1 ? "CPF" : "CNPJ"}
                                    mask={tipoPessoa && tipoPessoa.value == 1 ? Masks.cpf : Masks.cnpj}
                                    register={{ ...register("documento") }} value={documento} setValue={setValue}
                                />
                                <InputLabel name="razaoSocial" title="Razão Social" register={{ ...register("razaoSocial") }} />
                                <InputLabel name="nomeFantasia" title="Nome Fantasia" register={{ ...register("nomeFantasia") }} />
                            </div>
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
                                    style=' lg:col-span-2'
                                />
                                <InputMaskLabel
                                    name="telefoneSecundario"
                                    title="Telefone Secundário"
                                    mask={Masks.celular}
                                    register={{ ...register("telefoneSecundario") }}
                                    value={watch("telefoneSecundario")}
                                    setValue={setValue}
                                    style=' lg:col-span-2'
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
                                <InputLabel name="complemento" title="Complemento" register={{ ...register("complemento") }} size="xl:col-span-4" />
                                <InputLabel name="pontoReferencia" title="Ponto Referência" register={{ ...register("pontoReferencia") }} size="xl:col-span-4" />
                                <div className='xl:col-span-8'>
                                    <TextareaLabel title="Observação" name="observacao" register={{ ...register("observacao") }} />
                                </div>
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