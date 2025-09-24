import getAxios from "@/axios/configAxios";
import { toast } from "react-toastify";
import { errorMsg } from "./api";
import { type itemSelectType } from "./constants";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/tipo-ocorrencia";

export type tipoOcorrenciaType = {
    id: number,
    descricao: string,
    descricaoTipoOcorrenciaCategoria: string,
    idTipoOcorrenciaCategoria: number
    usuarioCadastro: string,
    dataCadastro: string,
    usuarioEdicao: string | null,
    dataEdicao: string | null,
};

export type postListagemTipoOcorrenciaType = {
    pageSize: number,
    currentPage: number,
    pesquisa: string,
    idTipoOcorrenciaCategoria: number | null
}

export type dadosAddEdicaoTipoOcorrenciaType = {
    id?: number,
    descricao: string,
    idTipoOcorrenciaCategoria: number | null
}

export const getTipoOcorrencias = async (dados: postListagemTipoOcorrenciaType) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.post(`${api}/listagem`, dados);
    if (response.data.sucesso) return response.data.dados as {
        dados: tipoOcorrenciaType[],
        totalPages: number,
        currentPage: number,
        pageSize: number,
        totalRegisters: number
    }
    else {
        throw new Error(response.data.mensagem);
    }
}

export const getTipoOcorrenciaPorId = async (id: number) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/${id}`);
    if (response.data.sucesso) return response.data.dados as tipoOcorrenciaType;
    throw new Error(response.data.mensagem);
}

export const addTipoOcorrencia = async (dados: dadosAddEdicaoTipoOcorrenciaType) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.post(api, dados);
    if (response.data.sucesso) return {
        id: response.data.dados.id,
        mensagem: "TipoOcorrencia adicionado"
    };
    throw new Error(response.data.mensagem);
}

export const updateTipoOcorrencia = async (id: number, dados: dadosAddEdicaoTipoOcorrenciaType) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.put(`${api}/${id}`, dados);
    if (response.data.sucesso) return "TipoOcorrencia editado";
    throw new Error(response.data.mensagem);
}

export const deleteTipoOcorrencia = async (id: number) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.delete(`${api}/${id}`);
    if (response.data.sucesso) return "TipoOcorrencia excluído";
    else throw new Error(response.data.mensagem);
}

export const getTipoOcorrenciaList = async (
    pesquisa: string | undefined,
    idTipoOcorrenciaCategoria: number | undefined,
) => {
    try {
        const axiosInstance = await getAxios();
        const response = await axiosInstance.get(`${api}/select`, { params: { pesquisa, idTipoOcorrenciaCategoria } });
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