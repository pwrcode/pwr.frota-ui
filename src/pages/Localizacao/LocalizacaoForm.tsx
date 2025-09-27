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
import { z } from 'zod';
import { toast } from 'react-toastify';
import { dateDiaMesAno, dateHoraMin } from '@/services/date';
import { errorMsg } from '@/services/api';
import { InputMaskLabel, Masks } from '@/ui/components/forms/InputMaskLabel';
import { addLocalizacao, getLocalizacaoPorId, updateLocalizacao, type dadosAddEdicaoLocalizacaoType } from '@/services/localizacao';
import TextareaLabel from '@/ui/components/forms/TextareaLabel';
import { removeNonDigit } from '@/services/utils';
import { formatarCelular, formatarCep } from '@/services/formatacao';
import { FormGridPair } from '@/ui/components/forms/FormGrid';
import SelectUf from '@/ui/selects/UfSelect';
import SelectMunicipio from '@/ui/selects/MunicipioSelect';
import SelectBairro from '@/ui/selects/BairroSelect';
import { PlusButton } from '@/ui/components/buttons/PlusButton';
import { useEndereco } from '@/hooks/useEndereco';
import type { optionType } from '@/services/constants';
import Modal from '../Bairro/Modal';
import SelectTiposLocalizacao from '@/ui/selects/TipoLocalizacaoSelect';

export default function LocalizacaoForm() {

  const schema = z.object({
    idTipoLocalizacao: z.object({
      label: z.string().nullish(),
      value: z.number().nullish()
    }, { message: "Selecione o tipo localização" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o tipo localização" }),
    idUf: z.object({
      label: z.string().nullish(),
      value: z.number().nullish()
    }, { message: "Selecione o UF" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o UF" }),
    idMunicipio: z.object({
      label: z.string().nullish(),
      value: z.number().nullish()
    }, { message: "Selecione o Município" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o Município" }),
    idBairro: z.object({
      label: z.string().nullish(),
      value: z.number().nullish()
    }).nullish().transform(t => t && t.value ? t.value : null),
    descricao: z.string().nullish(),
    cep: z.string().optional().transform(value => value ? removeNonDigit(value) : ""),
    logradouro: z.string().nullish(),
    complemento: z.string().nullish(),
    numero: z.string().nullish(),
    pontoReferencia: z.string().nullish(),
    telefonePrincipal: z.string().nullish().transform(value => value ? removeNonDigit(value) : ""),
    telefoneSecundario: z.string().nullish().transform(value => value ? removeNonDigit(value) : ""),
    email: z.email().nullish(),
    horarioFuncionamento: z.string().nullish(),
    observacao: z.string().nullish(),
    raio: z.coerce.number<number>().nullish(),
  });

  const formFunctions = useForm({
    resolver: zodResolver(schema)
  });

  const { register, handleSubmit, reset, setValue, watch, control, setFocus, formState: { errors } } = formFunctions;

  const { id } = useParams();
  const idBairro = watch("idBairro.value");
  const idMunicipio = watch("idMunicipio.value");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cadInfo, setCadInfo] = useState<string>("");
  const [edicaoInfo, setEdicaoInfo] = useState<string>("");
  const [openModalFormBairro, setOpenModalFormBairro] = useState(false);

  const {
    cep, getBairros, buscarCep, loadingCep, setValuesMunicipio, setValuesBairro,
  } = useEndereco(formFunctions);

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

  // useEffect(() => {
  //   const subscription = watch((values, field) => {

  //   });

  //   return () => subscription.unsubscribe();
  // }, [watch])

  const setValuesPorId = async () => {
    const process = toast.loading("Buscando item...");
    try {
      if (!id || isNaN(Number(id))) throw new Error("Não foi possível encontrar o item");
      const item = await getLocalizacaoPorId(Number(id));
      reset({
        idTipoLocalizacao: { value: item.idTipoLocalizacao, label: item.descricaoTipoLocalizacao },
        idUf: { value: item.idUf, label: item.descricaoUf },
        observacao: item.observacao,
        descricao: item.observacao,
        cep: formatarCep(item.cep),
        telefonePrincipal: formatarCelular(item.telefonePrincipal),
        telefoneSecundario: formatarCelular(item.observacao),
        email: item.email,
        horarioFuncionamento: item.horarioFuncionamento,
        logradouro: item.logradouro,
        numero: item.numero,
        pontoReferencia: item.pontoReferencia,
        raio: item.raio,
      })

      setTimeout(() => {
        setValuesMunicipio(item.idMunicipio)
      }, 250);
      setTimeout(() => {
        setValuesBairro(item.idBairro)
      }, 250);

      setCadInfo(`${item.usuarioCadastro} ${dateDiaMesAno(item.dataCadastro)} ${dateHoraMin(item.dataCadastro)}`);
      setEdicaoInfo(`${item.usuarioEdicao} ${dateDiaMesAno(item.dataEdicao)} ${dateHoraMin(item.dataEdicao)}`);
      toast.dismiss(process);
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error), type: "error", isLoading: false, autoClose: 2000 });
      navigate("/localizacao");
    }
  };

  const submit = async (data: dadosAddEdicaoLocalizacaoType) => {
    if (loading) return;
    setLoading(true);
    const process = toast.loading("Salvando item...")
    try {
      if (!id) {
        const res = await addLocalizacao(data);
        toast.update(process, { render: res, type: "success", isLoading: false, autoClose: 2000 });
      }
      else {
        const res = await updateLocalizacao(Number(id), data);
        toast.update(process, { render: res, type: "success", isLoading: false, autoClose: 2000 });
      }
      reset();
      navigate(`/localizacao`);
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error), type: "error", isLoading: false, autoClose: 2000 });
    }
    finally {
      setLoading(false);
    }
  }

  const handleClickVoltar = () => {
    navigate("/localizacao");
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

      <div className="w-full mt-16 flex flex-col lg:flex-row gap-4">
        <form autoComplete='off' className="flex-[3] flex flex-col gap-4" onSubmit={handleSubmit((data) => submit(data as unknown as dadosAddEdicaoLocalizacaoType))}>

          <FormContainer>
            <FormContainerHeader title="Localizacao" />
            <FormContainerBody>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2'>
                <SelectTiposLocalizacao control={control} />
                <InputLabel name="descricao" title="Descrição" register={{ ...register("descricao") }} />
                <InputMaskLabel name='raio' title='Raio' mask={Masks.numerico} setValue={setValue} value={watch("raio")} />
                <InputLabel name="email" title="Email" register={{ ...register("email") }} size='lg:col-span-2' />
                <TextareaLabel name='observacao' title='Observação' register={{ ...register("observacao")}} />
              </div>
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
                <span className='col-span-1 hidden lg:invisible'></span>
                <SelectMunicipio control={control} size='col-span-1 xl:col-span-4' />
                <div className='col-span-1 xl:col-span-4 flex justify-between items-end gap-2'>
                  <SelectBairro control={control} size='w-full' />
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
            <FormContainerBody>
              <FormLine>
                <FormLine justify="start">
                  <CadAlterInfo cadInfo={cadInfo} alterInfo={edicaoInfo} />
                </FormLine>
                <FormLine justify="end">
                  <Button variant="outline" type="button" onClick={handleClickVoltar} disabled={loading}>Cancelar</Button>
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
