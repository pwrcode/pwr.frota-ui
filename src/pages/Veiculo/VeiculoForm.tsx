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
import { dateDiaMesAno, dateHoraMin } from '@/services/date';
import { errorMsg } from '@/services/api';
import AsyncReactSelect from '@/ui/components/forms/AsyncReactSelect';
import { DivCheckBox } from '@/ui/components/forms/DivCheckBox';
import { CheckBoxLabel } from '@/ui/components/forms/CheckBoxLabel';
import { getTipoVeiculoList } from '@/services/tipoVeiculo';
import { getVeiculoMarcaList } from '@/services/veiculoMarca';
import { getVeiculoModeloList } from '@/services/veiculoModelo';
import { InputMaskLabel, Masks } from '@/ui/components/forms/InputMaskLabel';
import { formatMaskPlaca } from '@/services/mask';
import { tiposCorVeiculo, type listType, type optionType } from '@/services/constants';
import { currency } from '@/services/currency';
import { toNumber } from '@/services/utils';
import { PlusButton } from '@/ui/components/buttons/PlusButton';
import ModalMarca from '../VeiculoMarca/Modal';
import ModalModelo from '../VeiculoModelo/Modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, ChevronUp, Car, Fuel } from 'lucide-react';
import Abastecimento from '../Abastecimento/Index';
import type { dadosAddEdicaoVeiculoTanqueType } from '@/services/veiculoTanque';
import VeiculoTanque from '../VeiculoTanque/Index';
import InputDataLabel from '@/ui/components/forms/InputDataLabel';
import { UploadFoto } from '@/ui/components/forms/UploadFoto';
import { useEndereco } from '@/hooks/useEndereco';
import { getTipoMotorList } from '@/services/tipoMotor';

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
  idTipoMotor: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }, { message: "Selecione o tipo do motor" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o tipo do motor" }),
  versao: z.string().optional()/*.min(1, {message: "Informe a versão"})*/,
  anoFabricacao: z.string().optional()/*.min(1, {message: "Informe o ano de fabricação"})*/,
  anoModelo: z.string().optional()/*.min(1, {message: "Informe o ano do modelo"})*/,
  cor: z.object({
    label: z.string().optional(),
    value: z.string().optional()
  },).optional().transform(t => t && t.value ? t.value : undefined),
  ativo: z.boolean().optional(),
  isVendido: z.boolean().optional(),
  icone: z.string().optional()/*.min(1, {message: "Informe o icone"})*/,
  quilometragemInicial: z.string().optional()/*.min(1, {message: "Informe a quilometragemInicial"})*/,
  capacidadeCargaKg: z.string().optional()/*.min(1, {message: "Informe a capacidadeCargaKg"})*/,
  capacidadeVolumeM3: z.string().optional()/*.min(1, {message: "Informe a capacidadeVolumeM3"})*/,
  capacidadePassageiros: z.string().optional()/*.min(1, {message: "Informe a capacidadePassageiros"})*/,
  valorCompra: z.string().optional()/*.min(1, {message: "Informe o valorCompra"})*/,
  valorVenda: z.string().optional()/*.min(1, {message: "Informe o valorVenda"})*/,
  idUf: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }, { message: "Selecione o UF" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o UF" }),
  idMunicipio: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }, { message: "Selecione o município" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o município" }),
  idTipoMotor: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }, { message: "Selecione um Tipo Motor" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione um Tipo Motor" }),
});

