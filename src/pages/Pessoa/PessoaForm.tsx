// import InputLabel from '@/ui/components/forms/InputLabel';
// import { Button } from '@/components/ui/button';
// import FormContainer from '@/ui/components/forms/FormContainer';
// import FormContainerHeader from '@/ui/components/forms/FormContainerHeader';
// import FormContainerBody from '@/ui/components/forms/FormContainerBody';
// import FormLine from '@/ui/components/forms/FormLine';
// import { ButtonSubmit, SearchButton } from '@/ui/components/buttons/FormButtons';
// import { CadAlterInfo } from '@/ui/components/forms/CadAlterInfo';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { sexoOpcoes, tiposContribuinte, tiposPessoa, tiposRenda } from '@/services/constants';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { toast } from 'react-toastify';
// import { dateDiaMesAno, dateHoraMin } from '@/services/date';
// import { errorMsg } from '@/services/api';
// import AsyncReactSelect from '@/ui/components/forms/AsyncReactSelect';
// import { DivCheckBox } from '@/ui/components/forms/DivCheckBox';
// import { CheckBoxLabel } from '@/ui/components/forms/CheckBoxLabel';
// import { InputMaskLabel, Masks } from '@/ui/components/forms/InputMaskLabel';
// import { removeNonDigit } from '@/services/utils';
// import { formatarCelular, formatarCpfCnpj } from '@/services/formatacao';
// import { pessoaSchema } from '@/schemas/pessoa';
// import { addPessoa, dadosAddEdicaoPessoaType, getPessoaPorId, updatePessoa } from '@/services/pessoa';
// import { currency } from '@/services/currency';
// import { formatMaskCep, formatMaskCpf } from '@/services/mask';
// import InputDataLabel from '@/ui/components/forms/InputDataLabel';
// import { FormGrid, FormGridPair } from '@/ui/components/forms/FormGrid';
// import { useEndereco } from '@/hooks/useEndereco';

// export default function PessoaForm() {

//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [cadInfo, setCadInfo] = useState<string>("");
//   const [edicaoInfo, setEdicaoInfo] = useState<string>("");

//   const formFunctions = useForm({
//     resolver: zodResolver(pessoaSchema)
//   });
//   const { register, handleSubmit, reset, setValue, watch, control, setFocus, formState: { errors } } = formFunctions;

//   const {
//     cep,
//     getPaises, getUfs, getMunicipios, buscarCep, loadingCep,
//     ufs, municipios,
//     setIdPais, setIdUf,
//     setValuesPais, setValuesUf, setValuesMunicipio
//   } = useEndereco(formFunctions);

//   const tipoPessoa = watch("tipoPessoa");
//   const documento = watch("documento");

//   useEffect(() => {
//     Object.entries(errors).forEach(([key, error]) => {
//       if (error?.message) {
//         toast.error(`${error.message}`);
//         setFocus(key);
//         return
//       }
//     });
//   }, [errors]);

//   useEffect(() => {
//     if (id) setValuesPorId();
//     else {
//       setValue("ativo", true);
//       setValue("tipoPessoa", tiposPessoa.find(tp => tp.value === 1)); // Pessoa Fisica Padrao
//     }
//   }, [id]);

