import InputLabel from '@/ui/components/forms/InputLabel';
import { Button } from '@/components/ui/button';
import FormContainer from '@/ui/components/forms/FormContainer';
import FormContainerHeader from '@/ui/components/forms/FormContainerHeader';
import FormContainerBody from '@/ui/components/forms/FormContainerBody';
import FormLine from '@/ui/components/forms/FormLine';
import { ButtonSubmit } from '@/ui/components/buttons/FormButtons';
import { CadAlterInfo } from '@/ui/components/forms/CadAlterInfo';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { dateDiaMesAno, dateHoraMin } from '@/services/date';
import { errorMsg } from '@/services/api';
import { DivCheckBox } from '@/ui/components/forms/DivCheckBox';
import { InputMaskLabel, Masks } from '@/ui/components/forms/InputMaskLabel';
import { getPostoCombustivelPorId } from '@/services/postoCombustivel';
import { addAbastecimento, getAbastecimentoPorId, updateAbastecimento, type dadosAddEdicaoAbastecimentoType } from '@/services/abastecimento';
import { UploadFoto } from '@/ui/components/forms/UploadFoto';
import TextareaLabel from '@/ui/components/forms/TextareaLabel';
import { CheckBoxLabel } from '@/ui/components/forms/CheckBoxLabel';
import { Label } from '@/components/ui/label';
import { currency } from '@/services/currency';
import { toNumber } from '@/services/utils';
import SelectPostoCombustivel from '@/ui/selects/PostoCombustivelSelect';
import SelectPostoCombustivelTanque from '@/ui/selects/PostoCombustivelTanqueSelect';
import SelectVeiculo from '@/ui/selects/VeiculoSelect';
import SelectVeiculoTanque from '@/ui/selects/VeiculoTanqueSelect';
import SelectProdutoAbastecimento from '@/ui/selects/ProdutoAbastecimentoSelect';
import SelectMotorista from '@/ui/selects/MotoristaSelect';
import InputDataControl from '@/ui/components/forms/InputDataControl';
import { formatarDataParaAPI } from '@/services/formatacao';

export const schema = z.object({
  idVeiculo: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }, { message: "Selecione o veículo" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o veículo" }),
  idPessoa: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }, { message: "Selecione o motorista" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o motorista" }),
  idPostoCombustivel: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }, { message: "Selecione o posto de combustível" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o posto de combustível" }),
  idPostoCombustivelTanque: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }).optional(),
  idProdutoAbastecimento: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }, { message: "Selecione o produto abastecimento" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o produto abastecimento" }),
  idVeiculoTanque: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }, { message: "Selecione o tanqu do veículo" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o tanque do veículo" }),
  quilometragem: z.string().optional(),
  quantidadeAbastecida: z.string().optional(),
  valorUnitario: z.string().optional(),
  observacao: z.string().optional(),
  tanqueCheio: z.boolean().optional(),
  idArquivoFotoPainelAntes: z.number().optional(),
  idArquivoFotoPainelDepois: z.number().optional(),
  dataAbastecimento: z.string().optional(),
});

