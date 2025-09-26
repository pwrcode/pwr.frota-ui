import { Button } from '@/components/ui/button';
import { errorMsg } from '@/services/api';
import { dateDiaMesAno, dateHoraMin } from '@/services/date';
import { addUsuario, type dadosAddEdicaoUsuarioType, getUsuarioPorId, updateUsuario } from '@/services/usuario';
import { ButtonSubmit } from '@/ui/components/buttons/FormButtons';
import { CadAlterInfo } from '@/ui/components/forms/CadAlterInfo';
import { CheckBoxLabel } from '@/ui/components/forms/CheckBoxLabel';
import { DivCheckBox } from '@/ui/components/forms/DivCheckBox';
import FormContainer from '@/ui/components/forms/FormContainer';
import FormContainerBody from '@/ui/components/forms/FormContainerBody';
import FormContainerHeader from '@/ui/components/forms/FormContainerHeader';
import FormLine from '@/ui/components/forms/FormLine';
import InputLabel from '@/ui/components/forms/InputLabel';
import { UploadFoto } from '@/ui/components/forms/UploadFoto';
import SelectPerfilAcesso from '@/ui/selects/PerfilAcessoSelect';
import SelectPessoa from '@/ui/selects/PessoaSelect';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';
import ModalSenha from './ModalSenha';

export const schemaAdd = z.object({
  nome: z.string().min(1, { message: "Informe o nome" }),
  login: z.string().min(1, { message: "Informe o login" }),
  idPerfil: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }, { message: "Selecione o perfil" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o perfil" }),
  idPessoa: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }).optional().transform(t => t && t.value ? t.value : undefined),
  ativo: z.boolean().optional(),
  senha: z.string().min(1, { message: "Informe a senha" }),
  confirmacaoSenha: z.string().min(1, { message: "Confirme a senha" }),
});

export const schemaUpdate = z.object({
  nome: z.string().min(1, { message: "Informe o nome" }),
  login: z.string().min(1, { message: "Informe o login" }),
  idPerfil: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }, { message: "Selecione o perfil" }).transform(t => t && t.value ? t.value : undefined).refine(p => !isNaN(Number(p)), { message: "Selecione o perfil" }),
  idPessoa: z.object({
    label: z.string().optional(),
    value: z.number().optional()
  }).optional().transform(t => t && t.value ? t.value : undefined),
  ativo: z.boolean().optional(),
  senha: z.string().optional(),
  confirmacaoSenha: z.string().optional(),
});

