import getAxios from "@/axios/configAxios";
import { toast } from "react-toastify";
import { errorMsg } from "./api";
import { type itemSelectType } from "./constants";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/pessoa";

export type pessoaType = {
  id: number,
  tipoPessoa: string,
  descricaoTipoPessoa: string,
  documento: string,
  razaoSocial: string,
  nomeFantasia: string,
  inscricaoEstadual: string,
  inscricaoMunicipal: string,
  rg: string,
  orgaoEmissor: string,
  sexo: string,
  descricaoSexo: string,
  profissao: string,
  dataNascimentoFundacao: string | null,
  tipoContribuinte: string | null,
  descricaoTipoContribuinte: string | null,
  vendaPromissoria: boolean,
  tipoRenda: string | null,
  descricaoTipoRenda: string | null,
  rendaMensal: number | null,
  limiteCredito: number | null,
  estrangeiro: boolean,
  documentoEstrangeiro: string,
  suframa: string,
  cei: string,
  rntrc: string,
  consumidorFinal: boolean,
  ativo: boolean,
  isCliente: boolean,
  isFornecedor: boolean,
  isTransportadora: boolean,
  isMotorista: boolean,
  isSeguradora: boolean,
  nomePai: string,
  nomeMae: string,
  nomeConjuge: string,
  cpfConjuge: string,
  telefone1: string,
  telefone2: string,
  email: string,
  site: string,
  redeSocial: string,
  idPais: number,
  descricaoPais: string,
  cep: string,
  idUF: number,
  descricaoUF: string,
  idMunicipio: number,
  descricaoMunicipio: string,
  bairro: string,
  logradouro: string,
  numero: string,
  complemento: string,
  pontoReferencia: string,
  observacoes: string,
  dataCadastro: string,
  usuarioCadastro: string,
  dataEdicao: string | null,
  usuarioEdicao: string | null
};

export type postListagemPessoaType = {
  pageSize: number,
  currentPage: number,
  pesquisa: string,
  tipoPessoa: number | null,
  isCliente: boolean | null,
  isFornecedor: boolean | null,
  isTransportadora: boolean | null,
  isMotorista: boolean | null,
  isSeguradora: boolean | null,
  ativo: boolean | null,
  idPais: number | null,
  idUF: number | null,
  idMunicipio: number | null
}

export type dadosAddEdicaoPessoaType = {
  tipoPessoa: number,
  documento: string,
  razaoSocial: string,
  nomeFantasia: string,
  inscricaoEstadual: string,
  inscricaoMunicipal: string,
  rg: string,
  orgaoEmissor: string,
  documentoEstrangeiro: string,
  suframa: string,
  cei: string,
  rntrc: string,
  sexo: number,
  profissao: string,
  dataNascimentoFundacao: string,
  tipoContribuinte: number | null,
  ativo: boolean,
  estrangeiro: boolean,
  tipoRenda: number | null,
  rendaMensal: number,
  limiteCredito: number,
  consumidorFinal: boolean,
  isCliente: boolean,
  isFornecedor: boolean,
  isTransportadora: boolean,
  isMotorista: boolean,
  isSeguradora: boolean,
  vendaPromissoria: boolean,
  nomePai: string,
  nomeMae: string,
  nomeConjuge: string,
  cpfConjuge: string,
  telefone1: string,
  telefone2: string,
  email: string,
  site: string,
  redeSocial: string,
  idPais: number,
  cep: string,
  idUF: number,
  idUf?: number,
  idMunicipio: number,
  bairro: string,
  logradouro: string,
  numero: string,
  complemento: string,
  pontoReferencia: string,
  observacoes: string
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
  else throw new Error (response.data.mensagem);
}

export const getPessoaList = async (
  pesquisa: string | undefined,
  ativo: boolean | undefined,
  tipoPessoa: any | undefined,
  isCliente: boolean | undefined,
  isFornecedor: boolean | undefined,
  isTransportadora: boolean | undefined
) => {
  try {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/select`, {
      params: { 
        pesquisa: pesquisa,
        tipoPessoa: tipoPessoa,
        isCliente: isCliente,
        isFornecedor: isFornecedor,
        isTransportadora: isTransportadora,
        ativo: ativo 
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