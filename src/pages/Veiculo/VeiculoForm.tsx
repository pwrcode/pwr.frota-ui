import InputLabel from '@/ui/components/forms/InputLabel';
import { Button } from '@/components/ui/button';
import FormContainer from '@/ui/components/forms/FormContainer';
import FormContainerHeader from '@/ui/components/forms/FormContainerHeader';
import FormContainerBody from '@/ui/components/forms/FormContainerBody';
import FormLine from '@/ui/components/forms/FormLine';
import { ButtonSubmit } from '@/ui/components/buttons/FormButtons';
import { CadAlterInfo } from '@/ui/components/forms/CadAlterInfo';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { addVeiculo, type dadosAddEdicaoVeiculoType, getVeiculoPorId, updateVeiculo } from '@/services/veiculo';
import { dateDiaMesAno, dateHoraMin, formatarData } from '@/services/date';
import { errorMsg } from '@/services/api';
import AsyncReactSelect from '@/ui/components/forms/AsyncReactSelect';
import { DivCheckBox } from '@/ui/components/forms/DivCheckBox';
import { CheckBoxLabel } from '@/ui/components/forms/CheckBoxLabel';
import { getTipoVeiculoList } from '@/services/tipoVeiculo';
import { getVeiculoMarcaList } from '@/services/veiculoMarca';
import { getVeiculoModeloList } from '@/services/veiculoModelo';
import { InputMaskLabel, Masks } from '@/ui/components/forms/InputMaskLabel';
import InputDataAno from '@/ui/components/forms/InputDataAno';
import { formatMaskPlaca } from '@/services/mask';
import type { listType } from '@/services/constants';
import { currency } from '@/services/currency';
import { toNumber } from '@/services/utils';

export const schema = z.object({
  descricao: z.string().optional()/*.min(1, {message: "Informe a descrição"})*/,
  placa: z.string().optional()/*.min(1, {message: "Informe a placa"})*/,
  renavam: z.string().optional()/*.min(1, {message: "Informe o renavam"})*/,
  chassi: z.string().optional()/*.min(1, {message: "Informe o chassi"})*/,
  idTipoVeiculo: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }, { message: "Selecione o tipo veículo" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o tipo veículo" }),
  idVeiculoMarca: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }, { message: "Selecione a marca" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione a marca" }),
  idVeiculoModelo: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }, { message: "Selecione o modelo" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o modelo" }),
  versao: z.string().optional()/*.min(1, {message: "Informe a versão"})*/,
  anoFabricacao: z.string().optional()/*.min(1, {message: "Informe o ano de fabricação"})*/,
  anoModelo: z.string().optional()/*.min(1, {message: "Informe o ano do modelo"})*/,
  cor: z.string().optional()/*.min(1, {message: "Informe a cor"})*/,
  ativo: z.boolean().optional(),
  icone: z.string().optional()/*.min(1, {message: "Informe o icone"})*/,
  quilometragemInicial: z.string().optional()/*.min(1, {message: "Informe a quilometragemInicial"})*/,
  capacidadeCargaKg: z.string().optional()/*.min(1, {message: "Informe a capacidadeCargaKg"})*/,
  capacidadeVolumeM3: z.string().optional()/*.min(1, {message: "Informe a capacidadeVolumeM3"})*/,
  capacidadePassageiros: z.string().optional()/*.min(1, {message: "Informe a capacidadePassageiros"})*/,
  dataAquisicao: z.string().optional()/*.min(1, {message: "Informe a dataAquisicao"})*/,
  valorCompra: z.string().optional()/*.min(1, {message: "Informe o valorCompra"})*/,
  dataVenda: z.string().optional()/*.min(1, {message: "Informe a dataVenda"})*/,
  valorVenda: z.string().optional()/*.min(1, {message: "Informe o valorVenda"})*/,
});

