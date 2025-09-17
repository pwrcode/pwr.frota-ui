import getAxios from "@/axios/configAxios";
import { toast } from "react-toastify";
import { errorMsg } from "./api";
import { type itemSelectType } from "./constants";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/tipo-veiculo";

export type tipoVeiculoType = {
  descricao: string,
  id: number,
  categoria: string,
  usuarioCadastro: string,
  dataCadastro: string,
  usuarioEdicao: string | null,
  dataEdicao: string | null,
};

export type postListagemTipoVeiculoType = {
  pageSize: number,
  currentPage: number,
  categoria: string,
  pesquisa: string,
}

export const getTipoVeiculos = async (dados: postListagemTipoVeiculoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/listagem`, dados);
  if (response.data.sucesso) return response.data.dados as {
    dados: tipoVeiculoType[],
    totalPages: number,
    currentPage: number,
    pageSize: number,
    totalRegisters: number
  }
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getTipoVeiculoPorId = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/${id}`);
  if (response.data.sucesso) return response.data.dados as tipoVeiculoType;
  throw new Error(response.data.mensagem);
}

export const getTipoVeiculoList = async (pesquisa: string | undefined, categoria: string | undefined) => {
  try {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/select`, {params: { pesquisa, categoria }});
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