import { getBairroList } from "@/services/bairro";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useEffect, useState } from "react";
import { useController, useWatch, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
    size?: string
}

const SelectBairro = (props: Props) => {
    const {
        name = "idBairro",
        title = "Bairro",
        control,
        size
    } = props;

    const { field: { value, onChange } } = useController({ control, name })
    const [opcoesBairro, setOpcoesBairro] = useState<Array<any>>([]);

    const municipio = useWatch({
        control: control,
        name: "idMunicipio.value",
    })

    useEffect(() => {
        onChange(null)
        getBairros();
    }, [municipio]);

    const getBairros = async (pesquisa?: string) => {
        setOpcoesBairro([]);

        if (!municipio)
            return [];

        const data = await getBairroList(pesquisa, municipio);
        setOpcoesBairro([...data]);
        return data;
    }

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={opcoesBairro}
            asyncFunction={getBairros}
            value={value}
            setValue={onChange}
            isClearable
            filter
            size={size}
        />
    )
}

export default SelectBairro