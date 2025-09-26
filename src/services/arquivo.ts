import getAxiosArquivo from "@/axios/axiosArquivo";
import getAxios from "@/axios/configAxios";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/arquivo";

export type arquivoType = {
  descricao: string,
  nomeArquivo: string,
  extensao: string,
  nomeCompleto: string,
  tamanhoArquivo: number,
  dropboxLinkView: string | null,
  dropboxLinkDownload: string | null,
  dropboxCaminhoArquivo: string | null,
  mimetype: string,
  id: number,
  dataCadastro: string,
  usuarioCadastro: string,
  dataEdicao: string | null,
  usuarioEdicao: string | null
}

export const postArquivo = async (dados: any) => {
  const axiosInstance = await getAxiosArquivo();
  const response = await axiosInstance.post(`${api}/upload`, dados);
  if(response.data.sucesso) return response.data.dados as arquivoType;
  throw new Error("Erro ao enviar arquivo");
}

export const obterArquivoPorId = async (idArquivo: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/${idArquivo}`);
  if(response.data.sucesso) return response.data.dados as arquivoType;
  throw new Error("Erro ao baixar arquivo");
}