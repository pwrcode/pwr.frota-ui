// import { errorMsg } from "@/services/api";
// import { getBairroList, getBairroPorId } from "@/services/bairro";
// import { getCep } from "@/services/cep";
// import { type listType } from "@/services/constants";
// import { getMunicipioList, getMunicipioPorId } from "@/services/municipio";
// import { getPaisList, getPaisPorId } from "@/services/pais";
// import { getUfList, getUfPorId } from "@/services/uf";
// import { removeNonDigit } from "@/services/utils";
// import { useEffect, useState } from "react";
// import { type FieldValues, type UseFormReturn } from "react-hook-form";
// import { toast } from "react-toastify";

// export function useEndereco(useForm: UseFormReturn<FieldValues, any, FieldValues>) {

//   const { watch, resetField, setValue } = useForm;

//   const cep = watch("cep");
//   const pais = watch("idPais");
//   const uf = watch("idUf");
//   const municipio = watch("idMunicipio");

//   const [idPais, setIdPais] = useState<number>();
//   const [idUf, setIdUf] = useState<number>();
//   const [idMunicipio, setIdMunicipio] = useState<number>();

//   const [ufs, setUfs] = useState<listType>([]);
//   const [municipios, setMunicipios] = useState<listType>([]);
//   const [bairros, setBairros] = useState<listType>([]);

//   const getPaises = async (pesquisa?: string) => {
//     const data = await getPaisList(pesquisa);
//     return data;
//   }

//   useEffect(() => {
//     getUfs();
//     if (!pais || !pais.value || pais.value !== idPais) {
//       //resetField("cep");
//       resetField("idUf");
//       resetField("idMunicipio");
//       resetField("idBairro");
//     }
//   }, [pais]);

//   const getUfs = async (pesquisa?: string) => {
//     const data = pais && pais.value ? await getUfList(pesquisa, pais.value) : [];
//     setUfs(data);
//     return data;
//   }

//   useEffect(() => {
//     getMunicipios();
//     if (!uf || !uf.value || uf.value !== idUf) {
//       resetField("idMunicipio");
//       resetField("idBairro");
//     }
//   }, [uf]);

//   const getMunicipios = async (pesquisa?: string) => {
//     const data = uf && uf.value ? await getMunicipioList(pesquisa, uf.value) : [];
//     setMunicipios(data);
//     return data;
//   }

//   useEffect(() => {
//     getBairros();
//     if (!municipio || !municipio.value || municipio.value !== idMunicipio) {
//       resetField("idBairro");
//     }
//   }, [municipio]);

//   const getBairros = async (pesquisa?: string) => {
//     const data = municipio && municipio.value ? await getBairroList(pesquisa, municipio.value) : [];
//     setBairros(data);
//     return data;
//   }

//   const [loadingCep, setLoadingCep] = useState<boolean>(false);

//   const buscarCep = async () => {
//     if (!cep || loadingCep) return
//     setLoadingCep(true);
//     const process = toast.loading("Carregando...");
//     try {
//       const data = await getCep(removeNonDigit(cep));
//       if (data.uf) {
//         setValue("idUf", {value: data.uf.id, label: data.uf.descricao});
//         setIdPais(data.uf.idPais);
//         // Pais
//         const paisObj = data.uf.idPais ? await getPaisPorId(data.uf.idPais) : undefined;
//         if (paisObj) setValue("idPais", {value: paisObj.id, label: paisObj.descricao});
//         else resetField("idPais");
//       }
//       if (data.municipio) {
//         setValue("idMunicipio", {value: data.municipio.id, label: data.municipio.descricao});
//         setIdUf(data.municipio.idUf);
//       }
//       if (data.bairro) {
//         setValue("idBairro", {value: data.bairro.id, label: data.bairro.descricao});
//         setIdMunicipio(data.bairro.idMunicipio);
//       }
//       setValue("logradouro", data.rua);
//       toast.dismiss(process);
//     }
//     catch (error: Error | any) {
//       toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 2000 });
//     }
//     finally {
//       setLoadingCep(false);
//     }
//   }

//   const setValuesPais = async (id: number | null) => {
//     const paisObj = id ? await getPaisPorId(id) : undefined;
//     if (paisObj) setValue("idPais", {value: paisObj.id, label: paisObj.descricao});
//   }

//   const setValuesUf = async (id: number | null) => {
//     const ufObj = id ? await getUfPorId(id) : undefined;
//     if (ufObj) setValue("idUf", {value: ufObj.id, label: ufObj.descricao});
//   }

//   const setValuesMunicipio = async (id: number | null) => {
//     const municipioObj = id ? await getMunicipioPorId(id) : undefined;
//     if (municipioObj) setValue("idMunicipio", {value: municipioObj.id, label: municipioObj.descricao});
//   }

//   const setValuesBairro = async (id: number | null) => {
//     const bairroObj = id ? await getBairroPorId(id) : undefined;
//     if (bairroObj) setValue("idBairro", {value: bairroObj.id, label: bairroObj.descricao});
//   }

//   return {
//     cep, pais, uf, municipio,
//     ufs, municipios, bairros,
//     setIdPais, setIdUf, setIdMunicipio,
//     getPaises, getUfs, getMunicipios, getBairros,
//     loadingCep, buscarCep,
//     setValuesPais, setValuesUf, setValuesMunicipio, setValuesBairro
//   }
// }