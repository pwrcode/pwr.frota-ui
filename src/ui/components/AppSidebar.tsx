import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { menu, type menusType, type menuType } from "@/services/menu";
import { toast } from "react-toastify";
import { errorMsg } from "@/services/api";
import { Input } from "@/components/ui/input";
import { renderIcon } from "./RenderIcon";
import { Zap } from "lucide-react";

interface SubmenuType {
  descricao: string;
  link: string;
  icone: string;
  ativo: boolean;
  idAlerta: number | null;
  caminho: string | null;
  submenus?: SubmenuType[] | null;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const [acessos, setAcessos] = useState<menusType[]>();
  const location = useLocation();
  const [primeiraReq, setPrimeiraReq] = useState(true);

  const [menuActiveStates, setMenuActiveStates] = useState<Record<string, boolean>>({});
  const [currentAccordion, setCurrentAccordion] = useState<string | undefined>(undefined);

  const { setOpenMobile } = useSidebar();

  useEffect(() => {
    if (acessos) {
      const newMenuActiveStates = acessos.reduce((acc, menu) => {
        acc[menu.descricao] = isMenuActive(menu, location.pathname);
        return acc;
      }, {} as Record<string, boolean>);

      setMenuActiveStates(newMenuActiveStates);

      const activeMenu = acessos.find((menu) =>
        isMenuActive(menu, location.pathname)
      );

      if (activeMenu) {
        setCurrentAccordion(activeMenu.descricao);
      }
    }
  }, [acessos, location.pathname]);


  useEffect(() => {
    checkAcessos();
  }, [location]);