//   const setValuesPorId = async () => {
//     const process = toast.loading("Buscando item...");
//     try {
//       if (!id || isNaN(Number(id))) throw new Error("Não foi possível encontrar o item");
//       const item = await getPessoaPorId(Number(id));
//       if (item.idPais) setIdPais(item.idPais);
//       if (item.idUF) setIdUf(item.idUF); // ATENCAO case --- ifUf - idUF
//       setValue("tipoPessoa", tiposPessoa.find(tp => tp.valueString === item.tipoPessoa)); // atencao
//       setValue("documento", formatarCpfCnpj(removeNonDigit(item.documento)));
//       setValue("razaoSocial", item.razaoSocial);
//       setValue("nomeFantasia", item.nomeFantasia);
//       setValue("inscricaoEstadual", item.inscricaoEstadual);
//       setValue("inscricaoMunicipal", item.inscricaoMunicipal);
//       setValue("rg", item.rg);
//       setValue("orgaoEmissor", item.orgaoEmissor);
//       setValue("sexo", sexoOpcoes.find(s => s.valueString === item.sexo)); // atencao
//       setValue("profissao", item.profissao);
//       setValue("dataNascimentoFundacao", item.dataNascimentoFundacao ?? "");
//       setValue("tipoContribuinte", tiposContribuinte.find(tc => tc.valueString === item.tipoContribuinte)); // atencao
//       setValue("vendaPromissoria", item.vendaPromissoria ? true : false);
//       setValue("tipoRenda", tiposRenda.find(tr => tr.valueString === item.tipoRenda));
//       setValue("rendaMensal", item.rendaMensal ? currency(item.rendaMensal) : "");
//       setValue("limiteCredito", item.limiteCredito ? currency(item.limiteCredito) : "");
//       setValue("estrangeiro", item.estrangeiro ? true : false);
//       setValue("documentoEstrangeiro", item.documentoEstrangeiro);
//       setValue("suframa", item.suframa);
//       setValue("cei", item.cei);
//       setValue("rntrc", item.rntrc);
//       setValue("consumidorFinal", item.consumidorFinal ? true : false);
//       setValue("ativo", item.ativo ? true : false);
//       setValue("isCliente", item.isCliente ? true : false);
//       setValue("isFornecedor", item.isFornecedor ? true : false);
//       setValue("isTransportadora", item.isTransportadora ? true : false);
//       setValue("isMotorista", item.isMotorista ? true : false);
//       setValue("isSeguradora", item.isSeguradora ? true : false);
//       setValue("nomePai", item.nomePai);
//       setValue("nomeMae", item.nomeMae);
//       setValue("nomeConjuge", item.nomeConjuge);
//       setValue("cpfConjuge", formatMaskCpf(removeNonDigit(item.cpfConjuge)));
//       setValue("telefone1", formatarCelular(removeNonDigit(item.telefone1)));
//       setValue("telefone2", formatarCelular(removeNonDigit(item.telefone2)));
//       setValue("email", item.email);
//       setValue("site", item.site);
//       setValue("redeSocial", item.redeSocial);
//       setValue("cep", formatMaskCep(removeNonDigit(item.cep)));
//       setValue("bairro", item.bairro);
//       setValue("logradouro", item.logradouro);
//       setValue("numero", item.numero);
//       setValue("complemento", item.complemento);
//       setValue("pontoReferencia", item.pontoReferencia);
//       setValue("observacoes", item.observacoes);
//       setValuesPais(item.idPais); // useEndereco
//       setValuesUf(item.idUF); // useEndereco
//       setValuesMunicipio(item.idMunicipio); // useEndereco
//       setValue("bairro", item.bairro);
//       setCadInfo(`${item.usuarioCadastro} ${dateDiaMesAno(item.dataCadastro)} ${dateHoraMin(item.dataCadastro)}`);
//       setEdicaoInfo(`${item.usuarioEdicao} ${dateDiaMesAno(item.dataEdicao)} ${dateHoraMin(item.dataEdicao)}`);
//       toast.dismiss(process);
//     }
//     catch (error: Error | any) {
//       toast.update(process, { render: errorMsg(error), type: "error", isLoading: false, autoClose: 2000 });
//       navigate("/pessoa");
//     }
//   };

