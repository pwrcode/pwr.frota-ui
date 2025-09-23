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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { getVeiculoList } from '@/services/veiculo';
import { dateDiaMesAno, dateHoraMin } from '@/services/date';
import { errorMsg } from '@/services/api';
import AsyncReactSelect from '@/ui/components/forms/AsyncReactSelect';
import { DivCheckBox } from '@/ui/components/forms/DivCheckBox';
import { InputMaskLabel, Masks } from '@/ui/components/forms/InputMaskLabel';
import { getPostoCombustivelList, getPostoCombustivelPorId } from '@/services/postoCombustivel';
import { getProdutoAbastecimentoList } from '@/services/produtoAbastecimento';
import { getPessoaList } from '@/services/pessoa';
import { addAbastecimento, getAbastecimentoPorId, updateAbastecimento, type dadosAddEdicaoAbastecimentoType } from '@/services/abastecimento';
import { UploadFoto } from '@/ui/components/forms/UploadFoto';
import TextareaLabel from '@/ui/components/forms/TextareaLabel';
import { CheckBoxLabel } from '@/ui/components/forms/CheckBoxLabel';
import { Label } from '@/components/ui/label';
import { currency } from '@/services/currency';
import { toNumber } from '@/services/utils';
import InputDataLabel from '@/ui/components/forms/InputDataLabel';
import { getVeiculoTanqueList } from '@/services/veiculoTanque';
import type { listType, optionType } from '@/services/constants';
import { PlusButton } from '@/ui/components/buttons/PlusButton';
import Modal from '../VeiculoTanque/Modal';
import { getPostoCombustivelTanqueList } from '@/services/postoCombustivelTanque';

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
});

