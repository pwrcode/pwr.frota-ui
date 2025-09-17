import getAxios from "@/axios/configAxios";
import { toast } from "react-toastify";
import { errorMsg } from "./api";
import { type itemSelectType } from "./constants";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/veiculo-modelo";

export type veiculoModeloType = {
  descricao: string,
  id: number,
  idVeiculoMarca: number,
  descricaoVeiculoMarca: string,
  usuarioCadastro: string,
  dataCadastro: string,
  usuarioEdicao: string | null,
  dataEdicao: string | null,
};

export type postListagemVeiculoModeloType = {
  pageSize: number,
  currentPage: number,
  idVeiculoMarca: number | null,
  pesquisa: string,
}

export type dadosAddEdicaoVeiculoModeloType = {
  descricao: string,
  idVeiculoMarca: number,
}

export const getVeiculoModelos = async (dados: postListagemVeiculoModeloType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/listagem`, dados);
  if (response.data.sucesso) return response.data.dados as {
    dados: veiculoModeloType[],
    totalPages: number,
    currentPage: number,
    pageSize: number,
    totalRegisters: number
  }
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getVeiculoModeloPorId = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/${id}`);
  if (response.data.sucesso) return response.data.dados as veiculoModeloType;
  throw new Error(response.data.mensagem);
}

export const addVeiculoModelo = async (dados: dadosAddEdicaoVeiculoModeloType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(api, dados);
  if (response.data.sucesso) return {
    id: response.data.dados.id,
    mensagem: "VeiculoModelo adicionado"
  };
  throw new Error(response.data.mensagem);
}

export const updateVeiculoModelo = async (id: number, dados: dadosAddEdicaoVeiculoModeloType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.put(`${api}/${id}`, dados);
  if (response.data.sucesso) return "VeiculoModelo editado";
  throw new Error(response.data.mensagem);
}

export const deleteVeiculoModelo = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.delete(`${api}/${id}`);
  if (response.data.sucesso) return "VeiculoModelo excluído";
  else throw new Error (response.data.mensagem);
}

export const getVeiculoModeloList = async (pesquisa: string | undefined, idVeiculoMarca: number | undefined) => {
  try {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/select`, {params: { pesquisa, idVeiculoMarca }});
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