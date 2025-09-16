import getAxios from "@/axios/configAxios";
import { toast } from "react-toastify";
import { errorMsg } from "./api";
import { type itemSelectType } from "./constants";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/veiculo-marca";

export type veiculoMarcaType = {
  descricao: string,
  id: number,
  usuarioCadastro: string,
  dataCadastro: string,
  usuarioEdicao: string | null,
  dataEdicao: string | null,
};

export type postListagemVeiculoMarcaType = {
  pageSize: number,
  currentPage: number,
  pesquisa: string,
}

export type dadosAddEdicaoVeiculoMarcaType = {
  descricao: string,
}

export const getVeiculoMarcas = async (dados: postListagemVeiculoMarcaType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/listagem`, dados);
  if (response.data.sucesso) return response.data.dados as {
    dados: veiculoMarcaType[],
    totalPages: number,
    currentPage: number,
    pageSize: number,
    totalRegisters: number
  }
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getVeiculoMarcaPorId = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/${id}`);
  if (response.data.sucesso) return response.data.dados as veiculoMarcaType;
  throw new Error(response.data.mensagem);
}

export const addVeiculoMarca = async (dados: dadosAddEdicaoVeiculoMarcaType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(api, dados);
  if (response.data.sucesso) return {
    id: response.data.dados.id,
    mensagem: "VeiculoMarca adicionado"
  };
  throw new Error(response.data.mensagem);
}

export const updateVeiculoMarca = async (id: number, dados: dadosAddEdicaoVeiculoMarcaType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.put(`${api}/${id}`, dados);
  if (response.data.sucesso) return "VeiculoMarca editado";
  throw new Error(response.data.mensagem);
}

export const deleteVeiculoMarca = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.delete(`${api}/${id}`);
  if (response.data.sucesso) return "VeiculoMarca excluído";
  else throw new Error (response.data.mensagem);
}

export const getVeiculoMarcaList = async (pesquisa: string | undefined) => {
  try {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/select`, {params: { pesquisa: pesquisa }});
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