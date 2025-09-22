import axios from "axios";
import { type listType } from "./constants";

export const getCidadesUf = async (uf: string | number) => {
  if (!uf) throw new Error("Erro ao procurar municípios");
  const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
  if (response.data) return response.data.map((c: any) => ({ value: c.nome, label: c.nome })) as listType;
  throw new Error("Erro ao procurar municípios");
};
  
export const getEndereco = async (cep: string | number) => {
  if (!cep) throw new Error("Erro ao procurar cep");
  const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
  const data = response.data;
  if (data.erro) throw new Error("CEP não encontrado");
  return {
    uf: data.uf,
    cidade: data.localidade,
    bairro: data.bairro,
    logradouro: data.logradouro,
    complemento: data.complemento,
    codigoIbge: data.ibge
  };
};