export default function VeiculoForm() {

  const { register, handleSubmit, reset, setValue, watch, control, setFocus, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const { id } = useParams();
  const idVeiculoMarca = watch("idVeiculoMarca");
  const [veiculoModelos, setVeiculoModelos] = useState<listType>([])
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cadInfo, setCadInfo] = useState<string>("");
  const [edicaoInfo, setEdicaoInfo] = useState<string>("");

  useEffect(() => {
    if (id) return
    getTipoVeiculos();
    getVeiculoMarcas();
  }, []);

  useEffect(() => {
    getVeiculoModelos();
  }, [idVeiculoMarca])

  const getTipoVeiculos = async (pesquisa?: string) => {
    const data = await getTipoVeiculoList(pesquisa, undefined);
    return data;
  }

  const getVeiculoMarcas = async (pesquisa?: string) => {
    const data = await getVeiculoMarcaList(pesquisa);
    return data;
  }

  const getVeiculoModelos = async (pesquisa?: string) => {
    if (!idVeiculoMarca) {
      setVeiculoModelos([]);
      reset({ idTipoVeiculo: undefined });
      return [];
    }
    const data = await getVeiculoModeloList(pesquisa, idVeiculoMarca ? idVeiculoMarca.value : undefined);
    setVeiculoModelos([...data]);
    return data;
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
    else setValue("ativo", true);
  }, [id]);

  const setValuesPorId = async () => {
    const process = toast.loading("Buscando item...");
    try {
      if (!id || isNaN(Number(id))) throw new Error("Não foi possível encontrar o item");
      const item = await getVeiculoPorId(Number(id));
      setValue("descricao", item.descricao);
      setValue("placa", formatMaskPlaca(item.placa));
      setValue("renavam", item.renavam);
      setValue("chassi", item.chassi);
      if (item.idTipoVeiculo) setValue("idTipoVeiculo", { value: item.idTipoVeiculo, label: item.descricaoTipoVeiculo });
      if (item.idVeiculoMarca) setValue("idVeiculoMarca", { value: item.idVeiculoMarca, label: item.descricaoVeiculoMarca });
      if (item.idVeiculoModelo) setValue("idVeiculoModelo", { value: item.idVeiculoModelo, label: item.descricaoVeiculoModelo });
      setValue("versao", item.versao);
      setValue("anoFabricacao", item.anoFabricacao?.toString());
      setValue("anoModelo", item.anoModelo?.toString());
      setValue("cor", item.cor);
      setValue("ativo", item.ativo ? true : false);
      setValue("icone", item.icone);
      setValue("quilometragemInicial", item.quilometragemInicial?.toString());
      setValue("capacidadeCargaKg", item.capacidadeCargaKg?.toString());
      setValue("capacidadeVolumeM3", item.capacidadeVolumeM3?.toString());
      setValue("capacidadePassageiros", item.capacidadePassageiros?.toString());
      setValue("dataAquisicao", formatarData(item.dataAquisicao ?? "", "yyyy-mm-dd"));
      setValue("valorCompra", String(currency(item.valorCompra)));
      setValue("dataVenda", formatarData(item.dataVenda ?? "", "yyyy-mm-dd"));
      setValue("valorVenda", String(currency(item.valorVenda)));
      setCadInfo(`${item.usuarioCadastro} ${dateDiaMesAno(item.dataCadastro)} ${dateHoraMin(item.dataCadastro)}`);
      setEdicaoInfo(`${item.usuarioEdicao} ${dateDiaMesAno(item.dataEdicao)} ${dateHoraMin(item.dataEdicao)}`);
      toast.dismiss(process);
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error), type: "error", isLoading: false, autoClose: 2000 });
      navigate("/veiculo");
    }
  };

  const submit = async (data: dadosAddEdicaoVeiculoType) => {
    if (loading) return;
    setLoading(true);
    const process = toast.loading("Salvando item...")
    try {
      if (!id) {
        const post: dadosAddEdicaoVeiculoType = {
          descricao: data.descricao,
          placa: data.placa?.replace('-', ""),
          renavam: data.renavam,
          chassi: data.chassi,
          idTipoVeiculo: data.idTipoVeiculo ?? null,
          idVeiculoMarca: data.idVeiculoMarca ?? null,
          idVeiculoModelo: data.idVeiculoModelo ?? null,
          versao: data.versao,
          anoFabricacao: data.anoFabricacao,
          anoModelo: data.anoModelo,
          cor: data.cor,
          ativo: data.ativo ?? false,
          icone: data.icone,
          quilometragemInicial: data.quilometragemInicial,
          capacidadeCargaKg: data.capacidadeCargaKg,
          capacidadeVolumeM3: data.capacidadeVolumeM3,
          capacidadePassageiros: data.capacidadePassageiros,
          dataAquisicao: data.dataAquisicao ? data.dataAquisicao.slice(0, 11).concat("T00:00:00") : null,
          valorCompra: toNumber(data.valorCompra) ?? 0,
          dataVenda: data.dataVenda ? data.dataVenda.slice(0, 11).concat("T00:00:00") : null,
          valorVenda: toNumber(data.valorVenda) ?? 0,
        }
        const res = await addVeiculo(post);
        toast.update(process, { render: res.mensagem, type: "success", isLoading: false, autoClose: 2000 });
      }
      else {
        const put: dadosAddEdicaoVeiculoType = {
          descricao: data.descricao,
          placa: data.placa?.replace('-', ""),
          renavam: data.renavam,
          chassi: data.chassi,
          idTipoVeiculo: data.idTipoVeiculo ?? null,
          idVeiculoMarca: data.idVeiculoMarca ?? null,
          idVeiculoModelo: data.idVeiculoModelo ?? null,
          versao: data.versao,
          anoFabricacao: data.anoFabricacao,
          anoModelo: data.anoModelo,
          cor: data.cor,
          ativo: data.ativo ?? false,
          icone: data.icone,
          quilometragemInicial: data.quilometragemInicial,
          capacidadeCargaKg: data.capacidadeCargaKg,
          capacidadeVolumeM3: data.capacidadeVolumeM3,
          capacidadePassageiros: data.capacidadePassageiros,
          dataAquisicao: data.dataAquisicao ? data.dataAquisicao.slice(0, 11).concat("T00:00:00") : null,
          valorCompra: toNumber(data.valorCompra) ?? 0,
          dataVenda: data.dataVenda ? data.dataVenda.slice(0, 11).concat("T00:00:00") : null,
          valorVenda: toNumber(data.valorVenda) ?? 0,
        }
        const res = await updateVeiculo(Number(id), put);
        toast.update(process, { render: res, type: "success", isLoading: false, autoClose: 2000 });
      }
      reset();
      navigate("/veiculo");
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error), type: "error", isLoading: false, autoClose: 2000 });
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full mt-16 flex flex-col lg:flex-row gap-4">
      <form autoComplete='off' className="flex-[3] flex flex-col gap-4" onSubmit={handleSubmit((data) => submit(data as unknown as dadosAddEdicaoVeiculoType))}>
        <FormContainer>
          <FormContainerHeader title="Informações Básicas" />
          <FormContainerBody>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              <InputLabel name="descricao" title="Descrição" register={{ ...register("descricao") }} />
              <InputMaskLabel name='placa' title='Placa' mask={Masks.placa} value={watch("placa")} setValue={setValue} />
              <InputLabel name="renavam" title="Renavam" register={{ ...register("renavam") }} />
              <InputLabel name="chassi" title="Chassi" register={{ ...register("chassi") }} />
              <InputLabel name="cor" title="Cor" register={{ ...register("cor") }} />
              <InputLabel name="versao" title="Versão" register={{ ...register("versao") }} />
            </div>
            {(!id) && (
              <div className="mt-6">
                <DivCheckBox style="line">
                  <CheckBoxLabel name="ativo" title="Ativo" register={{ ...register("ativo") }} />
                </DivCheckBox>
              </div>
            )}
          </FormContainerBody>
        </FormContainer>

        <FormContainer>
          <FormContainerHeader title="Tipo e Modelo" />
          <FormContainerBody>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              <AsyncReactSelect name="idTipoVeiculo" title="Tipo Veículo" control={control} asyncFunction={getTipoVeiculos} options={[]} isClearable />
              <AsyncReactSelect name="idVeiculoMarca" title="Marca" control={control} asyncFunction={getVeiculoMarcas} options={[]} isClearable />
              <AsyncReactSelect name="idVeiculoModelo" title="Modelo" control={control} asyncFunction={getVeiculoModelos} options={veiculoModelos} filter isClearable />
              <InputMaskLabel name='anoFabricacao' title='Ano Fabricação' mask={Masks.numerico} value={(watch("anoFabricacao"))} setValue={setValue} />
              <InputMaskLabel name='anoModelo' title='Ano Modelo' mask={Masks.numerico} value={watch("anoModelo")} setValue={setValue} />
              <InputLabel name="icone" title="Ícone" register={{ ...register("icone") }} />
            </div>
          </FormContainerBody>
        </FormContainer>

        <FormContainer>
          <FormContainerHeader title="Capacidades e Especificações" />
          <FormContainerBody>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              <InputMaskLabel name='quilometragemInicial' title='Quilometragem Inicial' mask={Masks.numerico} value={watch("quilometragemInicial")} setValue={setValue} />
              <InputMaskLabel name='capacidadeCargaKg' title='Capacidade Carga (Kg)' mask={Masks.numerico} value={watch("capacidadeCargaKg")} setValue={setValue} />
              <InputMaskLabel name='capacidadeVolumeM3' title='Capacidade Volume (m³)' mask={Masks.numerico} value={watch("capacidadeVolumeM3")} setValue={setValue} />
              <InputMaskLabel name='capacidadePassageiros' title='Capacidade Passageiros' mask={Masks.numerico} value={watch("capacidadePassageiros")} setValue={setValue} />
            </div>
          </FormContainerBody>
        </FormContainer>

        <FormContainer>
          <FormContainerHeader title="Informações Comerciais" />
          <FormContainerBody>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <InputDataAno title="Data Aquisição" id="dataAquisição" register={{ ...register("dataAquisicao") }} />
              <InputMaskLabel name='valorCompra' title='Valor Compra' mask={Masks.dinheiro} setValue={setValue} value={watch("valorCompra")} />
              <InputDataAno title="Data Venda" id="dataVenda" register={{ ...register("dataVenda") }} />
              <InputMaskLabel name='valorVenda' title='Valor Venda' mask={Masks.dinheiro} setValue={setValue} value={watch("valorVenda")} />
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
                <Button variant="outline" type="button" onClick={() => navigate("/veiculo")} disabled={loading}>Cancelar</Button>
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
