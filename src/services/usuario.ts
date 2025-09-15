import getAxios from "@/axios/configAxios";
import { toast } from "react-toastify";
import { errorMsg } from "./api";
import { type itemSelectType } from "./constants";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/usuario";

export type usuarioType = {
  id: number,
  nome: string,
  login: string,
  idPerfil: number,
  descricaoPerfil: string,
  ativo: true,
  dataUltimaAlteracaoSenha: string | null,
  dataUltimoLogin: string | null,
  dataCadastro: string,
  usuarioCadastro: string,
  dataEdicao: string | null,
  usuarioEdicao: string | null,
  idArquivoFoto: number | null
};

export type postListagemUsuarioType = {
  pageSize: number,
  currentPage: number,
  pesquisa: string,
  idPerfilAcesso: number | null
}

export type dadosAddEdicaoUsuarioType = {
  nome: string,
  login: string,
  idPerfil: number,
  idArquivoFoto: number | null,
  ativo: boolean,
  senha?: string,
  confirmacaoSenha?: string
}

export const getUsuarios = async (dados: postListagemUsuarioType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/listagem`, dados);
  if (response.data.sucesso) return response.data.dados as {
    dados: usuarioType[],
    totalPages: number,
    currentPage: number,
    pageSize: number,
    totalRegisters: number
  }
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getUsuarioPorId = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/${id}`);
  if (response.data.sucesso) return response.data.dados as usuarioType;
  throw new Error(response.data.mensagem);
}

export const addUsuario = async (dados: dadosAddEdicaoUsuarioType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(api, dados);
  if (response.data.sucesso) return "Usuário adicionado";
  throw new Error(response.data.mensagem);
}

export const updateUsuario = async (id: number, dados: dadosAddEdicaoUsuarioType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.put(`${api}/${id}`, dados);
  if (response.data.sucesso) return "Usuário editado";
  throw new Error(response.data.mensagem);
}

export const deleteUsuario = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.delete(`${api}/${id}`);
  if (response.data.sucesso) return "Usuário excluído";
  else throw new Error (response.data.mensagem);
}

export const getUsuarioList = async (pesquisa?: string) => {
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

export type novaSenhaType = {
  novaSenha: string,
  confirmacaoNovaSenha: string
}

export const alterarSenhaUsuario = async (id: number, dados: novaSenhaType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.put(`${api}/alterar-senha/${id}`, dados);
  if (response.data.sucesso) return "Senha alterada";
  throw new Error(response.data.mensagem);
}

export type novaSenhaLogadoType = {
  senhaAtual: string,
  novaSenha: string,
  confirmacaoNovaSenha: string
}

export const alterarSenhaUsuarioLogado = async (dados: novaSenhaLogadoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.put(`${api}/alterar-senha-usuario-logado`, dados);
  if (response.data.sucesso) return "Senha alterada";
  throw new Error(response.data.mensagem);
}

export const getInfoUsuarioLogado = async () => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/logado`);
  if (response.data.sucesso) return response.data as usuarioType;
  throw new Error(response.data.mensagem);
}