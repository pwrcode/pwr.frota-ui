import { Button } from '@/components/ui/button';
import FormContainer from '@/ui/components/forms/FormContainer';
import FormContainerHeader from '@/ui/components/forms/FormContainerHeader';
import FormContainerBody from '@/ui/components/forms/FormContainerBody';
import FormLine from '@/ui/components/forms/FormLine';
import { ButtonSubmit } from '@/ui/components/buttons/FormButtons';
import { CadAlterInfo } from '@/ui/components/forms/CadAlterInfo';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { dateDiaMesAno, dateHoraMin } from '@/services/date';
import { errorMsg } from '@/services/api';
import { InputMaskLabel, Masks } from '@/ui/components/forms/InputMaskLabel';
import { addMulta, getMultaPorId, updateMulta, type dadosAddEdicaoMultaType } from '@/services/multa';
import TextareaLabel from '@/ui/components/forms/TextareaLabel';
import { removeNonDigit } from '@/services/utils';
import { formatarDataParaAPI } from '@/services/formatacao';
import { tiposInfração } from '@/services/constants';
import { currency } from '@/services/currency';
import { Label } from '@/components/ui/label';
import { UploadFoto } from '@/ui/components/forms/UploadFoto';
import SelectVeiculo from '@/ui/selects/VeiculoSelect';
import SelectMotorista from '@/ui/selects/MotoristaSelect';
import SelectTipoInfracao from '@/ui/selects/TipoInfracaoSelect';
import InputDataControl from '@/ui/components/forms/InputDataControl';

export default function MultaForm() {

  const schema = z.object({
    idVeiculo: z.object({
      label: z.string().nullish(),
      value: z.number().nullish()
    }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o tipo localização" }),
    idMotorista: z.object({
      label: z.string().nullish(),
      value: z.number().nullish()
    }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o Motorista" }),
    tipoInfracao: z.object({
      label: z.string().nullish(),
      value: z.number().nullish()
    }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o tipo da infração" }),
    idArquivoAutuacao: z.number().nullish(),
    idArquivoComprovantePagamento: z.number().nullish(),
    dataInfracao: z.string().nullish().transform(value => value ? formatarDataParaAPI(value) : ""),
    numeroAuto: z.string().nullish(),
    pontosCnh: z.coerce.number<number>().nullish(),
    valorMulta: z.string().nullish().transform(value => value ? removeNonDigit(value) : ""),
    dataVencimento: z.string().nullish().transform(value => value ? formatarDataParaAPI(value) : ""),
    dataPagamento: z.string().nullish().transform(value => value ? formatarDataParaAPI(value) : ""),
    observacoes: z.string().nullish(),
  });

  const formFunctions = useForm({
    resolver: zodResolver(schema)
  });

  const { register, handleSubmit, reset, setValue, watch, control, setFocus, formState: { errors } } = formFunctions;

  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cadInfo, setCadInfo] = useState<string>("");
  const [edicaoInfo, setEdicaoInfo] = useState<string>("");

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
      const item = await getMultaPorId(Number(id));
      reset({
        idVeiculo: { value: item.idVeiculo, label: item.descricaoVeiculo },
        idMotorista: { value: item.idMotorista, label: item.razaoSocialMotorista },
        tipoInfracao: {
          value: tiposInfração.find(t => t.valueLabel === String(item.tipoInfracao))?.value,
          label: tiposInfração.find(t => t.valueLabel === String(item.tipoInfracao))?.label,
        },
        idArquivoAutuacao: item.idArquivoAutuacao,
        idArquivoComprovantePagamento: item.idArquivoComprovantePagamento,
        dataInfracao: item.dataInfracao,
        dataPagamento: item.dataPagamento,
        dataVencimento: item.dataVencimento,
        numeroAuto: item.numeroAuto,
        pontosCnh: item.pontosCnh,
        valorMulta: currency(item.valorMulta),
        observacoes: item.observacoes,
      })

      setCadInfo(`${item.usuarioCadastro} ${dateDiaMesAno(item.dataCadastro)} ${dateHoraMin(item.dataCadastro)}`);
      setEdicaoInfo(`${item.usuarioEdicao} ${dateDiaMesAno(item.dataEdicao)} ${dateHoraMin(item.dataEdicao)}`);
      toast.dismiss(process);
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error), type: "error", isLoading: false, autoClose: 2000 });
      navigate("/multa");
    }
  };

  const submit = async (data: dadosAddEdicaoMultaType) => {
    if (loading) return;
    setLoading(true);
    const process = toast.loading("Salvando item...")
    try {
      if (!id) {
        const res = await addMulta(data);
        toast.update(process, { render: res, type: "success", isLoading: false, autoClose: 2000 });
      }
      else {
        const res = await updateMulta(Number(id), data);
        toast.update(process, { render: res, type: "success", isLoading: false, autoClose: 2000 });
      }
      reset();
      navigate(`/multa`);
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error), type: "error", isLoading: false, autoClose: 2000 });
    }
    finally {
      setLoading(false);
    }
  }

  const handleClickVoltar = () => {
    navigate("/multa");
  }

  return (
    <div className="w-full mt-16 flex flex-col lg:flex-row gap-4">
      <form autoComplete='off' className="flex-[3] flex flex-col gap-4" onSubmit={handleSubmit((data) => submit(data as unknown as dadosAddEdicaoMultaType))}>

        <FormContainer>
          <FormContainerHeader title="Multa" />
          <FormContainerBody>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2'>
              <SelectVeiculo control={control} />
              <SelectMotorista control={control} />
              <SelectTipoInfracao control={control} />
              <InputDataControl name='dataInfracao' title='Data Infração' control={control} />
              <InputMaskLabel name='numeroAuto' title='Número Auto' mask={Masks.numerico} setValue={setValue} value={watch("numeroAuto")} />
              <InputMaskLabel name='pontosCnh' title='Pontos CNH' mask={Masks.numerico} setValue={setValue} value={watch("pontosCnh")} />
              <InputDataControl name='dataPagamento' title='Data Pagamento' control={control} />
              <InputDataControl name='dataVencimento' title='Data Vencimento' control={control} />
              <InputMaskLabel name='valorMulta' title='Valor Multa' mask={Masks.dinheiro} setValue={setValue} value={watch("valorMulta")} />
              <TextareaLabel name='observacoes' title='Observação' register={{ ...register("observacoes") }} />
            </div>
          </FormContainerBody>
        </FormContainer>

        <FormContainer>
          <FormContainerHeader title="Arquivos" />
          <FormContainerBody>
            <div className='flex flex-col md:flex-row gap-2 w-full'>
              <Label className='space-y-2 flex flex-col items-start w-full'>
                Arquivo Atuação
                <div className="w-full">
                  <Controller
                    control={control}
                    name="idArquivoAutuacao"
                    render={({ field: { onChange, value } }) => (
                      <UploadFoto
                        referenciaTipo="ArquivoAutuacao"
                        idArquivo={value ?? 0}
                        changeIdArquivo={onChange}
                        alt="Arquivo"
                        isDisabled={loading}
                      />
                    )}
                  />
                </div>
              </Label>
              <Label className='space-y-2 flex flex-col items-start w-full'>
                Arquivo Comprovante de Pagamento
                <div className="w-full">
                  <Controller
                    control={control}
                    name="idArquivoComprovantePagamento"
                    render={({ field: { onChange, value } }) => (
                      <UploadFoto
                        referenciaTipo="ArquivoComprovantePagamento"
                        idArquivo={value ?? 0}
                        changeIdArquivo={onChange}
                        alt="Arquivo"
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
