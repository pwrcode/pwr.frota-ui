import getAxios from "@/axios/configAxios";
import { toast } from "react-toastify";
import { errorMsg } from "./api";
import { type itemSelectType } from "./constants";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/tipo-ocorrencia-categoria";

export type tipoOcorrenciaCategoriaType = {
    id: number,
    descricao: string,
    usuarioCadastro: string,
    dataCadastro: string,
    usuarioEdicao: string | null,
    dataEdicao: string | null,
};

export type postListagemTipoOcorrenciaCategoriaType = {
    pageSize: number,
    currentPage: number,
    pesquisa: string,
}

export type dadosAddEdicaoTipoOcorrenciaCategoriaType = {
    id?: number,
    descricao: string,
}

export const getTipoOcorrenciaCategorias = async (dados: postListagemTipoOcorrenciaCategoriaType) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.post(`${api}/listagem`, dados);
    if (response.data.sucesso) return response.data.dados as {
        dados: tipoOcorrenciaCategoriaType[],
        totalPages: number,
        currentPage: number,
        pageSize: number,
        totalRegisters: number
    }
    else {
        throw new Error(response.data.mensagem);
    }
}

export const getTipoOcorrenciaCategoriaPorId = async (id: number) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/${id}`);
    if (response.data.sucesso) return response.data.dados as tipoOcorrenciaCategoriaType;
    throw new Error(response.data.mensagem);
}

export const addTipoOcorrenciaCategoria = async (dados: dadosAddEdicaoTipoOcorrenciaCategoriaType) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.post(api, dados);
    if (response.data.sucesso) return {
        id: response.data.dados.id,
        mensagem: "TipoOcorrenciaCategoria adicionado"
    };
    throw new Error(response.data.mensagem);
}

export const updateTipoOcorrenciaCategoria = async (id: number, dados: dadosAddEdicaoTipoOcorrenciaCategoriaType) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.put(`${api}/${id}`, dados);
    if (response.data.sucesso) return "TipoOcorrenciaCategoria editado";
    throw new Error(response.data.mensagem);
}

export const deleteTipoOcorrenciaCategoria = async (id: number) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.delete(`${api}/${id}`);
    if (response.data.sucesso) return "TipoOcorrenciaCategoria excluído";
    else throw new Error(response.data.mensagem);
}

export const getTipoOcorrenciaCategoriaList = async (
    pesquisa: string | undefined,
) => {
    try {
        const axiosInstance = await getAxios();
        const response = await axiosInstance.get(`${api}/select`, { params: { pesquisa } });
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