export default function UsuarioForm() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cadInfo, setCadInfo] = useState<string>("");
  const [edicaoInfo, setEdicaoInfo] = useState<string>("");
  const [idArquivoFoto, setIdArquivoFoto] = useState<number>(0);
  const [openModalSenha, setOpenModalSenha] = useState<boolean>(false);

  const { register, handleSubmit, reset, setValue, control, setFocus, formState: { errors } } = useForm({
    resolver: zodResolver(id ? schemaUpdate : schemaAdd)
  });

  useEffect(() => {
    Object.entries(errors).forEach(([key, error]) => {
      if (error?.message) {
        toast.error(`${error.message}`);
        // @ts-ignore
        setFocus(key);
        return
      }
    });
  }, [errors]);

  useEffect(() => {
    if (id) setValuesPorId();
    else setValue("ativo", true);
  }, [id]);

  const setValuesPorId = async () => {
    const process = toast.loading("Buscando item...");
    try {
      if (!id || isNaN(Number(id))) throw new Error("Não foi possível encontrar o item");
      const item = await getUsuarioPorId(Number(id));
      setIdArquivoFoto(item.idArquivoFoto ?? 0);
      setValue("nome", item.nome);
      setValue("login", item.login);
      if (item.idPerfil) setValue("idPerfil", { value: item.idPerfil, label: item.descricaoPerfil });
      if (item.idPessoa) setValue("idPessoa", { value: item.idPessoa, label: item.descricaoPessoa });
      setValue("ativo", item.ativo ? true : false);
      setCadInfo(`${item.usuarioCadastro} ${dateDiaMesAno(item.dataCadastro)} ${dateHoraMin(item.dataCadastro)}`);
      setEdicaoInfo(`${item.usuarioEdicao} ${dateDiaMesAno(item.dataEdicao)} ${dateHoraMin(item.dataEdicao)}`);
      toast.dismiss(process);
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error), type: "error", isLoading: false, autoClose: 2000 });
      navigate("/usuario");
    }
  };

  const changeIdArquivo = (codigo: number) => {
    setIdArquivoFoto(codigo);
  }

  const submit = async (data: dadosAddEdicaoUsuarioType) => {
    if (loading) return;
    setLoading(true);
    const process = toast.loading("Salvando item...")
    try {
      if (!id) {
        const post: dadosAddEdicaoUsuarioType = {
          nome: data.nome,
          login: data.login,
          idPerfil: data.idPerfil ?? null,
          idPessoa: data.idPessoa ?? null,
          idArquivoFoto: idArquivoFoto !== 0 ? idArquivoFoto : null,
          ativo: data.ativo ?? false,
          senha: data.senha,
          confirmacaoSenha: data.confirmacaoSenha
        }
        const res = await addUsuario(post);
        toast.update(process, { render: res, type: "success", isLoading: false, autoClose: 2000 });
      }
      else {
        const put: dadosAddEdicaoUsuarioType = {
          nome: data.nome,
          login: data.login,
          idPessoa: data.idPessoa ?? null,
          idPerfil: data.idPerfil ?? null,
          idArquivoFoto: idArquivoFoto !== 0 ? idArquivoFoto : null,
          ativo: data.ativo ?? false
        }
        const res = await updateUsuario(Number(id), put);
        toast.update(process, { render: res, type: "success", isLoading: false, autoClose: 2000 });
      }
      reset();
      navigate("/usuario");
    }
    catch (error: Error | any) {
      toast.update(process, { render: errorMsg(error), type: "error", isLoading: false, autoClose: 2000 });
    }
    finally {
      setLoading(false);
    }
  }

  const handleClickAlterarSenha = () => {
    setOpenModalSenha(true);
  }

  return (
    <div className="w-full mt-16 flex flex-col lg:flex-row gap-4">

      <div className="flex-1">
        <UploadFoto referenciaTipo="Usuario" idArquivo={idArquivoFoto} changeIdArquivo={changeIdArquivo} alt="Foto do usuário" isDisabled={loading} />
      </div>

      <form autoComplete='off' className="flex-[3] flex flex-col gap-4" onSubmit={handleSubmit((data) => submit(data as unknown as dadosAddEdicaoUsuarioType))}>
        <FormContainer>
          <FormContainerHeader title="Usuário">
            {(id && Number(id) > 0) && (
              <Button variant="blue" type="button" onClick={() => handleClickAlterarSenha()} disabled={loading}>Alterar senha</Button>
            )}
          </FormContainerHeader>
          <FormContainerBody>

            <FormLine>
              <InputLabel name="nome" title="Nome" register={{ ...register("nome") }} />
              <SelectPessoa control={control} />
              <SelectPerfilAcesso control={control} />
            </FormLine>

            <FormLine justify="start">
              <InputLabel name="login" title="Login" register={{ ...register("login") }} />
              {!id && <>
                <InputLabel name="senha" type="password" title="Senha" register={{ ...register("senha") }} />
                <InputLabel name="confirmacaoSenha" type="password" title="Confirmar senha" register={{ ...register("confirmacaoSenha") }} />
              </>}
              {id && (
                <DivCheckBox style="medium-full">
                  <CheckBoxLabel name="ativo" title="Ativo" register={{ ...register("ativo") }} />
                </DivCheckBox>
              )}
            </FormLine>

            {(!id) && (
              <FormLine>
                <DivCheckBox style="line">
                  <CheckBoxLabel name="ativo" title="Ativo" register={{ ...register("ativo") }} />
                </DivCheckBox>
              </FormLine>
            )}
          </FormContainerBody>
        </FormContainer>

        <FormContainer>
          <FormContainerBody>
            <FormLine>
              <FormLine justify="start">
                <CadAlterInfo cadInfo={cadInfo} alterInfo={edicaoInfo} />
              </FormLine>
              <FormLine justify="end">
                <Button variant="outline" type="button" onClick={() => navigate("/usuario")} disabled={loading}>Cancelar</Button>
                <ButtonSubmit loading={loading}>
                  Salvar
                </ButtonSubmit>
              </FormLine>
            </FormLine>
          </FormContainerBody>
        </FormContainer>
      </form>

      <ModalSenha open={openModalSenha} setOpen={setOpenModalSenha} id={Number(id)} />

    </div>
  )
}
