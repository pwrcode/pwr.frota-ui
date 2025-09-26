import { getTipoVeiculoList } from "@/services/tipoVeiculo";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useEffect } from "react";
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
}

const SelectTiposVeiculo = (props: Props) => {
    const {
        name = "idTipoVeiculo",
        title = "Tipo Veículo",
        control
    } = props;

    const { field: { value, onChange } } = useController({ control, name })

    useEffect(() => {
        getTiposVeiculo();
    }, []);

    const getTiposVeiculo = async (pesquisa?: string) => {
        const data = await getTipoVeiculoList(pesquisa, undefined);
        return [...data];
    }

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={[]}
            asyncFunction={getTiposVeiculo}
            value={value}
            setValue={onChange}
            isClearable
        />
    )
}

export default SelectTiposVeiculo