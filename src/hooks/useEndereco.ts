import { errorMsg } from "@/services/api";
import { getBairroList, getBairroPorId } from "@/services/bairro";
import { getCep } from "@/services/cep";
import { type listType } from "@/services/constants";
import { getMunicipioList, getMunicipioPorId } from "@/services/municipio";
import { getUfList, getUfPorId } from "@/services/uf";
import { removeNonDigit } from "@/services/utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function useEndereco(useForm: any) {

  const { watch, resetField, setValue } = useForm;

  const cep = watch("cep");
  const uf = watch("idUf");
  const municipio = watch("idMunicipio");

  const [idUf, setIdUf] = useState<number>();
  const [idMunicipio, setIdMunicipio] = useState<number>();
  const [, setIdBairro] = useState<number>();

  const [ufs, setUfs] = useState<listType>([]);
  const [municipios, setMunicipios] = useState<listType>([]);
  const [bairros, setBairros] = useState<listType>([]);

  const getUfs = async (pesquisa?: string) => {
    const data = await getUfList(pesquisa);
    setUfs(data);
    return data;
  }

  useEffect(() => {
    getMunicipios();
    if (!uf || !uf.value || uf.value !== idUf) {
      resetField("idMunicipio");
      resetField("idBairro");
    }
  }, [uf]);

  const getMunicipios = async (pesquisa?: string) => {
    const data = uf && uf.value ? await getMunicipioList(pesquisa, uf.value) : [];
    setMunicipios(data);
    return data;
  }

  useEffect(() => {
    getBairros();
    if (!municipio || !municipio.value || municipio.value !== idMunicipio) {
      resetField("idBairro");
    }
  }, [municipio]);

  const getBairros = async (pesquisa?: string) => {
    const data = municipio && municipio.value ? await getBairroList(pesquisa, municipio.value) : [];
    setBairros(data);
    return data;
  }

  const [loadingCep, setLoadingCep] = useState<boolean>(false);

  const buscarCep = async () => {
    if (!cep || loadingCep) return
    setLoadingCep(true);
    const process = toast.loading("Carregando...");
    try {
      const data = await getCep(removeNonDigit(cep));
      if (data.uf) {
        setValue("idUf", {value: data.uf.id, label: data.uf.descricao});
              }
      if (data.municipio) {
        setValue("idMunicipio", {value: data.municipio.id, label: data.municipio.descricao});
        setIdUf(data.municipio.idUf);
      }
      if (data.bairro) {
        setValue("idBairro", {value: data.bairro.id, label: data.bairro.descricao});
        setIdMunicipio(data.bairro.idMunicipio);
      }
      setValue("logradouro", data.rua);
      toast.dismiss(process);
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 2000 });
    }
    finally {
      setLoadingCep(false);
    }
  }

  const setValuesUf = async (id: number | null) => {
    const ufObj = id ? await getUfPorId(id) : undefined;
    if (ufObj) setValue("idUf", {value: ufObj.id, label: ufObj.descricao});
  }

  const setValuesMunicipio = async (id: number | null) => {
    const municipioObj = id ? await getMunicipioPorId(id) : undefined;
    if (municipioObj) setValue("idMunicipio", {value: municipioObj.id, label: municipioObj.descricao});
  }

  const setValuesBairro = async (id: number | null) => {
    const bairroObj = id ? await getBairroPorId(id) : undefined;
    if (bairroObj) setValue("idBairro", {value: bairroObj.id, label: bairroObj.descricao});
  }

  return {
    cep, uf, municipio,
    ufs, municipios, bairros,
    setIdUf, setIdMunicipio, setIdBairro,
    getUfs, getMunicipios, getBairros,
    loadingCep, buscarCep,
    setValuesUf, setValuesMunicipio, setValuesBairro
  }
}