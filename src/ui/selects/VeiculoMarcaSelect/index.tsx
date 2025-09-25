import { getVeiculoMarcaList } from "@/services/veiculoMarca";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useEffect } from "react";
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
}

const SelectVeiculoMarca = (props: Props) => {
    const {
        name = "idVeiculoMarca",
        title = "Marcas",
        control
    } = props;

    const { field: { value, onChange } } = useController({ control, name })

    useEffect(() => {
        getVeiculoMarcas();
    }, []);

    const getVeiculoMarcas = async (pesquisa?: string) => {
        const data = await getVeiculoMarcaList(pesquisa);
        return [...data];
    }

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={[]}
            asyncFunction={getVeiculoMarcas}
            value={value}
            setValue={onChange}
            isClearable
        />
    )
}

export default SelectVeiculoMarca