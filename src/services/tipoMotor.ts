import getAxios from "@/axios/configAxios";
import { toast } from "react-toastify";
import { errorMsg } from "./api";
import { type itemSelectType } from "./constants";

const api = import.meta.env.VITE_API_URL + "/tipo-motor";

export type tipoMotorType = {
    id: number;
    descricao: string;
    dataCadastro: string,
    usuarioCadastro: string,
    dataEdicao: string | null,
    usuarioEdicao: string | null
};

export type postListagemTipoMotorType = {
    pageSize: number,
    currentPage: number,
    pesquisa: string,
}

export const getTipoMotors = async (dados: postListagemTipoMotorType) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.post(`${api}/listagem`, dados);
    if (response.data.sucesso) return response.data.dados as {
        dados: tipoMotorType[],
        totalPages: number,
        currentPage: number,
        pageSize: number,
        totalRegisters: number
    }
    else {
        throw new Error(response.data.mensagem);
    }
}

export const getTipoMotorPorId = async (id: number) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/${id}`);
    if (response.data.sucesso) return response.data.dados as tipoMotorType;
    throw new Error(response.data.mensagem);
}

export const getTipoMotorList = async (
    pesquisa: string | undefined,
) => {
    try {
        const axiosInstance = await getAxios();
        const response = await axiosInstance.get(`${api}/select`, {
            params: {
                pesquisa,
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