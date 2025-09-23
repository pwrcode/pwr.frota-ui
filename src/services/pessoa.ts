import getAxios from "@/axios/configAxios";
import { toast } from "react-toastify";
import { errorMsg } from "./api";
import { type itemSelectType } from "./constants";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/pessoa";

export type pessoaType = {
  id: number,
  tipoPessoa: number,
  documento: string,
  razaoSocial: string,
  nomeFantasia: string,
  cep: string,
  idUf: number,
  idMunicipio: number,
  idBairro: number,
  logradouro: string,
  numero: string,
  complemento: string,
  pontoReferencia: string,
  telefonePrincipal: string,
  telefoneSecundario: string,
  observacao: string,
  isMotorista: boolean,
  isAjudante: boolean,
  isOficina: boolean,
  isFornecedor: boolean,
  cnhNumero: string,
  cnhCategoria: string,
  cnhValidade: string,
  ativo: boolean,
  dataCadastro: string,
  usuarioCadastro: string,
  dataEdicao: string | null,
  usuarioEdicao: string | null
};

export type postListagemPessoaType = {
  pageSize: number,
  currentPage: number,
  pesquisa: string,
  dataInicio: string,
  dataFim: string,
  tipoPessoa: number | null,
  isMotorista: boolean | null,
  isAjudante: boolean | null,
  isOficina: boolean | null,
  isFornecedor: boolean | null,
  ativo: boolean | null,
  idUf: number | null,
  idMunicipio: number | null,
  idBairro: number | null,
}

export type dadosAddEdicaoPessoaType = {
  tipoPessoa: number,
  documento: string,
  razaoSocial: string,
  nomeFantasia: string,
  cep: string,
  idUf: number,
  idMunicipio: number,
  idBairro: number,
  logradouro: string,
  numero: string,
  complemento: string,
  pontoReferencia: string,
  telefonePrincipal: string,
  telefoneSecundario: string,
  observacao: string,
  isMotorista: boolean,
  isAjudante: boolean,
  isOficina: boolean,
  isFornecedor: boolean,
  cnhNumero: string,
  cnhCategoria: string,
  cnhValidade: string | null | undefined,
  ativo: boolean,
}

export const getPessoas = async (dados: postListagemPessoaType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/listagem`, dados);
  if (response.data.sucesso) return response.data.dados as {
    dados: pessoaType[],
    totalPages: number,
    currentPage: number,
    pageSize: number,
    totalRegisters: number
  }
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getPessoaPorId = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/${id}`);
  if (response.data.sucesso) return response.data.dados as pessoaType;
  throw new Error(response.data.mensagem);
}

export const addPessoa = async (dados: dadosAddEdicaoPessoaType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(api, dados);
  if (response.data.sucesso) return "Pessoa adicionada";
  throw new Error(response.data.mensagem);
}

export const updatePessoa = async (id: number, dados: dadosAddEdicaoPessoaType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.put(`${api}/${id}`, dados);
  if (response.data.sucesso) return "Pessoa editada";
  throw new Error(response.data.mensagem);
}

export const deletePessoa = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.delete(`${api}/${id}`);
  if (response.data.sucesso) return "Pessoa excluída";
  else throw new Error(response.data.mensagem);
}

export const getPessoaList = async (
  pesquisa: string | undefined,
  ativo: boolean | undefined,
  tipoPessoa: any | undefined,
  isAjudante: boolean | undefined,
  isMotorista: boolean | undefined,
  isOficina: boolean | undefined,
  isFornecedor: boolean | undefined,
  idUf: number | undefined,
  idMunicipio: number | undefined,
  idBairro: number | undefined,
) => {
  try {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/select`, {
      params: {
        pesquisa,
        tipoPessoa,
        isAjudante,
        isOficina,
        isMotorista,
        isFornecedor,
        ativo: ativo,
        idUf,
        idMunicipio,
        idBairro,
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