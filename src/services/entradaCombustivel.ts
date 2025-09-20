import getAxios from "@/axios/configAxios";
import { toast } from "react-toastify";
import { errorMsg } from "./api";
import { type itemSelectType } from "./constants";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/entrada-combustivel";

export type entradaCombustivelType = {
  id: number;
  dataRecebimento: string;
  idPostoCombustivel: number;
  razaoSocialPostoCombustivel: string;
  idProdutoAbastecimento: number;
  descricaoProdutoAbastecimento: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  dataCadastro: string,
  usuarioCadastro: string,
  dataEdicao: string | null,
  usuarioEdicao: string | null
};

export type postListagemEntradaCombustivelType = {
  pageSize: number,
  currentPage: number,
  dataInicio: string,
  dataFim: string,
  idPostoCombustivel: number | null,
  idProdutoAbastecimento: number | null
}

export type dadosAddEdicaoEntradaCombustivelType = {
  dataRecebimento: string,
  idPostoCombustivel: number | null,
  idProdutoAbastecimento: number | null,
  quantidade: number,
  valorUnitario: number,
}

export const getEntradaCombustivels = async (dados: postListagemEntradaCombustivelType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/listagem`, dados);
  if (response.data.sucesso) return response.data.dados as {
    dados: entradaCombustivelType[],
    totalPages: number,
    currentPage: number,
    pageSize: number,
    totalRegisters: number
  }
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getEntradaCombustivelPorId = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/${id}`);
  if (response.data.sucesso) return response.data.dados as entradaCombustivelType;
  throw new Error(response.data.mensagem);
}

export const addEntradaCombustivel = async (dados: dadosAddEdicaoEntradaCombustivelType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(api, dados);
  if (response.data.sucesso) return "EntradaCombustivel adicionada";
  throw new Error(response.data.mensagem);
}

export const updateEntradaCombustivel = async (id: number, dados: dadosAddEdicaoEntradaCombustivelType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.put(`${api}/${id}`, dados);
  if (response.data.sucesso) return "EntradaCombustivel editada";
  throw new Error(response.data.mensagem);
}

export const deleteEntradaCombustivel = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.delete(`${api}/${id}`);
  if (response.data.sucesso) return "EntradaCombustivel excluída";
  else throw new Error(response.data.mensagem);
}

export const getEntradaCombustivelList = async (
  idPostoCombustivel: boolean | undefined,
  idProdutoAbastecimento: number | undefined,
) => {
  try {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/select`, {
      params: {
        idPostoCombustivel,
        idProdutoAbastecimento,
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