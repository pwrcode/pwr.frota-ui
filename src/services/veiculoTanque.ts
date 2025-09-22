import getAxios from "@/axios/configAxios";
import { toast } from "react-toastify";
import { errorMsg } from "./api";
import { type itemSelectType } from "./constants";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/veiculo-tanque";

export type veiculoTanqueType = {
  descricao: string,
  id: number,
  idVeiculo: number | null,
  descricaoVeiculo: string,
  numeroTanque: number,
  capacidade: number,
  tipoTanque: string,
  usuarioCadastro: string,
  dataCadastro: string,
  usuarioEdicao: string | null,
  dataEdicao: string | null,
};

export type postListagemVeiculoTanqueType = {
  pageSize: number,
  currentPage: number,
  pesquisa: string,
  idVeiculo: number | null,
  tipoTanque: number | null,
}

export type dadosAddEdicaoVeiculoTanqueType = {
  descricao?: string
  idVeiculo: number
  numeroTanque?: number
  capacidade: number
  tipoTanque: number
}

export const getVeiculoTanques = async (dados: postListagemVeiculoTanqueType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/listagem`, dados);
  if (response.data.sucesso) return response.data.dados as {
    dados: veiculoTanqueType[],
    totalPages: number,
    currentPage: number,
    pageSize: number,
    totalRegisters: number
  }
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getVeiculoTanquePorId = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/${id}`);
  if (response.data.sucesso) return response.data.dados as veiculoTanqueType;
  throw new Error(response.data.mensagem);
}

export const addVeiculoTanque = async (dados: dadosAddEdicaoVeiculoTanqueType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(api, dados);
  if (response.data.sucesso) return {
    id: response.data.dados.id,
    mensagem: "VeiculoTanque adicionado"
  };
  throw new Error(response.data.mensagem);
}

export const updateVeiculoTanque = async (id: number, dados: dadosAddEdicaoVeiculoTanqueType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.put(`${api}/${id}`, dados);
  if (response.data.sucesso) return "VeiculoTanque editado";
  throw new Error(response.data.mensagem);
}

export const deleteVeiculoTanque = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.delete(`${api}/${id}`);
  if (response.data.sucesso) return "VeiculoTanque excluído";
  else throw new Error(response.data.mensagem);
}

export const getVeiculoTanqueList = async (pesquisa: string | undefined, idVeiculo: number | undefined, tipoTanque: number | undefined) => {
  try {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/select`, { params: { pesquisa, idVeiculo, tipoTanque } });
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