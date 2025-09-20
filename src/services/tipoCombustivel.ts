import getAxios from "@/axios/configAxios";
import { toast } from "react-toastify";
import { errorMsg } from "./api";
import { type itemSelectType } from "./constants";

const api = import.meta.env.VITE_API_URL + "/tipo-combustivel";

export type tipoCombustivelType = {
    id: number;
    descricao: string;
    idUnidadeMedida: number;
    descricaoUnidadeMedida: string;
    siglaUnidadeMedida: string;
    dataCadastro: string,
    usuarioCadastro: string,
    dataEdicao: string | null,
    usuarioEdicao: string | null
};

export type postListagemTipoCombustivelType = {
    pageSize: number,
    currentPage: number,
    pesquisa: string,
    idUnidadeMedida: number | null,
}

export const getTipoCombustivels = async (dados: postListagemTipoCombustivelType) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.post(`${api}/listagem`, dados);
    if (response.data.sucesso) return response.data.dados as {
        dados: tipoCombustivelType[],
        totalPages: number,
        currentPage: number,
        pageSize: number,
        totalRegisters: number
    }
    else {
        throw new Error(response.data.mensagem);
    }
}

export const getTipoCombustivelPorId = async (id: number) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/${id}`);
    if (response.data.sucesso) return response.data.dados as tipoCombustivelType;
    throw new Error(response.data.mensagem);
}

export const getTipoCombustivelList = async (
    pesquisa: string | undefined,
    idUnidadeMedida: number | undefined
) => {
    try {
        const axiosInstance = await getAxios();
        const response = await axiosInstance.get(`${api}/select`, {
            params: {
                pesquisa,
                idUnidadeMedida,
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