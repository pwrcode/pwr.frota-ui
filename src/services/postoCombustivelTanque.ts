import getAxios from "@/axios/configAxios";
import { toast } from "react-toastify";
import { errorMsg } from "./api";
import { type itemSelectType } from "./constants";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/posto-combustivel-tanque";

export type postoCombustivelTanqueType = {
  descricao: string,
  id: number,
  idPostoCombustivel: number | null,
  descricaoPostoCombustivel: string,
  numeroTanque: number,
  idProdutoAbastecimento:  number | null,
  descricaoProdutoAbastecimento: string,
  capacidadeLitros: number,
  estoqueMinimoLitros: number,
  usuarioCadastro: string,
  dataCadastro: string,
  usuarioEdicao: string | null,
  dataEdicao: string | null,
};

export type postListagemPostoCombustivelTanqueType = {
  pageSize: number,
  currentPage: number,
  pesquisa: string,
  idPostoCombustivel: number | null,
  idProdutoAbastecimento: number | null,
}

export type dadosAddEdicaoPostoCombustivelTanqueType = {
  descricao?: string
  idPostoCombustivel: number
  idProdutoAbastecimento: number
  numeroTanque?: number
  capacidadeLitros: number
  estoqueMinimoLitros: number
}

export type dadosHistoricoPostoCombustivelTanqueType = {
  descricao: string,
  descricaoProdutoAbastecimento: string,
  descricaoTanque: string,
  data: string,
}

export const getPostoCombustivelTanques = async (dados: postListagemPostoCombustivelTanqueType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/listagem`, dados);
  if (response.data.sucesso) return response.data.dados as {
    dados: postoCombustivelTanqueType[],
    totalPages: number,
    currentPage: number,
    pageSize: number,
    totalRegisters: number
  }
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getPostoCombustivelTanquePorId = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/${id}`);
  if (response.data.sucesso) return response.data.dados as postoCombustivelTanqueType;
  throw new Error(response.data.mensagem);
}

export const addPostoCombustivelTanque = async (dados: dadosAddEdicaoPostoCombustivelTanqueType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(api, dados);
  if (response.data.sucesso) return {
    id: response.data.dados.id,
    mensagem: "Posto Combustível Tanque adicionado"
  };
  throw new Error(response.data.mensagem);
}

export const updatePostoCombustivelTanque = async (id: number, dados: dadosAddEdicaoPostoCombustivelTanqueType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.put(`${api}/${id}`, dados);
  if (response.data.sucesso) return "Posto Combustível Tanque editado";
  throw new Error(response.data.mensagem);
}

export const deletePostoCombustivelTanque = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.delete(`${api}/${id}`);
  if (response.data.sucesso) return "Posto Combustível Tanque excluído";
  else throw new Error(response.data.mensagem);
}

export const getPostoCombustivelTanqueList = async (pesquisa: string | undefined, idPostoCombustivel: number | undefined, tipoTanque: number | undefined) => {
  try {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/select`, { params: { pesquisa, idPostoCombustivel, tipoTanque } });
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

export const getPostoCombustivelTanqueHistorico = async (id: number) => {
  try {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/historico/${id}`);
    if (response.data.sucesso) {
      if (response.data.dados.length == 0) return [];
      return response.data.dados;
    }
    else return [];
  }
  catch (error: Error | any) {
    toast.error(errorMsg(error, null));
    return [];
  }
}