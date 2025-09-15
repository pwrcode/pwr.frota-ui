import getAxios from "@/axios/configAxios";
import { toast } from "react-toastify";
import { errorMsg } from "./api";
import { type itemSelectType, type listType } from "./constants";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/uf";

export type ufType = {
  descricao: string,
  descricaoPais: string,
  id: number,
  idPais: number,
  sigla: string,
  usuarioCadastro: string,
  dataCadastro: string,
  usuarioEdicao: string | null,
  dataEdicao: null,
}

export type postListagemUfType = {
  pageSize: number,
  currentPage: number,
  pesquisa: string
}

export const getUfs = async (dados: postListagemUfType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/listagem`, dados);
  if (response.data.sucesso) return response.data.dados as {
    dados: ufType[],
    totalPages: number,
    currentPage: number,
    pageSize: number,
    totalRegisters: number
  }
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getUfPorId = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/${id}`);
  if (response.data.sucesso) return response.data.dados as ufType;
  throw new Error(response.data.mensagem);
}

export const getUfList = async (pesquisa: string | undefined, idPais: number | undefined) => {
  try {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/select`, {params: { pesquisa: pesquisa, idPais: idPais }});
    if (response.data.sucesso) {
      if (response.data.dados.length == 0) return [];
      return response.data.dados.map((l: itemSelectType) => ({ value: l.id, label: l.descricao })) as listType;
    }
    else return [];
  }
  catch (error: Error | any) {
    toast.error(errorMsg(error, null));
    return [];
  }
}