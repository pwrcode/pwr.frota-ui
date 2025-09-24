import { getPostoCombustivelTanqueList } from "@/services/postoCombustivelTanque";
import AsyncReactSelect from "@/ui/components/forms/AsyncReactSelect"
import { useEffect, useState } from "react";
import { useController, type Control } from "react-hook-form";

type Props = {
    name?: string;
    title?: string;
    control: Control<any>;
    idPostoCombustivel?: number;
}

const SelectPostoCombustivelTanque = (props: Props) => {
    const {
        name = "idPostoCombustivelTanque",
        title = "Posto Tanque",
        control,
        idPostoCombustivel
    } = props;

    const { field: { value, onChange } } = useController({ control, name })
    const [opcoesPostoCombustivelTanque, setOpcoesPostoCombustivelTanque] = useState<Array<any>>([]);

    useEffect(() => {
        onChange(null)
        getPostoCombustivelTanques();
    }, [idPostoCombustivel]);

    const getPostoCombustivelTanques = async (pesquisa?: string) => {
        setOpcoesPostoCombustivelTanque([]);
        if (!idPostoCombustivel)
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
        />
    )
}

export default SelectPostoCombustivelTanque