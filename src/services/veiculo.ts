import getAxios from "@/axios/configAxios";
import { toast } from "react-toastify";
import { errorMsg } from "./api";
import { type itemSelectType } from "./constants";
import type { dadosAddEdicaoVeiculoTanqueType } from "./veiculoTanque";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/veiculo";

export type veiculoType = {
  id: number,
  descricao: string,
  placa: string,
  renavam: string,
  chassi: string,
  idTipoVeiculo: number,
  descricaoTipoVeiculo: string,
  idVeiculoMarca: number,
  descricaoVeiculoMarca: string,
  idVeiculoModelo: number,
  descricaoVeiculoModelo: string,
  idTipoMotor: number,
  descricaoTipoMotor: string,
  versao: string,
  anoFabricacao: number,
  anoModelo: number,
  cor: string,
  ativo: boolean,
  statusVeiculo: string,
  icone: string,
  quilometragemInicial: number,
  capacidadeCargaKg: number,
  capacidadeVolumeM3: number,
  idFotoVeiculo: number | null,
  capacidadePassageiros: number,
  dataAquisicao: string,
  valorCompra: number,
  dataVenda: string,
  valorVenda: number
  usuarioCadastro: string,
  dataCadastro: string,
  usuarioEdicao: string | null,
  dataEdicao: string | null,
};

export type postListagemVeiculoType = {
  pageSize: number,
  currentPage: number,
  pesquisa: string,
  tipoData: string | null,
  dataInicio: string | undefined,
  dataFim: string | undefined,
  idTipoVeiculo: number | null,
  idVeiculoMarca: number | null,
  idVeiculoModelo: number | null,
  ativo: boolean | null,
}

export type dadosAddEdicaoVeiculoType = {
  descricao: string,
  placa: string,
  renavam: string,
  chassi: string,
  idTipoVeiculo: number,
  idVeiculoMarca: number,
  idVeiculoModelo: number,
  idTipoMotor: number,
  versao: string,
  anoFabricacao: number,
  anoModelo: number,
  cor: string,
  ativo: boolean,
  icone: string,
  idFotoVeiculo: number | null,
  quilometragemInicial: number,
  capacidadeCargaKg: number,
  capacidadeVolumeM3: number,
  capacidadePassageiros: number,
  dataAquisicao: string | null | undefined,
  valorCompra: number,
  dataVenda: string | null | undefined,
  valorVenda: number | null,
  veiculoTanques?: dadosAddEdicaoVeiculoTanqueType[],
}

export const getVeiculos = async (dados: postListagemVeiculoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/listagem`, dados);
  if (response.data.sucesso) return response.data.dados as {
    dados: veiculoType[],
    totalPages: number,
    currentPage: number,
    pageSize: number,
    totalRegisters: number
  }
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getVeiculoPorId = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/${id}`);
  if (response.data.sucesso) return response.data.dados as veiculoType;
  throw new Error(response.data.mensagem);
}

export const addVeiculo = async (dados: dadosAddEdicaoVeiculoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(api, dados);
  if (response.data.sucesso) return {
    id: response.data.dados.id,
    mensagem: "Veiculo adicionado"
  };
  throw new Error(response.data.mensagem);
}

export const updateVeiculo = async (id: number, dados: dadosAddEdicaoVeiculoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.put(`${api}/${id}`, dados);
  if (response.data.sucesso) return "Veiculo editado";
  throw new Error(response.data.mensagem);
}

export const deleteVeiculo = async (id: number) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.delete(`${api}/${id}`);
  if (response.data.sucesso) return "Veiculo excluído";
  else throw new Error(response.data.mensagem);
}

export const getVeiculoList = async (pesquisa: string | undefined, idTipoVeiculo: number | undefined, idVeiculoMarca: number | undefined, idVeiculoModelo: number | undefined) => {
  try {
    const axiosInstance = await getAxios();
    const response = await axiosInstance.get(`${api}/select`, { params: { pesquisa, idTipoVeiculo, idVeiculoMarca, idVeiculoModelo } });
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