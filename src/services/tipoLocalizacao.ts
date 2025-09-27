import getAxios from "@/axios/configAxios";
import { toast } from "react-toastify";
import { errorMsg } from "./api";
import { type itemSelectType } from "./constants";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/tipo-localizacao";

export type tipoLocalizacaoType = {
  id: number,
  descricao: string,
  icone: string,
  cor: string,
  usuarioCadastro: string,
  dataCadastro: string,
  usuarioEdicao: string | null,
  dataEdicao: string | null,
};

export type postListagemTipoLocalizacaoType = {
  pageSize: number,
  currentPage: number,
  pesquisa: string,
}

export type dadosAddEdicaoTipoLocalizacaoType = {
  descricao: string,
  icone: string,
  cor: string
}

export const getTipoLocalizacaos = async (dados: postListagemTipoLocalizacaoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/listagem`, dados);
  if (response.data.sucesso) return response.data.dados as {
    dados: tipoLocalizacaoType[],
    totalPages: number,
    currentPage: number,
    pageSize: number,
    totalRegisters: number
  }
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getTipoLocalizacaoPorId = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/${id}`);
  if (response.data.sucesso) return response.data.dados as tipoLocalizacaoType;
  throw new Error(response.data.mensagem);
}

export const addTipoLocalizacao = async (dados: dadosAddEdicaoTipoLocalizacaoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(api, dados);
  if (response.data.sucesso) return {
    id: response.data.dados.id,
    mensagem: "TipoLocalizacao adicionado"
  };
  throw new Error(response.data.mensagem);
}

export const updateTipoLocalizacao = async (id: number, dados: dadosAddEdicaoTipoLocalizacaoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.put(`${api}/${id}`, dados);
  if (response.data.sucesso) return "TipoLocalizacao editado";
  throw new Error(response.data.mensagem);
}

export const deleteTipoLocalizacao = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.delete(`${api}/${id}`);
  if (response.data.sucesso) return "TipoLocalizacao excluído";
  else throw new Error(response.data.mensagem);
}

export const getTipoLocalizacaoList = async (
  pesquisa: string | undefined,
) => {
  try {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/select`, { params: { pesquisa } });
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