export default function AbastecimentoForm() {

  const { register, handleSubmit, reset, resetField, setValue, watch, control, setFocus, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const idPosto = searchParams.get("idPosto");
  const idVeiculo = searchParams.get("idVeiculo");

  const veiculo = watch("idVeiculo");
  const postoCombustivel = watch("idPostoCombustivel");
  const postoCombustivelTanque = watch("idPostoCombustivelTanque");
  const [postoInterno, setPostoInterno] = useState(false);

  const [tanques, setTanques] = useState<listType>([]);
  const [tanquesPosto, setTanquesPosto] = useState<listType>([]);
  const [produtosAbastecimento, setProdutosAbastecimento] = useState<listType>([])

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cadInfo, setCadInfo] = useState<string>("");
  const [edicaoInfo, setEdicaoInfo] = useState<string>("");
  const [dataAbastecimento, setDataAbastecimento] = useState("");

  const [idArquivoFotoPainelAntes, setIdArquivoFotoPainelAntes] = useState<number>(0);
  const [idArquivoFotoPainelDepois, setIdArquivoFotoPainelDepois] = useState<number>(0);


  useEffect(() => {
    if (id) return
  }, []);

  const getVeiculos = async (pesquisa?: string) => {
    const data = await getVeiculoList(pesquisa, undefined, undefined, undefined, undefined, undefined, undefined);
    return data;
  }

  const getPostosCombustivel = async (pesquisa?: string) => {
    const data = await getPostoCombustivelList(pesquisa, undefined, undefined, undefined, undefined);
    return data;
  }

  const getProdutosAbastecimento = async (pesquisa?: string) => {
    if (!postoCombustivelTanque && !veiculo) {
      setProdutosAbastecimento([]);
      return [];
    }
    const data = await getProdutoAbastecimentoList(pesquisa, undefined, undefined, undefined, postoCombustivelTanque?.value, veiculo?.value);
    setProdutosAbastecimento([...data]);
    return data;
  }

  const getPessoas = async (pesquisa?: string) => {
    const data = await getPessoaList(pesquisa, undefined, undefined, undefined, true, undefined, undefined, undefined, undefined, undefined);
    return data;
  }

  useEffect(() => {
    resetField("idVeiculoTanque")
    getTanques();
  }, [veiculo])

  useEffect(() => {
    resetField("idPostoCombustivelTanque")
    getTanquesPosto();
    verificaPostoInterno();
  }, [postoCombustivel])

  useEffect(() => {
    resetField("idProdutoAbastecimento")
    getProdutosAbastecimento();
  }, [postoCombustivelTanque, veiculo])

  const getTanques = async (pesquisa?: string) => {
    if (!veiculo) {
      setTanques([]);
      return [];
    }
    const data = await getVeiculoTanqueList(pesquisa, veiculo && veiculo.value ? veiculo.value : undefined, undefined);
    setTanques([...data]);
    return data;
  }

  const getTanquesPosto = async (pesquisa?: string) => {
    if (!postoCombustivel) {
      setTanquesPosto([]);
      return [];
    }
    const data = await getPostoCombustivelTanqueList(pesquisa, postoCombustivel && postoCombustivel.value ? postoCombustivel.value : undefined, undefined);
    setTanquesPosto([...data]);
    return data;
  }

  const verificaPostoInterno = async () => {
    if (!postoCombustivel) return;
    const data = await getPostoCombustivelPorId(postoCombustivel.value || 0);
    setPostoInterno(data.isInterno || false);
  }

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
      const item = await getAbastecimentoPorId(Number(id));
      setDataAbastecimento(item.dataAbastecimento ?? "");
      setIdArquivoFotoPainelAntes(item.idArquivoFotoPainelAntes ?? 0);
      setIdArquivoFotoPainelDepois(item.idArquivoFotoPainelDepois ?? 0);
      setValue("idVeiculo", { value: item.idVeiculo, label: item.descricaoVeiculo });
      setValue("idPessoa", { value: item.idPessoa, label: item.razaoSocialPessoa });
      setValue("idProdutoAbastecimento", { value: item.idProdutoAbastecimento, label: item.descricaoProdutoAbastecimento });
      setValue("idPostoCombustivel", { value: item.idPostoCombustivel, label: item.razaoSocialPostoCombustivel });
      setValue("quilometragem", item.quilometragem.toString())
      setValue("quantidadeAbastecida", item.quantidadeAbastecida.toString())
      setValue("valorUnitario", String(currency(item.valorUnitario)))
      setValue("observacao", item.observacao ?? "")
      setValue("tanqueCheio", item.tanqueCheio ? true : false)
      setTimeout(() => {
        setValue("idVeiculoTanque", { value: item.idVeiculoTanque, label: item.descricaoVeiculoTanque })
      }, 500);
      setTimeout(() => {
        setValue("idPostoCombustivelTanque", { value: item.idPostoCombustivelTanque, label: item.descricaoPostoCombustivelTanque })
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
          dataAbastecimento: dataAbastecimento ? dataAbastecimento.slice(0, 11).concat("00:00:00") : "",
          idVeiculo: Number(idVeiculo) !== 0 ? Number(idVeiculo) : data.idVeiculo ?? null,
          idPessoa: data.idPessoa ?? null,
          idVeiculoTanque: data.idVeiculoTanque ?? null,
          idPostoCombustivel: Number(idPosto) !== 0 ? Number(idPosto) : data.idPostoCombustivel ?? null,
          idPostoCombustivelTanque: data.idPostoCombustivelTanque ?? null,
          idProdutoAbastecimento: data.idProdutoAbastecimento ?? null,
          quilometragem: +data.quilometragem,
          quantidadeAbastecida: +data.quantidadeAbastecida,
          valorUnitario: toNumber(data.valorUnitario) ?? 0,
          observacao: data.observacao,
          tanqueCheio: data.tanqueCheio ?? false,
          idArquivoFotoPainelAntes: idArquivoFotoPainelAntes !== 0 ? idArquivoFotoPainelAntes : null,
          idArquivoFotoPainelDepois: idArquivoFotoPainelDepois !== 0 ? idArquivoFotoPainelDepois : null,
        }
        const res = await addAbastecimento(post);
        toast.update(process, { render: res, type: "success", isLoading: false, autoClose: 2000 });
      }
      else {
        const put: dadosAddEdicaoAbastecimentoType = {
          dataAbastecimento: dataAbastecimento ? dataAbastecimento.slice(0, 11).concat("00:00:00") : "",
          idVeiculo: Number(idVeiculo) !== 0 ? Number(idVeiculo) : data.idVeiculo ?? null,
          idPessoa: data.idPessoa ?? null,
          idVeiculoTanque: data.idVeiculoTanque ?? null,
          idPostoCombustivelTanque: data.idPostoCombustivelTanque ?? null,
          idPostoCombustivel: Number(idPosto) !== 0 ? Number(idPosto) : data.idPostoCombustivel ?? null,
          idProdutoAbastecimento: data.idProdutoAbastecimento ?? null,
          quilometragem: +data.quilometragem,
          quantidadeAbastecida: +data.quantidadeAbastecida,
          valorUnitario: toNumber(data.valorUnitario) ?? 0,
          observacao: data.observacao,
          tanqueCheio: data.tanqueCheio ?? false,
          idArquivoFotoPainelAntes: idArquivoFotoPainelAntes !== 0 ? idArquivoFotoPainelAntes : null,
          idArquivoFotoPainelDepois: idArquivoFotoPainelDepois !== 0 ? idArquivoFotoPainelDepois : null,
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
              {!idPosto ? <AsyncReactSelect style='2xl:col-span-2' name="idPostoCombustivel" title="Posto Combustível" control={control} asyncFunction={getPostosCombustivel} options={[]} isClearable /> : <></>}
              {postoInterno ? <AsyncReactSelect style='2xl:col-span-2' name="idPostoCombustivelTanque" title="Tanque Posto" control={control} asyncFunction={getTanquesPosto} options={tanquesPosto} filter isClearable size="w-full" isDisabled={!postoInterno} /> : <></>}
              {!idVeiculo ? <AsyncReactSelect name="idVeiculo" title="Veículo" control={control} asyncFunction={getVeiculos} options={[]} isClearable /> : <></>}
              <AsyncReactSelect name="idVeiculoTanque" title="Tanque Veiculo" control={control} asyncFunction={getTanques} options={tanques} filter isClearable size="w-full" />
              <AsyncReactSelect name="idProdutoAbastecimento" title="Produto Abastecimento" control={control} options={produtosAbastecimento} asyncFunction={getProdutosAbastecimento} filter isClearable size="w-full" />
            </div>
          </FormContainerBody>
        </FormContainer>

        <FormContainer>
          <FormContainerHeader title="Informações abastecimento" />
          <FormContainerBody>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
              <AsyncReactSelect name="idPessoa" title="Motorista" control={control} asyncFunction={getPessoas} options={[]} isClearable />
              <InputDataLabel title="Data Abastecimento" name="dataAbastecimento" date={dataAbastecimento} setDate={setDataAbastecimento} />
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
                  <UploadFoto referenciaTipo="FotoPainelAntes" idArquivo={idArquivoFotoPainelAntes} changeIdArquivo={setIdArquivoFotoPainelAntes} alt="Foto do painel antes" isDisabled={loading} />
                </div>
              </Label>
              <Label className='space-y-2 flex flex-col items-start w-full'>
                Foto Painel Depois
                <div className="w-full">
                  <UploadFoto referenciaTipo="FotoPainelDepois" idArquivo={idArquivoFotoPainelDepois} changeIdArquivo={setIdArquivoFotoPainelDepois} alt="Foto do painel depois" isDisabled={loading} />
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
