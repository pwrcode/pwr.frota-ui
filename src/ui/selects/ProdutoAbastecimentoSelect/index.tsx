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

    const [idVeiculo, idPostoCombustivelTanque, idVeiculoTanque] = useWatch({
        control: control,
        name: ["idVeiculo.value", "idPostoCombustivelTanque.value", "idVeiculoTanque.value"],
    }) 

    useEffect(() => {
        onChange(null)
        getProdutosAbastecimento();
    }, [idPostoCombustivelTanque, idVeiculo, idVeiculoTanque]);

    const getProdutosAbastecimento = async (pesquisa?: string) => {
        setOpcoesProdutoAbastecimento([]);

        if(!idPostoCombustivelTanque && !idVeiculo && !idVeiculoTanque && !ignoreFiltros)
            return [];

        const data = await getProdutoAbastecimentoList(pesquisa, undefined, undefined, undefined, idPostoCombustivelTanque, idVeiculo, idVeiculoTanque);
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