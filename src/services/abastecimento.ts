import getAxios from "@/axios/configAxios";
import { toast } from "react-toastify";
import { errorMsg } from "./api";
import { type itemSelectType } from "./constants";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/abastecimento";

export type abastecimentoType = {
  id: number;
  dataAbastecimento: string;
  idVeiculo: number;
  idPessoa: number;
  idPostoCombustivel: number;
  idProdutoAbastecimento: number;
  descricaoVeiculo: string;
  razaoSocialPessoa: string;
  razaoSocialPostoCombustivel: string;
  descricaoProdutoAbastecimento: string;
  quilometragem: number;
  quantidadeAbastecida: number;
  valorUnitario: number;
  valorTotal: number;
  observacao: string;
  tanqueCheio: boolean;
  idArquivoFotoPainelAntes: number;
  idArquivoFotoPainelDepois: number;
  dataCadastro: string,
  usuarioCadastro: string,
  dataEdicao: string | null,
  usuarioEdicao: string | null
};

export type postListagemAbastecimentoType = {
  pageSize: number,
  currentPage: number,
  dataInicio: string,
  dataFim: string,
  idVeiculo: number | null,
  idMotorista: number | null,
  idPostoCombustivel: number | null,
  idProdutoAbastecimento: number | null
}

export type dadosAddEdicaoAbastecimentoType = {
  dataAbastecimento: string;
  idVeiculo: number | null;
  idPessoa: number | null;
  idPostoCombustivel: number | null;
  idProdutoAbastecimento: number | null;
  quilometragem: number;
  quantidadeAbastecida: number;
  valorUnitario: number;
  observacao: string;
  tanqueCheio: boolean | null;
  idArquivoFotoPainelAntes: number | null;
  idArquivoFotoPainelDepois: number | null;
}

export const getAbastecimentos = async (dados: postListagemAbastecimentoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/listagem`, dados);
  if (response.data.sucesso) return response.data.dados as {
    dados: abastecimentoType[],
    totalPages: number,
    currentPage: number,
    pageSize: number,
    totalRegisters: number
  }
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getAbastecimentoPorId = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/${id}`);
  if (response.data.sucesso) return response.data.dados as abastecimentoType;
  throw new Error(response.data.mensagem);
}

export const addAbastecimento = async (dados: dadosAddEdicaoAbastecimentoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(api, dados);
  if (response.data.sucesso) return "Abastecimento adicionada";
  throw new Error(response.data.mensagem);
}

export const updateAbastecimento = async (id: number, dados: dadosAddEdicaoAbastecimentoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.put(`${api}/${id}`, dados);
  if (response.data.sucesso) return "Abastecimento editada";
  throw new Error(response.data.mensagem);
}

export const deleteAbastecimento = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.delete(`${api}/${id}`);
  if (response.data.sucesso) return "Abastecimento excluída";
  else throw new Error(response.data.mensagem);
}

export const getAbastecimentoList = async (
  idVeiculo: boolean | undefined,
  isMotorista: boolean | undefined,
  idPostoCombustivel: boolean | undefined,
  idProdutoAbastecimento: number | undefined,
) => {
  try {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/select`, {
      params: {
        idProdutoAbastecimento,
        idVeiculo,
        idPostoCombustivel,
        isMotorista,
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