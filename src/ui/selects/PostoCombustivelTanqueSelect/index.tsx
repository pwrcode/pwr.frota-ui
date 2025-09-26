import { getPostoCombustivelTanqueList } from "@/services/postoCombustivelTanque";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useEffect, useState } from "react";
import { useController, useWatch, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
    size?: string,
    ignoreFiltros?: boolean
}

const SelectPostoCombustivelTanque = (props: Props) => {
    const {
        name = "idPostoCombustivelTanque",
        title = "Posto Tanque",
        control,
        size,
        ignoreFiltros
    } = props;

    const { field: { value, onChange } } = useController({ control, name })
    const [opcoesPostoCombustivelTanque, setOpcoesPostoCombustivelTanque] = useState<Array<any>>([]);

    const idPostoCombustivel = useWatch({
        control: control,
        name: "idPostoCombustivel.value",
    })

    useEffect(() => {
        if (!idPostoCombustivel && !!value)
            onChange(null)

        getPostoCombustivelTanques();
    }, [idPostoCombustivel, value]);

    const getPostoCombustivelTanques = async (pesquisa?: string) => {
        setOpcoesPostoCombustivelTanque([]);
        
        if (!idPostoCombustivel && !ignoreFiltros)
            return [];

        const data = await getPostoCombustivelTanqueList(pesquisa, idPostoCombustivel, undefined);
        setOpcoesPostoCombustivelTanque([...data]);
        return data;
    }

    return (
        <AsyncReactSelect
            name={name}
            title={title}
            options={opcoesPostoCombustivelTanque}
            asyncFunction={getPostoCombustivelTanques}
            value={value}
            setValue={onChange}
            isClearable
            filter
            size={size}
        />
    )
}

export default SelectPostoCombustivelTanque