export default function AbastecimentoForm() {
  const { register, handleSubmit, reset, setValue, watch, control, setFocus, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const idPosto = searchParams.get("idPosto");
  const idVeiculo = searchParams.get("idVeiculo");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cadInfo, setCadInfo] = useState<string>("");
  const [edicaoInfo, setEdicaoInfo] = useState<string>("");
  const [postoInterno, setPostoInterno] = useState(false);

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

  useEffect(() => {
    const subscription = watch((values, field) => {
      if (field.name == "idPostoCombustivel")
        verificaPostoInterno(values.idPostoCombustivel?.value)
    });

    return () => subscription.unsubscribe();
  }, [watch])

  const verificaPostoInterno = async (idPostoCombustivel?: number) => {
    if (!idPostoCombustivel) {
      setPostoInterno(false);
      return;
    }
    const data = await getPostoCombustivelPorId(idPostoCombustivel || 0);
    setPostoInterno(data.isInterno || false);
  }

  const setValuesPorId = async () => {
    const process = toast.loading("Buscando item...");
    try {
      if (!id || isNaN(Number(id))) throw new Error("Não foi possível encontrar o item");
      const item = await getAbastecimentoPorId(Number(id));
      verificaPostoInterno(item.idPostoCombustivel)
      reset({
        idVeiculo: { value: item.idVeiculo, label: item.descricaoVeiculo },
        idPessoa: { value: item.idPessoa, label: item.razaoSocialPessoa },
        idPostoCombustivel: { value: item.idPostoCombustivel, label: item.razaoSocialPostoCombustivel },
        quilometragem: item.quilometragem.toString(),
        quantidadeAbastecida: item.quantidadeAbastecida.toString(),
        valorUnitario: String(currency(item.valorUnitario)),
        observacao: item.observacao ?? "",
        tanqueCheio: item.tanqueCheio ? true : false,
        idVeiculoTanque: { value: item.idVeiculoTanque, label: item.descricaoVeiculoTanque },
        dataAbastecimento: item.dataAbastecimento ?? "",
        idArquivoFotoPainelAntes: item.idArquivoFotoPainelAntes ?? 0,
        idArquivoFotoPainelDepois: item.idArquivoFotoPainelDepois ?? 0,
      })

      setTimeout(() => {
        setValue("idPostoCombustivelTanque", { value: item.idPostoCombustivelTanque, label: item.descricaoPostoCombustivelTanque })
        setValue("idProdutoAbastecimento", { value: item.idProdutoAbastecimento, label: item.descricaoProdutoAbastecimento })
      }, 500);

      setCadInfo(`${item.usuarioCadastro} ${dateDiaMesAno(item.dataCadastro)} ${dateHoraMin(item.dataCadastro)}`);
      setEdicaoInfo(`${item.usuarioEdicao} ${dateDiaMesAno(item.dataEdicao)} ${dateHoraMin(item.dataEdicao)}`);
      toast.dismiss(process);
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error), type: "error", isLoading: false, autoClose: 2000 });
      navigate("/abastecimento");
    }
  };

  const submit = async (data: dadosAddEdicaoAbastecimentoType) => {
    if (loading) return;
    setLoading(true);
    const process = toast.loading("Salvando item...")
    try {
      if (!id) {
        const post: dadosAddEdicaoAbastecimentoType = {
          idVeiculo: Number(idVeiculo) !== 0 ? Number(idVeiculo) : data.idVeiculo ?? null,
          idPessoa: data.idPessoa ?? null,
          idVeiculoTanque: data.idVeiculoTanque ?? null,
          idPostoCombustivel: Number(idPosto) !== 0 ? Number(idPosto) : data.idPostoCombustivel ?? null,
          idPostoCombustivelTanque: (data.idPostoCombustivelTanque as any)?.value ?? null,
          idProdutoAbastecimento: data.idProdutoAbastecimento ?? null,
          quilometragem: +data.quilometragem,
          quantidadeAbastecida: +data.quantidadeAbastecida,
          valorUnitario: toNumber(data.valorUnitario) ?? 0,
          observacao: data.observacao,
          tanqueCheio: data.tanqueCheio ?? false,
          dataAbastecimento: formatarDataParaAPI(data.dataAbastecimento),
          idArquivoFotoPainelAntes: data.idArquivoFotoPainelAntes !== 0 ? data.idArquivoFotoPainelAntes : null,
          idArquivoFotoPainelDepois: data.idArquivoFotoPainelDepois !== 0 ? data.idArquivoFotoPainelDepois : null,
        }
        const res = await addAbastecimento(post);
        toast.update(process, { render: res, type: "success", isLoading: false, autoClose: 2000 });
      }
      else {
        const put: dadosAddEdicaoAbastecimentoType = {
          idVeiculo: Number(idVeiculo) !== 0 ? Number(idVeiculo) : data.idVeiculo ?? null,
          idPessoa: data.idPessoa ?? null,
          idVeiculoTanque: data.idVeiculoTanque ?? null,
          idPostoCombustivel: Number(idPosto) !== 0 ? Number(idPosto) : data.idPostoCombustivel ?? null,
          idPostoCombustivelTanque: (data.idPostoCombustivelTanque as any)?.value ?? null,
          idProdutoAbastecimento: data.idProdutoAbastecimento ?? null,
          quilometragem: +data.quilometragem,
          quantidadeAbastecida: +data.quantidadeAbastecida,
          valorUnitario: toNumber(data.valorUnitario) ?? 0,
          observacao: data.observacao,
          tanqueCheio: data.tanqueCheio ?? false,
          dataAbastecimento: formatarDataParaAPI(data.dataAbastecimento),
          idArquivoFotoPainelAntes: data.idArquivoFotoPainelAntes !== 0 ? data.idArquivoFotoPainelAntes : null,
          idArquivoFotoPainelDepois: data.idArquivoFotoPainelDepois !== 0 ? data.idArquivoFotoPainelDepois : null,
        }
        const res = await updateAbastecimento(Number(id), put);
        toast.update(process, { render: res, type: "success", isLoading: false, autoClose: 2000 });
      }
      reset();
      idPosto ? navigate(`/posto-combustivel/form/${idPosto}`) : idVeiculo ? navigate(`/veiculo/form/${idVeiculo}`) : navigate("/abastecimento");
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error), type: "error", isLoading: false, autoClose: 2000 });
    }
    finally {
      setLoading(false);
    }
  }

  const handleClickVoltar = () => {
    idPosto ? navigate(`/posto-combustivel/form/${idPosto}`) : idVeiculo ? navigate(`/veiculo/form/${idVeiculo}`) : navigate("/abastecimento");
  }

  return (
    <div className="w-full mt-16 flex flex-col lg:flex-row gap-4">
      <form autoComplete='off' className="flex-[3] flex flex-col gap-4" onSubmit={handleSubmit((data) => submit(data as unknown as dadosAddEdicaoAbastecimentoType))}>

        <FormContainer>
          <FormContainerHeader title="Abastecimento" />
          <FormContainerBody>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2'>
              {!idPosto ? <SelectPostoCombustivel control={control} /> : <></>}
              {postoInterno ? <SelectPostoCombustivelTanque control={control} /> : <></>}
              {!idVeiculo ? <SelectVeiculo control={control} /> : <></>}
              <SelectVeiculoTanque control={control} />
              <SelectProdutoAbastecimento control={control} />
            </div>
          </FormContainerBody>
        </FormContainer>

        <FormContainer>
          <FormContainerHeader title="Informações abastecimento" />
          <FormContainerBody>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
              <SelectMotorista name='idPessoa' control={control} />
              <InputDataControl title="Data Abastecimento" name="dataAbastecimento" control={control} time/>
              <InputLabel name="quilometragem" title="Quilomentragem" register={{ ...register("quilometragem") }} type='number' step='0.01' />
              <InputLabel name="quantidadeAbastecida" title="Quantidade Abastecida" register={{ ...register("quantidadeAbastecida") }} type='number' step='0.01' />
              <InputMaskLabel name='valorUnitario' title='Valor Unitário' mask={Masks.dinheiro} setValue={setValue} value={watch("valorUnitario")} />
              <div className='lg:col-span-3'>
                <TextareaLabel title="Observação" name="observacao" register={{ ...register("observacao") }} />
              </div>
              <DivCheckBox style="line">
                <CheckBoxLabel name="tanqueCheio" title="Tanque Cheio" register={{ ...register("tanqueCheio") }} />
              </DivCheckBox>
            </div>
          </FormContainerBody>
        </FormContainer>

        <FormContainer>
          <FormContainerHeader title="Fotos" />
          <FormContainerBody>
            <div className='flex flex-col md:flex-row gap-2 w-full'>
              <Label className='space-y-2 flex flex-col items-start w-full'>
                Foto Painel Antes
                <div className="w-full">
                  <Controller
                    control={control}
                    name="idArquivoFotoPainelAntes"
                    render={({ field: { onChange, value } }) => (
                      <UploadFoto
                        referenciaTipo="FotoPainelAntes"
                        idArquivo={value ?? 0}
                        changeIdArquivo={onChange}
                        alt="Foto do painel antes"
                        isDisabled={loading}
                      />
                    )}
                  />
                </div>
              </Label>
              <Label className='space-y-2 flex flex-col items-start w-full'>
                Foto Painel Depois
                <div className="w-full">
                  <Controller
                    control={control}
                    name="idArquivoFotoPainelDepois"
                    render={({ field: { onChange, value } }) => (
                      <UploadFoto
                        referenciaTipo="FotoPainelDepois"
                        idArquivo={value ?? 0}
                        changeIdArquivo={onChange}
                        alt="Foto do painel depois"
                        isDisabled={loading}
                      />
                    )}
                  />
                </div>
              </Label>
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
  )
}
