import getAxios from "@/axios/configAxios";
import type { ufType } from "./uf";
import type { municipioType } from "./municipio";
import type { bairroType } from "./bairro";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/cep";

export type cepType = {
  uf: ufType,
  municipio: municipioType,
  bairro: bairroType,
  rua: string
}

export const getCep = async (cep: string) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/${cep}`);
  if (response.data.sucesso) return response.data.dados as cepType;
  throw new Error(response.data.mensagem);
}