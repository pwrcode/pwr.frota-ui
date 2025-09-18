
import { Outlet, useNavigate } from "react-router-dom";
import { Maximize, Minimize } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { AppSidebar } from "@/ui/components/AppSidebar";
import {
  Breadcrumb, BreadcrumbList
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset, SidebarProvider, SidebarTrigger
} from "@/components/ui/sidebar";
import { useEffect, useState, Suspense } from "react";
import { ImageSrc, TypesImg } from "./ImageSrc";
import { getAuthLogado, logOut } from "@/services/auth";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { errorMsg } from "@/services/api";
import ModalSenha from "./ModalSenha";
import ContentLoading from "./ContentLoading";

export default function LayoutPage() {

  const navigate = useNavigate();
  const [nome, setNome] = useState<string>("");
  const [idArquivoFoto, setIdArquivoFoto] = useState<number | null>();
  const [openModalSenha, setOpenModalSenha] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    getInfoUsuario();
  }, []);
  
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

  const handleLogOut = () => {
    logOut(navigate);
  };

  const alterarSenha = () => {
    setOpenModalSenha(true);
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Erro ao entrar em fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error('Erro ao sair do fullscreen:', err);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <>
      <SidebarProvider>

        <AppSidebar />

        <SidebarInset className="overflow-hidden">
          <header className="fixed top-0 z-10 flex h-16 w-[100vw] items-center justify-between gap-2 border-b px-4 bg-white dark:bg-slate-800 dark:border-slate-600 shadow-md">
            <SidebarTrigger className="-ml-1 dark:text-white dark:hover:bg-slate-700" />
            <Separator orientation="vertical" className="mx-6 h-4 " />
            <Breadcrumb className="fixed right-3">
              <BreadcrumbList>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="dark:bg-slate-800 dark:border-slate-500 dark:hover:bg-slate-700 dark:text-white focus:outline-none focus-visible:outline-none"
                  >
                    {isFullscreen ? <Minimize className="h-[1.2rem] w-[1.2rem]" /> : <Maximize className="h-[1.2rem] w-[1.2rem]" />}
                  </Button>
                  <ModeToggle />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex justify-center items-center gap-3 px-3 rounded-md cursor-pointer hover:bg-gray-100 dark:bg-slate-800 hover:dark:bg-slate-700">
                        <p className="text-blue-800 dark:text-white text-sm font-semibold" translate="no">{nome}</p>
                        <div className="size-8 rounded-full flex justify-center items-center overflow-hidden">
                          <ImageSrc idArquivo={idArquivoFoto} alt="Foto do usuário" style="w-full h-full max-w-max" typeImg={TypesImg.user} />
                        </div>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className='w-40 dark:bg-slate-800'>
                      <DropdownMenuItem className="cursor-pointer text-base font-semibold text-gray-800 dark:text-white" onClick={alterarSenha}>
                        Alterar senha
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-base font-semibold text-red-600 dark:text-white" onClick={handleLogOut}>
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <main className="bg-gray-100 dark:bg-slate-700 flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 max-w-[100vw] md:max-w-[calc(100vw)] lg:max-w-[calc(100vw)] overflow-y-auto">
            <Suspense fallback={<ContentLoading />}>
              <Outlet />
            </Suspense>
          </main>
        </SidebarInset>

      </SidebarProvider>

      <ModalSenha open={openModalSenha} setOpen={setOpenModalSenha} nome={nome} />

    </>
  );
}