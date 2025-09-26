import { getVeiculoModeloList } from "@/services/veiculoModelo";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useEffect, useState } from "react";
import { useController, useWatch, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
}

const SelectVeiculoModelo = (props: Props) => {
    const {
        name = "idVeiculoModelo",
        title = "Modelos",
        control
    } = props;

    const { field: { value, onChange } } = useController({ control, name })
    const [opcoesVeiculoModelo, setOpcoesVeiculoModelo] = useState<Array<any>>([]);

    const marca = useWatch({
        control: control,
        name: "idVeiculoMarca.value",
    })

    useEffect(() => {
        if (!marca && !!value)
            onChange(null);
        
        getVeiculoModelos();
    }, [marca, value]);

    const getVeiculoModelos = async (pesquisa?: string) => {
        setOpcoesVeiculoModelo([]);

        if (!marca)
            return [];

        const data = await getVeiculoModeloList(pesquisa, marca);
        setOpcoesVeiculoModelo([...data]);
        return [...data];
    }

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={opcoesVeiculoModelo}
            asyncFunction={getVeiculoModelos}
            value={value}
            setValue={onChange}
            isClearable
        />
    )
}

export default SelectVeiculoModelo