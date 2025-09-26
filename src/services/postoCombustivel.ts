import getAxios from "@/axios/configAxios";
import { toast } from "react-toastify";
import { errorMsg } from "./api";
import { type itemSelectType } from "./constants";
import type { dadosAddEdicaoPostoCombustivelTanqueType, dadosHistoricoPostoCombustivelTanqueType } from "./postoCombustivelTanque";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/posto-combustivel";

export type postoCombustivelType = {
  id: number,
  cnpj: string,
  razaoSocial: string,
  nomeFantasia: string,
  bandeira: string,
  cep: string,
  idUf: number | null,
  idMunicipio: number | null,
  idBairro: number | null,
  logradouro: string,
  numero: string,
  complemento: string,
  pontoReferencia: string,
  telefonePrincipal: string,
  telefoneSecundario: string,
  observacao: string,
  isInterno: boolean | null,
  dataCadastro: string,
  usuarioCadastro: string,
  dataEdicao: string | null,
  usuarioEdicao: string | null
};

export type postListagemPostoCombustivelType = {
  pageSize: number,
  currentPage: number,
  pesquisa: string,
  isInterno: boolean | null,
  idUf: number | null,
  idMunicipio: number | null,
  idBairro: number | null,
}

export type dadosAddEdicaoPostoCombustivelType = {
  cnpj: string,
  razaoSocial: string,
  nomeFantasia: string,
  bandeira: string,
  cep: string,
  idUf: number | null,
  idMunicipio: number | null,
  idBairro: number | null,
  logradouro: string,
  numero: string,
  complemento: string,
  pontoReferencia: string,
  telefonePrincipal: string,
  telefoneSecundario: string,
  observacao: string,
  isInterno: boolean | null,
  postoCombustivelTanques?: dadosAddEdicaoPostoCombustivelTanqueType[]
}

export const getPostoCombustivels = async (dados: postListagemPostoCombustivelType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/listagem`, dados);
  if (response.data.sucesso) return response.data.dados as {
    dados: postoCombustivelType[],
    totalPages: number,
    currentPage: number,
    pageSize: number,
    totalRegisters: number
  }
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getPostoCombustivelPorId = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/${id}`);
  if (response.data.sucesso) return response.data.dados as postoCombustivelType;
  throw new Error(response.data.mensagem);
}

export const addPostoCombustivel = async (dados: dadosAddEdicaoPostoCombustivelType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(api, dados);
  if (response.data.sucesso) return "PostoCombustivel adicionada";
  throw new Error(response.data.mensagem);
}

export const updatePostoCombustivel = async (id: number, dados: dadosAddEdicaoPostoCombustivelType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.put(`${api}/${id}`, dados);
  if (response.data.sucesso) return "PostoCombustivel editada";
  throw new Error(response.data.mensagem);
}

export const deletePostoCombustivel = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.delete(`${api}/${id}`);
  if (response.data.sucesso) return "PostoCombustivel excluída";
  else throw new Error(response.data.mensagem);
}

export const getPostoCombustivelList = async (
  pesquisa: string | undefined,
  isInterno: boolean | undefined,
  idUf: number | undefined,
  idMunicipio: number | undefined,
  idBairro: number | undefined,
) => {
  try {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/select`, {
      params: {
        pesquisa,
        isInterno,
        idUf,
        idMunicipio,
        idBairro,
      }
    });
    if (response.data.sucesso) {
      if (response.data.dados.length == 0) return [];
      return response.data.dados.map((l: itemSelectType) => ({ value: l.id, label: l.descricao }));
    }
    else return [];
  }
  catch (error: Error | any) {
    toast.error(errorMsg(error, null));
    return [];
  }
}

export const getPostoCombustivelHistorico = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/historico/${id}`);
  if (response.data.sucesso) return response.data.dados as Array<dadosHistoricoPostoCombustivelTanqueType>;
  throw new Error(response.data.mensagem);
}