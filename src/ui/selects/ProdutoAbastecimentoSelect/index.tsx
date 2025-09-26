import { getProdutoAbastecimentoList } from "@/services/produtoAbastecimento";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useEffect, useState } from "react";
import { useController, useWatch, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
    ignoreFiltros?: boolean;
    size?: string
}

const SelectProdutoAbastecimento = (props: Props) => {
    const {
        name = "idProdutoAbastecimento",
        title = "Produto Abastecimento",
        control,
        ignoreFiltros,
        size
    } = props;

    const { field: { value, onChange } } = useController({ control, name })
    const [opcoesProdutoAbastecimento, setOpcoesProdutoAbastecimento] = useState<Array<any>>([]);

    const [idVeiculo, idPostoCombustivelTanque, idVeiculoTanque, idPostoCombustivel] = useWatch({
        control: control,
        name: ["idVeiculo.value", "idPostoCombustivelTanque.value", "idVeiculoTanque.value", "idPostoCombustivel.value"],
    })

    useEffect(() => {
        if (!idPostoCombustivelTanque && !idVeiculo && !idVeiculoTanque && !ignoreFiltros && !!value)
            onChange(null)
        
        getProdutosAbastecimento();
    }, [idPostoCombustivelTanque, idVeiculo, idVeiculoTanque, idPostoCombustivel, value]);

    const getProdutosAbastecimento = async (pesquisa?: string) => {
        setOpcoesProdutoAbastecimento([]);

        if (!idPostoCombustivelTanque && !idVeiculo && !idVeiculoTanque && !ignoreFiltros)
            return [];

        const data = await getProdutoAbastecimentoList(pesquisa, undefined, undefined, undefined, idPostoCombustivelTanque, idVeiculo, idVeiculoTanque, idPostoCombustivel);
        setOpcoesProdutoAbastecimento([...data]);
        return data;
    }

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={opcoesProdutoAbastecimento}
            asyncFunction={getProdutosAbastecimento}
            value={value}
            setValue={onChange}
            filter
            isClearable
            size={size}
        />
    )
}

export default SelectProdutoAbastecimento