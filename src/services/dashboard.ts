import getAxios from "@/axios/configAxios";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/dashboard";

export type totalizadorType = {
  descricao: string,
  valor: number
}

export type dashboardFiltrosAbastecimentoType = {
  dataInicio: string | null,
  dataFim: string | null,
  idVeiculo: number | null,
  idPostoCombustivel: number | null,
  idProdutoAbastecimento: number | null,
}

export type dashboardFiltrosEntradaType = {
  dataInicio: string | null,
  dataFim: string | null,
  idVeiculo: number | null,
  idPostoCombustivel: number | null,
  idProdutoAbastecimento: number | null,
}

export type dashboardTabelaType = {
  descricao: string,
  quantidade: number,
  litros: number,
  valorTotal: number
}

export type dashboardTanqueType = {
  descricaoPostoCombustivel: string,
  descricaoPostoCombustivelTanque: string,
  descricaoProdutoAbastecimento : string,
  quantidade: number,
}

export const getDashboardTotalizadores = async () => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/totalizadores`);
  if (response.data.sucesso) return response.data.dados as Array<totalizadorType>
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getDashboardVeiculoPorTipo = async () => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/veiculo-por-tipo`);
  if (response.data.sucesso) return response.data.dados as Array<totalizadorType>
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getTotalizadorQuantidadeAbastecimentos = async (filtros: dashboardFiltrosAbastecimentoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/quantidade-abastecimentos`, filtros);
  if (response.data.sucesso) return response.data.dados as totalizadorType
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getTotalizadorValorTotalAbastecimentos = async (filtros: dashboardFiltrosAbastecimentoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/valor-total-abastecimentos`, filtros);
  if (response.data.sucesso) return response.data.dados as totalizadorType
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getTotalizadorQuantidadeLitrosAbastecimentos = async (filtros: dashboardFiltrosAbastecimentoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/quantidade-litros-abastecimentos`, filtros);
  if (response.data.sucesso) return response.data.dados as totalizadorType
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getAbastecimentosPorVeiculo = async (filtros: dashboardFiltrosAbastecimentoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/abastecimentos-por-veiculo`, filtros);
  if (response.data.sucesso) return response.data.dados as Array<dashboardTabelaType>
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getAbastecimentosPorProdutoAbastecimento = async (filtros: dashboardFiltrosAbastecimentoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/abastecimentos-por-produto-abastecimento`, filtros);
  if (response.data.sucesso) return response.data.dados as Array<dashboardTabelaType>
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getAbastecimentosPorPostoCombustivel = async (filtros: dashboardFiltrosAbastecimentoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/abastecimentos-por-posto-combustivel`, filtros);
  if (response.data.sucesso) return response.data.dados as Array<dashboardTabelaType>
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getTotalizadorAbastecimentosPorDia = async (filtros: dashboardFiltrosAbastecimentoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/abastecimentos-por-dia`, filtros);
  if (response.data.sucesso) return response.data.dados as Array<totalizadorType>
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getTotalizadorAbastecimentosLitrosPorDia = async (filtros: dashboardFiltrosAbastecimentoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/abastecimentos-litros-por-dia`, filtros);
  if (response.data.sucesso) return response.data.dados as Array<totalizadorType>
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getTotalizadorAbastecimentosValorTotalPorDia = async (filtros: dashboardFiltrosAbastecimentoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/abastecimentos-valor-total-por-dia`, filtros);
  if (response.data.sucesso) return response.data.dados as Array<totalizadorType>
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getTotalizadorAbastecimentosPorMes = async (filtros: dashboardFiltrosAbastecimentoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/totalizador-abastecimentos-por-mes`, filtros);
  if (response.data.sucesso) return response.data.dados as Array<totalizadorType>
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getTotalizadorAbastecimentosLitrosPorMes = async (filtros: dashboardFiltrosAbastecimentoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/totalizador-abastecimentos-litros-por-mes`, filtros);
  if (response.data.sucesso) return response.data.dados as Array<totalizadorType>
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getTotalizadorAbastecimentosValorTotalPorMes = async (filtros: dashboardFiltrosAbastecimentoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/totalizador-abastecimentos-valor-total-por-mes`, filtros);
  if (response.data.sucesso) return response.data.dados as Array<totalizadorType>
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getAbastecimentosPorMotorista = async (filtros: dashboardFiltrosAbastecimentoType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/abastecimentos-por-motorista`, filtros);
  if (response.data.sucesso) return response.data.dados as Array<dashboardTabelaType>
  else {
    throw new Error(response.data.mensagem);
  }
}

export const getDashboardEstoqueTanque = async (filtros: dashboardFiltrosEntradaType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/estoque-tanque-por-posto`, filtros);
  if (response.data.sucesso) return response.data.dados as Array<dashboardTanqueType>
  else {
    throw new Error(response.data.mensagem);
  }
}