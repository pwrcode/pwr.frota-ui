import getAxios from "@/axios/configAxios"

// @ts-ignore
const apiUrl = import.meta.env.VITE_API_URL + "/perfil-acesso-item";

export type permissao = {
  descricao: string,
  liberado: boolean
};

export type acessoItemType = {
  acessosFuncionalidade: string[],
  acessosUsuario: string[],
  dataCadastro: string,
  dataEdicao: string | null,
  descricaoFuncionalidade: string,
  id: number,
  idFuncionalidade: number,
  idPerfil: number,
  permissoes: permissao[],
  status: string,
  usuarioCadastro: string,
  usuarioEdicao: string | null
}

export const listarAcessosPerfil = async (idPerfil: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${apiUrl}/perfil/${idPerfil}`);
  if (response.data.sucesso) return response.data.dados as acessoItemType[];
  throw new Error(response.data.mensagem);
}

// export type acessoType = string[];

// export const listarAcessosFuncionalidades = async (funcionalidade: string) => {
//   const axiosInstance = await getAxios();
//   const response = await axiosInstance.get(`${apiUrl}/acesso/${funcionalidade}`);
//   if (response.status === 200) return response.data as acessoType;
//   throw new Error("Erro ao solicitar acessos");
// }

export type funcionalidadeType = {
  id: number,
  idPerfil: number,
  idFuncionalidade: number,
  descricaoFuncionalidade: string,
  acessosFuncionalidade: string,
  acessosUsuario: string,
  dataCadastro: string,
  usuarioCadastro: string | null,
  dataEdicao: string | null,
  usuarioEdicao: string | null,
  status: string,
  permissoes: permissao[],
}

export const getFuncionalidade = async (idPerfil: number, idFuncionalidade: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${apiUrl}/perfil/${idPerfil}/funcionalidade/${idFuncionalidade}`);
  if (response.data.sucesso) return response.data.dados as funcionalidadeType;
  throw new Error(response.data.mensagem);
}

export const liberarTodosAcessos = async (idPerfil: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.put(`${apiUrl}/liberar-todos-acessos/${idPerfil}`);
  if (response.data.sucesso) return "Acessos liberados";
  throw new Error(response.data.mensagem);
}

export const bloquearTodosAcessos = async (idPerfil: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.delete(`${apiUrl}/bloquear-todos-acessos/${idPerfil}`);
  if (response.data.sucesso) return "Acessos bloqueados";
  throw new Error(response.data.mensagem);
}

export type dadosAcessoItemType = {
  idPerfil: number,
  idFuncionalidade: number,
  acessos: string[] | string;
}

export const addPerfilAcessoItem = async (dados: dadosAcessoItemType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${apiUrl}`, dados);
  if (response.data.sucesso) return "Acesso adicionada com sucesso";
  throw new Error(response.data.mensagem);
}