import { Card, CardTitle } from "@/components/ui/card";
import { errorMsg } from "@/services/api";
import { getAuthLogado } from "@/services/auth";
import { menu, type menusType, type menuType } from "@/services/menu";
import CardLink from "@/ui/components/CardLink";
import { ImageSrc, TypesImg } from "@/ui/components/ImageSrc";
import { renderIcon } from "@/ui/components/RenderIcon";
import { ChartColumnBig } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Home() {

  const [nome, setNome] = useState<string>("");
  const [idArquivoFoto, setIdArquivoFoto] = useState<number | null>();
  const [menuItems, setMenuItems] = useState<menusType[]>([]);

  useEffect(() => {
    getInfoUsuario();
    getMenuItems();
  }, []);

  const getMenuItems = async () => {
    try {
      const dados = { controllerAtual: "/", actionAtual: "" };
      const response: menuType = await menu(dados);
      setMenuItems(response.dados.menu[0].menus);
    }
    catch (error: Error | any) {
      console.error("Erro ao carregar itens do menu:", error);
    }
  };

  // Função para renderizar todos os itens de menu (incluindo submenus)
  const renderAllMenuItems = () => {
    const allItems: menusType[] = [];
    const excludedItems = ['inicio', 'home', 'usuario', 'usuarios', 'perfil-acesso', 'perfil de acesso'];

    menuItems.forEach(menu => {
      // Verifica se o item principal deve ser excluído
      const shouldExcludeMain = excludedItems.some(excluded =>
        menu.descricao?.toLowerCase().includes(excluded.toLowerCase()) ||
        menu.link?.toLowerCase().includes(excluded.toLowerCase())
      );

      // Adiciona o item principal se ele tem link e não está na lista de exclusão
      if (menu.link && !shouldExcludeMain) {
        allItems.push(menu);
      }

      // Adiciona todos os submenus (excluindo os da lista)
      if (menu.submenus) {
        menu.submenus.forEach((submenu: any) => {
          const shouldExcludeSubmenu = excludedItems.some(excluded =>
            submenu.descricao?.toLowerCase().includes(excluded.toLowerCase()) ||
            submenu.link?.toLowerCase().includes(excluded.toLowerCase())
          );

          if (submenu.link && !shouldExcludeSubmenu) {
            allItems.push(submenu);
          }
        });
      }
    });

    return allItems;
  };

  const getInfoUsuario = async () => {
    const process = toast.loading("");
    try {
      const data = await getAuthLogado();
      setNome(data.nome);
      setIdArquivoFoto(data.idArquivoFoto);
      toast.dismiss(process);
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error), type: "error", isLoading: false, autoClose: 2000 });
    }
  }

  return (
    <div className="w-full">

      {/* Hero Section */}
      <div className="pt-20 pb-12 px-4">
        <Card className="w-full shadow-xl border-0 bg-white dark:bg-slate-800">
          <div className="flex flex-col md:flex-row items-center p-8 gap-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-4 ring-blue-100 dark:ring-blue-900">
                <ImageSrc idArquivo={idArquivoFoto} alt="Foto do usuário" style="h-full rounded-full max-w-max" typeImg={TypesImg.user} />
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                Bem-vindo, {nome}
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-300 font-medium mt-2">
                Escolha uma das opções abaixo para começar
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div className="px-4 pb-12">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8">
          Acesso Rápido
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderAllMenuItems().map((item, index) => (
            <CardLink
              key={`${item.link}-${index}`}
              link={item.link}
              label={item.descricao}
              icone={renderIcon(item.icone) ?? <ChartColumnBig />}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