export default function VeiculoForm() {

  const formFunctions = useForm({
    resolver: zodResolver(schema)
  });
  const { register, handleSubmit, reset, setValue, watch, resetField, control, setFocus, formState: { errors } } = formFunctions;

  const {
    getUfs, getMunicipios,
    ufs, municipios,
    setIdUf, setIdMunicipio,
  } = useEndereco(formFunctions);

  const { id } = useParams();
  const [idArquivoFotoVeiculo, setIdArquivoFotoVeiculo] = useState<number>(0);
  const idVeiculoMarca = watch("idVeiculoMarca");
  const idVeiculoModelo = watch("idVeiculoModelo.value");
  const isVendido = watch("isVendido");
  const [veiculoModelos, setVeiculoModelos] = useState<listType>([])
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cadInfo, setCadInfo] = useState<string>("");
  const [edicaoInfo, setEdicaoInfo] = useState<string>("");
  const [openModalFormMarca, setOpenModalFormMarca] = useState(false);
  const [openModalFormModelo, setOpenModalFormModelo] = useState(false);
  const [isDropDownTabsOpen, setIsDropDownTabsOpen] = useState(false);
  const [tabNameMobile, setTabNameMobile] = useState("Veículo");
  const [tanques, setTanques] = useState<dadosAddEdicaoVeiculoTanqueType[]>([]);
  const [dataCompra, setDataCompra] = useState("");
  const [dataVenda, setDataVenda] = useState("");

  useEffect(() => {
    if (id) return
    getTipoVeiculos();
    getVeiculoMarcas();
    getUfs();
  }, []);

  useEffect(() => {
    resetField("idVeiculoModelo")
    getVeiculoModelos();
  }, [idVeiculoMarca])

  const getTiposMotor = async (pesquisa?: string) => {
    const data = await getTipoMotorList(pesquisa);
    return data;
  }

  const getTipoVeiculos = async (pesquisa?: string) => {
    const data = await getTipoVeiculoList(pesquisa, undefined);
    return data;
  }

  const getTiposMotor = async (pesquisa?: string) => {
    const data = await getTipoMotorList(pesquisa);
    return data;
  }

  const getVeiculoMarcas = async (pesquisa?: string) => {
    const data = await getVeiculoMarcaList(pesquisa);
    return data;
  }

  const getVeiculoModelos = async (pesquisa?: string) => {
    if (!idVeiculoMarca) {
      setVeiculoModelos([]);
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
      if (item.idUf) setIdUf(item.idUf);
      if (item.idMunicipio) setIdMunicipio(item.idMunicipio);
      setIdArquivoFotoVeiculo(item.idFotoVeiculo ?? 0)
      setValue("descricao", item.descricao);
      setValue("placa", formatMaskPlaca(item.placa));
      setValue("renavam", item.renavam);
      setValue("chassi", item.chassi);
      if (item.idTipoVeiculo) setValue("idTipoVeiculo", { value: item.idTipoVeiculo, label: item.descricaoTipoVeiculo });
      if (item.idTipoMotor) setValue("idTipoMotor", { value: item.idTipoMotor, label: item.descricaoTipoMotor });
      if (item.idVeiculoMarca) setValue("idVeiculoMarca", { value: item.idVeiculoMarca, label: item.descricaoVeiculoMarca });
      if (item.idTipoMotor) setValue("idTipoMotor", { value: item.idTipoMotor, label: item.descricaoTipoMotor });
      setValue("versao", item.versao);
      setValue("anoFabricacao", item.anoFabricacao?.toString());
      setValue("anoModelo", item.anoModelo?.toString());
      setValue("cor", item.cor ? { label: item.cor, value: item.cor } : undefined);
      setValue("ativo", item.ativo ? true : false);
      setValue("icone", item.icone);
      setValue("quilometragemInicial", item.quilometragemInicial?.toString());
      setValue("capacidadeCargaKg", item.capacidadeCargaKg?.toString());
      setValue("capacidadeVolumeM3", item.capacidadeVolumeM3?.toString());
      setValue("capacidadePassageiros", item.capacidadePassageiros?.toString());
      setDataCompra(item.dataAquisicao);
      setDataVenda(item.dataVenda);
      setValue("valorCompra", String(currency(item.valorCompra)));
      setValue("valorVenda", String(currency(item.valorVenda)));
      setValue("isVendido", item.valorVenda ? true : false);
      setCadInfo(`${item.usuarioCadastro} ${dateDiaMesAno(item.dataCadastro)} ${dateHoraMin(item.dataCadastro)}`);
      setEdicaoInfo(`${item.usuarioEdicao} ${dateDiaMesAno(item.dataEdicao)} ${dateHoraMin(item.dataEdicao)}`);
      setTimeout(() => {
        if (item.idVeiculoModelo) setValue("idVeiculoModelo", { value: item.idVeiculoModelo, label: item.descricaoVeiculoModelo });
      }, 500);
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
          idFotoVeiculo: idArquivoFotoVeiculo,
          descricao: data.descricao,
          placa: data.placa?.replace('-', ""),
          renavam: data.renavam,
          chassi: data.chassi,
          idTipoVeiculo: data.idTipoVeiculo ?? null,
          idTipoMotor: data.idTipoMotor ?? null,
          idVeiculoMarca: data.idVeiculoMarca ?? null,
          idVeiculoModelo: data.idVeiculoModelo ?? null,
          idTipoMotor: data.idTipoMotor ?? null,
          versao: data.versao,
          anoFabricacao: data.anoFabricacao,
          anoModelo: data.anoModelo,
          cor: data.cor ?? null,
          ativo: data.ativo ?? false,
          icone: data.icone,
          quilometragemInicial: +data.quilometragemInicial,
          capacidadeCargaKg: +data.capacidadeCargaKg,
          capacidadeVolumeM3: +data.capacidadeVolumeM3,
          capacidadePassageiros: +data.capacidadePassageiros,
          dataAquisicao: dataCompra ? dataCompra.slice(0, 11).concat("00:00:00") : null,
          valorCompra: toNumber(data.valorCompra) ?? 0,
          dataVenda: isVendido ? dataVenda ? dataVenda.slice(0, 11).concat("00:00:00") : null : null,
          valorVenda: isVendido ? toNumber(data.valorVenda) ?? 0 : null,
          veiculoTanques: tanques,
          idUf: data.idUf ?? null,
          idMunicipio: data.idMunicipio ?? null,
        }
        const res = await addVeiculo(post);
        toast.update(process, { render: res.mensagem, type: "success", isLoading: false, autoClose: 2000 });
      }
      else {
        const put: dadosAddEdicaoVeiculoType = {
          idFotoVeiculo: idArquivoFotoVeiculo,
          descricao: data.descricao,
          placa: data.placa?.replace('-', ""),
          renavam: data.renavam,
          chassi: data.chassi,
          idTipoVeiculo: data.idTipoVeiculo ?? null,
          idTipoMotor: data.idTipoMotor ?? null,
          idVeiculoMarca: data.idVeiculoMarca ?? null,
          idVeiculoModelo: data.idVeiculoModelo ?? null,
          idTipoMotor: data.idTipoMotor ?? null,
          versao: data.versao,
          anoFabricacao: data.anoFabricacao,
          anoModelo: data.anoModelo,
          cor: data.cor ?? null,
          ativo: data.ativo ?? false,
          icone: data.icone,
          quilometragemInicial: +data.quilometragemInicial,
          capacidadeCargaKg: +data.capacidadeCargaKg,
          capacidadeVolumeM3: +data.capacidadeVolumeM3,
          capacidadePassageiros: data.capacidadePassageiros,
          dataAquisicao: dataCompra ? dataCompra.slice(0, 11).concat("00:00:00") : null,
          valorCompra: toNumber(data.valorCompra) ?? 0,
          dataVenda: isVendido ? dataVenda ? dataVenda.slice(0, 11).concat("00:00:00") : null : null,
          valorVenda: isVendido ? toNumber(data.valorVenda) ?? 0 : null,
          idUf: data.idUf ?? null,
          idMunicipio: data.idMunicipio ?? null,
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

  const handleClickAdicionarMarca = () => {
    setOpenModalFormMarca(true);
  }

  const selecionarMarca = (marca: optionType) => {
    setValue("idVeiculoMarca", marca);
    getVeiculoMarcas();
  }

  const handleClickAdicionarModelo = () => {
    setOpenModalFormModelo(true);
  }

  const selecionarModelo = (modelo: optionType) => {
    setValue("idVeiculoModelo", modelo);
    getVeiculoModelos();
  }

  return (
    <>
      <ModalMarca open={openModalFormMarca} setOpen={setOpenModalFormMarca} id={idVeiculoMarca?.value ?? 0} selecionarMarca={selecionarMarca} />

      <ModalModelo open={openModalFormModelo} setOpen={setOpenModalFormModelo} id={idVeiculoModelo ?? 0} selecionarModelo={selecionarModelo} idMarca={idVeiculoMarca?.value} />

      <Tabs defaultValue='veiculo' className='w-full mt-16 flex flex-col gap-2'>

        <TabsList className='w-fit h-min hidden md:flex justify-start gap-1 p-1 bg-muted rounded-lg'>
          <TabsTrigger
            value='veiculo'
            onClick={() => setTabNameMobile("Veículo")}
            className='cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-md transition-all duration-200 data-[state=active]:bg-orange-500 data-[state=active]:text-white hover:bg-orange-50 hover:text-orange-600'
          >
            <Car size={16} />
            Veículo
          </TabsTrigger>
          {id ? <>
            <TabsTrigger
              value='abastecimento'
              onClick={() => setTabNameMobile("Abastecimentos")}
              className='cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-md transition-all duration-200 data-[state=active]:bg-orange-500 data-[state=active]:text-white hover:bg-orange-50 hover:text-orange-600'
            >
              <Fuel size={16} />
              Abastecimentos
            </TabsTrigger>
          </> : <></>}
        </TabsList>

        <DropdownMenu onOpenChange={(open) => setIsDropDownTabsOpen(open)} open={id ? isDropDownTabsOpen : false}>
          <TabsList className='flex w-full px-1 py-1 md:hidden bg-muted rounded-lg'>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className='w-full text-foreground flex justify-between items-center gap-2 py-3 px-4 hover:bg-orange-50 hover:text-orange-600'
              >
                <div className='flex items-center gap-2'>
                  {tabNameMobile === "Veículo" && <Car size={16} />}
                  {tabNameMobile === "Abastecimentos" && <Fuel size={16} />}
                  {tabNameMobile}
                </div>
                {id ? <div className='ml-4'>{isDropDownTabsOpen ? <ChevronUp /> : <ChevronDown />}</div> : <></>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='md:hidden w-64 p-1'>
              <DropdownMenuItem className='p-0'>
                <TabsTrigger
                  value='veiculo'
                  onClick={() => setTabNameMobile("Veículo")}
                  className='w-full justify-start flex items-center gap-2 py-3 px-3 rounded-md transition-all duration-200 data-[state=active]:bg-orange-500 data-[state=active]:text-white hover:bg-orange-50 hover:text-orange-600'
                >
                  <Car size={16} />
                  Veículo
                </TabsTrigger>
              </DropdownMenuItem>
              {id && (
                <DropdownMenuItem className='p-0'>
                  <TabsTrigger
                    value='abastecimento'
                    onClick={() => setTabNameMobile("Abastecimentos")}
                    className='w-full justify-start flex items-center gap-2 py-3 px-3 rounded-md transition-all duration-200 data-[state=active]:bg-orange-500 data-[state=active]:text-white hover:bg-orange-50 hover:text-orange-600'
                  >
                    <Fuel size={16} />
                    Abastecimentos
                  </TabsTrigger>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </TabsList>
        </DropdownMenu>

        <TabsContent value='veiculo' className="w-full flex flex-col lg:flex-row-reverse gap-4">
          <div className="flex-1">
            <UploadFoto referenciaTipo="Veiculo" idArquivo={idArquivoFotoVeiculo} changeIdArquivo={setIdArquivoFotoVeiculo} alt="Foto do Veículo" isDisabled={loading} />
          </div>

          <form autoComplete='off' className="flex-[3] flex flex-col gap-4" onSubmit={handleSubmit((data) => submit(data as unknown as dadosAddEdicaoVeiculoType))}>
            <FormContainer>
              <FormContainerHeader title="Informações Básicas" />
              <FormContainerBody>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  <InputLabel name="descricao" title="Descrição" register={{ ...register("descricao") }} />
                  <InputMaskLabel name='placa' title='Placa' mask={Masks.placa} value={watch("placa")} setValue={setValue} />
                  <InputLabel name="renavam" title="Renavam" register={{ ...register("renavam") }} />
                  <InputLabel name="chassi" title="Chassi" register={{ ...register("chassi") }} />
                  <AsyncReactSelect name="cor" title="Cor" control={control} options={tiposCorVeiculo} isClearable size="w-full" />
                  <InputLabel name="versao" title="Versão" register={{ ...register("versao") }} />
                  <AsyncReactSelect name="idUf" title="UF" control={control} options={ufs} asyncFunction={getUfs} size="col-span-1" filter={true} isClearable />
                  <AsyncReactSelect name="idMunicipio" title="Município" control={control} options={municipios} asyncFunction={getMunicipios} filter={true} isClearable size="col-span-1" />
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
                  <AsyncReactSelect name="idTipoMotor" title="Tipo Motor" control={control} asyncFunction={getTiposMotor} options={[]} isClearable />
                  <div className='flex justify-between items-end gap-2'>
                    <AsyncReactSelect name="idVeiculoMarca" title="Marca" control={control} options={[]} asyncFunction={getVeiculoMarcas} isClearable size="w-full" />
                    <PlusButton loading={loading} func={handleClickAdicionarMarca} />
                  </div>
                  <div className=' flex justify-between items-end gap-2'>
                    <AsyncReactSelect name="idVeiculoModelo" title="Modelo" control={control} options={veiculoModelos} asyncFunction={getVeiculoModelos} filter isClearable size="w-full" />
                    <PlusButton loading={loading} func={handleClickAdicionarModelo} />
                  </div>
                  <AsyncReactSelect name="idTipoMotor" title="Tipo Motor" control={control} options={[]} asyncFunction={getTiposMotor} isClearable />
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
                  <InputLabel name='quilometragemInicial' title='Quilometragem Inicial' register={{ ...register("quilometragemInicial") }} type='number' step='0.01' />
                  <InputLabel name='capacidadeCargaKg' title='Capacidade Carga (Kg)' register={{ ...register("capacidadeCargaKg") }} type='number' step='0.01' />
                  <InputLabel name='capacidadeVolumeM3' title='Capacidade Volume (m³)' register={{ ...register("capacidadeVolumeM3") }} type='number' step='0.01' />
                  <InputMaskLabel name='capacidadePassageiros' title='Capacidade Passageiros' mask={Masks.numerico} value={watch("capacidadePassageiros")} setValue={setValue} />
                </div>
              </FormContainerBody>
            </FormContainer>

            <FormContainer>
              <FormContainerHeader title="Informações Comerciais" />
              <FormContainerBody>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                  <InputDataLabel name='dataAquisicao' title='Data Aquisição' date={dataCompra} setDate={setDataCompra} />
                  <InputMaskLabel name='valorCompra' title='Valor Compra' mask={Masks.dinheiro} setValue={setValue} value={watch("valorCompra")} />
                  {isVendido ?
                    <>
                      <InputDataLabel name='dataVenda' title='Data Venda' date={dataVenda} setDate={setDataVenda} />
                      <InputMaskLabel name='valorVenda' title='Valor Venda' mask={Masks.dinheiro} setValue={setValue} value={watch("valorVenda")} />
                    </> : <></>}
                </div>
                <DivCheckBox style="line">
                  <CheckBoxLabel name="isVendido" title="Vendido" register={{ ...register("isVendido") }} />
                </DivCheckBox>
              </FormContainerBody>
            </FormContainer>

            <VeiculoTanque idVeiculo={Number(id) !== 0 ? Number(id) : undefined} tanques={tanques} setTanques={setTanques} />

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
        </TabsContent>

        <TabsContent value='abastecimento'>
          <Abastecimento idVeiculo={Number(id)} />
        </TabsContent>

      </Tabs>
    </>
  )
}