//   const submit = async (data: dadosAddEdicaoPessoaType) => {
//     if (loading) return;
//     setLoading(true);
//     const process = toast.loading("Salvando item...")
//     try {
//       const postPut: dadosAddEdicaoPessoaType = {
//         tipoPessoa: data.tipoPessoa,
//         documento: data.documento,
//         razaoSocial: data.razaoSocial,
//         nomeFantasia:data.nomeFantasia,
//         inscricaoEstadual: data.inscricaoEstadual,
//         inscricaoMunicipal: data.inscricaoMunicipal,
//         rg: data.rg,
//         orgaoEmissor: data.orgaoEmissor,
//         sexo: data.sexo,
//         profissao: data.profissao,
//         dataNascimentoFundacao: data.dataNascimentoFundacao,
//         tipoContribuinte: data.tipoContribuinte,
//         vendaPromissoria: data.vendaPromissoria,
//         tipoRenda: data.tipoRenda,
//         rendaMensal: data.rendaMensal,
//         limiteCredito: data.limiteCredito,
//         estrangeiro: data.estrangeiro,
//         documentoEstrangeiro: data.documentoEstrangeiro,
//         suframa: data.suframa,
//         cei: data.cei,
//         rntrc: data.rntrc,
//         consumidorFinal: data.consumidorFinal,
//         ativo: data.ativo,
//         isCliente: data.isCliente,
//         isFornecedor: data.isFornecedor,
//         isTransportadora: data.isTransportadora,
//         isMotorista: data.isMotorista,
//         isSeguradora: data.isSeguradora,
//         nomePai: data.nomePai,
//         nomeMae: data.nomeMae,
//         nomeConjuge: data.nomeConjuge,
//         cpfConjuge: data.cpfConjuge,
//         telefone1: data.telefone1,
//         telefone2: data.telefone2,
//         email: data.email,
//         site: data.site,
//         redeSocial: data.redeSocial,
//         idPais: data.idPais,
//         cep: data.cep,
//         idUF: Number(data.idUf), // ATENCAO case --- ifUf - idUF
//         idMunicipio: data.idMunicipio,
//         bairro: data.bairro,
//         logradouro: data.logradouro,
//         numero: data.numero,
//         complemento: data.complemento,
//         pontoReferencia: data.pontoReferencia,
//         observacoes: data.observacoes
//       }
//       if (!id) {
//         const res = await addPessoa(postPut);
//         toast.update(process, { render: res, type: "success", isLoading: false, autoClose: 2000 });
//       }
//       else {
//         const res = await updatePessoa(Number(id), postPut);
//         toast.update(process, { render: res, type: "success", isLoading: false, autoClose: 2000 });
//       }
//       reset();
//       navigate("/pessoa");
//     }
//     catch (error: Error | any) {
//       toast.update(process, { render: errorMsg(error), type: "error", isLoading: false, autoClose: 2000 });
//     }
//     finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="w-full mt-16">
//       <form autoComplete='off' className="flex-[3] flex flex-col gap-4" onSubmit={handleSubmit((data) => submit(data as dadosAddEdicaoPessoaType))}>

//         <FormContainer>
//           <FormContainerHeader title="Pessoa" />
//           <FormContainerBody>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
//               <AsyncReactSelect name="tipoPessoa" title="Tipo Pessoa" control={control} options={tiposPessoa} />
//               <InputMaskLabel
//                 name="documento" title="Documento"
//                 mask={tipoPessoa && tipoPessoa.value == 1 ? Masks.cpf : Masks.cnpj}
//                 register={{ ...register("documento") }} value={documento} setValue={setValue}
//               />
//               <InputLabel name="razaoSocial" title="Razão Social" register={{ ...register("razaoSocial") }} />
//               <InputLabel name="nomeFantasia" title="Nome Fantasia" register={{ ...register("nomeFantasia") }} />

//               <InputLabel name="inscricaoEstadual" title="Inscrição Estadual" register={{ ...register("inscricaoEstadual") }} />
//               <InputLabel name="inscricaoMunicipal" title="Inscrição Municipal" register={{ ...register("inscricaoMunicipal") }} />
//               <InputLabel name="rg" title="RG" register={{ ...register("rg") }} />
//               <InputLabel name="orgaoEmissor" title="Órgão Emissor" register={{ ...register("orgaoEmissor") }} />

//               <InputLabel name="documentoEstrangeiro" title="Documento Estrangeiro" register={{ ...register("documentoEstrangeiro") }} />
//               <InputLabel name="suframa" title="Suframa" register={{ ...register("suframa") }} />
//               <InputLabel name="cei" title="CEI" register={{ ...register("cei") }} />
//               <InputLabel name="rntrc" title="RNTRC" register={{ ...register("rntrc") }} />

