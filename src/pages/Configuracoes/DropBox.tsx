// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { errorMsg } from '@/services/apiServices';
// import { autorizarDropBox } from '@/services/configuracoesServices';
// import FormHead from '@/ui/components/form/FormHead';
// import InputLabelValue from '@/ui/components/InputLabelValue';
// import { NavDropBox } from '@/ui/components/NavDropBox';
// import { useState } from 'react';
// import { toast } from 'react-toastify';

// type propsType = {
//   loading: boolean,
//   dropboxAppKey: string
// }

// export const DropBox = ({loading, dropboxAppKey}: propsType) => {

//   const [etapa, setEtapa] = useState<number>(1);
//   const [authCodigo, setAuthCodigo] = useState<string>("");
//   const [loadingDrop, setLoadingDrop] = useState<boolean>(false);

//   const verifyCodeAuth = async () => {
//     if(loadingDrop) return
//     setLoadingDrop(true);
//     try {
//       if(authCodigo.length < 1) throw new Error("Informe o código de autenticação");
//       const response = await autorizarDropBox(authCodigo);
//       console.log(response);
//       if(response) setEtapa(3);
//     }
//     catch (error: Error | any) {
//       toast.error(errorMsg(error, null), { autoClose: 4000 });
//     }
//     setLoadingDrop(false);
//   }

//   return (
//     <>
//       <FormHead
//         title="Autorização Dropbox"
//         subtitle="Status atual e Etapas de autorização de uso Dropbox."
//       />


//       <NavDropBox etapa={etapa} setEtapa={setEtapa} />


//       <div className="bg-white dark:bg-slate-800 flex flex-col justify-center items-center gap-7 p-10 text-center">
//         {etapa === 1 && <>
//           <label>
//             Acesse o
//             <a className='text-blue-600 font-semibold px-1' target="_blank"
//               href={`https://www.dropbox.com/oauth2/authorize?client_id=${dropboxAppKey}&token_access_type=offline&response_type=code`}
//             >
//               Link de Autorização
//             </a>
//             para obter o código de integração com o Dropbox
//           </label>
          
//           <a
//             target="_blank" 
//             href={`https://www.dropbox.com/oauth2/authorize?client_id=${dropboxAppKey}&token_access_type=offline&response_type=code`}
//             className='shadow bg-gray-200 rounded-md px-6 py-4 font-semibold text-gray-600 tex-xs break-words sm:w-fit w-full'
//           >
//             {`https://www.dropbox.com/oauth2/authorize?client_id=${dropboxAppKey}&token_access_type=offline&response_type=code`}
//           </a>

//           <Button type="button" variant="success" onClick={() => setEtapa(2)} disabled={loading || loadingDrop}>
//             Já possuo o código
//           </Button>
//         </>}


//         {etapa === 2 && <>
//           <Label htmlFor="authCodigo" className="block font-medium text-lg">Código de Autorização</Label>
//           <InputLabelValue id="authCodigo" value={authCodigo} setValue={setAuthCodigo} />
//           <Button type="button" variant="success" onClick={verifyCodeAuth} disabled={loading || loadingDrop}>
//             Verificar código
//           </Button>
//         </>}


//         {etapa === 3 && (
//           <p className='text-green-600 text-2xl font-bold'>
//             Dropbox autorizado
//           </p>
//         )}
//       </div>
//     </>
//   )
// }