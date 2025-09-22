import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import {
  Car,
  CarFront,
  Settings,
  Building
} from "lucide-react";
// import { getConfigType, getConfiguracoes, postConfigType, postConfiguracoes } from "@/services/configuracoesServices";
import { useState } from "react";
import VeiculoMarca from "../VeiculoMarca";
import VeiculoModelo from "../VeiculoModelo";
import FormContainer from "@/ui/components/forms/FormContainer";
import PageTitle from "@/ui/components/PageTitle";

// const schema = z.object({
//   pathArquivos: z.string().optional(),
//   dropboxAppKey: z.string().optional(),
//   dropboxAppSecret: z.string().optional(),
//   permiteCadastrarClienteNomeDuplicado: z.boolean().optional(),
//   permiteCadastrarClienteTelefoneDuplicado: z.boolean().optional(),
//   permiteTrocaOperadorComanda: z.boolean().optional(),
//   permiteVendaProdutoEstoqueNegativo: z.boolean().optional(),
//   dropboxRefreshToken: z.string().optional(),
//   dropboxAccessToken: z.string().optional(),
//   nomeFantasia: z.string().optional(),
//   razaoSocial: z.string().optional(),
//   cnpj: z.string().transform(c => removeNonDigit(c)).optional(),
//   inscricaoEstadual: z.string().transform(c => removeNonDigit(c)).optional(),
//   telefone: z.string().transform(c => removeNonDigit(c)).optional(),
//   idUf: z.number({ message: "Selecione a UF" }).optional(),
//   idMunicipio: z.number({ message: "Selecione o município" }).optional(),
//   idBairro: z.number({ message: "Selecione o bairro" }).optional(),
//   rua: z.string().optional(),
//   numero: z.string().optional(),
//   complemento: z.string().optional(),
//   cep: z.string().transform(c => removeNonDigit(c)).optional()
// });