//               <AsyncReactSelect name="sexo" title="Sexo" control={control} options={sexoOpcoes} isClearable />
//               <InputLabel name="profissao" title="Profissão" register={{ ...register("profissao") }} />
//               <InputDataLabel
//                 name="dataNascimentoFundacao" title={tipoPessoa && tipoPessoa.value == 1 ? "Data Nascimento" : "Data Fundação"}
//                 date={watch("dataNascimentoFundacao")} setValue={setValue}
//               />
//               <AsyncReactSelect name="tipoContribuinte" title="Tipo Contribuinte" control={control} options={tiposContribuinte} isClearable />
//             </div>
//             <DivCheckBox custom="col-span-full py-3 flex flex-row items-end gap-4">
//               <CheckBoxLabel name="ativo" title="Ativo" register={{ ...register("ativo") }} />
//               <CheckBoxLabel name="estrangeiro" title="Estrangeiro" register={{ ...register("estrangeiro") }} />
//             </DivCheckBox>
//           </FormContainerBody>
//         </FormContainer>

//         <FormContainer>
//           <FormContainerHeader title="Renda" />
//           <FormContainerBody>
//             <FormLine>
//               <AsyncReactSelect name="tipoRenda" title="Tipo Renda" control={control} options={tiposRenda} isClearable />
//               <InputMaskLabel
//                 name="rendaMensal" title="Renda Mensal" mask={Masks.dinheiro}
//                 register={{ ...register("rendaMensal") }} value={watch("rendaMensal")} setValue={setValue}
//               />
//               <InputMaskLabel
//                 name="limiteCredito" title="Limite Crédito" mask={Masks.dinheiro}
//                 register={{ ...register("limiteCredito") }} value={watch("limiteCredito")} setValue={setValue}
//               />
//             </FormLine>
//           </FormContainerBody>
//         </FormContainer>

//         <FormContainer>
//           <FormContainerBody>
//             <FormGrid>
//               <DivCheckBox style="micro">
//                 <CheckBoxLabel name="consumidorFinal" title="Consumidor Final" register={{ ...register("consumidorFinal") }} />
//               </DivCheckBox>
//               <DivCheckBox style="micro">
//                 <CheckBoxLabel name="isCliente" title="Cliente" register={{ ...register("isCliente") }} />
//               </DivCheckBox>
//               <DivCheckBox style="micro">
//                 <CheckBoxLabel name="isFornecedor" title="Fornecedor" register={{ ...register("isFornecedor") }} />
//               </DivCheckBox>
//               <DivCheckBox style="micro">
//                 <CheckBoxLabel name="isTransportadora" title="Transportadora" register={{ ...register("isTransportadora") }} />
//               </DivCheckBox>
//               <DivCheckBox style="micro">
//                 <CheckBoxLabel name="isMotorista" title="Motorista" register={{ ...register("isMotorista") }} />
//               </DivCheckBox>
//               <DivCheckBox style="micro">
//                 <CheckBoxLabel name="isSeguradora" title="Seguradora" register={{ ...register("isSeguradora") }} />
//               </DivCheckBox>
//               <DivCheckBox style="micro">
//                 <CheckBoxLabel name="vendaPromissoria" title="Venda Promissória" register={{ ...register("vendaPromissoria") }} />
//               </DivCheckBox>
//             </FormGrid>
//           </FormContainerBody>
//         </FormContainer>

//         <FormContainer>
//           <FormContainerHeader title="Referência" />
//           <FormContainerBody>
//             <FormGridPair>
//               <InputLabel name="nomePai" title="Nome Pai" register={{ ...register("nomePai") }} />
//               <InputLabel name="nomeMae" title="Nome Mãe" register={{ ...register("nomeMae") }} />
//               <InputLabel name="nomeConjuge" title="Nome Conjuge" register={{ ...register("nomeConjuge") }} />
//               <InputMaskLabel
//                 name="cpfConjuge" title="CPF Conjuge" register={{ ...register("cpfConjuge") }}
//                 mask={Masks.cpf} value={watch("cpfConjuge")} setValue={setValue}
//               />
//             </FormGridPair>
//           </FormContainerBody>
//         </FormContainer>

