import getAxios from "@/axios/configAxios";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/empresa";

export type empresaType = {
  id: number,
  tipoPessoa: number;
  documento: string;
  razaoSocial: string;
  nomeFantasia: string;
  cep: string;
  idUf: number;
  descricaoUf: string;
  idMunicipio: number;
  descricaoMunicipio: string;
  idBairro: number;
  descricaoBairro: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  pontoReferencia?: string;
  telefonePrincipal?: string;
  telefoneSecundario?: string;
  observacao?: string;
  idArquivoFoto?: number;
  dataCadastro: string,
  usuarioCadastro: string,
  dataEdicao: string | null,
  usuarioEdicao: string | null
};

export type dadosAddEdicaoEmpresaType = {
  tipoPessoa: number;
  documento: string;
  razaoSocial: string;
  nomeFantasia: string;
  cep: string;
  idUf: number;
  idMunicipio: number;
  idBairro: number;
  logradouro: string;
  numero: string;
  complemento?: string;
  pontoReferencia?: string;
  telefonePrincipal?: string;
  telefoneSecundario?: string;
  observacao?: string;
  idArquivoFoto?: number;
}

export const getEmpresa = async () => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}`);
  if (response.data.sucesso) return response.data.dados as empresaType;
  throw new Error(response.data.mensagem);
}

export const updateEmpresa = async (dados: dadosAddEdicaoEmpresaType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.put(`${api}`, dados);
  if (response.data.sucesso) return "Empresa editada";
  throw new Error(response.data.mensagem);
}