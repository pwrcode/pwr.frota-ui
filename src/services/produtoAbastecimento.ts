import getAxios from "@/axios/configAxios";
import { toast } from "react-toastify";
import { errorMsg } from "./api";
import { type itemSelectType } from "./constants";

const api = import.meta.env.VITE_API_URL + "/produto-abastecimento";

export type produtoAbastecimentoType = {
    id: number,
    descricao: string,
    idTipoCombustivel: number,
    descricaoTipoCombustivel: string,
    isAditivado: boolean,
    tipoTanque: string,
    dataCadastro: string,
    usuarioCadastro: string,
    dataEdicao: string | null,
    usuarioEdicao: string | null
};

export type postListagemProdutoAbastecimentoType = {
    pageSize: number,
    currentPage: number,
    pesquisa: string,
    idTipoCombustivel: number | null,
    isAditivado: boolean | null,
    tipoTanque: number | null,
}

export const getProdutoAbastecimentos = async (dados: postListagemProdutoAbastecimentoType) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.post(`${api}/listagem`, dados);
    if (response.data.sucesso) return response.data.dados as {
        dados: produtoAbastecimentoType[],
        totalPages: number,
        currentPage: number,
        pageSize: number,
        totalRegisters: number
    }
    else {
        throw new Error(response.data.mensagem);
    }
}

export const getProdutoAbastecimentoPorId = async (id: number) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/${id}`);
    if (response.data.sucesso) return response.data.dados as produtoAbastecimentoType;
    throw new Error(response.data.mensagem);
}

export const getProdutoAbastecimentoList = async (
    pesquisa: string | undefined,
    idTipoCombustivel: number | undefined,
    isAditivado: boolean | undefined,
    tipoTanque: 1 | 2 | undefined
) => {
    try {
        const axiosInstance = await getAxios();
        const response = await axiosInstance.get(`${api}/select`, {
            params: {
                pesquisa,
                idTipoCombustivel,
                isAditivado,
                tipoTanque
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