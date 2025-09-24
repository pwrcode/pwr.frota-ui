import { getProdutoAbastecimentoList } from "@/services/produtoAbastecimento";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useEffect, useState } from "react";
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
    idPostoCombustivelTanque?: number;
    idVeiculo?: number;
    idVeiculoTanque?: number;
}

const SelectProdutoAbastecimento = (props: Props) => {
    const {
        name = "idProdutoAbastecimento",
        title = "Produto Abastecimento",
        control,
        idPostoCombustivelTanque,
        idVeiculo,
        idVeiculoTanque
    } = props;

    const { field: { value, onChange } } = useController({ control, name })
    const [opcoesProdutoAbastecimento, setOpcoesProdutoAbastecimento] = useState<Array<any>>([]);

    useEffect(() => {
        getProdutosAbastecimento();
    }, [idPostoCombustivelTanque, idVeiculo, idVeiculoTanque]);

    const getProdutosAbastecimento = async (pesquisa?: string) => {
        setOpcoesProdutoAbastecimento([]);

        if(!idPostoCombustivelTanque && !idVeiculo && !idVeiculoTanque)
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
            isClearable
        />
    )
}

export default SelectProdutoAbastecimento