  const checkAcessos = async () => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    const controllerAtual = primeiraReq ? "/" : pathParts[0] ?? "";
    const dados = { controllerAtual, actionAtual: "" };
    try {
      const response: menuType = await menu(dados);
      setAcessos(response.dados.menu[0].menus);
    }
    catch (error: Error | any) {
      toast.error(errorMsg(error, null), { autoClose: 4000 });
    }
    finally {
      setPrimeiraReq(false);
    }
  };

  function normalizePath(path: string): string {
    return path.split("/")[1] || "";
  }

  function isActive(item: SubmenuType | menusType, currentPath: string): boolean {
    if (!item.link) return false;
    return normalizePath(currentPath) === normalizePath(item.link);
  }

  function isMenuActive(menu: menusType, currentPath: string): boolean {
    return (
      isActive(menu, currentPath) ||
      (menu.submenus?.some((submenu: SubmenuType | menusType) => isActive(submenu, currentPath)) ?? false)
    );
  }

  const [search, setSearch] = useState<string>("");

  return (
    <Sidebar {...props}>
      <SidebarHeader className="bg-background h-16 flex justify-center items-start text-md border-b border-border">
        <div className="flex items-center ml-1">
          <div className="flex aspect-square size-7 items-center justify-center rounded-sm bg-brand-primary">
            <Zap className="size-4 text-brand-primary-foreground" />
          </div>
          <span className="font-normal text-sidebar-foreground ml-4" translate="no">
            <span className="font-bold">PWR</span> Frota
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-background h-full overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-500 scrollbar-track-gray-200 scrollbar-hide">
        <div className="h-10 px-2 mt-3">
          <Input
            name="search"
            placeholder="Pesquisar..."
            className="border-sidebar-border"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Sidebar sem pesquisa */}
        {search.length === 0 && (
          <SidebarMenu className="mb-3 scrollbar-hide">
            {acessos?.map((menu) => {
              const menuIsActive = menuActiveStates[menu.descricao] ?? false;
              return (
                <SidebarMenuItem key={menu.link || menu.descricao} className="text-sidebar-foreground mx-2">
                  {menu.submenus && menu.submenus.length > 0 ? (
                    <Accordion
                      type="single"
                      collapsible
                      value={currentAccordion}
                      onValueChange={(value) => {
                        setCurrentAccordion((prev) => (prev === value ? undefined : value));
                      }}
                    >
                      <AccordionItem value={menu.descricao} className={`border-b-0 ${menuIsActive ? "open" : ""}`}>
                        <AccordionTrigger className={`text-sidebar-foreground hover:bg-sidebar-accent p-2 rounded-md`}>
                          <div className="flex items-center">
                            <div className="w-5 h-5 mr-2 flex items-center justify-center flex-shrink-0">
                              {renderIcon(menu.icone, "size-5")}
                            </div>
                            <div className="ml-1 font-normal">{menu.descricao}</div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="rounded-md">
                          {menu.submenus.map((submenu: menusType | SubmenuType) => {
                            const isSubmenuActive = isActive(submenu, location.pathname);
                            return (
                              <SidebarMenuButton
                                key={submenu.link}
                                asChild
                                className={`pl-5 py-5 text-sm ${isSubmenuActive ? "bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary-hover" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
                                onClick={() => setOpenMobile(false)}
                              >
                                <Link to={submenu.link}>
                                  <div className="w-5 h-5 mr-2 flex items-center justify-center flex-shrink-0">
                                    {renderIcon(submenu.icone, "size-5")}
                                  </div>
                                  {submenu.descricao}
                                </Link>
                              </SidebarMenuButton>
                            );
                          })}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      className={`py-5 ${menuIsActive ? "bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary-hover" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
                      onClick={() => setOpenMobile(false)}
                    >
                      <Link to={menu.link} className="flex items-center">
                        <div className="w-5 h-5 mr-2 flex items-center justify-center flex-shrink-0">
                          {renderIcon(menu.icone, "size-5")}
                        </div>
                        {menu.descricao}
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        )}

        {/* Menus quando pesquisa */}
        {search.length > 0 && (
          <SidebarMenu className="mb-3 scrollbar-hide text-sidebar-foreground gap-0">
            {acessos?.map(menu => {
              const hasSearch = menu.descricao.toLowerCase().includes(search.toLowerCase());
              const isSubmenuActive = isActive(menu, location.pathname);

              if (hasSearch && menu.link !== "")
                return (
                  <div key={menu.descricao} className="mx-2">
                    <SidebarMenuButton
                      key={menu.link}
                      asChild
                      className={`py-5 text-sm ${isSubmenuActive ? "bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary-hover" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
                      onClick={() => setOpenMobile(false)}
                    >
                      <Link to={menu.link} className="flex items-center">
                        <div className="w-5 h-5 mr-2 flex items-center justify-center flex-shrink-0">
                          {renderIcon(menu.icone, "size-5")}
                        </div>
                        {menu.descricao}
                      </Link>
                    </SidebarMenuButton>
                  </div>)
              return (
                <div key={menu.descricao} className="mx-2">
                  {Array.isArray(menu.submenus) && menu.submenus.map(submenu => {

                    const hasSearch = submenu.descricao.toLowerCase().includes(search.toLowerCase());
                    const isSubmenuActive = isActive(submenu, location.pathname);

                    if (hasSearch) return (
                      <SidebarMenuButton
                        key={submenu.link}
                        asChild
                        className={`py-5 ${isSubmenuActive ? "bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary-hover" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
                        onClick={() => setOpenMobile(false)}
                      >
                        <Link to={submenu.link} className="flex items-center">
                          <div className="w-5 h-5 mr-2 flex items-center justify-center flex-shrink-0">
                            {renderIcon(submenu.icone, "size-5")}
                          </div>
                          {submenu.descricao}
                        </Link>
                      </SidebarMenuButton>
                    )
                  })}
                </div>)
            }
            )}
          </SidebarMenu>
        )}
      </SidebarContent>
      <SidebarFooter className="bg-background p-2 border-t border-border">
        <div className="flex items-center gap-2 pb-2 mt-1">
          <div className="flex aspect-square size-11 items-center justify-center rounded-lg bg-[#fafafa80]">
            <img src="/logo.png" alt="Logo" className="rounded-md p-1" />
          </div>
          <span className="font-normal text-sidebar-foreground ml-2">Cliente</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
