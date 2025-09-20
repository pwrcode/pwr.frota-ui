// import { listType } from '@/services/constants';
// import FormContent from '@/ui/components/form/FormContent';
// import FormHead from '@/ui/components/form/FormHead';
// import FormLine from '@/ui/components/form/FormLine';
// import InputLabel from '@/ui/components/form/InputLabel';
// import ReactSelect from '@/ui/components/form/ReactSelect';
// import { useEffect, useState } from 'react';
// import { Control, FieldValues } from 'react-hook-form';
// import { BairroModal } from '../../ui/components/dialog/BairroModal';
// import { formatarCep } from '@/services/formatacao';
// import { UploadFoto } from '@/ui/components/form/UploadFoto';
// import { selectSetBairros } from '@/services/functions/selectSetBairros';
// import { selectSetMunicipios } from '@/services/functions/selectSetMunicipios';
// import { selectSetUfs } from '@/services/functions/selectSetUfs';
// import { UfModal } from '@/ui/components/dialog/UfModal';
// import { MunicipioModal } from '@/ui/components/dialog/MunicipioModal';
// import { AddButton, SelectAddBox } from '@/ui/components/form/SelectAddBox';
// import { SearchButton } from '@/ui/components/form/Buttons';
// import { removeNonDigit } from '@/services/utils';
// import { buscarCep } from '@/services/functions/buscarCep';
// import { InputMaskLabel, InputMasks } from '@/ui/components/form/InputMaskLabel';

// type propsType = {
//   register: any,
//   control: Control<FieldValues, any>,
//   setFieldValue: (field: string, value: any) => void,
//   cnpj: string,
//   telefone: string,
//   cep: string,
//   idUf: number,
//   codigoImg: number,
//   setCodigoImg: React.Dispatch<React.SetStateAction<number>>
//   idMunicipio: number,
//   loading: boolean,
//   setBuscandoCep: React.Dispatch<React.SetStateAction<boolean>>
// }

// export default function DadosEmpresa({ register, control, cnpj, telefone, codigoImg, setCodigoImg, setFieldValue, cep, idUf, idMunicipio, loading, setBuscandoCep }: propsType) {

//   const changeCodigoImg = (codigo: number) => {
//     setCodigoImg(codigo);
//   }

//   const [canIdMunicipioGetClean, setCanIdMunicipioGetClean] = useState<boolean>(false);
//   const [canIdBairroGetClean, setCanIdBairroGetClean] = useState<boolean>(false);
//   const [blockUf, setBlockUf] = useState<boolean>(false);
//   const [blockMunicipio, setBlockMunicipio] = useState<boolean>(false);
//   const [blockBairro, setBlockBairro] = useState<boolean>(false);
//   const [blockRua, setBlockRua] = useState<boolean>(false);

//   const [ufs, setUfs] = useState<listType>([]);
//   const [municipios, setMunicipios] = useState<listType>([]);
//   const [bairros, setBairros] = useState<listType>([]);

//   const setUfId = (id: number) => {
//     if (id) setFieldValue("idUf", id);
//   }

//   const setMunicipioId = (id: number) => {
//     if (id) setFieldValue("idMunicipio", id);
//   }

//   const setBairroId = (id: number) => {
//     if (id) setFieldValue("idBairro", id);
//   }

//   useEffect(() => {
//     setFieldValue("cep", formatarCep(cep));
//     selectUfs();
//   }, []);

//   useEffect(() => {
//     setMunicipios([]);
//     setBairros([]);
//     if (canIdMunicipioGetClean) setFieldValue("idMunicipio", 0);
//     if (idUf && idUf > 0) selectMunicipios();
//   }, [idUf]);

//   useEffect(() => {
//     setBairros([]);
//     if (canIdBairroGetClean) setFieldValue("idBairro", 0);
//     if (idMunicipio && idMunicipio > 0) selectBairros();
//   }, [idMunicipio]);

//   const selectUfs = async () => {
//     selectSetUfs(setUfs);
//   }

//   const selectMunicipios = async () => {
//     setCanIdMunicipioGetClean(true);
//     selectSetMunicipios(idUf, setMunicipios);
//   }

//   const selectBairros = async () => {
//     setCanIdBairroGetClean(true);
//     selectSetBairros(idMunicipio, setBairros);
//   };

//   useEffect(() => {
//     if ((removeNonDigit(cep).length < 8) && blockUf || blockMunicipio || blockBairro || blockRua) {
//       unblockFields();
//       cleanFields();
//     }
//   }, [cep]);

