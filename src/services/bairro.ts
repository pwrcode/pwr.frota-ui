import getAxios from "@/axios/configAxios";
import { toast } from "react-toastify";
import { errorMsg } from "./api";
import { type itemSelectType } from "./constants";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/bairro";

export type bairroType = {
  descricao: string,
  descricaoMunicipio: string,
  id: number,
  idMunicipio: number,
  idUf: number,
  siglaUf: string,
  usuarioCadastro: string,
  dataCadastro: string,
  usuarioEdicao: string | null,
  dataEdicao: string | null,
};

export type postListagemBairroType = {
  pageSize: number,
  currentPage: number,
  pesquisa: string,
  idMunicipio: number | null,
  idUf: number | null,
}

export type dadosAddEdicaoBairroType = {
  descricao: string,
  idMunicipio: number
}

export const getBairros = async (dados: postListagemBairroType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/listagem`, dados);
  if (response.data.sucesso) return response.data.dados as {
    dados: bairroType[],
    totalPages: number,
    currentPage: number,
    pageSize: number,
    totalRegisters: number
  }
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getBairroPorId = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/${id}`);
  if (response.data.sucesso) return response.data.dados as bairroType;
  throw new Error(response.data.mensagem);
}

export const addBairro = async (dados: dadosAddEdicaoBairroType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(api, dados);
  if (response.data.sucesso) return {
    id: response.data.dados.id,
    mensagem: "Bairro adicionado"
  };
  throw new Error(response.data.mensagem);
}

export const updateBairro = async (id: number, dados: dadosAddEdicaoBairroType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.put(`${api}/${id}`, dados);
  if (response.data.sucesso) return "Bairro editado";
  throw new Error(response.data.mensagem);
}

export const deleteBairro = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.delete(`${api}/${id}`);
  if (response.data.sucesso) return "Bairro excluído";
  else throw new Error (response.data.mensagem);
}

export const getBairroList = async (pesquisa: string | undefined, idMunicipio: number | undefined) => {
  try {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/select`, {params: { pesquisa: pesquisa, idMunicipio: idMunicipio }});
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