import { getVeiculoList } from "@/services/veiculo";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useEffect } from "react";
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
}

const SelectVeiculo = (props: Props) => {
    const {
        name = "idVeiculo",
        title = "Veículo",
        control
    } = props;

    const { field: { value, onChange } } = useController({ control, name })

    useEffect(() => {
        getVeiculos();
    }, []);

    const getVeiculos = async (pesquisa?: string) => {
        const data = await getVeiculoList(pesquisa, undefined, undefined, undefined, undefined, undefined, undefined);
        return [...data];
    }

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={[]}
            asyncFunction={getVeiculos}
            value={value}
            setValue={onChange}
            isClearable
        />
    )
}

export default SelectVeiculo