//         <FormContainer>
//           <FormContainerHeader title="Contato" />
//           <FormContainerBody>
//             <FormGridPair>
//               <InputMaskLabel
//                 name="telefone1"
//                 title="Telefone 1"
//                 mask={Masks.celular}
//                 register={{ ...register("telefone1") }}
//                 value={watch("telefone1")}
//                 setValue={setValue}
//               />
//               <InputMaskLabel
//                 name="telefone2"
//                 title="Telefone 2"
//                 mask={Masks.celular}
//                 register={{ ...register("telefone2") }}
//                 value={watch("telefone2")}
//                 setValue={setValue}
//               />
//               <InputLabel name="email" title="Email" register={{ ...register("email") }} size="lg:col-span-2" />
//               <InputLabel name="site" title="Site" register={{ ...register("site") }} />
//               <InputLabel name="redeSocial" title="Rede Social" register={{ ...register("redeSocial") }} />
//             </FormGridPair>
//           </FormContainerBody>
//         </FormContainer>

//         <FormContainer>
//           <FormContainerHeader title="Endereço" />
//           <FormContainerBody>
//             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-8 gap-2">
//               <AsyncReactSelect name="idPais" title="País" control={control} options={[]} asyncFunction={getPaises} size="col-span-1 xl:col-span-3" isClearable />
//               {/* CEP e Buscar */}
//               <div className="col-span-1 xl:col-span-2 flex flex-row items-end gap-1">
//                 <InputMaskLabel name="cep" title="CEP" mask={Masks.cep} register={{ ...register("cep") }} value={cep} setValue={setValue} />
//                 <SearchButton func={buscarCep} disabled={loadingCep} />
//               </div>
//               <AsyncReactSelect name="idUf" title="UF" control={control} options={ufs} asyncFunction={getUfs} size="col-span-1 xl:col-span-3" filter={true} isClearable />
//               <AsyncReactSelect name="idMunicipio" title="Município" control={control} options={municipios} asyncFunction={getMunicipios} filter={true} isClearable size="col-span-1 xl:col-span-4" />
//               {/* Bairro e Add */}
//               <InputLabel name="bairro" title="Bairro" register={{ ...register("bairro") }} size="xl:col-span-4" />
//               <InputLabel name="logradouro" title="Logradouro" register={{ ...register("logradouro") }} size="xl:col-span-3" />
//               <InputLabel name="numero" title="Número" register={{ ...register("numero") }} size="xl:col-span-1" />
//               <InputLabel name="complemento" title="Complemento" register={{ ...register("complemento") }} size="xl:col-span-2" />
//               <InputLabel name="pontoReferencia" title="Ponto Referência" register={{ ...register("pontoReferencia") }} size="xl:col-span-2" />
//             </div>
//           </FormContainerBody>
//         </FormContainer>

//         <FormContainer>
//           <FormContainerBody>
//             <InputLabel
//               name="observacoes"
//               title="Observações"
//               register={{ ...register("observacoes") }}
//             />
//           </FormContainerBody>
//         </FormContainer>

//         <FormContainer>
//           <FormContainerBody>
//             <FormLine>
//               <FormLine justify="start">
//                 <CadAlterInfo cadInfo={cadInfo} alterInfo={edicaoInfo} />
//               </FormLine>
//               <FormLine justify="end">
//                 <Button variant="outline" type="button" onClick={() => navigate("/pessoa")} disabled={loading}>Cancelar</Button>
//                 <ButtonSubmit loading={loading}>
//                   Salvar
//                 </ButtonSubmit>
//               </FormLine>
//             </FormLine>
//           </FormContainerBody>
//         </FormContainer>

//       </form>
//     </div>
//   )
// }