import getAxios from "@/axios/configAxios";
import { errorMsg } from "./api";
import { toast } from "react-toastify";
import { type itemSelectType } from "./constants";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/localizacao";

export type localizacaoType = {
    id: number,
    idTipoLocalizacao: number,
    descricaoTipoLocalizacao: string,
    descricao: string,
    cep: string,
    idUf: number,
    descricaoUf: string
    idMunicipio: number,
    descricaoMunicipio: string,
    idBairro: number,
    descricaoBairro: string,
    logradouro: string,
    numero: string,
    complemento: string,
    pontoReferencia: string,
    telefonePrincipal: string,
    telefoneSecundario: string,
    email: string,
    raio: 0,
    horarioFuncionamento: string,
    observacao: string
    usuarioCadastro: string,
    dataCadastro: string,
    usuarioEdicao: string | null,
    dataEdicao: string | null
};

export type postListagemLocalizacaoType = {
    currentPage: number,
    pageSize: number,
    pesquisa: string,
    idTipoLocalizacao: number | null,
    idUf: number | null,
    idMunicipio: number | null,
    idBairro: number | null
}

export type dadosAddEdicaoLocalizacaoType = {
    idTipoLocalizacao: number,
    descricao: string,
    cep: string,
    idUf: number,
    idMunicipio: number,
    idBairro: number,
    logradouro: string,
    numero: string,
    complemento: string,
    pontoReferencia: string,
    telefonePrincipal: string,
    telefoneSecundario: string,
    email: string,
    raio: 0,
    horarioFuncionamento: string,
    observacao: string
}

export const getLocalizacao = async (dados: postListagemLocalizacaoType) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.post(api + "/listagem", dados);
    if (response.data.sucesso) return response.data.dados as {
        dados: localizacaoType[],
        totalPages: number,
        currentPage: number,
        pageSize: number,
        totalRegisters: number
    };
    throw new Error(response.data.mensagem);
}

export const getLocalizacaoPorId = async (id: number) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/${id}`);
    if (response.data.sucesso) return response.data.dados as localizacaoType;
    throw new Error(response.data.mensagem);
}

export const addLocalizacao = async (dados: dadosAddEdicaoLocalizacaoType) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.post(api, dados);
    if (response.data.sucesso) return "Localização adicionada";
    throw new Error(response.data.mensagem);
}

export const updateLocalizacao = async (id: number, dados: dadosAddEdicaoLocalizacaoType) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.put(api + `/${id}`, dados);
    if (response.data.sucesso) return "Localização adicionada";
    throw new Error(response.data.mensagem);
}

export const deleteLocalizacao = async (id: number) => {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.delete(`${api}/${id}`);
    if (response.data.sucesso) return "Localização excluída";
    throw new Error(response.data.mensagem);
}

export const getLocalizacaoList = async (
    pesquisa?: string,
    idTipoLocalizacao?: number,
    idUf?: number,
    idMunicipio?: number,
    idBairro?: number
) => {
    try {
        const axiosInstance = await getAxios();
        const response = await axiosInstance.get(`${api}/select`, {
            params: { pesquisa, idTipoLocalizacao, idUf, idMunicipio, idBairro }
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