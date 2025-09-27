import getAxios from "@/axios/configAxios";
import { errorMsg } from "./api";
import { toast } from "react-toastify";
import { type itemSelectType } from "./constants";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/multa";

export type multaType = {
    id: number
    idVeiculo: number,
    descricaoVeiculo: string
    idMotorista: number,
    razaoSocialMotorista: string
    idArquivoAutuacao: number,
    idArquivoComprovantePagamento: number,
    dataInfracao: string
    numeroAuto: string,
    tipoInfracao: number,
    pontosCnh: number,
    valorMulta: number,
    dataVencimento: string
    dataPagamento: string
    observacoes: string
    usuarioCadastro: string,
    dataCadastro: string,
    usuarioEdicao: string | null,
    dataEdicao: string | null
};

export type postListagemMultaType = {
    currentPage: number,
    pageSize: number,
    tipoData: string | null,
    dataInicio: string
    dataFim: string
    pesquisa: string,
    idVeiculo: number | null,
    idMotorista: number | null,
    tipoInfracao: number | null
}

export type dadosAddEdicaoMultaType = {
    idVeiculo: number,
    idMotorista: number,
    idArquivoAutuacao: number,
    idArquivoComprovantePagamento: number,
    dataInfracao: string
    numeroAuto: string,
    tipoInfracao: number,
    pontosCnh: number,
    valorMulta: number,
    dataVencimento: string
    dataPagamento: string
    observacoes: string
}

export const getMulta = async (dados: postListagemMultaType) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.post(api + "/listagem", dados);
    if (response.data.sucesso) return response.data.dados as {
        dados: multaType[],
        totalPages: number,
        currentPage: number,
        pageSize: number,
        totalRegisters: number
    };
    throw new Error(response.data.mensagem);
}

export const getMultaPorId = async (id: number) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/${id}`);
    if (response.data.sucesso) return response.data.dados as multaType;
    throw new Error(response.data.mensagem);
}

export const addMulta = async (dados: dadosAddEdicaoMultaType) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.post(api, dados);
    if (response.data.sucesso) return "Localização adicionada";
    throw new Error(response.data.mensagem);
}

export const updateMulta = async (id: number, dados: dadosAddEdicaoMultaType) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.put(api + `/${id}`, dados);
    if (response.data.sucesso) return "Localização adicionada";
    throw new Error(response.data.mensagem);
}

export const deleteMulta = async (id: number) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.delete(`${api}/${id}`);
    if (response.data.sucesso) return "Localização excluída";
    throw new Error(response.data.mensagem);
}

export const getMultaList = async (
    pesquisa?: string,
    idTipoMulta?: number,
    idUf?: number,
    idMunicipio?: number,
    idBairro?: number
) => {
    try {
        const axiosInstance = await getAxios();
        const response = await axiosInstance.get(`${api}/select`, {
            params: { pesquisa, idTipoMulta, idUf, idMunicipio, idBairro }
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