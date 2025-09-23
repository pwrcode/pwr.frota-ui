import getAxios from "@/axios/configAxios";
import { toast } from "react-toastify";
import { errorMsg } from "./api";
import { type itemSelectType } from "./constants";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/motivo-parada";

export type motivoParadaType = {
    id: number,
    descricao: string,
    tipo: string,
    usuarioCadastro: string,
    dataCadastro: string,
    usuarioEdicao: string | null,
    dataEdicao: string | null,
};

export type postListagemMotivoParadaType = {
    pageSize: number,
    currentPage: number,
    pesquisa: string,
    tipoParada: number | null,
}

export type dadosAddEdicaoMotivoParadaType = {
    id?: number,
    descricao: string,
    tipo: number,
}

export const getMotivoParadas = async (dados: postListagemMotivoParadaType) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.post(`${api}/listagem`, dados);
    if (response.data.sucesso) return response.data.dados as {
        dados: motivoParadaType[],
        totalPages: number,
        currentPage: number,
        pageSize: number,
        totalRegisters: number
    }
    else {
        throw new Error(response.data.mensagem);
    }
}

export const getMotivoParadaPorId = async (id: number) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/${id}`);
    if (response.data.sucesso) return response.data.dados as motivoParadaType;
    throw new Error(response.data.mensagem);
}

export const addMotivoParada = async (dados: dadosAddEdicaoMotivoParadaType) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.post(api, dados);
    if (response.data.sucesso) return {
        id: response.data.dados.id,
        mensagem: "MotivoParada adicionado"
    };
    throw new Error(response.data.mensagem);
}

export const updateMotivoParada = async (id: number, dados: dadosAddEdicaoMotivoParadaType) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.put(`${api}/${id}`, dados);
    if (response.data.sucesso) return "MotivoParada editado";
    throw new Error(response.data.mensagem);
}

export const deleteMotivoParada = async (id: number) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.delete(`${api}/${id}`);
    if (response.data.sucesso) return "MotivoParada excluído";
    else throw new Error(response.data.mensagem);
}

export const getMotivoParadaList = async (
    pesquisa: string | undefined,
    tipoParada: number | undefined
) => {
    try {
        const axiosInstance = await getAxios();
        const response = await axiosInstance.get(`${api}/select`, { params: { pesquisa, tipoParada } });
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