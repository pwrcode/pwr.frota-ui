
// import FormContent from '@/ui/components/form/FormContent';
// import FormHead from '@/ui/components/form/FormHead';
// import FormLine from '@/ui/components/form/FormLine';
// import InputLabel from '@/ui/components/form/InputLabel';
// import { SwitchLabel } from '@/ui/components/form/SwitchLabel';
// import { Control, FieldValues } from 'react-hook-form';

// type propsType = {
//   register: any,
//   control: Control<FieldValues, any>,
//   loading: boolean
// }

// export default function Geral({register, control, loading}: propsType) {
//   return (
//     <>
//       <FormHead title="Configurações Gerais" subtitle="Caminho Anexo e outras configurações" />
//       <FormContent>
//         <FormLine cols={1}>
//           <InputLabel id="pathArquivos" title="Caminho Anexo" register={{ ...register("pathArquivos") }} isDisabled={loading} />
//           <InputLabel id="dropboxAppKey" title="Dropbox App Key" register={{ ...register("dropboxAppKey") }} isDisabled={loading} />
//           <InputLabel id="dropboxAppSecret" title="Dropbox App Secret" register={{ ...register("dropboxAppSecret") }} isDisabled={loading} />
//           <SwitchLabel id="permiteCadastrarClienteNomeDuplicado" title="Permite cadastrar cliente com nome duplicado" control={control} isDisabled={loading} />
//           <SwitchLabel id="permiteCadastrarClienteTelefoneDuplicado" title="Permite cadastrar cliente com telefone duplicado" control={control} isDisabled={loading} />
//           <SwitchLabel id="permiteTrocaOperadorComanda" title="Permite trocar operador comanda" control={control} isDisabled={loading} />
//           <SwitchLabel id="permiteVendaProdutoEstoqueNegativo" title="Permite venda de produtos com estoque negativo" control={control} isDisabled={loading} />
//         </FormLine>
//       </FormContent>
//     </>
//   )
// }