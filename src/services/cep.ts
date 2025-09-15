import getAxios from "@/axios/configAxios";
import { paisType } from "./pais";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/cep";

type ufCepType = {
  dataCadastro: string,
  usuarioCadastro: string,
  dataEdicao: string,
  usuarioEdicao: string,
  id: number,
  descricao: string,
  sigla: string,
  idPais: number,
  pais: paisType
}

type municipioCepType = {
  dataCadastro: string,
  usuarioCadastro: string,
  dataEdicao: string,
  usuarioEdicao: string,
  id: number,
  descricao: string,
  idUf: number,
  uf: ufCepType
}

type bairroCepType = {
  dataCadastro: string,
  usuarioCadastro: string,
  dataEdicao: string,
  usuarioEdicao: string,
  id: number,
  descricao: string,
  idMunicipio: number,
  municipio: municipioCepType
}

export type cepType = {
  uf: ufCepType,
  municipio: municipioCepType,
  bairro: bairroCepType,
  rua: string
}

export const getCep = async (cep: string) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/${cep}`);
  if (response.data.sucesso) return response.data.dados as cepType;
  throw new Error(response.data.mensagem);
}