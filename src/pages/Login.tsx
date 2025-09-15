import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { logIn } from '@/services/auth';
import { errorMsg } from '@/services/api';
import { ModeToggle } from '@/components/ui/mode-toggle';

const schema = z.object({
  login: z.string().min(1, { message: "Login é obrigatório" }),
  senha: z.string().min(1, { message: "Senha é obrigatória" })
});

type dadosType = {
  login: string,
  senha: string
}

export default function Login() {

  const navigate = useNavigate();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem("authToken");
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<dadosType>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    if (errors.login) toast.error(`${errors.login.message}`);
    if (errors.senha) toast.error(`${errors.senha.message}`);
  }, [errors]);

  const submit = async (data: dadosType) => {
    if (loading) return
    setLoading(true);
    const process = toast.loading("Logando...");
    try {
      const post = {
        login: data.login,
        senha: data.senha
      };
      const response = await logIn(post);
      toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
      navigate("/");
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error, "Erro ao fazer login"), type: "error", isLoading: false, autoClose: 5000 });
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="lg:grid lg:grid-cols-[1fr_2fr] w-full h-screen">
      <div className="h-full flex items-center justify-center py-12 bg-slate-100 dark:bg-slate-600">

        <div className='absolute top-4 right-4'>
          <ModeToggle />
        </div>

        <div className="mx-auto grid w-[350px] gap-6">

          {/* LOGO NO MOBILE */}
          <div className="flex justify-center mb-4 lg:hidden">
            <img src="/assets/logo-erp.png" alt="logo" className="w-24 h-auto" />
          </div>

          {/* Login Card Unificado */}
          <form autoComplete='off' onSubmit={handleSubmit(submit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="login" className='text-gray-600 dark:text-gray-200'>Login</Label>
                <Input {...register("login")} placeholder="Login" className='dark:text-gray-200 dark:hover:text-gray-200' />
              </div>

              <div className="grid gap-2 relative">
                <Label htmlFor="senha" className='text-gray-600 dark:text-gray-200'>Senha</Label>
                <Input
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Senha"
                  {...register("senha")}
                  className="pr-10 dark:text-gray-200 dark:hover:text-gray-200"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-2 top-[22px] p-2 bg-transparent hover:bg-transparent dark:hover:bg-transparent"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                  {mostrarSenha ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                </Button>
              </div>

              <Button type="submit" variant="orange" className="w-full">
                Entrar
              </Button>
            </div>
          </form>

        </div>

      </div>

      {/* LOGO NO DESKTOP */}
      <div className="hidden bg-orange-700 lg:flex items-center justify-center">
        <div className="w-2/5">
          <img src="/assets/logo-erp.png" alt="logo" />
        </div>
      </div>
    </div>
  )
}