export default function Configuracoes() {

  // const navigate = useNavigate();

  // const [acessos, setAcessos] = useState<acessoType>([]);
  // const [acessoListar, setAcessoListar] = useState<boolean>(false);
  // const [acessoEditar, setAcessoEditar] = useState<boolean>(false);
  // const [dropboxAppKey, setDropboxAppKey] = useState<string>("");
  // const [codigoImg, setCodigoImg] = useState<number>(0);

  // useEffect(() => {
  //   checkAcessos();
  // }, []);

  // const checkAcessos = async () => {
  //   const process = toast.loading("Checando acesso");
  //   try {
  //     const response = await listarAcessosFuncionalidades("configuracao");
  //     if (response.length === 0) throw new Error("Acesso negado");
  //     setAcessos(response);
  //     toast.dismiss(process);
  //   }
  //   catch (error: Error | any) {
  //     toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 3000 });
  //     navigate("/");
  //   }
  // }

  // useEffect(() => {
  //   if (acessos.length < 1) return
  //   const listar = acessos.some(a => a === "LISTAR");
  //   const editar = acessos.some(a => a === "EDITAR");
  //   setAcessoListar(listar);
  //   setAcessoEditar(editar);

  //   if (!listar) {
  //     toast.error("Acesso negado", { autoClose: 4000 });
  //     navigate("/");
  //   }
  // }, [acessos]);

  // const [loading, setLoading] = useState(false);

  // const { register, control, handleSubmit, setValue, watch, setFocus, formState: { errors } } = useForm({
  //   resolver: zodResolver(schema)
  // });

  // const [buscandoCep, setBuscandoCep] = useState(false);
  // const cnpj: string = watch("cnpj");
  // const telefone: string = watch("telefone");
  // const cep: string = watch("cep");
  // const uf: number = watch("idUf");
  // const municipio: number = watch("idMunicipio");

  // const setFieldValue = (field: string, value: any) => {
  //   setValue(field, value);
  // }

  // useEffect(() => {
  //   Object.entries(errors).forEach(([key, error]) => {
  //     if (error?.message) {
  //       toast.error(`${error.message}`);
  //       setFocus(key);
  //       return
  //     }
  //   });
  // }, [errors]);

  // useEffect(() => {
  //   if (acessoListar) getConfiguracoesValues();
  // }, [acessoListar]);

  // const getConfiguracoesValues = async () => {
  //   if (!acessoListar) return
  //   try {
  //     const data = await getConfiguracoes();
  //     setConfigs(data);
  //     setCodigoImg(data.idArquivoLogo);
  //     if (data.dropboxAppKey) setDropboxAppKey(data.dropboxAppKey);
  //     if (data.pathArquivos) setValue("pathArquivos", data.pathArquivos);
  //     if (data.dropboxAppKey) setValue("dropboxAppKey", data.dropboxAppKey);
  //     if (data.dropboxAppSecret) setValue("dropboxAppSecret", data.dropboxAppSecret);
  //     if (data.permiteCadastrarClienteNomeDuplicado) setValue("permiteCadastrarClienteNomeDuplicado", data.permiteCadastrarClienteNomeDuplicado);
  //     if (data.permiteCadastrarClienteTelefoneDuplicado) setValue("permiteCadastrarClienteTelefoneDuplicado", data.permiteCadastrarClienteTelefoneDuplicado);
  //     if (data.permiteTrocaOperadorComanda) setValue("permiteTrocaOperadorComanda", data.permiteTrocaOperadorComanda);
  //     if (data.permiteVendaProdutoEstoqueNegativo) setValue("permiteVendaProdutoEstoqueNegativo", data.permiteVendaProdutoEstoqueNegativo);
  //     if (data.dropboxRefreshToken) setValue("dropboxRefreshToken", data.dropboxRefreshToken);
  //     if (data.dropboxAccessToken) setValue("dropboxAccessToken", data.dropboxAccessToken);
  //     if (data.nomeFantasia) setValue("nomeFantasia", data.nomeFantasia);
  //     if (data.razaoSocial) setValue("razaoSocial", data.razaoSocial);
  //     if (data.cnpj) setValue("cnpj", formatMaskCnpj(data.cnpj));
  //     if (data.inscricaoEstadual) setValue("inscricaoEstadual", data.inscricaoEstadual);
  //     if (data.telefone) setValue("telefone", formatMaskCelular(data.telefone));
  //     if (data.idUf) setValue("idUf", data.idUf);
  //     if (data.idMunicipio) setValue("idMunicipio", data.idMunicipio);
  //     if (data.idBairro) setValue("idBairro", data.idBairro);
  //     if (data.rua) setValue("rua", data.rua);
  //     if (data.numero) setValue("numero", data.numero);
  //     if (data.complemento) setValue("complemento", data.complemento);
  //     if (data.cep) setValue("cep", formatMaskCep(data.cep));
  //   }
  //   catch (error: Error | any) {
  //     toast.error(errorMsg(error, null), { autoClose: 4000 });
  //   }
  // }

  // const submit = async (data: postConfigType) => {
  //   if (loading) return
  //   setLoading(true);
  //   if (!acessoEditar) {
  //     toast.error("Acesso negado", { autoClose: 4000 });
  //     navigate("/");
  //   }
  //   const process = toast.loading("Salvando alterações...");
  //   try {
  //     const post = {
  //       pathArquivos: configs?.pathArquivos === data.pathArquivos ? configs?.pathArquivos : data.pathArquivos,
  //       dropboxAppKey: configs?.dropboxAppKey === data.dropboxAppKey ? configs?.dropboxAppKey : data.dropboxAppKey,
  //       dropboxAppSecret: configs?.dropboxAppSecret === data.dropboxAppSecret ? configs?.dropboxAppSecret : data.dropboxAppSecret,
  //       dropboxRefreshToken: configs?.dropboxRefreshToken === data.dropboxRefreshToken ? configs?.dropboxRefreshToken : data.dropboxRefreshToken,
  //       dropboxAccessToken: configs?.dropboxAccessToken === data.dropboxAccessToken ? configs?.dropboxAccessToken : data.dropboxAccessToken,
  //       idArquivoLogo: configs?.idArquivoLogo === codigoImg ? configs?.idArquivoLogo : codigoImg !== 0 ? codigoImg : null,
  //       nomeFantasia: configs?.nomeFantasia === data.nomeFantasia ? configs?.nomeFantasia : data.nomeFantasia,
  //       razaoSocial: configs?.razaoSocial === data.razaoSocial ? configs?.razaoSocial : data.razaoSocial,
  //       cnpj: configs?.cnpj === removeNonDigit(data.cnpj) ? configs?.cnpj : removeNonDigit(data.cnpj),
  //       inscricaoEstadual: configs?.inscricaoEstadual === data.inscricaoEstadual ? configs?.inscricaoEstadual : removeNonDigit(data.inscricaoEstadual),
  //       telefone: configs?.telefone === removeNonDigit(data.telefone) ? configs?.telefone : removeNonDigit(data.telefone),
  //       idUf: configs?.idUf === data.idUf ? configs?.idUf : data.idUf,
  //       idMunicipio: configs?.idMunicipio === data.idMunicipio ? configs?.idMunicipio : data.idMunicipio,
  //       idBairro: configs?.idBairro === data.idBairro ? configs?.idBairro : data.idBairro,
  //       rua: configs?.rua === data.rua ? configs?.rua : data.rua,
  //       numero: configs?.numero === data.numero ? configs?.numero : data.numero,
  //       complemento: configs?.complemento === data.complemento ? configs?.complemento : data.complemento,
  //       cep: configs?.cep === removeNonDigit(data.cep) ? configs?.cep : removeNonDigit(data.cep),
  //       permiteCadastrarClienteNomeDuplicado: configs?.permiteCadastrarClienteNomeDuplicado === data.permiteCadastrarClienteNomeDuplicado ? configs?.permiteCadastrarClienteNomeDuplicado : data.permiteCadastrarClienteNomeDuplicado ?? false,
  //       permiteCadastrarClienteTelefoneDuplicado: configs?.permiteCadastrarClienteTelefoneDuplicado === data.permiteCadastrarClienteTelefoneDuplicado ? configs?.permiteCadastrarClienteTelefoneDuplicado : data.permiteCadastrarClienteTelefoneDuplicado ?? false,
  //       permiteTrocaOperadorComanda: configs?.permiteTrocaOperadorComanda === data.permiteTrocaOperadorComanda ? configs?.permiteTrocaOperadorComanda : data.permiteTrocaOperadorComanda ?? false,
  //       permiteVendaProdutoEstoqueNegativo: configs?.permiteVendaProdutoEstoqueNegativo === data.permiteVendaProdutoEstoqueNegativo ? configs?.permiteVendaProdutoEstoqueNegativo : data.permiteVendaProdutoEstoqueNegativo ?? false
  //     };
  //     const response = await postConfiguracoes(post);
  //     toast.update(process, { render: response, type: "success", isLoading: false, autoClose: 2000 });
  //   }
  //   catch (error: Error | any) {
  //     toast.update(process, { render: errorMsg(error, null), type: "error", isLoading: false, autoClose: 5000 });
  //   }
  //   setLoading(false);
  // }

  const [, setDropTabActive] = useState<boolean>(false);

  return (
    <div className="w-full space-y-6">
      <PageTitle title="Configurações do Sistema" />

      <Tabs defaultValue="veiculoMarca" className="flex flex-col xl:flex-row xl:gap-6">
        <div className="xl:w-72 mb-6 xl:mb-0">
          <TabsList className="flex flex-col w-full h-fit bg-card shadow-sm border border-border">
            <div className="w-full p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">
                  Configurações
                </span>
              </div>
            </div>

            <div className="w-full space-y-1 p-2">
              <TabsTrigger
                value="geral"
                className="w-full justify-start gap-3 px-4 py-3 text-[15px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground hover:bg-accent/50"
                onClick={() => setDropTabActive(false)}
              >
                <Building className="h-4 w-4" />
                Configurações Gerais
              </TabsTrigger>

              <div className="border-t border-border my-2"></div>

              <TabsTrigger
                value="veiculoMarca"
                className="w-full justify-start gap-3 px-4 py-3 text-[15px] data-[state=active]:bg-green-50 dark:data-[state=active]:bg-green-900/20 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-300 hover:bg-accent/50"
                onClick={() => setDropTabActive(false)}
              >
                <Car className="h-4 w-4" />
                Marcas de Veículos
              </TabsTrigger>

              <TabsTrigger
                value="veiculoModelo"
                className="w-full justify-start gap-3 px-4 py-3 text-[15px] data-[state=active]:bg-green-50 dark:data-[state=active]:bg-green-900/20 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-300 hover:bg-accent/50"
                onClick={() => setDropTabActive(false)}
              >
                <CarFront className="h-4 w-4" />
                Modelos de Veículos
              </TabsTrigger>
            </div>
          </TabsList>
        </div>

        <div className="flex-1">
          <FormContainer>
            <TabsContent value="geral" className="p-6 bg-muted/30 rounded-lg border border-border mt-0">

            </TabsContent>

            <TabsContent value="veiculoMarca" className="p-6 bg-muted/30 rounded-lg border border-border mt-0">
              <VeiculoMarca />
            </TabsContent>

            <TabsContent value="veiculoModelo" className="p-6 bg-muted/30 rounded-lg border border-border mt-0">
              <VeiculoModelo />
            </TabsContent>
          </FormContainer>
        </div>
      </Tabs>
    </div>
  )
}
