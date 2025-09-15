// import { listType } from "@/services/constants";
// import { getProdutoCategoriaList } from "@/services/produtoCategoria";
// import { getProdutoSecaoList } from "@/services/produtoSecao";
// import { getProdutoSubcategoriaList } from "@/services/produtoSubcategoria";
// import { useEffect, useState } from "react";
// import { FieldValues, UseFormReturn } from "react-hook-form";

// export default function useEstoque(useForm: UseFormReturn<FieldValues, any, FieldValues>) {

//   const { watch, setValue } = useForm;

//   const [idSecao, setIdSecao] = useState<number>();
//   const [idCategoria, setIdCategoria] = useState<number>();
//   const secao = watch("idSecao");
//   const categoria = watch("idCategoria");

//   const [secoes, setSecoes] = useState<listType>([]);
//   const [categorias, setCategorias] = useState<listType>([]);
//   const [subcategorias, setSubcategorias] = useState<listType>([]);

//   const getSecoes = async (pesquisa?: string) => {
//     const data = await getProdutoSecaoList(pesquisa, undefined);
//     setSecoes(data);
//     return data;
//   }

//   useEffect(() => {
//     recarrecarCategorias();
//     recarregarSubCategorias();
//   }, [secao]);

//   const recarrecarCategorias = async () => {
//     await getCategorias();
//     if (!secao || secao.value !== idSecao) {
//       setValue("idCategoria", undefined);
//       setIdSecao(undefined);
//     }
//   }

//   const getCategorias = async (pesquisa?: string) => {
//     const data = await getProdutoCategoriaList(
//       pesquisa,
//       undefined,
//       secao ? secao.value : undefined
//     );
//     setCategorias(data);
//     return data;
//   }

//   useEffect(() => {
//     recarregarSubCategorias();
//   }, [categoria]);

//   const recarregarSubCategorias = async () => {
//     await getSubcategorias();
//     if (!categoria || categoria.value !== idCategoria) {
//       setValue("idSubcategoria", undefined);
//       setIdCategoria(undefined);
//     }
//   }

//   const getSubcategorias = async (pesquisa?: string) => {
//     const data = await getProdutoSubcategoriaList(
//       pesquisa,
//       undefined,
//       categoria ? categoria.value : undefined,
//       secao ? secao.value : undefined
//     );
//     setSubcategorias(data);
//     return data;
//   }

//   const setValuesSecao = (value: any, label: string) => {
//     if (!value) return
//     setValue("idSecao", {value: value, label: label});
//     setIdSecao(value);
//   }

//   const setValuesCategoria = (value: any, label: string) => {
//     if (!value) return
//     setValue("idCategoria", {value: value, label: label});
//     setIdCategoria(value);
//   }

//   return {
//     getSecoes, getCategorias, getSubcategorias,
//     secao, categoria,
//     secoes, categorias, subcategorias,
//     setValuesSecao, setValuesCategoria
//   }
// }