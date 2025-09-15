import getAxios from "@/axios/configAxios";
import { errorMsg } from "./api";
import { toast } from "react-toastify";
import { type itemSelectType } from "./constants";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/perfil-acesso";

export type perfilAcessoType = {
  id: number,
  descricao: string,
  quantidadeUsuarios: number,
  usuarioCadastro: string,
  dataCadastro: string,
  usuarioEdicao: string | null,
  dataEdicao: string | null
};

export type postListagemPerfilAcessoType = {
  currentPage: number,
  pageSize: number,
  pesquisa: string
}

export type dadosPerfilAcessoType = {
  descricao: string
}

export const getPerfilAcesso = async (dados: postListagemPerfilAcessoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(api + "/listagem", dados);
  if (response.data.sucesso) return response.data.dados as {
    dados: perfilAcessoType[],
    totalPages: number,
    currentPage: number,
    pageSize: number,
    totalRegisters: number
  };
  throw new Error(response.data.mensagem);
}

export const getPerfilAcessoPorId = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/${id}`);
  if(response.data.sucesso) return response.data.dados as perfilAcessoType;
  throw new Error(response.data.mensagem);
}

export const addPerfilAcesso = async (dados: dadosPerfilAcessoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(api, dados);
  if(response.data.sucesso) return "Perfil adicionado";
  throw new Error(response.data.mensagem);
}

export const editarPerfilAcesso = async (id: number, dados: dadosPerfilAcessoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.put(api + `/${id}`, dados);
  if(response.data.sucesso) return "Perfil adicionado";
  throw new Error(response.data.mensagem);
}

export const deletePerfilAcesso = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.delete(`${api}/${id}`);
  if(response.data.sucesso) return "Perfil excluído";
  throw new Error(response.data.mensagem);
}

export const getPerfilAcessoList = async (pesquisa?: string) => {
  try {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/select?pesquisa=${pesquisa}`);
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