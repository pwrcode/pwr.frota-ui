import { getMunicipioList } from "@/services/municipio";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useEffect, useState } from "react";
import { useController, useWatch, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
    size?: string
}

const SelectMunicipio = (props: Props) => {
    const {
        name = "idMunicipio",
        title = "Município",
        control,
        size
    } = props;

    const { field: { value, onChange } } = useController({ control, name })
    const [opcoesMunicipio, setOpcoesMunicipio] = useState<Array<any>>([]);

    const uf = useWatch({
        control: control,
        name: "idUf.value",
    })

    useEffect(() => {
        if (!uf && !!value)
            onChange(null)
        getMunicipios();
    }, [uf, value]);

    const getMunicipios = async (pesquisa?: string) => {
        setOpcoesMunicipio([]);

        if (!uf) {
            return [];
        }

        const data = await getMunicipioList(pesquisa, uf);
        setOpcoesMunicipio([...data]);
        return data;
    }

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={opcoesMunicipio}
            asyncFunction={getMunicipios}
            value={value}
            setValue={onChange}
            isClearable
            filter
            size={size}
        />
    )
}

export default SelectMunicipio