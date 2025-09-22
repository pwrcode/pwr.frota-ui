// import { getEmpresaList } from "@/services/empresa";
// import AsyncReactSelect from "./AsyncReactSelect";
// import { todosOption } from "@/services/constants";

// type propsType = {
//   name: string,
//   title?: string,
//   noTitle?: boolean,
//   control?: any,
//   value?: any,
//   setValue?: any,
//   disabled?: boolean,
//   size?: string
// }

// export const EmpresaSelect = ({name, title, noTitle, control, value, setValue, disabled, size}: propsType) => {

//   const getEmpresas = async (pesquisa?: string) => {
//     const data = await getEmpresaList(pesquisa, undefined);
//     if (control) return data;
//     return [todosOption, ...data];
//   }

//   return (
//     <AsyncReactSelect
//       name={name}
//       title={noTitle ? undefined : title ?? "Empresa"}
//       asyncFunction={getEmpresas}
//       control={control}
//       value={value}
//       setValue={setValue}
//       isDisabled={disabled}
//       size={size}
//       isClearable={control ? true : false}
//     />
//   )
// }