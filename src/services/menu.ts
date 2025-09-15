import getAxios from "@/axios/configAxios";

//@ts-ignore
const api = import.meta.env.VITE_API_URL + "/menu";

export type loginType = {
  usuario: string,
  senha: string,
  cpfCnpjEmpresa: string
};

type dadosMenuType = {
  controllerAtual: string;
  actionAtual?: string;
};

export type menusType = {
  ativo: boolean;
  caminho: string | null;
  descricao: string;
  icone: string;
  idAlerta: any;
  link: string;
  submenus: any;
};

export type menuType = {
  dados: {
    collapsedMenu: boolean;
    menu: {
      descricao: string;
      menus: menusType[];
    }[];
    menuPesquisa: {
      descricao: string;
      menus: menusType[];
    }[];
  },
  mensagem: string | any,
  sucesso: boolean
};

export const menu = async (dados: dadosMenuType) => {
  const axiosInstance = await getAxios();
  const response = await axiosInstance.post(`${api}`, dados);
  if(response.status !== 200) {
    throw new Error("Erro");
  }
  return response.data as menuType;
}