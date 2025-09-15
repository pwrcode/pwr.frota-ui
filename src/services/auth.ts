import getAxios from "@/axios/configAxios";
import { type NavigateFunction } from "react-router-dom";
import { type usuarioType } from "./usuario";
//import { errorMsg } from "./api";

// @ts-ignore
const api = import.meta.env.VITE_API_URL + "/auth"

export type dadosLoginType = {
  login: string,
  senha: string
}

export const logIn = async (dados: dadosLoginType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}/login`, dados);
  if(response.data.sucesso) {
    const token = response.data.dados.token;
    localStorage.setItem("authToken", JSON.stringify(token));
    localStorage.setItem("nome", JSON.stringify(response.data.dados.nome));
    return "Login feito com sucesso";
  } 
  else {
    throw new Error (response.data.mensagem ?? "Erro ao fazer login");
  }
}

export const logOut = (navigate: NavigateFunction) => {
  navigate("/login");
  localStorage.removeItem("authToken");
  localStorage.removeItem("email");
}

export const getAuthLogado = async () => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.get(`${api}/logado`);
  if (response.data.sucesso) {
    return response.data.dados as usuarioType;
  }
  else {
    throw new Error (response.data.mensagem);
  }
}