//   const buscarCepCall = async () => {
//     setCanIdMunicipioGetClean(false);
//     setCanIdBairroGetClean(false);
//     await buscarCep(setBuscandoCep, cep, setFieldValue, unblockFields, cleanFields, setBlockUf, setBlockMunicipio, setBlockBairro, setBlockRua);
//     selectUfs();
//   }

//   const cleanFields = () => {
//     setFieldValue("idUf", 0);
//     setFieldValue("idMunicipio", 0);
//     setFieldValue("idBairro", 0);
//     setFieldValue("rua", "");
//   }

//   const unblockFields = () => {
//     setBlockUf(false);
//     setBlockMunicipio(false);
//     setBlockBairro(false);
//     setBlockRua(false);
//   }

//   const [ufModalOpen, setUfModalOpen] = useState<boolean>(false);
//   const [municipioModalOpen, setMunicipioModalOpen] = useState<boolean>(false);
//   const [bairroModalOpen, setBairroModalOpen] = useState<boolean>(false);

//   const handleClickAddUf = () => {
//     setUfModalOpen(true);
//   }
//   const handleClickAddMunicipio = () => {
//     setMunicipioModalOpen(true);
//   }
//   const handleClickAddBairro = () => {
//     setBairroModalOpen(true);
//   }

//   return (
//     <>
//       <FormHead title="Dados da Empresa" subtitle="Taxa de Serviço, Nome Fantasia e outras configurações." />

//       <FormContent>
//         <div className="flex-1">
//           <UploadFoto descricao="LogoEmpresa" codigo={codigoImg} changeCodigo={changeCodigoImg} alt="Logo da Empresa" isDisabled={loading} />
//         </div>

//         <FormLine cols={2}>
//           <InputLabel id="nomeFantasia" title="Nome Fantasia" register={{ ...register("nomeFantasia") }} isDisabled={loading} />
//           <InputLabel id="razaoSocial" title="Razão Social" register={{ ...register("razaoSocial") }} />
//           <InputMaskLabel
//             name="cnpj" title="CNPJ" mask={InputMasks.cnpj} value={cnpj} setValue={setFieldValue} register={{ ...register("cnpj")}} disabled={loading}
//           />
//           <InputLabel id="inscricaoEstadual" title="Inscricão Estadual" register={{ ...register("inscricaoEstadual") }} isDisabled={loading} />
//           <InputMaskLabel
//             name="telefone" title="Telefone" mask={InputMasks.celular} value={telefone} setValue={setFieldValue} register={{ ...register("telefone")}} disabled={loading}
//           />
//         </FormLine>

//         <FormLine cols={2}>
//           <SelectAddBox>
//             <InputMaskLabel
//               name="cep" title="CEP" mask={InputMasks.cep} value={cep} setValue={setFieldValue} register={{ ...register("cep")}} disabled={loading}
//             />
//             <SearchButton func={buscarCepCall} loading={loading} />
//           </SelectAddBox>
//           <SelectAddBox>
//             <ReactSelect id="idUf" title="UF" options={ufs} control={control} isDisabled={loading || blockUf} />
//             <AddButton func={handleClickAddUf} loading={loading} />
//           </SelectAddBox>
//           <SelectAddBox>
//             <ReactSelect id="idMunicipio" title="Município" options={municipios} control={control} isDisabled={loading || blockMunicipio} />
//             <AddButton func={handleClickAddMunicipio} loading={loading} />
//           </SelectAddBox>
//           <SelectAddBox>
//             <ReactSelect id="idBairro" title="Bairro" options={bairros} control={control} isDisabled={loading || blockBairro} />
//             <AddButton func={handleClickAddBairro} loading={loading} />
//           </SelectAddBox>
//           <InputLabel id="rua" title="Rua" register={{ ...register("rua") }} isDisabled={loading || blockRua} />
//           <InputLabel id="numero" title="Número" register={{ ...register("numero") }} isDisabled={loading} />
//           <InputLabel id="complemento" title="Complemento" register={{ ...register("complemento") }} isDisabled={loading} />
//         </FormLine>
//       </FormContent>

//       <UfModal
//         open={ufModalOpen}
//         setOpen={setUfModalOpen}
//         setUfId={setUfId}
//         update={selectUfs}
//       />

//       <MunicipioModal
//         open={municipioModalOpen}
//         setOpen={setMunicipioModalOpen}
//         ufs={ufs}
//         idUf={idUf}
//         setMunicipioId={setMunicipioId}
//         update={selectMunicipios}
//       />

//       <BairroModal
//         open={bairroModalOpen}
//         setOpen={setBairroModalOpen}
//         ufs={ufs}
//         idUf={idUf}
//         idMunicipio={idMunicipio}
//         setBairroId={setBairroId}
//         update={selectBairros}
//       />
//     </>
//   )
// }